import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';
import User from '@/models/usertemp'; 
import { Product } from '@/models/Product';
import { Agent } from '@/models/Agent';
import { AbandonedCart } from '@/models/AbandonedCart';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from 'mongoose';
import { z } from "zod";
import Razorpay from 'razorpay';
import { calculateCheckoutDiscount } from '@/lib/loyalty';
import { checkFraudRisk } from '@/lib/fraud';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

let razorpay: any = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
}

const checkoutSchema = z.object({
    items: z.array(z.object({
        _id: z.string(),
        qty: z.number().int().positive(),
    })).min(1),
    shippingData: z.object({
        name: z.string().min(2, "Name is too short"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(10, "Phone number must be at least 10 digits"),
        address: z.string().min(10, "Address is too short"),
        city: z.string().min(1, "City is required"),
        state: z.string().optional(),
        pincode: z.string().length(6, "Pincode must be exactly 6 digits"),
    }),
    referralCode: z.string().nullable().optional(),
    useWallet: z.boolean().optional(),
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const isRazorpayConfigured = !!razorpay;

        await connectDB();
        const session = await getServerSession(authOptions);
        const json = await req.json();
        
        const validation = checkoutSchema.safeParse(json);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: "Validation failed" }, { status: 400 });
        }
        
        const { items, shippingData, referralCode, useWallet } = validation.data;

        let dbUser: any = null;
        if (session?.user) {
            dbUser = await User.findById((session.user as any).id);
        }

        let trueTotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const dbProduct = await Product.findById(item._id);
            if (!dbProduct || dbProduct.stock < item.qty) {
                return NextResponse.json({ success: false, error: "Product unavailable or insufficient stock" }, { status: 400 });
            }
            const unitPrice = dbProduct.offerPrice || dbProduct.price;
            trueTotal += unitPrice * item.qty;
            validatedItems.push({ productId: dbProduct._id, name: dbProduct.name || dbProduct.title, price: unitPrice, qty: item.qty, image: dbProduct.images[0] });
        }

        // LOYALTY & REFERRAL (10% OFF)
        const userTotalSpent = dbUser?.totalSpent || 0;
        const loyaltyDiscount = calculateCheckoutDiscount(trueTotal, userTotalSpent);
        if (loyaltyDiscount.discount > 0) trueTotal -= loyaltyDiscount.discount;

        if (referralCode) trueTotal -= (trueTotal * 0.10);
        if (trueTotal < 0) trueTotal = 0;

        // WALLET DEDUCTION
        let walletDeduction = 0;
        if (useWallet && dbUser && dbUser.walletBalance > 0) {
            walletDeduction = Math.min(dbUser.walletBalance, trueTotal);
            trueTotal -= walletDeduction;
            await User.findByIdAndUpdate(dbUser._id, { $inc: { walletBalance: -walletDeduction } });
        }

        let rzpOrder = null;
        if (isRazorpayConfigured && trueTotal > 0) {
            rzpOrder = await razorpay.orders.create({ amount: Math.round(trueTotal * 100), currency: "INR", receipt: `receipt_${Date.now()}` });
        }

        // 🚀 PHASE 1 & 4: Nuke 500 Errors & Payment Perfection
        const uniqueId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const orderPayload = {
            orderId: uniqueId,
            orderNumber: uniqueId,
            razorpayOrderId: rzpOrder ? rzpOrder.id : (trueTotal === 0 ? 'WALLET_PAID' : 'COD_PENDING'),
            userId: dbUser?._id || null,
            items: validatedItems,
            totalAmount: trueTotal,
            walletDeduction,
            shippingData,
                customer: {
               name: shippingData.name,
              email: shippingData.email,
            phone: shippingData.phone
         },
               shippingAddress: {
            address: shippingData.address,
           city: shippingData.city,
           pincode: shippingData.pincode,
           country: 'India'
    },
            paymentMethod: trueTotal === 0 ? 'WALLET' : (isRazorpayConfigured ? 'RAZORPAY' : 'COD'),
            paymentStatus: trueTotal === 0 ? 'PAID' : 'PENDING',
            status: 'PROCESSING',
            referralCode,
            createdAt: new Date()
        };
        

        let newOrder;
        try {
            newOrder = await Order.create(orderPayload);
        } catch (mongooseError: any) {
            console.error('CRITICAL: Order Creation Failed (Schema Mismatch?):', {
                message: mongooseError.message,
                errors: mongooseError.errors,
                payloadSent: orderPayload
            });
            const newOrder = await Order.create(orderPayload);
            throw mongooseError; // Re-throw to be caught by the main catch block
        }

        // REWARD PENDING (For Users)
        if (referralCode) {
            const referringUser = await User.findOne({ myReferralCode: { $regex: new RegExp(`^${referralCode.trim()}$`, 'i') } });
            if (referringUser) {
                await User.findByIdAndUpdate(referringUser._id, { $inc: { pendingWalletBalance: 500 } });
            }
        }

        // 🚀 PHASE 3: Purge Abandoned Cart on Success
        try {
            await AbandonedCart.findOneAndDelete({ 
                $or: [
                    { email: shippingData.email }, 
                    { phone: shippingData.phone },
                    { userId: dbUser?._id ? String(dbUser._id) : 'NON_EXISTENT' }
                ] 
            });
        } catch(abandonedError) {
            console.error('Abandoned Cart Purge Error (Non-Critical):', abandonedError);
        }

        return NextResponse.json({ 
            success: true, 
            orderId: newOrder.orderId, 
            razorpayOrderId: orderPayload.razorpayOrderId, 
            amount: Math.round(trueTotal * 100) 
        });

    } catch (error: any) {
        // 🚀 PHASE 1: Detailed Error Logging
        console.error('--- 500 INTERNAL SERVER ERROR DURING CHECKOUT ---');
        console.error('Error Message:', error.message);
        if (error.errors) {
            console.error('Mongoose Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        console.error('Stack Trace:', error.stack);
        
        return NextResponse.json({ 
            success: false, 
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        }, { status: 500 });
    }
}
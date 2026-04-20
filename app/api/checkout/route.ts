import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/usertemp'; // 🚀 FIXED: Capital 'User', lowercase path
import { Product } from '@/models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import Razorpay from 'razorpay';
import { userRateLimit } from '@/lib/ratelimit';
import { getLoyaltyDiscount, calculateCheckoutDiscount } from '@/lib/loyalty';
import { checkFraudRisk, flagSuspiciousOrder } from '@/lib/fraud';

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
    appliedReferralCode: z.string().nullable().optional(),
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = await userRateLimit.limit(ip);
        if (!success) {
            return NextResponse.json({ success: false, error: "Too many requests. Please try again." }, { status: 429 });
        }

        const isRazorpayConfigured = !!razorpay;

        await connectDB();
        const session = await getServerSession(authOptions);
        const json = await req.json();
        
        const validation = checkoutSchema.safeParse(json);
        if (!validation.success) {
            const errorDetails = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
            return NextResponse.json({ success: false, error: `Validation failed: ${errorDetails}` }, { status: 400 });
        }
        const { items, shippingData, appliedReferralCode } = validation.data;

        let dbUser: any = null;
        if (session && session.user && (session.user as any).id) {
            // 🚀 FIXED: Used Capital 'User'
            dbUser = await User.findById((session.user as any).id);
            if (dbUser && (!dbUser.phone || dbUser.phone.trim() === '')) {
                dbUser.phone = shippingData.phone;
                await dbUser.save();
            }
        }

        let trueTotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const dbProduct = await Product.findById(item._id);
            if (!dbProduct) return NextResponse.json({ success: false, error: `Product not found` }, { status: 404 });
            if (dbProduct.stock < item.qty) return NextResponse.json({ success: false, error: `Insufficient stock` }, { status: 400 });

            const unitPrice = dbProduct.offerPrice || dbProduct.price;
            trueTotal += unitPrice * item.qty;

            validatedItems.push({
                productId: dbProduct._id,
                name: dbProduct.name || dbProduct.title,
                price: unitPrice,
                qty: item.qty,
                image: dbProduct.images[0]
            });
        }

        // 💎 LOYALTY DISCOUNT (Automatic based on tier)
        const userTotalSpent = dbUser?.totalSpent || 0;
        const loyaltyDiscount = calculateCheckoutDiscount(trueTotal, userTotalSpent);
        let loyaltyDiscountAmount = 0;
        
        if (loyaltyDiscount.tierDiscount > 0 && dbUser) {
            loyaltyDiscountAmount = loyaltyDiscount.discount;
            trueTotal = trueTotal - loyaltyDiscountAmount;
            if (trueTotal < 0) trueTotal = 0;
        }

        // 🌟 PYRAMID SCHEME LOGIC: 10% DISCOUNT AT CHECKOUT 🌟
        let referrerId = null;
        let referralDiscountAmount = 0;

        if (appliedReferralCode) {
            // Find the person whose code is being used
            // 🚀 FIXED: Used Capital 'User'
            const referrerUser = await User.findOne({ myReferralCode: appliedReferralCode.trim() });
            
            if (referrerUser) {
                // Give Person B (the buyer) a flat 10% discount
                referralDiscountAmount = trueTotal * 0.10;
                referrerId = referrerUser._id;
            } else {
                return NextResponse.json({ success: false, error: "Invalid Referral Code" }, { status: 400 });
            }
        }

        // Apply Discount to Total
        trueTotal = trueTotal - referralDiscountAmount;
        if (trueTotal < 0) trueTotal = 0;

        // 💰 Calculate 10% Points to be credited AFTER delivery
        const pointsToBeCredited = Math.round(trueTotal * 0.10); 

        // 🚨 FRAUD DETECTION ENGINE
        const fraudCheck = await checkFraudRisk(
            ip,
            shippingData.email,
            shippingData.phone,
            appliedReferralCode || undefined 
        );

        if (fraudCheck.shouldBlock) {
            return NextResponse.json({
                success: false,
                error: "Order flagged for manual review. Please contact support.",
                code: "FRAUD_BLOCKED"
            }, { status: 403 });
        }

        let rzpOrder = null;
        if (isRazorpayConfigured && trueTotal > 0) {
            const options = {
                amount: Math.round(trueTotal * 100), 
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            };
            rzpOrder = await razorpay.orders.create(options);
        }

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const uniqueId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const autoTrackingId = `TRK-ER-${Math.floor(10000000 + Math.random() * 90000000)}`;
        
        const newOrder = await Order.create({
            orderId: uniqueId,
            orderNumber: uniqueId,
            trackingId: autoTrackingId, 
            razorpayOrderId: rzpOrder ? rzpOrder.id : `MOCK_RZP_${Date.now()}`,
            userId: session?.user ? (session.user as any).id : null,
            items: validatedItems,
            totalAmount: trueTotal,
            shippingData,
            status: isRazorpayConfigured ? 'PENDING_PAYMENT' : 'PROCESSING', 
            appliedReferralCode,

            // 🚨 SECURE REWARD DATA (Awaiting Delivery)
            referrerId: referrerId,
            pendingPoints: pointsToBeCredited,
            pointsCredited: false, // Will turn true when DELIVERED

            createdAt: new Date()
        });

        // 🗑️ Auto-Purge Abandoned Cart
        try {
            const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', new mongoose.Schema({}, { strict: false }));
            const customerEmail = shippingData.email?.trim().toLowerCase();
            const customerPhone = shippingData.phone?.trim();

            const orConditions = [];
            if (customerEmail) orConditions.push({ email: customerEmail });
            if (customerPhone) orConditions.push({ phone: customerPhone });

            if (orConditions.length > 0) {
                await AbandonedCart.findOneAndDelete({ $or: orConditions });
            }
        } catch (purgeError) {}

        // 🚨 Flag suspicious orders for admin review
        if (fraudCheck.isSuspicious) {
            await flagSuspiciousOrder(uniqueId, fraudCheck, ip);
        }

        return NextResponse.json({ 
            success: true, 
            orderId: newOrder.orderId, 
            razorpayOrderId: rzpOrder?.id,
            amount: rzpOrder?.amount,
            currency: rzpOrder?.currency,
            isMock: !isRazorpayConfigured,
            loyaltyInfo: {
                tier: loyaltyDiscount.tier,
                discount: loyaltyDiscount.tierDiscount,
                discountAmount: loyaltyDiscountAmount
            }
        });

    } catch (error: any) {
        console.error("Checkout System Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
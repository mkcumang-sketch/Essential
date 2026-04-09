import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/User';
import { Product } from '@/models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import Razorpay from 'razorpay';
import { userRateLimit } from '@/lib/ratelimit';

// 🛡️ BUILD-SAFE RAZORPAY INITIALIZATION
let razorpay: any = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

// 🛡️ STRICT PAYLOAD VALIDATION SCHEMA
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
        // 0. RATE LIMITING (Anti-Bot)
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = await userRateLimit.limit(ip);
        if (!success) {
            return NextResponse.json({ success: false, error: "Too many requests. Please try again in a few seconds." }, { status: 429 });
        }

        // 1. Check if Razorpay is configured
        const isRazorpayConfigured = !!razorpay;

        await connectDB();
        const session = await getServerSession(authOptions);
        const json = await req.json();
        
        // 2. Zod Validation (Anti-Tamper)
        const validation = checkoutSchema.safeParse(json);
        if (!validation.success) {
            const errorDetails = validation.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
            return NextResponse.json({ success: false, error: `Validation failed: ${errorDetails}` }, { status: 400 });
        }
        const { items, shippingData, appliedReferralCode } = validation.data;

        // 🌟 IDENTITY GLUE: Link Phone to Google/Email User
        if (session && session.user && (session.user as any).id) {
            const dbUser = await User.findById((session.user as any).id);
            if (dbUser && (!dbUser.phone || dbUser.phone.trim() === '')) {
                dbUser.phone = shippingData.phone;
                await dbUser.save();
            }
        }

        // 3. Server-Side Price & Stock Guard
        let trueTotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const dbProduct = await Product.findById(item._id);
            if (!dbProduct) {
                return NextResponse.json({ success: false, error: `Product not found: ${item._id}` }, { status: 404 });
            }

            // 🚨 INVENTORY GUARD
            if (dbProduct.stock < item.qty) {
                return NextResponse.json({ success: false, error: `Insufficient stock for ${dbProduct.name || dbProduct.title}` }, { status: 400 });
            }

            // 🚨 SECURE PRICE CALCULATION
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

        let rzpOrder = null;
        if (isRazorpayConfigured) {
            // 💳 4. CREATE REAL RAZORPAY ORDER
            const options = {
                amount: Math.round(trueTotal * 100), // amount in paise
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            };
            rzpOrder = await razorpay.orders.create(options);
        }

        // 📝 5. CREATE PENDING ORDER IN DB
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const uniqueId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const newOrder = await Order.create({
            orderId: uniqueId,
            orderNumber: uniqueId,
            razorpayOrderId: rzpOrder ? rzpOrder.id : `MOCK_RZP_${Date.now()}`,
            userId: session?.user?.id || null,
            items: validatedItems,
            totalAmount: trueTotal,
            shippingData,
            status: isRazorpayConfigured ? 'PENDING_PAYMENT' : 'PROCESSING', // Mark as processing if mock
            appliedReferralCode,
            createdAt: new Date()
        });

        return NextResponse.json({ 
            success: true, 
            orderId: newOrder.orderId, 
            razorpayOrderId: rzpOrder?.id,
            amount: rzpOrder?.amount,
            currency: rzpOrder?.currency,
            isMock: !isRazorpayConfigured
        });

    } catch (error: any) {
        console.error("Checkout System Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
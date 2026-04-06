import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/User';
import { Product } from '@/models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// 🛡️ STRICT PAYLOAD VALIDATION SCHEMA
const checkoutSchema = z.object({
  items: z.array(z.object({
    _id: z.string(),
    qty: z.number().int().positive(),
  })).min(1),
  shippingData: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    address: z.string().min(10),
    city: z.string(),
    pincode: z.string(),
  }),
  appliedReferralCode: z.string().nullable().optional(),
});

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const json = await req.json();
        
        // 1. Zod Validation (Anti-Tamper)
        const validation = checkoutSchema.safeParse(json);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: "Invalid request data." }, { status: 400 });
        }
        const { items, shippingData, appliedReferralCode } = validation.data;

        // 2. Server-Side Price & Stock Guard
        let trueTotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const dbProduct = await Product.findById(item._id);
            if (!dbProduct) {
                return NextResponse.json({ success: false, error: `Product not found: ${item._id}` }, { status: 404 });
            }

            // 🚨 INVENTORY GUARD (Check only, don't deduct yet)
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

        // 💳 3. CREATE RAZORPAY ORDER
        const options = {
            amount: Math.round(trueTotal * 100), // amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const rzpOrder = await razorpay.orders.create(options);

        // 📝 4. CREATE PENDING ORDER
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const uniqueId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const newOrder = await Order.create({
            orderId: uniqueId,
            razorpayOrderId: rzpOrder.id,
            userId: session?.user?.id || null,
            items: validatedItems,
            totalAmount: trueTotal,
            shippingData,
            status: 'PENDING_PAYMENT',
            appliedReferralCode,
            createdAt: new Date()
        });

        return NextResponse.json({ 
            success: true, 
            orderId: newOrder.orderId, 
            razorpayOrderId: rzpOrder.id,
            amount: rzpOrder.amount,
            currency: rzpOrder.currency
        });

    } catch (error: any) {
        console.error("Checkout System Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
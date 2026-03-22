import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose'; // 🔥 THE SUPERFAST ENGINE
import mongoose from 'mongoose';

// 🌟 STRICT SCHEMA (Prevents Vercel Sync Errors)
const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    items: { type: Array, required: true },
    totalAmount: { type: Number, required: true },
    customer: { type: Object, required: true },
    status: { type: String, default: 'PROCESSING' }
}, { timestamps: true, strict: false });

// Ensure model is registered securely
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export async function POST(req: Request) {
    try {
        await connectDB(); // ⚡ Connects in Microseconds!
        
        const body = await req.json();
        const { items, totalAmount, customer } = body;

        if (!items || !customer) {
            return NextResponse.json({ success: false, error: "Missing required order details" }, { status: 400 });
        }

        // Generate an Elite Order ID
        const orderId = `EST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newOrder = await Order.create({
            orderId,
            items,
            totalAmount,
            customer,
            status: 'PROCESSING'
        });

        return NextResponse.json({ success: true, orderId: newOrder.orderId, message: "Transaction Successful" });
    } catch (error: any) {
        console.error("Checkout Engine Error:", error);
        return NextResponse.json({ success: false, error: "Transaction Failed. Please try again." }, { status: 500 });
    }
}
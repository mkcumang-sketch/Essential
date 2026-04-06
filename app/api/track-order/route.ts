import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    try {
        // 1. Database se connect karo
        await connectDB();
        
        const body = await req.json();
        const trackingId = body.orderId?.trim();
        
        // 2. Agar khali request aayi toh reject karo
        if (!trackingId) {
            return NextResponse.json(
                { success: false, error: "Please provide a valid Tracking ID." }, 
                { status: 400 }
            );
        }

        // Order Model load karo
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 3. Pehle custom orderId (jaise ORD-12345) se search karo
        let foundOrder = await Order.findOne({ orderId: trackingId }).lean() as any;
        
        // 4. Fallback: Agar purana order hai aur MongoDB ki _id (24 characters) use hui thi
        if (!foundOrder && mongoose.Types.ObjectId.isValid(trackingId)) {
            foundOrder = await Order.findById(trackingId).lean() as any;
        }

        // Agar order nahi mila
        if (!foundOrder) {
            return NextResponse.json(
                { success: false, error: "Order not found. Please check your Tracking ID." }, 
                { status: 404 }
            );
        }

        // 🔒 5. STRICT SECURITY: PII (Personally Identifiable Information) Hatao
        // Track karte waqt sirf zaroori details bhejo, customer ka phone/address nahi!
        const safeOrderDetails = {
            _id: foundOrder._id,
            orderId: foundOrder.orderId || foundOrder._id.toString().slice(-6).toUpperCase(),
            status: foundOrder.status || "PROCESSING",
            totalAmount: foundOrder.totalAmount,
            items: foundOrder.items,
            createdAt: foundOrder.createdAt
        };

        // 6. Success Response Frontend ko bhej do
        return NextResponse.json({ 
            success: true, 
            order: safeOrderDetails 
        });

    } catch (error) {
        console.error("Tracking API Error:", error);
        return NextResponse.json(
            { success: false, error: "Server Error while tracking order." }, 
            { status: 500 }
        );
    }
}
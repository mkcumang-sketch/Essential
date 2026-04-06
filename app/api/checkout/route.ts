import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ success: false, error: "Session expired. Please login again." }, { status: 401 });
        }

        const body = await req.json();
        const userId = (session.user as any).id;
        
        // Flexible schema taaki koi extra field aane par crash na ho
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 📝 Order generate karo with FULL body spread
        const newOrder = await Order.create({
            ...body, // Cart, shipping data sab kuch direct save hoga
            orderId: `ORD-${Date.now().toString().slice(-6).toUpperCase()}`,
            userId: userId, 
            status: 'PROCESSING',
            createdAt: new Date()
        });

        return NextResponse.json({ success: true, orderId: newOrder.orderId || newOrder._id });

    } catch (error: any) {
        console.error("Checkout Crash Details:", error);
        // 🚨 AB ERROR CHHUPEGA NAHI, EXACT REASON TOAST MEIN DIKHEGA
        return NextResponse.json({ 
            success: false, 
            error: error.message || "Database Error during checkout." 
        }, { status: 500 });
    }
}
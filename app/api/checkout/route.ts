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

        // 🚨 GENERATE A UNIQUE ID 🚨
        const uniqueId = `ORD-${Date.now().toString().slice(-6).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

        // 📝 Order generate karo with FULL body spread
        const newOrder = await Order.create({
            ...body, 
            orderId: uniqueId,
            orderNumber: uniqueId, // 👈 FIX: Ye line "duplicate key error" ko theek karegi
            userId: userId, 
            status: 'PROCESSING',
            createdAt: new Date()
        });

        return NextResponse.json({ success: true, orderId: newOrder.orderId || newOrder.orderNumber || newOrder._id });

    } catch (error: any) {
        console.error("Checkout Crash Details:", error);
        
        // Agar fir bhi duplicate error aata hai, toh usko clean message mein dikhao
        if (error.code === 11000) {
             return NextResponse.json({ 
                success: false, 
                error: "Database syncing issue. Please try placing the order again." 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: false, 
            error: error.message || "Database Error during checkout." 
        }, { status: 500 });
    }
}
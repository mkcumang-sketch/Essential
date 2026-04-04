import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const userId = (session?.user as any)?.id;

        if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const data = await req.json();
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        
        const orderId = `ORD-${Date.now()}`;
        const newOrder = await Order.create({
            orderId,
            orderNumber: orderId,
            userId: userId, // 🔒 THE LOCK: Ab order isi user ka rahega
            customer: data.customer,
            items: data.items,
            totalAmount: data.totalAmount,
            status: 'PROCESSING',
            createdAt: new Date()
        });

        return NextResponse.json({ success: true, orderId: newOrder.orderId });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
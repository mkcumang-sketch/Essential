import { NextResponse } from 'next/server';
import connectDB  from '@/lib/mongodb'; // 🚨 DB Helper Import
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        // 1. Sabse pehle Database Connect kar (Yahi miss ho raha hoga)
        await connectDB();

        const session = await getServerSession(authOptions);
        const body = await req.json();

        // 2. Strict Security: Bina login order nahi hoga
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Please login to place an order." }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // Order Model load kar
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 3. Order Create kar
        const newOrder = await Order.create({
            orderId: `ORD-${Date.now()}`,
            userId: userId, // 🔒 Strict Lock
            customer: body.customer,
            items: body.items,
            totalAmount: body.totalAmount,
            status: 'PROCESSING',
            createdAt: new Date()
        });

        // 4. Success Response
        return NextResponse.json({ success: true, orderId: newOrder.orderId });

    } catch (error) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ success: false, error: "Server Error during checkout" }, { status: 500 });
    }
}
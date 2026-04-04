import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() { // Ya POST, jo bhi tera method hai
    try {
        if (mongoose.connection.readyState < 1) await mongoose.connect(process.env.MONGODB_URI as string);
        
        const session = await getServerSession(authOptions);
        const userId = (session?.user as any)?.id;

        // 🚨 ZERO LEAKAGE RULE 1: Agar ID nahi, toh Order nahi.
        if (!userId) {
            return NextResponse.json({ success: true, data: { orders: [], totalSpent: 0 } });
        }

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        
        // 🚨 ZERO LEAKAGE RULE 2: STRICT MATCH ONLY `userId`. 
        // Yahan galti se bhi $or: [{email}, {phone}] nahi hona chahiye.
        const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 }).lean();

        const totalSpent = orders.reduce((acc: number, o: any) => acc + (Number(o.totalAmount) || 0), 0);

        return NextResponse.json({ 
            success: true, 
            data: { orders, totalSpent, tier: totalSpent >= 100000 ? 'Gold' : 'Silver' } 
        });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
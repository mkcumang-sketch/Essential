export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function POST(req: Request) {
    try {
        await connectDB();
        
        // 🔥 SEEDHA SESSION CHECK KARO 🔥
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, data: { orders: [] } });
        }

        const REAL_EMAIL = session.user.email.toLowerCase().trim();
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        
        // 🚨 STRICT ISOLATION: Sirf apni email ke orders nikalega
        const userOrders = await Order.find({ 'customer.email': REAL_EMAIL }).sort({ createdAt: -1 });

        return NextResponse.json({ 
            success: true, 
            data: { 
                profile: { completeness: 100 }, 
                orders: userOrders, 
                wallet: { points: 0, totalEarned: 0 }, 
                wishlist: [], savedCards: [], addresses: [], reviews: [], tickets: [], notifications: [] 
            } 
        });

    } catch (error) {
        return NextResponse.json({ success: false, data: { orders: [] } });
    }
}
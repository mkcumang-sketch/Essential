export const dynamic = 'force-dynamic'; // 🚨 CACHE KILLER
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth"; // 🔒 SERVER SESSION

export async function POST(req: Request) {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }
        
        // 🔥 FRONTEND KI BHEJI EMAIL KO KACHRE MEIN DAALO. SEEDHA SESSION CHECK KARO.
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, data: { orders: [] } });
        }

        const exactEmail = session.user.email.toLowerCase().trim();
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        
        // 🔒 STRICT FIREWALL: Sirf logged-in user ki email ke orders aayenge
        const userOrders = await Order.find({ "customer.email": exactEmail }).sort({ createdAt: -1 });

        return NextResponse.json({ 
            success: true, 
            data: { orders: userOrders, profile: { completeness: 100 }, wallet: { points: 0 } } 
        });

    } catch (error) {
        return NextResponse.json({ success: false, data: { orders: [] } });
    }
}
export const dynamic = 'force-dynamic'; // VERCEL CACHE KILLER
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }
        
        const { email } = await req.json();
        if (!email) return NextResponse.json({ success: false, data: { orders: [] } });

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        
        // 🚨 STRICT FIREWALL: Sirf wahi order aayega jiski email match karegi
        const exactEmail = email.toLowerCase().trim();
        const userOrders = await Order.find({ "customer.email": exactEmail }).sort({ createdAt: -1 });

        return NextResponse.json({ 
            success: true, 
            data: { orders: userOrders, profile: { completeness: 100 }, wallet: { points: 0 } } 
        });

    } catch (error) {
        console.error("User Dashboard Error:", error);
        return NextResponse.json({ success: false, data: { orders: [] } });
    }
}
export const dynamic = 'force-dynamic'; // VERCEL CACHE KILLER
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }
        
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const allOrders = await Order.find({}).sort({ createdAt: -1 });

        // Frontend jis bhi format mein data maange, usko mil jayega
        return NextResponse.json({ 
            success: true, 
            data: allOrders,
            orders: allOrders
        });

    } catch (error) {
        console.error("Manage Orders Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch orders" });
    }
}
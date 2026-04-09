export const dynamic = 'force-dynamic'; // VERCEL CACHE KILLER
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
export const revalidate = 0;

export async function GET() {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }
        
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const allOrders = await Order.find({}).sort({ createdAt: -1 });

        let totalRevenue = 0;
        allOrders.forEach(order => {
            totalRevenue += Number(order.totalAmount || 0);
        });

        return NextResponse.json({
            success: true,
            data: {
                totalOrders: allOrders.length,
                totalRevenue: totalRevenue,
                recentOrders: allOrders, 
                orders: allOrders,
                abandonedCarts: 0
            }
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch stats" });
    }
}
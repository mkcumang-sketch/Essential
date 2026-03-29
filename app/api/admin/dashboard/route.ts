export const dynamic = 'force-dynamic'; 
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET(req: Request) {
    try {
        await connectDB();
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
                recentOrders: allOrders, // Kuch frontend ye padhte hain
                orders: allOrders,       // Kuch frontend ye padhte hain
                abandonedCarts: 0
            }
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to fetch admin data" });
    }
}
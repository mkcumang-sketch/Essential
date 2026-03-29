export const dynamic = 'force-dynamic'; // 🚨 KILLS FAKE CACHE
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET() {
    try {
        await connectDB();
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        
        // Fetch ONLY real orders
        const allOrders = await Order.find({ status: { $nin: ['CANCELLED', 'PENDING'] } });
        const totalRevenue = allOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

        return NextResponse.json({
            success: true,
            metrics: {
                totalOrders: allOrders.length, // REAL COUNT
                totalRevenue: totalRevenue     // REAL REVENUE
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, metrics: { totalOrders: 0, totalRevenue: 0 } });
    }
}
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Minimal Order Schema just to calculate totals
const orderSchema = new mongoose.Schema({
    totalAmount: { type: Number, default: 0 },
    status: { type: String, default: 'PROCESSING' }
}, { strict: false });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try { await mongoose.connect(process.env.MONGODB_URI as string); } catch (e) {}
};

export async function GET(req: Request) {
    try {
        await connectDB();

        // 1. Get all successful orders
        const orders = await Order.find({ status: { $ne: 'CANCELLED' } });
        
        // 2. Calculate Math
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        return NextResponse.json({
            success: true,
            metrics: {
                totalOrders: totalOrders,
                totalRevenue: totalRevenue,
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to compile matrix metrics" }, { status: 500 });
    }
}
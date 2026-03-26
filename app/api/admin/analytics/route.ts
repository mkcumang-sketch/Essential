import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 🌟 DB CONNECTION 🌟
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// 🌟 ORDER SCHEMA (For tracking Sales and Abandoned Carts) 🌟
const OrderSchema = new mongoose.Schema({
    orderId: String,
    customer: { name: String, email: String, phone: String },
    items: Array,
    totalAmount: Number,
    status: { type: String, default: 'PENDING' }, // PENDING means Abandoned if not updated
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export async function GET() {
    try {
        await connectDB();

        // Saare orders fetch karo
        const allOrders = await Order.find().sort({ createdAt: -1 });

        // 1. Calculate Metrics (Total Revenue & Valid Orders)
        const validOrders = allOrders.filter(o => o.status !== 'CANCELLED' && o.status !== 'PENDING');
        const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        // 2. Find Abandoned Carts (Leads)
        // Jo orders lambe time se 'PENDING' hain, unko abandoned maan lo
        const abandonedCarts = allOrders
            .filter(o => o.status === 'PENDING')
            .map(o => ({
                name: o.customer?.name || 'Guest User',
                phone: o.customer?.phone || '',
                email: o.customer?.email || '',
                cartTotal: o.totalAmount || 0,
                date: o.createdAt
            }));

        return NextResponse.json({
            success: true,
            leads: abandonedCarts, // Yeh aapke "Abandoned Carts" module mein dikhega
            metrics: {
                totalRevenue,
                totalOrders: validOrders.length
            }
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
    }
}
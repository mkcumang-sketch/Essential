import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 🌟 DB CONNECTION 🌟
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// 🌟 1. ORDER SCHEMA 🌟
const OrderSchema = new mongoose.Schema({
    orderId: String,
    customer: { name: String, email: String, phone: String },
    items: Array,
    totalAmount: Number,
    status: { type: String, default: 'PENDING' },
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// 🌟 2. ABANDONED CART (LEADS) SCHEMA 🌟
const AbandonedCartSchema = new mongoose.Schema({
    name: String,
    phone: String,
    cartTotal: Number,
    status: { type: String, default: 'ABANDONED' },
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', AbandonedCartSchema);

// 🚀 GET: Fetch Analytics for Admin Dashboard
export async function GET() {
    try {
        await connectDB();

        // 1. Calculate Real Metrics (Total Revenue & Orders)
        const allOrders = await Order.find().sort({ createdAt: -1 });
        const validOrders = allOrders.filter(o => o.status !== 'CANCELLED' && o.status !== 'PENDING');
        const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        // 2. Fetch GENUINE Abandoned Carts from our new collection
        const abandonedLeads = await AbandonedCart.find({ status: 'ABANDONED' }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            leads: abandonedLeads, // Real Abandoned Carts sent to Admin UI!
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

// 🚀 POST: Receive Pre-Capture Data from Frontend Popup!
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, phone, cartTotal } = body;

        if (!phone) return NextResponse.json({ error: "Phone number is required" }, { status: 400 });

        // Save the lead securely to the database
        const newLead = await AbandonedCart.create({
            name: name || "Guest User",
            phone: phone,
            cartTotal: cartTotal || 0,
            status: 'ABANDONED'
        });

        return NextResponse.json({ success: true, lead: newLead });
    } catch (error) {
        console.error("Lead Capture Error:", error);
        return NextResponse.json({ success: false, error: "Failed to capture lead" }, { status: 500 });
    }
}
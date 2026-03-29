export const dynamic = 'force-dynamic'; // 🚨 CACHE KILLER: Hamesha fresh data aayega
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 🌟 1. DATABASE CONNECTION 🌟
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
};

// 🌟 2. SCHEMA DEFINITIONS 🌟
const AbandonedCartSchema = new mongoose.Schema({
    name: { type: String, default: "Vault Client" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    cartTotal: { type: Number, default: 0 },
    status: { type: String, default: 'ABANDONED' },
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

// Initialize Models safely
const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', AbandonedCartSchema);
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

// =======================================================================
// 🚀 POST: RECEIVE DATA FROM FRONTEND (Logged in OR Guest Popup)
// =======================================================================
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, phone, email, cartTotal } = body;

        // Agar user ne phone ya email kuch nahi diya toh reject karo
        if (!phone && !email) {
            return NextResponse.json({ success: false, error: "Contact info required" }, { status: 400 });
        }

        // Save the lead securely to the database
        const newLead = await AbandonedCart.create({
            name: name || "Vault Client",
            phone: phone || "",
            email: email || "",
            cartTotal: Number(cartTotal) || 0,
            status: 'ABANDONED',
            createdAt: new Date()
        });

        return NextResponse.json({ success: true, message: "Lead captured silently", lead: newLead });

    } catch (error) {
        console.error("Lead Capture Error:", error);
        return NextResponse.json({ success: false, error: "Failed to capture lead" }, { status: 500 });
    }
}

// =======================================================================
// 🚀 GET: SEND REAL LEADS TO ADMIN DASHBOARD
// =======================================================================
export async function GET() {
    try {
        await connectDB();

        // 1. Fetch Real Abandoned Carts from DB
        const abandonedLeads = await AbandonedCart.find({ status: 'ABANDONED' }).sort({ createdAt: -1 });

        // 2. Fetch Order Metrics for Admin Dashboard (Extra utility)
        const allOrders = await Order.find({ status: { $nin: ['CANCELLED', 'PENDING'] } });
        const totalRevenue = allOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

        return NextResponse.json({
            success: true,
            leads: abandonedLeads, // Send to Admin
            metrics: {
                totalRevenue: totalRevenue,
                totalOrders: allOrders.length
            }
        });

    } catch (error) {
        console.error("Analytics Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
    }
}
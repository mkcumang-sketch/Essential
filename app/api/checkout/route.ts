export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
};

export async function POST(req: Request) {
    try {
        await connectDB();
        
        // 🔥 FRONTEND PE BHAROSA BAND. SEEDHA SESSION SE ASLI EMAIL NIKALO 🔥
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, error: "Unauthorized. Please login again." }, { status: 401 });
        }
        
        const REAL_EMAIL = session.user.email.toLowerCase().trim();

        const data = await req.json(); 
        let { items, totalAmount, financialBreakdown, appliedReferralCode, customer, paymentMethod } = data;

        // 🚨 STRICT OVERRIDE: Customer object ko forcefully sahi email do
        if (!customer) customer = {};
        customer.email = REAL_EMAIL; // Koi aur email yahan aa hi nahi sakti ab
        if (session.user.name) customer.name = session.user.name;

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        
        const newOrder = await Order.create({
            orderId, 
            customer, // 100% Verified Google Email
            items, 
            totalAmount, 
            financialBreakdown, 
            appliedReferralCode, 
            paymentMethod,
            status: 'PROCESSING',
            createdAt: new Date()
        });

        // Cleanup Abandoned Carts
        try {
            const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', new mongoose.Schema({}, { strict: false }));
            await AbandonedCart.deleteMany({ email: REAL_EMAIL });
        } catch (e) {}

        return NextResponse.json({ success: true, orderId: newOrder.orderId });

    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ success: false, error: "Checkout failed." }, { status: 500 });
    }
}
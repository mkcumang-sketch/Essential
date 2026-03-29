export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";

// 🌟 DATABASE CONNECTION 🌟
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
};

export async function POST(req: Request) {
    try {
        await connectDB();
        
        // 🔥 THE ULTIMATE LOCKDOWN: Server Session se exact email nikalna 🔥
        const session = await getServerSession();
        
        // Agar user login nahi hai, toh bhaga do usko. Guest checkout allow mat karo jab tak data leak chal raha hai.
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ success: false, error: "Unauthorized. Please login again." }, { status: 401 });
        }

        const exactSessionEmail = session.user.email.toLowerCase().trim();
        
        const data = await req.json(); 
        let { items, totalAmount, financialBreakdown, appliedReferralCode, customer, paymentMethod } = data;

        // 🚨 STRICT OVERRIDE: Frontend se aayi hui kisi bhi email ko kachre mein daalo. 
        // Sirf wahi email save hogi jisse "Continue with Google" kiya gaya hai.
        if (!customer) customer = {};
        customer.email = exactSessionEmail; 
        
        // Naam bhi override kar do if needed, taaki confusion na ho.
        if (session.user.name) {
             customer.name = session.user.name;
        }

        console.log(`🔒 SECURITY LOCK: Order being saved strictly for: ${customer.email}`);

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        
        const newOrder = await Order.create({
            orderId, 
            customer, // Iske andar ab hamesha exact logged-in email hogi
            items, 
            totalAmount, 
            financialBreakdown, 
            appliedReferralCode, 
            paymentMethod,
            status: 'PROCESSING',
            createdAt: new Date()
        });

        // Cleanup
        try {
            const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', new mongoose.Schema({}, { strict: false }));
            await AbandonedCart.deleteMany({ email: customer.email });
        } catch (e) {}

        return NextResponse.json({ success: true, orderId: newOrder.orderId });

    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ success: false, error: "Checkout failed." }, { status: 500 });
    }
}
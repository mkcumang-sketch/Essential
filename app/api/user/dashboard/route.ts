export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth"; 

export async function POST(req: Request) {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

        // 🚨 FIREWALL 1: BROWSER KI KABHI MAT SUNO. DIRECT SERVER SE PUCHO KAUN HAI.
        const session = await getServerSession();

        // Agar session nahi hai, ya user nahi hai, toh turant bahar phenko.
        if (!session || !session.user) {
            return NextResponse.json({ success: false, data: { orders: [] }, message: "Unauthorized Request" }, { status: 401 });
        }

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 🚨 FIREWALL 2: STRICT DATA SANITIZATION
        const safeEmail = session.user.email ? session.user.email.toLowerCase().trim() : null;
        
        // Agar NextAuth ke session mein email hi nahi hai, toh block kar do!
        // Isse "null" email wale doosre leads mix nahi honge.
        if (!safeEmail || safeEmail.length < 5) {
             return NextResponse.json({ success: false, data: { orders: [] }, message: "Invalid Session Identity" }, { status: 403 });
        }

        // 🚨 FIREWALL 3: THE BULLETPROOF QUERY
        // Sirf aur sirf wahi order laao jisme "customer.email" exactly is safeEmail se match kare.
        const userOrders = await Order.find({ 
            "customer.email": { $eq: safeEmail } 
        }).sort({ createdAt: -1 }).lean();

        // Data clean karke bhejo
        return NextResponse.json({ 
            success: true, 
            data: { 
                orders: userOrders, 
                profile: { completeness: 100 }, 
                wallet: { points: 0 } 
            } 
        });

    } catch (error) {
        console.error("Critical Dashboard API Error:", error);
        return NextResponse.json({ success: false, data: { orders: [] }, message: "Server Error" }, { status: 500 });
    }
}
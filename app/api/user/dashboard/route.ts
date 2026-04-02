export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth"; 

type DashboardData = {
    orders: any[];
    totalSpent: number;
    tier: 'Silver' | 'Gold';
};

const EMPTY_DASHBOARD: { success: true; data: DashboardData } = {
    success: true,
    data: { orders: [], totalSpent: 0, tier: 'Silver' },
};

export async function POST(req: Request) {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

        // 🚨 FIREWALL 1: BROWSER KI KABHI MAT SUNO. DIRECT SERVER SE PUCHO KAUN HAI.
        const session = await getServerSession();

        // Agar session nahi hai, ya user nahi hai, toh turant bahar phenko.
        if (!session || !session.user) {
            return NextResponse.json(EMPTY_DASHBOARD, { status: 200 });
        }

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 🚨 FIREWALL 2: STRICT DATA SANITIZATION
        const safeEmail = session.user.email ? session.user.email.toLowerCase().trim() : null;
        
        // Agar NextAuth ke session mein email hi nahi hai, toh block kar do!
        // Isse "null" email wale doosre leads mix nahi honge.
        if (!safeEmail || safeEmail.length < 5) {
             return NextResponse.json(EMPTY_DASHBOARD, { status: 200 });
        }

        // 🚨 FIREWALL 3: THE BULLETPROOF QUERY
        // Sirf aur sirf wahi order laao jisme "customer.email" exactly is safeEmail se match kare.
        const userOrders = await Order.find({ 
            "customer.email": { $eq: safeEmail } 
        }).sort({ createdAt: -1 }).lean();

        const eligibleStatuses = new Set(['PROCESSING', 'DISPATCHED', 'DELIVERED']);
        const totalSpent = (Array.isArray(userOrders) ? userOrders : []).reduce((sum: number, o: any) => {
            const status = String(o?.status || '').toUpperCase();
            if (!eligibleStatuses.has(status)) return sum;
            const amt = Number(o?.totalAmount ?? 0);
            return sum + (Number.isFinite(amt) ? amt : 0);
        }, 0);

        const tier: DashboardData['tier'] = totalSpent >= 100000 ? 'Gold' : 'Silver';

        // Strict contract: always return { success, data: { orders, totalSpent, tier } }
        return NextResponse.json({
            success: true,
            data: {
                orders: Array.isArray(userOrders) ? userOrders : [],
                totalSpent,
                tier,
            },
        } satisfies { success: true; data: DashboardData });

    } catch (error) {
        console.error("Critical Dashboard API Error:", error);
        return NextResponse.json(EMPTY_DASHBOARD, { status: 200 });
    }
}
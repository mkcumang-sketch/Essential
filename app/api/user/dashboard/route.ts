export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

        const session = await getServerSession(authOptions);
        const sessionUser = session?.user as any;

        if (!sessionUser) {
            return NextResponse.json({ success: true, data: { orders: [], totalSpent: 0, tier: 'Silver' } });
        }

        // 🚨 MASTER FIX: Seedha Database se Asli ID uthao
        let absoluteUserId = sessionUser.id;
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const userQuery = [];
        if (sessionUser.email) userQuery.push({ email: sessionUser.email });
        if (sessionUser.phone && !sessionUser.phone.startsWith('GOOG-')) userQuery.push({ phone: sessionUser.phone });

        if (userQuery.length > 0) {
            const dbUser = await User.findOne({ $or: userQuery }).lean() as any;
            if (dbUser && dbUser._id) absoluteUserId = dbUser._id.toString();
        }

        if (!absoluteUserId) {
            return NextResponse.json({ success: true, data: { orders: [], totalSpent: 0, tier: 'Silver' } });
        }

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 🔒 ZERO FALLBACKS: Ab koi phone/email nahi dekha jayega.
        // Sirf aur sirf wahi order lao jispe is bande ki ID chhapi hai.
        const userOrders = await Order.find({
            $or: [
                { userId: absoluteUserId },
                { user: absoluteUserId }
            ]
        }).sort({ createdAt: -1 }).lean();

        const eligibleStatuses = new Set(['PROCESSING', 'DISPATCHED', 'DELIVERED']);
        let totalSpent = 0;
        const safeOrders = Array.isArray(userOrders) ? userOrders : [];

        safeOrders.forEach((o: any) => {
            const status = String(o?.status || '').toUpperCase();
            if (eligibleStatuses.has(status)) {
                totalSpent += (Number(o?.totalAmount) || 0);
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                orders: safeOrders,
                totalSpent,
                tier: totalSpent >= 100000 ? 'Gold' : 'Silver',
            },
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ success: true, data: { orders: [], totalSpent: 0, tier: 'Silver' } });
    }
}
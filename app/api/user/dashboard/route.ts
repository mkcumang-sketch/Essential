import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // 🚨 Matching Tera DB Helper Import
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from '@/models/User'; 

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        
        // 🔒 Strict Security: Bina ID wale request reject
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 🕵️‍♂️ STRICT FILTERING: Sirf is logged-in user ke orders nikalna
        const userOrders = await Order.find({ userId: userId }).sort({ createdAt: -1 });

        // User ki current real-time details nikalna 
        const dbUser = await User.findById(userId).select("walletPoints loyaltyTier role name email").lean() as any;

        // 🎟️ Smart Fallback Referral Code
        const firstName = dbUser?.name?.split(' ')[0] || session.user.name?.split(' ')[0] || 'VIP';
        const generatedRefCode = `REF-${firstName.toUpperCase()}10`;

        // 💰 Total Spent Calculate Karna
        const totalSpent = userOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

        return NextResponse.json({ 
            success: true, 
            data: { 
                orders: userOrders,
                walletPoints: dbUser?.walletPoints || 0,
                totalEarned: 0, 
                loyaltyTier: dbUser?.loyaltyTier || "Silver Vault",
                myReferralCode: generatedRefCode,
                totalSpent: totalSpent
            } 
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
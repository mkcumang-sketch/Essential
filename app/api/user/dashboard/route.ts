import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; 
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from '@/models/user'; 

// 🚀 THE GHOST KILLER: Next.js 15 Data Cache Bypass
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: Request) {
    return POST(req);
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        
        // 🔒 Strict Security: Bina ID wale request reject
        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const sessionUserId = (session.user as any).id;
        
        // 🕵️‍♂️ SMART IDENTITY GLUE: Hamesha Database se fresh user detail lo,
        // kyunki session (JWT) purana ho sakta hai (e.g., agar naya phone add kiya ho).
        const dbUser = await User.findById(sessionUserId).lean() as any;
        
        if (!dbUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Hamesha fresh DB data use karo orders dhoondhne ke liye
        const userEmail = dbUser.email || session.user.email;
        const userPhone = dbUser.phone || (session.user as any).phone;

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 🕵️‍♂️ STRICT FILTERING: Sirf is logged-in user ke orders nikalna
        const orConditions: any[] = [
            { userId: sessionUserId }
        ];

        // Email match
        if (userEmail) {
            orConditions.push({ 'shippingData.email': userEmail });
            orConditions.push({ 'customer.email': userEmail });
        }

        // Agar user ka phone DB mein link ho chuka hai, toh uske basis par bhi guest orders utha lo
        if (userPhone && userPhone.trim() !== "") {
            orConditions.push({ 'shippingData.phone': userPhone });
            orConditions.push({ 'customer.phone': userPhone });
        }

        // Find Orders based on Identity Glue
        const userOrders = await Order.find({ $or: orConditions }).sort({ createdAt: -1 }).lean();

        // 🎟️ Smart Fallback Referral Code
        const firstName = dbUser?.name?.split(' ')[0] || session.user.name?.split(' ')[0] || 'VIP';
        const generatedRefCode = `REF-${firstName.toUpperCase()}10`;

        // 💰 Total Spent Calculate Karna
        const totalSpent = userOrders.reduce((sum: number, order: any) => sum + (Number(order.totalAmount) || 0), 0);

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
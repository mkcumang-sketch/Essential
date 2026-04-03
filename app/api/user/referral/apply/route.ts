export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import UserService from '@/services/user.service';
import { validateInput } from '@/lib/validation';
import { referralApplySchema } from '@/lib/validation';
import { ApiResponse } from '@/types';

// 🌟 BULLETPROOF DATABASE CONNECTION 🌟
let isConnected = false;
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, {
            bufferCommands: true,
            maxPoolSize: 10,
        });
        isConnected = true;
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ DB Connection Error:", error);
        throw new Error("Database connection failed!");
    }
};

// 🏆 ENTERPRISE REFERRAL APPLICATION API 🏆
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
    try {
        await connectDB();
        
        // �️ FIREWALL: Verify user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ 
                success: false, 
                error: "Authentication required" 
            }, { status: 401 });
        }

        // 🛡️ ENTERPRISE INPUT VALIDATION
        const body = await req.json();
        const validatedData = validateInput(referralApplySchema, body);
        const { referralCode } = validatedData;

        // �️ FIREWALL: Get current user with security
        const currentUser = await UserService.findUserById(session.user.id);
        if (!currentUser) {
            return NextResponse.json({ 
                success: false, 
                error: "User not found" 
            }, { status: 404 });
        }

        // �️ FIREWALL: Prevent self-referral
        if (currentUser.myReferralCode === referralCode) {
            return NextResponse.json({ 
                success: false, 
                error: "Cannot use your own referral code" 
            }, { status: 400 });
        }

        // �️ FIREWALL: Check if already used referral
        if (currentUser.referredBy) {
            return NextResponse.json({ 
                success: false, 
                error: "Referral code already used" 
            }, { status: 400 });
        }

        // 🏆 BUSINESS LOGIC: Apply referral using service layer
        const result = await UserService.applyReferralReward(referralCode, session.user.id);

        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        // 🏆 SUCCESS RESPONSE WITH REWARD DETAILS
        return NextResponse.json({
            success: true,
            message: "Referral applied successfully!",
            data: {
                discount: 500,
                referrerBonus: 100,
                referralCode: referralCode,
                newWalletBalance: currentUser.walletPoints + 50 // Welcome bonus
            }
        });

    } catch (error: any) {
        console.error("Referral Apply Error:", error);
        
        // 🛡️ DATABASE ERROR HANDLING
        if (error.code === 11000) {
            return NextResponse.json({ 
                success: false, 
                error: "Referral code conflict" 
            }, { status: 409 });
        }

        return NextResponse.json({ 
            success: false, 
            error: "Failed to apply referral code" 
        }, { status: 500 });
    }
}

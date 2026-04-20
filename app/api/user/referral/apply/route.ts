export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/usertemp';
import UserService from '@/services/user.service';
import { validateInput } from '@/lib/validation';
import { referralApplySchema } from '@/lib/validation';
import { ApiResponse } from '@/types';
import { sendReferralRewardEmail } from '@/lib/mail';

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
                error: "Please sign in first." 
            }, { status: 401 });
        }

        // 🛡️ ENTERPRISE INPUT VALIDATION
        const body = await req.json();
        const validatedData = validateInput(referralApplySchema, body);
        const referralCode = validatedData.referralCode?.toUpperCase().trim();

        // 🛡️ FIREWALL: Get current user with security
        const currentUser = await UserService.findUserById(session.user.id);
        if (!currentUser) {
            return NextResponse.json({ 
                success: false, 
                error: "User not found" 
            }, { status: 404 });
        }

        // 🛡️ FIREWALL: Prevent self-referral (case-insensitive)
        if (currentUser.myReferralCode?.toUpperCase() === referralCode) {
            return NextResponse.json({ 
                success: false, 
                error: "You cannot use your own referral code." 
            }, { status: 400 });
        }

        // 🛡️ FIREWALL: Verify if code exists (case-insensitive)
        const referrer = await User.findOne({ 
            myReferralCode: { $regex: new RegExp(`^${referralCode}$`, 'i') } 
        }).select('_id name');
        
        if (!referrer) {
            return NextResponse.json({ success: false, error: "This referral/promo code does not exist." }, { status: 404 });
        }

        // 🛡️ FIREWALL: Check if already used referral
        if (currentUser.referredBy) {
            return NextResponse.json({ 
                success: false, 
                error: "Referral code already used" 
            }, { status: 400 });
        }

        // 🏆 ATOMIC REFERRAL APPLICATION (PREVENT RACE CONDITION)
        const result = await User.findOneAndUpdate(
            { 
                _id: session.user.id,
                referredBy: { $exists: false } // Atomic check
            },
            { 
                $set: { referredBy: referralCode },
                $inc: { walletPoints: 50 }, // Welcome bonus
                $push: {
                    notifications: {
                        title: "🎁 Referral Bonus Applied!",
                        desc: "₹500 discount has been applied to your account.",
                        unread: true,
                        time: new Date()
                    }
                }
            },
            { new: true }
        ).select('-password -__v');

        if (!result) {
            return NextResponse.json({ 
                success: false, 
                error: "We could not apply that code." 
            }, { status: 400 });
        }

        // 📧 SEND REFERRAL REWARD EMAIL TO REFERRER
        try {
            // Get referrer details for email
            const referrerRaw = await User.findOne({ myReferralCode: referralCode })
                .select('name email')
                .lean();
            
            if (referrerRaw && !Array.isArray(referrerRaw)) {
                const referrer = referrerRaw as { email?: string; name?: string };
                const to = referrer.email?.trim();
                if (to) {
                    await sendReferralRewardEmail(
                        to,
                        referrer.name ?? '',
                        currentUser.name,
                        100 // Reward amount
                    );
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Referral reward email sent to:', to);
                    }
                }
            }
        } catch (emailError) {
            if (process.env.NODE_ENV === 'development') {
                console.error('❌ Referral reward email failed:', emailError);
            }
            // Don't fail the API call if email fails
        }

        // 🏆 SUCCESS RESPONSE WITH REWARD DETAILS
        return NextResponse.json({
            success: true,
            message: "Referral code applied!",
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
                error: "That code is already in use." 
            }, { status: 409 });
        }

        return NextResponse.json({ 
            success: false, 
            error: "We could not apply that code." 
        }, { status: 500 });
    }
}

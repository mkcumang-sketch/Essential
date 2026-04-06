import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        await connectDB(); 
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const code = body.code?.toUpperCase().trim();

        if (!code) {
            return NextResponse.json({ success: false, error: "Code is missing" });
        }

        // 🌟 1. GLOBAL BRAND CODES
        const globalCodes: Record<string, number> = {
            'ESSENTIAL10': 10,
            'WELCOME20': 20,
            'RUSH50': 50,
        };

        if (globalCodes[code]) {
            return NextResponse.json({ 
                success: true, 
                type: 'global', 
                discountValue: globalCodes[code],
                isReferral: false 
            });
        }

        // 🌟 2. SECURE REFERRAL SYSTEM (REAL DB CHECK)
        if (code.startsWith('REF-') || code.startsWith('VIP-')) {
            const referrer = await User.findOne({ myReferralCode: code }).select('_id name');
            
            if (!referrer) {
                return NextResponse.json({ success: false, error: "Invalid Referral Code" }, { status: 400 });
            }

            // 🛡️ SECURITY: Prevent self-referral
            if (session?.user?.id === String(referrer._id)) {
                return NextResponse.json({ success: false, error: "You cannot use your own referral code." }, { status: 400 });
            }

            return NextResponse.json({ 
                success: true, 
                type: 'referral', 
                discountValue: 10, 
                isReferral: true 
            });
        }

        return NextResponse.json({ success: false, error: "Invalid promo code" }, { status: 400 });

    } catch (error) {
        console.error("Promo Verification Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
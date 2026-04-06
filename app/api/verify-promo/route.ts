import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // 🚨 Added for future DB checks
// import User from '@/models/User'; // Future mein jab asli user match karna ho

export async function POST(req: Request) {
    try {
        // Database connect kar lo aage ke real validations ke liye
        await connectDB(); 

        const body = await req.json();
        const code = body.code?.toUpperCase().trim();

        if (!code) {
            return NextResponse.json({ success: false, error: "Code is missing" });
        }

        // 🌟 1. GLOBAL BRAND CODES (Fix Discounts)
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

        // 🌟 2. SMART MLM REFERRAL SYSTEM
        // Agar code mein 'REF', 'VIP', ya 'PRO' aata hai
        if (code.startsWith('REF') || code.startsWith('VIP') || code.startsWith('PRO')) {
            
            // 🚀 GOD MODE FUTURE UPDATE: Yahan tu actual DB se match kar sakta hai
            // const referrerUser = await User.findOne({ myReferralCode: code });
            // if (!referrerUser) return NextResponse.json({ success: false, error: "Invalid Referral Code" }, { status: 400 });

            return NextResponse.json({ 
                success: true, 
                type: 'referral', 
                discountValue: 10, // MLM walo ko hamesha 10% off milega
                isReferral: true 
            });
        }

        // Agar code upar kahin match nahi hua, toh reject kar do
        return NextResponse.json({ success: false, error: "Invalid promo code" }, { status: 400 });

    } catch (error) {
        console.error("Promo Verification Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
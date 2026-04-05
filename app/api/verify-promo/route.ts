import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
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
        // Agar code mein 'REF', 'VIP', ya 'PRO' aata hai (Jaise: REF-UMANG, VIP-AKANSHA)
        if (code.startsWith('REF') || code.startsWith('VIP') || code.startsWith('PRO')) {
            return NextResponse.json({ 
                success: true, 
                type: 'referral', 
                discountValue: 10, // MLM walo ko hamesha 10% off milega
                isReferral: true 
            });
        }

        // 🌟 3. (FUTURE) Yahan tu Database se check karne ka logic daal sakta hai
        // const dbCode = await PromoDB.findOne({ code: code })
        // if(dbCode) return NextResponse.json({ success: true, discountValue: dbCode.discount })

        // Agar code upar kahin match nahi hua, toh reject kar do
        return NextResponse.json({ success: false, error: "Invalid promo code" }, { status: 400 });

    } catch (error) {
        console.error("Promo Verification Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
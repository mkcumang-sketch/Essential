import { NextResponse } from 'next/server';

// 🌟 DUMMY PAYMENT ROUTE TO PASS VERCEL BUILD 🌟
// Real Razorpay logic will be injected here later.

export async function POST(req: Request) {
    try {
        // Just a safe mock response for now so the build doesn't crash
        return NextResponse.json({ 
            success: true, 
            message: "Payment Gateway is currently in mock mode.",
            orderId: "mock_order_123" 
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Payment routing error" }, { status: 500 });
    }
}
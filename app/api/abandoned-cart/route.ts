import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { AbandonedCart } from '@/models/AbandonedCart';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const { email, phone, name, cartItems, total } = await req.json();

        if (!email && !phone) {
            return NextResponse.json({ success: false, message: "Email or Phone required" }, { status: 400 });
        }

        const query = session?.user 
            ? { userId: (session.user as any).id }
            : { $or: [{ email }, { phone }] };

        const update = {
            name: name || "Vault Client",
            email: email || "",
            phone: phone || "",
            userId: session?.user ? (session.user as any).id : null,
            cartTotal: total || 0,
            items: cartItems || [],
            status: "ABANDONED",
            lastInteraction: new Date()
        };

        await AbandonedCart.findOneAndUpdate(query, update, { upsert: true, new: true });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Abandoned Cart Capture Error:', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

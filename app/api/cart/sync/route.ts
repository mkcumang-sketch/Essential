import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Apne authOptions ka path check kar lena
import connectDB from '@/lib/mongodb';
import { AbandonedCart } from '@/models/AbandonedCart';

export const dynamic = 'force-dynamic';

// 🚀 GET: Frontend ko purani cart wapas dene ke liye
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, items: [] });
        }

        await connectDB();
        const userCart:any = await AbandonedCart.findOne({ email: session.user.email }).lean();

        if (!userCart) {
            return NextResponse.json({ success: true, items: [] });
        }

        return NextResponse.json({ success: true, items: userCart.cartItems || [] });
    } catch (error) {
        console.error("GET Cart Error:", error);
        return NextResponse.json({ success: false, items: [] }, { status: 500 });
    }
}

// 🚀 POST: Frontend se naya data DB mein save (Abandoned Cart banane) ke liye
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, message: "Login required to save cart" }, { status: 401 });
        }

        await connectDB();
        const { items, totalAmount } = await req.json();

        const userEmail = session.user.email;
        const userName = session.user.name || "Vault VIP";

        // Agar cart khaali kardi user ne, toh DB se Abandoned Cart uda do
        if (!items || items.length === 0) {
            await AbandonedCart.findOneAndDelete({ email: userEmail });
            return NextResponse.json({ success: true, message: "Cart cleared" });
        }

        // 🚀 THE MAGIC: Upsert (Agar cart nahi hai toh banayega, agar hai toh update karega)
        await AbandonedCart.findOneAndUpdate(
            { email: userEmail },
            { 
                name: userName,
                email: userEmail,
                cartItems: items,
                cartTotal: totalAmount || 0,
                updatedAt: new Date()
            },
            { new: true, upsert: true } // Upsert = Create if not exists!
        );

        return NextResponse.json({ success: true, message: "Abandoned Cart Saved!" });

    } catch (error: any) {
        console.error("POST Cart Error:", error.message);
        return NextResponse.json({ success: false, message: "Server Database Error" }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { productId, productName } = body;

        if (!productId) {
            return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
        }

        // Use session info if available, otherwise it's a guest (though frontend checks session)
        const phone = (session?.user as any)?.phone || 'N/A';
        const userId = session?.user?.id;

        // Save to Lead collection as a 'PENDING' status for waitlist
        const newWaitlistEntry = await Lead.create({
            phone: phone,
            userId: userId,
            cartItems: [{ productId, productName }],
            status: 'PENDING',
            lastActive: new Date()
        });

        return NextResponse.json({ 
            success: true, 
            message: "You have been added to the exclusive waitlist. We will contact you soon.",
            data: newWaitlistEntry 
        });

    } catch (error: any) {
        console.error("Waitlist API Error:", error);
        return NextResponse.json({ success: false, error: "Failed to join waitlist. Please try again." }, { status: 500 });
    }
}

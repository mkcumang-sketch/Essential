export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth"; 

export async function POST(req: Request) {
    try {
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

        // 🔒 1. SERVER SE DIRECT SESSION NIKALO (HACK-PROOF)
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json({ success: false, data: { orders: [] } });
        }

        const userEmail = session.user.email?.toLowerCase().trim();
        const userPhone = (session.user as any).phone || (session.user as any).number;

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 🔒 2. TITANIUM SECURITY QUERY (Khali email/phone ko match karne se rokna)
        let query: any = { $or: [] };

        if (userEmail && userEmail.length > 3) {
            query.$or.push({ "customer.email": userEmail });
            query.$or.push({ "email": userEmail }); // Backup check
        }

        if (userPhone && userPhone.length > 5) {
            query.$or.push({ "customer.phone": userPhone });
            query.$or.push({ "phone": userPhone }); // Backup check
        }

        // 🚨 AGAR EMAIL AUR PHONE DONO KHALI HAIN, TOH EMPTY RETURN KARO (DATA LEAK PREVENTED)
        if (query.$or.length === 0) {
            return NextResponse.json({ success: false, data: { orders: [] } });
        }

        // 3. EXACT MATCH WALE ORDERS NIKALO
        const userOrders = await Order.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ 
            success: true, 
            data: { orders: userOrders, profile: { completeness: 100 }, wallet: { points: 0 } } 
        });

    } catch (error) {
        console.error("User Dashboard Error:", error);
        return NextResponse.json({ success: false, data: { orders: [] } });
    }
}
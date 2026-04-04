export const dynamic = 'force-dynamic'; // 🚨 VERCEL CACHE KILLER
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth";
// 🚨 FIX: Session options import karna zaroori hai
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const connectDB = async () => {
    if (mongoose.connection.readyState < 1) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }
};

// 🌟 1. GET ORDERS (SMART FILTER: Admin sees all, Users see their own)
export async function GET() {
    try {
        await connectDB();
        
        // 🛡️ SECURITY LOCK: Pehchano kaun aaya hai
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized access! Please login." }, { status: 401 });
        }

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const sessionUser = session.user as any;
        let orders = [];

        // 👑 SUPER_ADMIN KO SAB DIKHEGA
        if (sessionUser.role === 'SUPER_ADMIN') {
            orders = await Order.find({}).sort({ createdAt: -1 });
        } 
        // 👤 NORMAL USER KO SIRF APNA DIKHEGA
        else {
            const queryConditions = [];
            
            // Har tarah se order dhoondho (ID, Email, Phone)
            if (sessionUser.id) {
                queryConditions.push({ user: sessionUser.id }, { userId: sessionUser.id });
            }
            if (sessionUser.email) {
                queryConditions.push({ "customer.email": sessionUser.email }, { email: sessionUser.email });
            }
            if (sessionUser.phone && !sessionUser.phone.startsWith('GOOG-')) {
                queryConditions.push({ "customer.phone": sessionUser.phone }, { phone: sessionUser.phone });
            }

            // Agar koi valid ID/Email/Phone mila, tabhi search karo
            if (queryConditions.length > 0) {
                orders = await Order.find({ $or: queryConditions }).sort({ createdAt: -1 });
            }
        }

        return NextResponse.json({ success: true, data: orders, orders: orders });
    } catch (error) {
        console.error("Orders Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch orders" });
    }
}

// 🌟 2. STATUS UPDATE KAREGA (Dropdown change karne par)
export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        const orderId = body._id || body.id; 
        const newStatus = body.status;

        if (!orderId || !newStatus) {
            return NextResponse.json({ success: false, error: "Missing ID or Status" }, { status: 400 });
        }

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        await Order.findByIdAndUpdate(orderId, { status: newStatus });

        return NextResponse.json({ success: true, message: "Status updated successfully!" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
    }
}

export async function POST(req: Request) { return PUT(req); }
export async function PATCH(req: Request) { return PUT(req); }

// 🌟 3. HARD DELETE (Trash bin dabane par)
export async function DELETE(req: Request) {
    try {
        await connectDB();
        
        const url = new URL(req.url);
        let orderId = url.searchParams.get('id');
        
        if (!orderId) {
            const body = await req.json().catch(() => ({}));
            orderId = body._id || body.id;
        }

        if (!orderId) {
            return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
        }

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        await Order.findByIdAndDelete(orderId);

        return NextResponse.json({ success: true, message: "Order completely deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
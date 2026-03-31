export const dynamic = 'force-dynamic'; // 🚨 VERCEL CACHE KILLER
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState < 1) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }
};

// 🌟 1. GET ORDERS (Admin Panel Load Hone Par)
export async function GET() {
    try {
        await connectDB();
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const orders = await Order.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: orders, orders: orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch orders" });
    }
}

// 🌟 2. STATUS UPDATE KAREGA (Dropdown change karne par)
export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        // Frontend 'id' bheje ya '_id', hum dono pakad lenge
        const orderId = body._id || body.id; 
        const newStatus = body.status;

        if (!orderId || !newStatus) {
            return NextResponse.json({ success: false, error: "Missing ID or Status" }, { status: 400 });
        }

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        
        // Database mein naya status permanent save karo
        await Order.findByIdAndUpdate(orderId, { status: newStatus });

        return NextResponse.json({ success: true, message: "Status updated successfully!" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
    }
}

// Agar frontend galti se POST ya PATCH bhejta hai, tab bhi update chalega!
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
        
        // 🚨 ZAMEEN SE MITA DO: Order hamesha ke liye delete. Customer ko kabhi nahi dikhega!
        await Order.findByIdAndDelete(orderId);

        return NextResponse.json({ success: true, message: "Order completely deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
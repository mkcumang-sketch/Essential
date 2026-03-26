import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// GET All Orders for Tracking
export async function GET() {
    try {
        await connectDB();
        // Assuming Order schema is already registered by other APIs
        const Order = mongoose.models.Order;
        if (!Order) return NextResponse.json({ success: true, data: [] });

        const orders = await Order.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
    }
}

// UPDATE Order Status
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const { id, status } = await req.json();
        const Order = mongoose.models.Order;
        
        await Order.findByIdAndUpdate(id, { status });
        return NextResponse.json({ success: true, message: "Status updated" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
    }
}
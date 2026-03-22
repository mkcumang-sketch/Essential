import { NextResponse } from 'next/server';
import mongoose from 'mongoose';


// 🌟 SECURE ORDER SCHEMA 🌟
const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'PROCESSING' }, // PENDING, PROCESSING, DISPATCHED, DELIVERED
    customer: {
        name: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'IN' }
    },
    items: [{
        product: String,
        quantity: Number,
        price: Number
    }]
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try { await mongoose.connect(process.env.MONGODB_URI as string); } catch (e) { console.error(e); }
};

export async function GET(req: Request) {
    try {
        await connectDB();
        const orders = await Order.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        // Generate a fallback Order ID if Razorpay didn't provide one (for mock testing)
        const newOrderId = body.orderId || `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        const newOrder = await Order.create({
            ...body,
            orderId: newOrderId
        });

        return NextResponse.json({ success: true, data: newOrder });
    } catch (error: any) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ success: false, error: "Failed to secure transaction" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await connectDB();
        const { id, status } = await req.json();
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 });
    }
}
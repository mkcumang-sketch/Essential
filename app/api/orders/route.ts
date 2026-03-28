import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// DB Connection
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// ... (Aapke existing GET ya POST methods yahan rahenge) ...

// 🚀 Handle DELETE request for Orders 🚀
export async function DELETE(req: Request) {
    try {
        await connectDB();
        
        // Parse the ID sent from the frontend
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
        }

        // Ensure Order schema exists dynamically
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 🚀 Permanently delete from MongoDB
        await Order.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Order permanently deleted." });

    } catch (error) {
        console.error("Order Deletion Error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 });
    }
} 
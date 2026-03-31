export const dynamic = 'force-dynamic'; // 🚨 ZOMBIE CACHE KILLER 🚨
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState < 1) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }
};

// 🌟 1. GET ALL PRODUCTS (Hamesha fresh data layega)
export async function GET() {
    try {
        await connectDB();
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        const products = await Product.find({}).sort({ createdAt: -1 });
        
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch products" });
    }
}

// 🌟 2. ADD NEW PRODUCT
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        
        const newProduct = await Product.create(body);
        return NextResponse.json({ success: true, data: newProduct });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to add product" });
    }
}

// 🌟 3. DELETE PRODUCT (Zameen se mita dega)
// 🌟 ADMIN SE DELETE DABANE PAR STATUS 'CANCELLED' KAREGA
export async function DELETE(req: Request) {
    try {
        if (mongoose.connection.readyState < 1) await mongoose.connect(process.env.MONGODB_URI as string);
        
        const url = new URL(req.url);
        let id = url.searchParams.get('id');
        
        if (!id) {
            const body = await req.json().catch(() => ({}));
            id = body.id || body._id;
        }

        if (!id) return NextResponse.json({ success: false, error: "Order ID missing" }, { status: 400 });

        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        
        // 🚨 DELETE NAHI KARNA HAI! STATUS UPDATE KARNA HAI!
        await Order.findByIdAndUpdate(id, { status: "CANCELLED" });
        
        return NextResponse.json({ success: true, message: "Order marked as Cancelled" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to cancel order" }, { status: 500 });
    }
}
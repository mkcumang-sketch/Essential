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
export async function DELETE(req: Request) {
    try {
        await connectDB();
        
        // Frontend ya toh URL parameters mein ID bhejta hai ya Body mein, hum dono handle karenge
        const url = new URL(req.url);
        let id = url.searchParams.get('id');
        
        if (!id) {
            const body = await req.json().catch(() => ({}));
            id = body.id || body._id;
        }

        if (!id) {
            return NextResponse.json({ success: false, error: "Product ID missing" }, { status: 400 });
        }

        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        await Product.findByIdAndDelete(id);
        
        return NextResponse.json({ success: true, message: "Product deleted forever" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
    }
}
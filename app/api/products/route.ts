import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// 🌟 PRODUCT SCHEMA 🌟
const ProductSchema = new mongoose.Schema({
    name: String, slug: String, sku: String, brand: String, category: String,
    price: Number, offerPrice: Number, stock: Number,
    imageUrl: String, images: Array, videoUrl: String, model3DUrl: String,
    description: String, tags: Array, priority: Number, badge: String, amazonDetails: Array,
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// GET All Products
export async function GET() {
    try {
        await connectDB();
        const products = await Product.find().sort({ priority: -1, createdAt: -1 });
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
    }
}

// CREATE New Product
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const newProduct = await Product.create(body);
        return NextResponse.json({ success: true, data: newProduct });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to save product" }, { status: 500 });
    }
}

// DELETE Product
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { id } = await req.json();
        await Product.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
    }
}
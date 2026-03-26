import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 🌟 BULLETPROOF DB CONNECTION 🌟
let isConnected = false;
const connectDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected || mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string, { maxPoolSize: 10 });
    isConnected = true;
};

// 🌟 THE ENHANCED LUXURY PRODUCT SCHEMA 🌟
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, default: 'Luxury' },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    description: { type: String },
    images: { type: Array, default: [] },
    badge: { type: String, default: '' },
    priority: { type: Number, default: 0 },
    
    // 👑 NEW ENTERPRISE PRICING ENGINE FIELDS 👑
    vipVaultKey: { type: String, default: "" },     // Product-specific promo code (e.g., "ROLEXVIP")
    vipDiscount: { type: Number, default: 0 },      // Discount amount (e.g., 5000)
    transitFee: { type: Number, default: 0 },       // Insured Delivery Charge (e.g., 1500 or 0 for free)
    taxPercentage: { type: Number, default: 18 },   // GST/Duty bracket (e.g., 18%)
    taxInclusive: { type: Boolean, default: true }, // True = Price includes GST, False = Add GST extra at checkout

    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// GET: Fetch all products for the frontend
export async function GET(req: Request) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const search = url.searchParams.get('search') || '';
        
        const query = search ? { 
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ] 
        } : {};

        const products = await Product.find(query).sort({ priority: -1, createdAt: -1 });
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.error("Fetch Products Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST: Add a new product from Godmode Admin Panel
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        // Create the product with the new pricing engine fields
        const newProduct = await Product.create(body);
        
        return NextResponse.json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Add Product Error:", error);
        return NextResponse.json({ success: false, error: "Failed to add product" }, { status: 500 });
    }
}

// PUT: Update an existing product
export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { _id, ...updateData } = body;
        
        if (!_id) return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });

        const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, { new: true });
        return NextResponse.json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Update Product Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
    }
}

// DELETE: Remove a product
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });

        await Product.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Product deleted safely" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
    }
}
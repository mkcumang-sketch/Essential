export const dynamic = 'force-dynamic';
export const revalidate = 60; // 🚨 CACHE FOR 60 SECONDS FOR SPEED 🚨

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from 'next/cache';

// 🌟 BULLETPROOF DB CONNECTION 🌟
let isConnected = false;
const connectDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected || mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string, { maxPoolSize: 10 });
    isConnected = true;
};

const isSuperAdmin = async () => {
    const session = await getServerSession(authOptions);
    return (session?.user as any)?.role === 'SUPER_ADMIN';
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

// GET: Fetch all products for the frontend (WITH CACHE KILLER)
export async function GET(req: Request) {
    try {
        // 🚨 Sahi tareeka DB connect karne ka
        await connectDB();

        // Query ko properly define kar diya
        const query = {};

        const products = await Product.find(query).sort({ priority: -1, createdAt: -1 });
        
        // 🚨 CACHE FOR 60 SECONDS FOR SPEED 🚨
        const response = NextResponse.json({ success: true, data: products });
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
        return response;

    } catch (error) {
        console.error("Fetch Products Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST: Add a new product from Godmode Admin Panel
export async function POST(req: Request) {
    try {
        if (!(await isSuperAdmin())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }
        await connectDB();
        const body = await req.json();
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
        if (!(await isSuperAdmin())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }
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

// DELETE: Remove a product (BULLETPROOF HARD DELETE)
export async function DELETE(req: Request) {
    try {
        if (!(await isSuperAdmin())) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }
        await connectDB();
        
        // Support both URL params and Body payload for ID
        const url = new URL(req.url);
        let id = url.searchParams.get('id');
        
        if (!id) {
            const body = await req.json().catch(() => ({}));
            id = body.id || body._id;
        }

        if (!id) return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });

        await Product.findByIdAndDelete(id);
        revalidatePath('/', 'layout');
        
        return NextResponse.json({ success: true, message: "Product deleted safely and permanently" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
    }
}
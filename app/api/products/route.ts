import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 🌟 PREMIUM DATABASE SCHEMA: BULLETPROOF ASSET MODEL 🌟
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true }, // 🛡️ Zero Crash: Strict Unique SKU
    brand: { type: String, default: 'Essential' },
    category: { type: String, default: 'Luxury' },
    price: { type: Number, default: 0 },
    offerPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 10 },
    imageUrl: { type: String, required: true },
    images: { type: [String], default: [] }, // Multi-angle gallery
    videoUrl: { type: String, default: '' }, // Cinematic MP4 support
    model3DUrl: { type: String, default: '' }, // 3D Spline support
    description: { type: String, default: '' },
    tags: { type: [String], default: [] }, // Neural SEO tags
    priority: { type: Number, default: 0 }, // Z-Index sorting
    badge: { type: String, default: '' }, // e.g., 'Rare Edition'
    amazonDetails: { type: Array, default: [] } // Tech specs array
}, { timestamps: true });

// 🛡️ VERCEL CACHE FIX: Prevent Schema Overwrite during serverless hot-reloads
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// ⚡ HIGH-SPEED DB CONNECTION TUNNEL
const connectDB = async () => {
    // Agar connection pehle se hai, toh naya mat banao (Saves Vercel RAM)
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("✅ MongoDB Secured: Vault Engine Online");
    } catch (error) {
        console.error("❌ MongoDB Breach (Connection Error):", error);
    }
};

// 📡 GET: FETCH ALL ASSETS (For Frontend & Godmode)
export async function GET(req: Request) {
    try {
        await connectDB();
        // Automatically sort by highest priority (Z-Index) first, then newest
        const products = await Product.find({}).sort({ priority: -1, createdAt: -1 });
        return NextResponse.json({ success: true, data: products }, { status: 200 });
    } catch (error) {
        console.error("Vault Access Error:", error);
        return NextResponse.json({ success: false, error: "Failed to access Vault" }, { status: 500 });
    }
}

// 💉 POST: INJECT NEW ASSET (From Godmode)
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // 🛡️ THE BRAMHASTRA: Auto-Generate Fallbacks to prevent ANY MongoDB Crash (E11000)
        const generatedSlug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
        const generatedSku = body.sku || `ASSET-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        const newProduct = await Product.create({
            ...body,
            slug: generatedSlug,
            sku: generatedSku
        });

        return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
    } catch (error: any) {
        console.error("Asset Injection Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Failed to inject asset" }, { status: 500 });
    }
}

// 🗑️ DELETE: PURGE ASSET (From Godmode)
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { id } = await req.json();
        
        if (!id) {
            return NextResponse.json({ success: false, error: "Asset ID missing in payload" }, { status: 400 });
        }

        await Product.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Asset Purged Successfully" }, { status: 200 });
    } catch (error) {
        console.error("Asset Purge Error:", error);
        return NextResponse.json({ success: false, error: "Failed to purge asset" }, { status: 500 });
    }
}
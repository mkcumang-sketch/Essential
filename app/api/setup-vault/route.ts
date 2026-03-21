import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 🌟 EXACT PRODUCT SCHEMA (To match your vault)
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    brand: String,
    category: String,
    price: { type: Number, default: 0 },
    offerPrice: { type: Number, default: 0 },
    stock: { type: Number, default: 10 },
    imageUrl: { type: String, required: true },
    images: { type: [String], default: [] },
    videoUrl: String,
    model3DUrl: String,
    description: String,
    tags: { type: [String], default: [] },
    priority: { type: Number, default: 0 },
    badge: String,
    amazonDetails: { type: Array, default: [] }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try { await mongoose.connect(process.env.MONGODB_URI as string); } catch (e) { console.error(e); }
};

// 👑 THE MASTERPIECES (High-Res Unsplash Assets)
const SEED_DATA = [
    {
        name: "Cosmograph Daytona Platinum",
        slug: `rolex-daytona-${Date.now()}-1`,
        sku: `AST-${Date.now()}-101`,
        brand: "ROLEX",
        category: "Investment Grade",
        price: 8500000,
        offerPrice: 8250000,
        stock: 2,
        imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop",
        images: [],
        description: "The ultimate tool watch for those with a passion for driving and speed. Forged in pure platinum with an ice-blue dial.",
        priority: 100,
        badge: "Highly Rare",
        amazonDetails: [{ key: "Dial", value: "Ice Blue" }, { key: "Material", value: "Platinum" }]
    },
    {
        name: "Royal Oak Selfwinding",
        slug: `ap-royaloak-${Date.now()}-2`,
        sku: `AST-${Date.now()}-102`,
        brand: "AUDEMARS PIGUET",
        category: "Modern Complications",
        price: 4500000,
        offerPrice: 4500000,
        stock: 5,
        imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1000&auto=format&fit=crop",
        images: [],
        description: "The watch that created the luxury sports category. Featuring the iconic octagonal bezel and 'Grande Tapisserie' dial.",
        priority: 90,
        badge: "Iconic",
        amazonDetails: [{ key: "Dial", value: "Blue Tapisserie" }, { key: "Material", value: "Steel" }]
    },
    {
        name: "Nautilus Travel Time",
        slug: `patek-nautilus-${Date.now()}-3`,
        sku: `AST-${Date.now()}-103`,
        brand: "PATEK PHILIPPE",
        category: "Rare Vintage",
        price: 12500000,
        offerPrice: 12000000,
        stock: 1,
        imageUrl: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000&auto=format&fit=crop",
        images: [],
        description: "A masterpiece of casual elegance. The Nautilus features a dual time zone mechanism indicating local and home time.",
        priority: 110,
        badge: "Holy Trinity",
        amazonDetails: [{ key: "Dial", value: "Gradient Blue" }, { key: "Movement", value: "Automatic" }]
    },
    {
        name: "Santos de Cartier",
        slug: `cartier-santos-${Date.now()}-4`,
        sku: `AST-${Date.now()}-104`,
        brand: "CARTIER",
        category: "Investment Grade",
        price: 650000,
        offerPrice: 620000,
        stock: 8,
        imageUrl: "https://images.unsplash.com/photo-1587836374828-cb4387df3c56?q=80&w=1000&auto=format&fit=crop",
        images: [],
        description: "The first modern wristwatch. Elegant, square, and instantly recognizable with its exposed screws.",
        priority: 80,
        badge: "Classic",
        amazonDetails: [{ key: "Dial", value: "Opaline White" }, { key: "Bracelet", value: "SmartLink" }]
    }
];

export async function GET(req: Request) {
    try {
        await connectDB();
        
        // Count existing products
        const existingCount = await Product.countDocuments();
        
        if (existingCount > 0) {
            return NextResponse.json({ success: true, message: `Vault already contains ${existingCount} assets. Delete them from Godmode to re-seed.` });
        }

        // Inject the Masterpieces
        await Product.insertMany(SEED_DATA);
        
        return NextResponse.json({ success: true, message: "Vault successfully populated with 4 Ultra-Premium Masterpieces! 💎" });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
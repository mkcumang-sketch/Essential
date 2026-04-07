// app/api/temp-seed/route.ts (Temporary Seeder file)

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import mongoose from 'mongoose';
import { getToken } from 'next-auth/jwt';

// Ensure MONGODB_URI is correctly set in Vercel Environment Variables
if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// 🌟 THE VERCEL CACHE-BUSTER: Required to ensure the script runs fresh on Vercel 🌟
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🌟 THE MASTER CMS SCHEMA 🌟
const cmsSchema = new mongoose.Schema({
    heroSlides: { type: Array, default: [] },
    aboutConfig: { type: Object, default: {} },
    galleryImages: { type: Array, default: [] },
    promotionalVideos: { type: Array, default: [] }, // The 5 video breaks storage
    uiConfig: { type: Object, default: {} },
    categories: { type: Array, default: [] },
    faqs: { type: Array, default: [] },
    socialLinks: { type: Object, default: {} },
    corporateInfo: { type: Object, default: {} },
    legalPages: { type: Array, default: [] }
}, { timestamps: true });

// Bind Model
const CmsConfig = mongoose.models.CmsConfig || mongoose.model('CmsConfig', cmsSchema);

const isSuperAdminRequest = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token && (token as any).role === 'SUPER_ADMIN';
};

// 💎 THE PREMIUM DEFAULT DATA (User's provided data from previous turns)
const LUXURY_DEFAULT_DATA = {
    corporateInfo: {
        companyName: "Essential Rush Horology",
        address: "145 Luxury Avenue, Geneva, Switzerland - 1204",
        phone1: "+41 22 715 30 00",
        email: "concierge@essentialrush.com"
    },
    aboutConfig: {
        title: "Our Heritage",
        alignment: "left",
        boldWords: "uncompromising excellence, timeless, precision, legacy",
        content: "Founded on the principles of uncompromising excellence, Essential Rush was established to curate and protect the world's most significant mechanical art pieces. We believe in the beauty of simplicity and the power of true craftsmanship. Every timepiece in our vault is an embodiment of precision and a testament to a legacy that stands the test of time."
    },
    faqs: [
        { q: "Are all timepieces guaranteed authentic?", a: "Absolutely. Every asset in our vault undergoes a rigorous multi-point inspection by certified master horologists. We provide a Certificate of Authenticity and a comprehensive 2-year warranty with every acquisition." },
        { q: "What are your global shipping protocols?", a: "We offer complimentary, fully-insured global shipping via armored courier services (such as Malca-Amit or Brinks). Your asset is protected from the moment it leaves our vault until it reaches your hands." },
        { q: "Do you accept returns or exchanges?", a: "We accept returns within 14 days of delivery, provided the timepiece remains unworn, in its original pristine condition, with all factory seals and documentation entirely intact." }
    ],
    categories: ["Investment Grade", "Rare Vintage", "Modern Complications", "Classic Dress"],
    promotionalVideos: [
        "https://cdn.pixabay.com/video/2020/05/24/40092-424840899_large.mp4", 
        "https://cdn.pixabay.com/video/2021/08/11/84687-587289569_large.mp4", 
        "https://cdn.pixabay.com/video/2020/02/21/32616-393246231_large.mp4", 
        "", 
        ""
    ],
    legalPages: [
        { id: "privacy-2026", title: "Privacy Protocol", slug: "privacy-policy", content: "<h2>1. Data Protection Guarantee</h2><p>...</p>" },
        { id: "terms-2026", title: "Terms of Acquisition", slug: "terms-of-service", content: "<h2>1. General Agreement</h2><p>...</p>" },
        { id: "returns-2026", title: "Shipping & Returns", slug: "shipping-returns", content: "<h2>1. Insured Global Logistics</h2><p>...</p>" }
    ]
};

export async function GET(req: NextRequest) {
    try {
        if (!(await isSuperAdminRequest(req))) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
        await connectDB();
        const config = await CmsConfig.findOne({});
        
        if (!config) {
            await CmsConfig.create(LUXURY_DEFAULT_DATA);
            return NextResponse.json({ success: true, message: "Sample data added." });
        } else {
            return NextResponse.json({ success: false, message: "Database already has data. Seed skipped." });
        }
    } catch (error) {
        console.error("Temp Seed Error:", error);
        return NextResponse.json({ success: false, error: "Seed failed" }, { status: 500 });
    }
}
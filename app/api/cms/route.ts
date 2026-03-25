import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import mongoose from 'mongoose';

// 🌟 THE VERCEL CACHE-BUSTER: Forces Vercel to always fetch and save FRESH data 🌟
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🌟 THE MASTER CMS SCHEMA 🌟
const cmsSchema = new mongoose.Schema({
    heroSlides: { type: Array, default: [] },
    aboutConfig: { type: Object, default: {} },
    galleryImages: { type: Array, default: [] },
    
    // 🌟 THE NEW UPGRADE: Storage for the 5 Cinematic Video Breaks 🌟
    promotionalVideos: { type: Array, default: [] }, 
    
    uiConfig: { type: Object, default: {} },
    categories: { type: Array, default: [] },
    faqs: { type: Array, default: [] },
    visionaries: { type: Array, default: [] }, // Legacy, moving towards Celebrity DB
    socialLinks: { type: Object, default: {} },
    corporateInfo: { type: Object, default: {} },
    legalPages: { type: Array, default: [] }
}, { timestamps: true });

// Bind Model
const CmsConfig = mongoose.models.CmsConfig || mongoose.model('CmsConfig', cmsSchema);

// 💎 THE PREMIUM DEFAULT DATA (Vogue/Apple Style English)
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
    
    // 🌟 DEFAULT VIDEOS FOR THE FRONTEND BREAKS 🌟
    promotionalVideos: [
        "https://cdn.pixabay.com/video/2020/05/24/40092-424840899_large.mp4", 
        "https://cdn.pixabay.com/video/2021/08/11/84687-587289569_large.mp4", 
        "https://cdn.pixabay.com/video/2020/02/21/32616-393246231_large.mp4", 
        "", 
        ""
    ],
    
    legalPages: [
        {
            id: "privacy-2026",
            title: "Privacy Protocol",
            slug: "privacy-policy",
            content: "<h2>1. Data Protection Guarantee</h2><p>At Essential Rush, your privacy is treated with the same uncompromising standard of security as our physical vaults. We employ military-grade AES-256 encryption to ensure all client identity vectors and transaction details remain strictly confidential.</p><h2>2. Information Collection</h2><p>We only collect data strictly necessary for the execution of global logistics and elite concierge services. This includes your secure communication lines and physical coordinates for dispatch.</p>"
        },
        {
            id: "terms-2026",
            title: "Terms of Acquisition",
            slug: "terms-of-service",
            content: "<h2>1. General Agreement</h2><p>By interacting with the Essential Rush digital platform, you agree to our elite operational protocols. All assets listed in the vault are subject to rigorous availability checks.</p><h2>2. Valuation & Capital</h2><p>Market values for highly rare timepieces fluctuate. The capital required for acquisition is locked only upon successful completion of the secure checkout process.</p>"
        },
        {
            id: "returns-2026",
            title: "Shipping & Returns",
            slug: "shipping-returns",
            content: "<h2>1. Insured Global Logistics</h2><p>All acquisitions are shipped completely free of charge worldwide. Deliveries are executed via secure, armored transit protocols, requiring a direct signature upon delivery.</p><h2>2. The 14-Day Guarantee</h2><p>Should your acquisition not meet your exact expectations, you may initiate a return protocol within 14 days. The asset must remain in factory condition.</p>"
        }
    ]
};

// 📡 GET: FETCH CMS DATA (Auto-Seeds if Empty!)
export async function GET() {
    try {
        await connectDB();
        let config = await CmsConfig.findOne({});
        
        // 🌟 MAGIC AUTO-SEEDER: If database is empty, fill it with Luxury Data!
        if (!config) {
            console.log("Vault empty. Seeding ultra-premium CMS data...");
            config = await CmsConfig.create(LUXURY_DEFAULT_DATA);
        }
        
        return NextResponse.json({ success: true, data: config });
    } catch (error) {
        console.error("CMS GET Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch matrix configuration" }, { status: 500 });
    }
}

// 💉 POST: UPDATE CMS DATA (From Godmode)
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        // Update or Create the single configuration document
        const config = await CmsConfig.findOneAndUpdate({}, body, { new: true, upsert: true });
        
        return NextResponse.json({ success: true, data: config });
    } catch (error) {
        console.error("CMS POST Error:", error);
        return NextResponse.json({ success: false, error: "Failed to compile UI changes" }, { status: 500 });
    }
}
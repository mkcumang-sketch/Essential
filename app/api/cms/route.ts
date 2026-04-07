import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 🌟 DATABASE CONNECTION 🌟
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
};

// 🌟 CMS SCHEMA (Make sure legalPages is included!) 🌟
const CmsSchema = new mongoose.Schema({
    heroSlides: Array,
    aboutConfig: Object,
    galleryImages: Array,
    promotionalVideos: Array,
    uiConfig: Object,
    categories: Array,
    faqs: Array,
    socialLinks: Object,
    corporateInfo: Object,
    legalPages: [{
        id: String,
        title: String,
        slug: String,
        content: String
    }], // Yeh missing hone ki wajah se error aata hai
    updatedAt: { type: Date, default: Date.now }
});

const CMS = mongoose.models.CMS || mongoose.model('CMS', CmsSchema);

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minute cache for CMS

// 🌟 GET METHOD: Frontend aur Admin ko data bhejne ke liye 🌟
export async function GET() {
    try {
        await connectDB();
        const cmsData = await CMS.findOne();
        
        if (!cmsData) {
            return NextResponse.json({ success: true, data: {} });
        }
        
        const response = NextResponse.json({ success: true, data: cmsData });
        response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch CMS data" }, { status: 500 });
    }
}

// 🌟 POST METHOD: Admin panel se data save karne ke liye 🌟
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        // Pehle check karo agar koi document already hai
        const existingCms = await CMS.findOne();
        
        if (existingCms) {
            // Update existing
            await CMS.updateOne({}, { $set: { ...body, updatedAt: Date.now() } });
        } else {
            // Create new
            await CMS.create(body);
        }
        
        return NextResponse.json({ success: true, message: "CMS Updated Successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update CMS" }, { status: 500 });
    }
}
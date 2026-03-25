// app/api/cms/route.ts (Updated and Cleaned)

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import mongoose from 'mongoose';

// Ensure MONGODB_URI is correctly set in Vercel Environment Variables
if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// 🌟 THE VERCEL CACHE-BUSTER: forces fresh reads from database 🌟
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🌟 THE MASTER CMS SCHEMA 🌟
const cmsSchema = new mongoose.Schema({
    heroSlides: { type: Array, default: [] },
    aboutConfig: { type: Object, default: {} },
    galleryImages: { type: Array, default: [] },
    promotionalVideos: { type: Array, default: [] }, // the 5 video breaks storage
    uiConfig: { type: Object, default: {} },
    categories: { type: Array, default: [] },
    faqs: { type: Array, default: [] },
    visionaries: { type: Array, default: [] }, // Moving to Celebrity DB
    socialLinks: { type: Object, default: {} },
    corporateInfo: { type: Object, default: {} },
    legalPages: { type: Array, default: [] }
}, { timestamps: true });

// Bind Model
const CmsConfig = mongoose.models.CmsConfig || mongoose.model('CmsConfig', cmsSchema);

// 📡 GET: FETCH CMS DATA
export async function GET() {
    try {
        await connectDB();
        const config = await CmsConfig.findOne({});
        
        // 🌟 Auto-seed logic is GONE! No more defaults from here. 🌟
        
        if (!config) {
             return NextResponse.json({ success: false, error: "Configuration not found. Please run the seeder." }, { status: 404 });
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
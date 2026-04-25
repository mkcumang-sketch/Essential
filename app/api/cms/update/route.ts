import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CmsConfig from '@/models/CmsConfig';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    try {
        await connectDB();
        
        // Ensure CmsConfig is fully synced (Vercel Fix)
        const CmsModel = mongoose.models.CmsConfig || CmsConfig;

        const body = await req.json();
        const { heroConfig, aboutConfig } = body;

        if (!heroConfig && !aboutConfig) {
            return NextResponse.json({ success: false, error: "Missing config data." }, { status: 400 });
        }

        // Fetch or Create the single config document
        let config = await CmsModel.findOne({});
        if (!config) config = new CmsModel({});

        // Apply Hero Updates (if sent)
        if (heroConfig) {
            config.heroConfig = { ...config.heroConfig, ...heroConfig };
        }

        // Apply About Updates (if sent)
        if (aboutConfig) {
            config.aboutConfig = { ...config.aboutConfig, ...aboutConfig };
        }

        await config.save();
        
        return NextResponse.json({ success: true, data: config });
    } catch (error) {
        console.error("CMS API Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
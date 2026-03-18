import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const CMSSchema = new mongoose.Schema({
  heroSlides: { type: Array, default: [] },
  aboutConfig: { type: Object, default: {} },
  galleryImages: { type: Array, default: [] } // 🚨 ADDED FOR DYNAMIC GALLERY
}, { timestamps: true });

const CMS = mongoose.models.CMS || mongoose.model('CMS', CMSSchema);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let cmsData = await CMS.findOne({});
    if (!cmsData) cmsData = await CMS.create({});
    return NextResponse.json({ success: true, data: cmsData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    let cmsData = await CMS.findOne({});
    
    if (cmsData) {
      cmsData = await CMS.findByIdAndUpdate(cmsData._id, { $set: body }, { new: true });
    } else {
      cmsData = await CMS.create(body);
    }
    
    return NextResponse.json({ success: true, data: cmsData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
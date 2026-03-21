import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { CMS } from '@/models/CMS';

// 🚨 YEH LINE NEXT.JS CACHE KO KILL KAREGI, FRONTEND HAMESHA FRESH RAHEGA!
export const dynamic = 'force-dynamic'; 

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET() {
  try {
    await connectDB();
    let cmsData = await CMS.findOne({ type: 'global' });
    
    // Agar DB khali hai, toh ek naya record bana lo
    if (!cmsData) {
      cmsData = await CMS.create({ type: 'global' });
    }
    
    return NextResponse.json({ success: true, data: cmsData });
  } catch (error) {
    return NextResponse.json({ success: false, error: "System failed to fetch nodes." });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Godmode se aaya sara data Global record mein chipka do
    const updatedCMS = await CMS.findOneAndUpdate(
      { type: 'global' },
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: updatedCMS });
  } catch (error) {
    return NextResponse.json({ success: false, error: "System failed to deploy nodes." });
  }
}
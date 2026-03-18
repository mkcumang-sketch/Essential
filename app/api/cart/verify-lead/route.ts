import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead'; // 🚨 FIXED: Ensure models/Lead.ts exists

export async function POST(req: Request) {
  try {
    await connectDB();
    const { phone, cartItems } = await req.json();
    
    // Check if lead already exists or create new
    const lead = await Lead.findOneAndUpdate(
      { phone },
      { cartItems, lastInteraction: new Date(), status: 'ABANDONED' },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, leadId: lead._id });
  } catch (error) {
    return NextResponse.json({ error: "Lead Capture Failed" }, { status: 500 });
  }
}
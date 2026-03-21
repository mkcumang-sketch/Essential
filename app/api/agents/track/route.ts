import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Agent } from '@/models/Agent';

export const dynamic = 'force-dynamic';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code } = await req.json();
    
    if (!code) return NextResponse.json({ success: false });

    // Find agent by code and increment clicks by 1
    const agent = await Agent.findOneAndUpdate(
        { code: code.toUpperCase() },
        { $inc: { clicks: 1 } },
        { new: true }
    );

    return NextResponse.json({ success: true, data: agent });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
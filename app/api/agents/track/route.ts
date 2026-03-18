import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code } = await req.json();

    if (!code) return NextResponse.json({ error: "Code missing" }, { status: 400 });

    // Find agent by code and increment clicks by 1
    const agent = await Agent.findOneAndUpdate(
        { code: code.toUpperCase() }, 
        { $inc: { clicks: 1 } },
        { new: true }
    );

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track traffic" }, { status: 500 });
  }
}
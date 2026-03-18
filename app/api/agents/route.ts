import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Agent from '@/models/Agent';

// 🔴 POST: Godmode se naya Agent banega
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Auto-generate uppercase tracking code if not provided
    const code = body.code ? body.code.toUpperCase() : body.name.split(' ')[0].toUpperCase() + Math.floor(10 + Math.random() * 90);

    const newAgent = await Agent.create({ 
        name: body.name,
        email: body.email,
        code: code,
        tier: body.tier || 'Imperial Agent',
        commissionRate: Number(body.commissionRate || 5)
    });

    return NextResponse.json({ success: true, agent: newAgent });
  } catch (error: any) {
    console.error("Agent Recruitment Error:", error);
    // Handle unique email/code errors smoothly
    if(error.code === 11000) {
        return NextResponse.json({ error: "Agent with this Email or Code already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to recruit agent" }, { status: 500 });
  }
}

// 🟢 GET: Godmode ke Dashboard mein saare agents dikhane ke liye
export async function GET() {
  try {
    await connectDB();
    // Sort by highest revenue
    const agents = await Agent.find({}).sort({ revenue: -1 });
    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sales force" }, { status: 500 });
  }
}
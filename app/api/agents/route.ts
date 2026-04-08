import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { Agent } from '@/models/Agent';

export const dynamic = 'force-dynamic';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET() {
  try {
    await connectDB();
    const agents = await Agent.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch agents" });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Agar custom code nahi dala, toh auto-generate karo
    if (!body.code) {
        body.code = 'REF-' + body.name.substring(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
    } else {
        body.code = body.code.toUpperCase();
    }

    const newAgent = await Agent.create(body);
    return NextResponse.json({ success: true, data: newAgent });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create agent" });
  }
}
// Add this at the bottom of the file
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;
        if (!id) return NextResponse.json({ success: false, error: "ID missing" });

        const Agent = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }));
        await Agent.findByIdAndDelete(id);
        revalidatePath('/', 'layout');

        return NextResponse.json({ success: true, message: "Affiliate Deleted from Database" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }
}
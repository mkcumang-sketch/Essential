import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Setting'; // ✅ Model yahan sahi hai

export async function GET() {
  await connectDB();
  const config = await Settings.findOne({ id: 'global_config' });
  return NextResponse.json(config || {});
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const updated = await Settings.findOneAndUpdate(
      { id: 'global_config' },
      { $set: body },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (e) { return NextResponse.json({ success: false }, { status: 500 }); }
}
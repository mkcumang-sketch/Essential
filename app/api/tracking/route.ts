import { connectDB } from "@/lib/db";
import { TeamMember, AbandonedCart } from "@/models/Schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const { type, refCode, userData } = await req.json();

  // 1. Visit Tracking
  if (type === 'visit' && refCode) {
    await TeamMember.findOneAndUpdate({ referralCode: refCode }, { $inc: { 'stats.visits': 1 } });
  }

  // 2. Abandoned Cart Capture
  if (type === 'abandon' && userData) {
    await AbandonedCart.create({ ...userData, referralCode: refCode });
    if (refCode) {
      await TeamMember.findOneAndUpdate({ referralCode: refCode }, { $inc: { 'stats.abandonedCount': 1 } });
    }
  }

  return NextResponse.json({ success: true });
}
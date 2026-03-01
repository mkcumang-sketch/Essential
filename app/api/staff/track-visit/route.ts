import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Staff } from "@/models/Staff";

export async function POST(req: Request) {
  await connectDB();
  const { refCode } = await req.json();
  await Staff.findOneAndUpdate({ refCode }, { $inc: { visits: 1 } });
  return NextResponse.json({ success: true });
}
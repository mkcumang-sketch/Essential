import { connectDB } from "@/lib/db";
import { ActivityLog } from "@/models/Enterprise";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const logs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
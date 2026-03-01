export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Staff } from "@/models/Staff"; // Ensure you have this model, or replace with logic

export async function GET() {
  try {
    await connectDB();
    // Agar Staff model hai toh:
    const staff = await Staff.find({});
    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
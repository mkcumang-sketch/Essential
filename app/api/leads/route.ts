export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

// Lead Model (Inline for Jugad)
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  message: String,
  interestedIn: String, // Watch name if any
  status: { type: String, default: "New" }, // New, Contacted, Sold
}, { timestamps: true });

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

// POST: Nayi Inquiry Save Karna
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    await Lead.create(body);
    return NextResponse.json({ success: true, message: "Request Sent to Concierge" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// GET: Admin ke liye saari leads lana
export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
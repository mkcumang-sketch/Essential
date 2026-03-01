import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteContent } from "@/models/SiteContent";

export async function GET() {
  try {
    await connectDB();
    const content = await SiteContent.findOne();
    // Agar data nahi hai, toh khali object bhej do taaki "Loading" khatam ho
    return NextResponse.json({ success: true, content: content || { about: { heading: "" }, brands: [] } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "DB Error" }, { status: 500 });
  }
}
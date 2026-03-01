import { connectDB } from "@/lib/db";
import Setting from "@/models/Setting";
import { NextResponse } from "next/server";

// Default Fallback Data (Taki website kabhi blank na ho)
const DEFAULT_SETTINGS = {
  heroSlides: [
    { imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2000", heading: "Elegance in Midnight.", subtext: "The Pinnacle of Horology" }
  ],
  categories: [
    { name: "Rolex", imageUrl: "https://logo.clearbit.com/rolex.com", link: "/collection/rolex" },
    { name: "Omega", imageUrl: "https://logo.clearbit.com/omegawatches.com", link: "/collection/omega" }
  ]
};

export async function GET() {
  try {
    await connectDB();
    let settings = await Setting.findOne();
    
    // Agar DB mein data nahi hai, toh default dikhao
    if (!settings || !settings.heroSlides) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("⚠️ Database connection failed, sending fallback UI data...");
    // FIX: Agar DB fail ho, toh 500 Error mat feko, Default UI bhej do!
    // Isse loading spinner kabhi nahi atkega.
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    let settings = await Setting.findOne();
    if (settings) {
      settings.heroSlides = data.heroSlides;
      settings.categories = data.categories;
      await settings.save();
    } else {
      await Setting.create(data);
    }
    
    return NextResponse.json({ success: true, message: "Settings Updated!" });
  } catch (error: any) {
    console.error("POST Settings Error:", error.message);
    // Ye error Admin panel ko batayega ki DB connect nahi hua
    return NextResponse.json({ success: false, error: "Database Connection Refused. Check your Network/WiFi." }, { status: 500 });
  }
}
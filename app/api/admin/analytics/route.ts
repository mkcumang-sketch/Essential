import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    await connectDB();
    
    // Sirf recent 20 abandoned leads uthayenge
    const leads = await Lead.find({}).sort({ updatedAt: -1 }).limit(20);
    
    // Future me yahan real orders aur revenue calculate hoga
    return NextResponse.json({ 
      success: true, 
      leads: leads || [],
      revenue: 84200000,
      clicks: 142800,
      orders: 242
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Mainframe Data Failure" }, { status: 500 });
  }
}
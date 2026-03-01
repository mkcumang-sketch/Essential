export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    
    // Total Products aur Sales calculate kar rahe hain
    const totalProducts = await Product.countDocuments();
    const allProducts = await Product.find({}, { price: 1 });
    const totalValue = allProducts.reduce((acc: number, curr: any) => acc + (curr.price || 0), 0);

    return NextResponse.json({ 
      success: true, 
      stats: { totalProducts, totalValue, leaderboard: [] } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
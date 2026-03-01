export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
// import { Order } from "@/models/Order"; // Agar Order model banaya hai toh

export async function GET() {
  try {
    await connectDB();

    const productCount = await Product.countDocuments();
    // const orderCount = await Order.countDocuments(); 

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: productCount,
        totalOrders: 0, // Filhal 0 rakhte hain
        totalRevenue: 0,
        totalUsers: 0
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
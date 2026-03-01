import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const newProduct = await Product.create(data); // Naya watch add karo
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
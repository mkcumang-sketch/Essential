import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

// ✅ 'Promise' aur 'await params' add kiya gaya hai
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params; // Next.js 15 Fix 🚀
    const body = await req.json();
    
    const updatedProduct = await Product.findByIdAndUpdate(
      resolvedParams.id,
      { $set: body },
      { new: true }
    );
    
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Admin Update Error:", error);
    return NextResponse.json({ success: false, message: "Update Failed" }, { status: 500 });
  }
}
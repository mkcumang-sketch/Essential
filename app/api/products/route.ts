import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    if (!body.description) {
        return NextResponse.json({ error: "Product description is required." }, { status: 400 });
    }

    const baseSlug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    
    const newProduct = await Product.create({ 
        ...body, 
        title: body.name,          
        basePrice: body.price,     
        slug: uniqueSlug 
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// 🚨 NEW BULLETPROOF DELETE FUNCTION 🚨
export async function DELETE(req: Request) {
  try {
    await connectDB();
    // Getting ID directly from the secure JSON body, ignoring URL completely
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Asset ID missing" }, { status: 400 });
    }

    // Physical deletion from MongoDB
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Asset not found in Database" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Permanently erased from Database" });
  } catch (error: any) {
    console.error("DB Delete Error:", error.message);
    return NextResponse.json({ error: "Database failed to delete" }, { status: 500 });
  }
}
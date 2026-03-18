import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: Request, context: any) {
  try {
    await connectDB();
    
    // Safe extraction for Next 15
    const params = await context.params; 
    const identifier = params?.slug || params?.id; 
    
    if (!identifier) return NextResponse.json({ error: "Invalid Asset" }, { status: 400 });

    let product = null;

    // 1. Try finding by MongoDB ID first (Super Fast)
    if (mongoose.Types.ObjectId.isValid(identifier)) {
        product = await Product.findById(identifier);
    }
    
    // 2. If not found by ID, try finding by Slug
    if (!product) {
        product = await Product.findOne({ slug: identifier });
    }
    
    if (!product) {
        return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // ALWAYS return inside a "data" object for consistency
    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: any) {
  try {
    await connectDB();
    const params = await context.params;
    const identifier = params?.slug || params?.id;
    const body = await req.json();
    
    if (!identifier) return NextResponse.json({ error: "Invalid Asset ID" }, { status: 400 });

    let updatedProduct;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
        updatedProduct = await Product.findByIdAndUpdate(identifier, { $set: body }, { new: true });
    } else {
        updatedProduct = await Product.findOneAndUpdate({ slug: identifier }, { $set: body }, { new: true });
    }

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ error: "Update Error" }, { status: 500 });
  }
}
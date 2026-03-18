import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Review } from '@/models/Review';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const isAdmin = searchParams.get('admin') === 'true';

    const query: any = { product: productId };
    if (!isAdmin) query.visibility = 'public'; // Users only see public reviews

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Default user review is 'private'. Admin generated is 'public'.
    const newReview = await Review.create({
      ...body,
      visibility: body.isAdminGenerated ? 'public' : 'private'
    });

    return NextResponse.json({ success: true, data: newReview });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { reviewId, visibility } = await req.json();
    const updated = await Review.findByIdAndUpdate(reviewId, { visibility }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
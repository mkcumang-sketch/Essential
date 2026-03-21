import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { UserBehavior }from '@/models/UserBehavior';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { sessionId, action, productId, category } = await req.json();
    if (!sessionId) return NextResponse.json({ error: "Session missing" }, { status: 400 });

    let behavior = await UserBehavior.findOne({ sessionId });
    if (!behavior) behavior = new UserBehavior({ sessionId });

    // Scoring System Logic
    let scoreDelta = 0;
    if (action === 'VIEW') scoreDelta = 10;
    if (action === 'CART') scoreDelta = 20;
    if (action === 'PURCHASE') scoreDelta = 50;

    // Update Product Score
    if (productId) {
      const currentScore = behavior.productScores.get(productId) || 0;
      behavior.productScores.set(productId, currentScore + scoreDelta);
      
      // Update Recently Viewed
      if (action === 'VIEW') {
         behavior.recentlyViewed = behavior.recentlyViewed.filter((id: any) => id.toString() !== productId);
         behavior.recentlyViewed.unshift(productId);
         if (behavior.recentlyViewed.length > 10) behavior.recentlyViewed.pop(); // Keep last 10
      }
    }

    // Update Category Affinity
    if (category) {
      const catScore = behavior.categoryScores.get(category) || 0;
      behavior.categoryScores.set(category, catScore + 5);
    }

    await behavior.save();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
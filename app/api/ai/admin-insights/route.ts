import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const insights = [];

    // 1. Low Stock Alert
    const lowStock = await Product.find({ stock: { $gt: 0, $lt: 4 } }).limit(2);
    lowStock.forEach(p => insights.push(`⚠️ Low stock alert: Only ${p.stock} units left for ${p.title || p.name}`));

    // 2. Trending Product
    const trending = await Product.findOne().sort({ totalSold: -1 });
    if (trending && trending.totalSold > 0) {
      insights.push(`🔥 High Demand: ${trending.title || trending.name} is currently trending with ${trending.totalSold} total dispatches.`);
    }

    // 3. Top Region
    const topCountry = await Order.aggregate([{ $group: { _id: "$customer.country", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 1 }]);
    if (topCountry.length > 0) {
      insights.push(`🌍 Regional Surge: Maximum active traffic and conversions are originating from ${topCountry[0]._id || 'India'}.`);
    }

    return NextResponse.json({ success: true, insights });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
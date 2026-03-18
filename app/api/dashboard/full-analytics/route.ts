import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // 1. Overall Metrics
    const metrics = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } }
    ]);

    // 2. Country-wise Sales
    const countrySales = await Order.aggregate([
      { $group: { _id: "$customer.country", revenue: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } }
    ]);

    // 3. Traffic Sources
    const trafficSources = await Order.aggregate([
      { $group: { _id: "$trafficSource", count: { $sum: 1 } } }
    ]);

    // 4. Salesperson Leaderboard (Affiliates)
    const leaderboard = await Order.aggregate([
      { $match: { affiliateCode: { $ne: null } } },
      { $group: { _id: "$affiliateCode", revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    return NextResponse.json({ 
      success: true, 
      metrics: metrics[0] || { totalRevenue: 0, totalOrders: 0 },
      countrySales, 
      trafficSources, 
      leaderboard 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
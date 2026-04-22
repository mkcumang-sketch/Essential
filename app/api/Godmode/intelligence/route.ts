import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET() {
  try {
    await connectDB();
    
    // 1. REVENUE FORECASTING (Based on last 7 days linear velocity)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentSales = await Order.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      { $group: { _id: { $dayOfYear: "$createdAt" }, dailyRevenue: { $sum: "$totalAmount" } } }
    ]);
    
    const avgDaily = recentSales.length > 0 
      ? recentSales.reduce((acc, curr) => acc + curr.dailyRevenue, 0) / recentSales.length 
      : 0;
    const projectedNext30Days = avgDaily * 30;

    // 2. PRODUCT INTELLIGENCE (Calculate SEO & Auto-Tagging)
    const products = await Product.find({ seoScore: 0 }).limit(10); // Batch process 10 at a time
    for (let p of products) {
        let seo = 0;
        let autoTags = [p.brand, p.category];
        
        if (p.description && p.description.length > 200) seo += 40;
        if (p.images && p.images.length > 3) seo += 30;
        if (p.specifications && Object.keys(p.specifications).length > 2) seo += 30;
        
        if (p.price > 1000000) autoTags.push("Ultra-Luxury");
        if (p.stock < 3) autoTags.push("Limited Edition");

        await Product.findByIdAndUpdate(p._id, { seoScore: seo, tags: autoTags });
    }

    return NextResponse.json({ 
        success: true, 
        forecasting: { avgDaily, projectedNext30Days },
        intelligenceMsg: "Processed SEO & Tags for background catalog."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
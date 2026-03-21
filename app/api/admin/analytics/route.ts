import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Order } from '@/models/Order';
import { Agent } from '@/models/Agent';

export const dynamic = 'force-dynamic';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET() {
  try {
    await connectDB();

    // 1. Fetch Real Orders for Leads Table
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    
    // Format orders into 'leads' format for the CRM table
    const leads = orders.map(order => ({
        _id: order._id,
        phone: order.customer.name, // Displaying name as primary identity
        email: order.customer.email,
        referralCode: order.promoCode || order.customer.source,
        cartTotal: order.totalAmount,
        status: order.status
    }));

    // 2. Aggregate Data for Godmode Dashboard
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;

    // Traffic Sources Aggregation
    const sourceData = await Order.aggregate([
        { $group: { _id: "$customer.source", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    // Regional Heatmap Aggregation
    const countryData = await Order.aggregate([
        { $group: { _id: "$customer.city", revenue: { $sum: "$totalAmount" } } },
        { $sort: { revenue: -1 } }
    ]);

    return NextResponse.json({ 
        success: true, 
        leads: leads,
        analytics: {
            metrics: { totalRevenue, totalOrders },
            trafficSources: sourceData.length > 0 ? sourceData : [{ _id: 'Direct', count: 0 }],
            countrySales: countryData.length > 0 ? countryData : [{ _id: 'Pending Data', revenue: 0 }]
        }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "System failed to aggregate analytics." });
  }
}
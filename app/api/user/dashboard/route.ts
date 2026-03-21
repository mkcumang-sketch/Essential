import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Order } from '@/models/Order';
import { Agent } from '@/models/Agent';

export const dynamic = 'force-dynamic';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) return NextResponse.json({ success: false, error: 'Authentication required' });

    // 1. User ki saari Order History nikal lo
    const orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 });
    
    // 2. User ka Referral/Wallet Account check karo, nahi hai toh naya bana do
    let userProfile = await Agent.findOne({ email: email });
    
    if (!userProfile) {
        userProfile = await Agent.create({
            name: email.split('@')[0], // Extract name from email
            email: email,
            code: 'VIP-' + Math.floor(10000 + Math.random() * 90000), // Auto-generate code
            tier: 'Client Protocol',
            commissionRate: 5, // 5% cashback/wallet logic
            revenue: 0, // Wallet Balance
            clicks: 0,
            sales: 0
        });
    }

    return NextResponse.json({ 
        success: true, 
        data: {
            orders: orders,
            walletBalance: userProfile.revenue || 0,
            referralCode: userProfile.code,
            referralStats: { clicks: userProfile.clicks, sales: userProfile.sales }
        }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "System failed to fetch client node." });
  }
}
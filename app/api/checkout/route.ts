import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Order } from '@/models/Order';
import { Agent } from '@/models/Agent';

export const dynamic = 'force-dynamic';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { items, customer, promoCode, useWallet, userEmail, affiliateRef, totalAmount } = body;

    // 1. Create the Order in Database
   // 1. Create the Order in Database
    const newOrder = await Order.create({
        orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            zipCode: customer.zipCode, // 🌟 YEH LINE ADD KARNI HAI
            country: customer.country,
            source: customer.source || 'Direct'
        },
        items: items,
        totalAmount: totalAmount,
        status: 'PENDING',
        promoCode: promoCode || null
    });

    // 2. Handle Affiliate/Referral Commission
    if (affiliateRef) {
        const agent = await Agent.findOne({ code: affiliateRef.toUpperCase() });
        if (agent) {
            // Give 5% commission to the referring agent
            const commission = (totalAmount * (agent.commissionRate || 5)) / 100;
            agent.sales += 1;
            agent.revenue += commission;
            await agent.save();
        }
    }

    // 3. Handle Wallet Deduction (If user used wallet balance)
    if (useWallet && userEmail) {
        const userProfile = await Agent.findOne({ email: userEmail });
        if (userProfile && userProfile.revenue > 0) {
            // Deduct the wallet balance (Simplification: resets to 0 if used fully)
            userProfile.revenue = 0; 
            await userProfile.save();
        }
    }

    return NextResponse.json({ success: true, orderId: newOrder.orderId });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ success: false, error: 'Checkout protocol failed' });
  }
}
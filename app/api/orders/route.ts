import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import mongoose from 'mongoose';
import User from '@/models/User'; // Import User model

// ... GET function same as before ...

export async function PATCH(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, status } = body;
        
        // Vercel strict schema binding
        const orderSchema = new mongoose.Schema({}, { strict: false });
        const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
        
        const order = await Order.findById(id);
        if (!order) return NextResponse.json({ error: 'Order Not found' }, { status: 404 });

        // Update status
        order.status = status;
        await order.save();

        // 🌟 EMPIRE REWARDS: 10% POINTS ON SUCCESSFUL DELIVERY 🌟
        if (status === 'DELIVERED') {
            const customerEmail = order.customer?.email;
            const customerPhone = order.customer?.phone;
            
            // Find the customer who placed the order
            const customer = await User.findOne({ $or: [{ email: customerEmail }, { phone: customerPhone }] });
            
            // If customer used someone's referral code
            if (customer && customer.referredBy) {
                // Find the referrer (The top of the pyramid)
                const referrer = await User.findOne({ myReferralCode: customer.referredBy });
                if (referrer) {
                    // Calculate 10% of order value
                    const rewardPoints = Math.floor((order.totalAmount || 0) * 0.10);
                    
                    // Add points to referrer's wallet
                    referrer.walletPoints = (referrer.walletPoints || 0) + rewardPoints;
                    referrer.totalEarned = (referrer.totalEarned || 0) + rewardPoints;
                    await referrer.save();
                    
                    console.log(`[EMPIRE REWARDS] Granted ${rewardPoints} PTS to ${referrer.email}`);
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch(e) {
        console.error("Order Status Error:", e);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
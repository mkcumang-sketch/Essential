import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/User'; // User model chahiye wallet update ke liye

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 1. Order Create Karo
        const uniqueId = `ORD-${Date.now().toString().slice(-6).toUpperCase()}`;
        const newOrder = await Order.create({
            ...body,
            orderId: uniqueId,
            orderNumber: uniqueId,
            status: 'PROCESSING',
            createdAt: new Date()
        });

        // 🚨 2. REFERRAL WALLET LOGIC (THE FIX) 🚨
        if (body.appliedReferralCode && body.appliedReferralCode.startsWith('REF-')) {
            // Hum dhoondhenge ki ye code kis user ka hai
            // Tip: Hum name match karke ya ek specific field se search kar sakte hain
            const referrerName = body.appliedReferralCode.split('-')[1].split('10')[0]; 
            
            // Database mein referrer ko dhoondo
            const referrer = await User.findOne({ 
                name: { $regex: new RegExp(referrerName, "i") } 
            });

            if (referrer) {
                // Referrer ke wallet mein ₹100 add karo
                await User.findByIdAndUpdate(referrer._id, {
                    $inc: { walletPoints: 100 }
                });
                console.log(`✅ ₹100 credited to ${referrer.name}'s wallet`);
            }
        }

        return NextResponse.json({ success: true, orderId: newOrder.orderId });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
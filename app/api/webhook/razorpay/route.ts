import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { Product } from '@/models/Product';
import User from '@/models/User';
import { sendOrderConfirmationEmail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');

        // 1. VERIFY WEBHOOK SIGNATURE
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
            console.error("RAZORPAY_WEBHOOK_SECRET is not defined");
            return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
        }

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error("Invalid Razorpay Webhook Signature");
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const event = JSON.parse(body);
        const { payload } = event;

        // 2. HANDLE SUCCESSFUL PAYMENT
        if (event.event === 'payment.captured') {
            await connectDB();
            const rzpOrderId = payload.payment.entity.order_id;
            const rzpPaymentId = payload.payment.entity.id;

            const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
            
            // Find the pending order
            const order = await Order.findOne({ razorpayOrderId: rzpOrderId });
            if (!order || order.status === 'PAID') {
                return NextResponse.json({ received: true });
            }

            // A) UPDATE ORDER STATUS
            order.status = 'PAID';
            order.razorpayPaymentId = rzpPaymentId;
            await order.save();

            // B) DEDUCT STOCK (Atomic)
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, { 
                    $inc: { stock: -item.qty, totalSold: item.qty } 
                });
            }

            // C) TRIGGER REFERRAL REWARDS
            if (order.appliedReferralCode && order.appliedReferralCode.startsWith('REF-')) {
                const referrer = await User.findOne({ 
                    myReferralCode: order.appliedReferralCode.toUpperCase() 
                });

                if (referrer && String(referrer._id) !== String(order.userId)) {
                    await User.findByIdAndUpdate(referrer._id, {
                        $inc: { walletPoints: 100, totalReferrals: 1, totalEarned: 100 },
                        $push: {
                            notifications: {
                                title: "💰 Referral Reward!",
                                desc: `You earned ₹100 from a successful order by a referral.`,
                                unread: true,
                                time: new Date()
                            }
                        }
                    });
                }
            }

            // D) TRIGGER ORDER CONFIRMATION EMAIL
            try {
                await sendOrderConfirmationEmail(order.shippingData.email, {
                    orderId: order.orderId,
                    customerName: order.shippingData.name,
                    totalAmount: order.totalAmount,
                    items: order.items
                });
            } catch (mailErr) {
                console.error("Confirmation email failed:", mailErr);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
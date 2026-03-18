import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import Order from '@/models/Order';
import connectDB from '@/lib/mongodb';

// Initialize Razorpay SDK (Keys will be in .env)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const { orderId } = await req.json();

    // Fetch the pending order we just created
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder || dbOrder.paymentStatus !== 'PENDING') {
      return NextResponse.json({ error: "Invalid Order" }, { status: 400 });
    }

    // Create Razorpay Order
    const options = {
      amount: Math.round(dbOrder.totalAmount * 100), // Amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${dbOrder._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save transaction ID to our DB for tracking
    dbOrder.transactionId = razorpayOrder.id;
    await dbOrder.save();

    return NextResponse.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      dbOrderId: dbOrder._id
    });

  } catch (error) {
    console.error("Payment Gateway Error:", error);
    return NextResponse.json({ error: "Gateway Initialization Failed" }, { status: 500 });
  }
}
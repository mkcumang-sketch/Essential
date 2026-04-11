import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, email } = body;

    if (!orderId?.trim() || !email?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Order ID and email are required.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Security: both _id AND email must match — prevents enumeration attacks
    const order = await Order.findOne({
      _id: orderId.trim(),
      'customer.email': email.trim().toLowerCase(),
    })
      .select('orderId status trackingId totalAmount items createdAt customer')
      .lean() as any;

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'No order found. Please check your Order ID and email.' },
        { status: 404 }
      );
    }

    // Zero-Touch Auto Tracking System: Auto-process status
    let displayStatus = order.status;
    let statusMessage = "";
    
    if (order.status === "PENDING" || order.status === "CREATED") {
      displayStatus = "PROCESSING";
      statusMessage = "Your order has been received and is currently being packed in our warehouse.";
    } else if (order.status === "PROCESSING") {
      statusMessage = "Your order is being packed and will be shipped soon.";
    } else if (order.status === "SHIPPED") {
      statusMessage = "Your order has been shipped and is on its way to you.";
    } else if (order.status === "DELIVERED") {
      statusMessage = "Your order has been successfully delivered.";
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        status: displayStatus,
        displayStatus: displayStatus,
        statusMessage: statusMessage,
        trackingId: order.trackingId || null,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        itemCount: Array.isArray(order.items) ? order.items.length : 0,
        firstItemName: order.items?.[0]?.name || order.items?.[0]?.title || 'Your Order',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

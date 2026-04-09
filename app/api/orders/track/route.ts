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

    // Security: both orderId AND email must match — prevents enumeration attacks
    const order = await Order.findOne({
      orderId: orderId.trim(),
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

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        status: order.status,
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

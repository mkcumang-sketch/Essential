import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const trackingId = body.orderId?.trim();
    const email = body.email?.trim().toLowerCase();

    if (!trackingId || !email) {
      return NextResponse.json(
        { success: false, message: 'Order ID and email are required.' },
        { status: 400 }
      );
    }

    await connectDB();

    const OrderModel = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(trackingId); 
    
    let query: any = { orderId: trackingId };
    if (isMongoId) {
        query = { $or: [{ orderId: trackingId }, { _id: trackingId }] };
    }

    const order = await OrderModel.findOne(query).lean() as any;

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'No order found. Please check your Order ID.' },
        { status: 404 }
      );
    }

    const orderEmail = (order.customer?.email || order.shippingData?.email || order.shippingAddress?.email || "").toLowerCase();
    
    if (orderEmail !== email) {
        return NextResponse.json(
            { success: false, message: "Billing email does not match this order." }, 
            { status: 403 }
        );
    }

    let displayStatus = order.status || "PENDING";
    let statusMessage = "Tracking details fetched successfully.";

    if (displayStatus === "PENDING" || displayStatus === "CREATED") {
      displayStatus = "PROCESSING";
      statusMessage = "Your order has been received and is currently being packed in our warehouse.";
    } else if (displayStatus === "PROCESSING") {
      statusMessage = "Your order is being packed and will be handed over to our logistics partner soon.";
    } else if (displayStatus === "SHIPPED") {
      statusMessage = "Your order is on the way via our premium logistics partner.";
    } else if (displayStatus === "DELIVERED") {
      statusMessage = "Your timepiece has been successfully delivered. Thank you for choosing Essential Rush.";
    }

    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        orderId: order.orderId || order._id.toString().slice(-8).toUpperCase(),
        status: displayStatus,
        displayStatus: displayStatus, 
        statusMessage: statusMessage,
        trackingId: order.trackingId || null,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        itemCount: Array.isArray(order.items) ? order.items.length : 0,
        firstItemName: order.items?.[0]?.name || order.items?.[0]?.title || 'Luxury Asset',
      },
    });
  } catch (error: any) {
    console.error("Tracking API Error:", error.message);
    return NextResponse.json(
      { success: false, message: 'Server Error while tracking order.' },
      { status: 500 }
    );
  }
}
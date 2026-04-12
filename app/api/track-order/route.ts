import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Sanitize Inputs
    const trackingInput = body.orderId?.trim(); // Frontend se jo bhi input aaya ho (Tracking ID ya Order ID)
    const email = body.email?.trim().toLowerCase();

    if (!trackingInput || !email) {
      return NextResponse.json(
        { success: false, message: 'Tracking ID/Order ID and Billing Email are required.' },
        { status: 400 }
      );
    }

    await connectDB();
    const OrderModel = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

    // 2. The Universal Search Logic (THE FIX 🚀)
    // Ab API check karegi ki user ne jo daala hai wo Tracking ID hai, ya Order ID hai.
    let query: any = {
        $or: [
            { trackingId: trackingInput }, // Matches "TRK-ER-12345678"
            { orderId: trackingInput }     // Matches "ORD-12345-6789"
        ]
    };

    // Agar by chance user ne Mongoose ka lambi wali _id daal di, toh usko bhi support karega
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(trackingInput); 
    if (isMongoId) {
        query.$or.push({ _id: trackingInput });
    }

    // 3. Find the Order
    const order = await OrderModel.findOne(query).lean() as any;

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'No active shipment found with this ID. Please verify your Tracking ID.' },
        { status: 404 }
      );
    }

    // 4. Security Check: Email must match (Prevents data scraping)
    const orderEmail = (order.customer?.email || order.shippingData?.email || order.shippingAddress?.email || "").toLowerCase();
    
    if (orderEmail !== email) {
        return NextResponse.json(
            { success: false, message: "Security Alert: Billing email does not match this shipment." }, 
            { status: 403 }
        );
    }

    // 5. Dynamic Status Messaging (Premium UX)
    let displayStatus = order.status || "PENDING";
    let statusMessage = "Tracking details synchronized successfully.";

    if (displayStatus === "PENDING" || displayStatus === "CREATED" || displayStatus === "PENDING_PAYMENT") {
      displayStatus = "PROCESSING";
      statusMessage = "Your acquisition has been confirmed and is undergoing security clearance.";
    } else if (displayStatus === "PROCESSING") {
      statusMessage = "Your asset is being meticulously packaged in our secure vault.";
    } else if (displayStatus === "SHIPPED" || displayStatus === "DISPATCHED") {
      displayStatus = "DISPATCHED";
      statusMessage = "Your timepiece is in transit via our armored logistics partner.";
    } else if (displayStatus === "DELIVERED") {
      statusMessage = "Asset successfully delivered. Welcome to the Essential Rush family.";
    }

    // 6. Return Clean Data
    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        orderId: order.orderId,
        trackingId: order.trackingId || "Awaiting Carrier ID", // Tracking ID front-end pe dikhane ke liye
        status: displayStatus,
        displayStatus: displayStatus, 
        statusMessage: statusMessage,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        itemCount: Array.isArray(order.items) ? order.items.length : 0,
        firstItemName: order.items?.[0]?.name || order.items?.[0]?.title || 'Luxury Asset',
      },
    });

  } catch (error: any) {
    console.error("Logistics Tracking API Error:", error.message);
    return NextResponse.json(
      { success: false, message: 'Secure Server Error while locating shipment.' },
      { status: 500 }
    );
  }
}
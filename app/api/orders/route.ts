import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

/**
 * ORDER & REQUISITION CONTROLLER v4.0
 * Handles Secure Transactions, Stock Management, and Fulfillment Lifecycle
 */

// 1. GET: Fetch All Requisitions (Dashboard Intelligence)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = {};
    if (status && status !== "ALL") {
      query = { status };
    }

    // High-performance lean query
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. PATCH: Status Synchronization (Fulfillment Lifecycle)
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, status, location, eta } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Node ID required." }, { status: 400 });
    }

    const updatedData: any = {};
    if (status) updatedData.status = status;
    if (location) updatedData.location = location;
    if (eta) updatedData.eta = eta;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );

    // Audit Log
    try {
        if(mongoose.models.ActivityLog) {
            await mongoose.models.ActivityLog.create({
              action: "ORDER_STATUS_UPDATE",
              details: `Order ${updatedOrder.orderId} transitioned.`,
              target: updatedOrder._id
            });
        }
    } catch(e){}

    return NextResponse.json({ success: true, data: updatedOrder });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 4. DELETE: Secure Order Cancellation
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Identification missing." }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (order) {
      // Revert Stock if cancelled
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
      }
      
      await Order.findByIdAndDelete(id);

      try {
        if(mongoose.models.ActivityLog) {
            await mongoose.models.ActivityLog.create({
              action: "ORDER_PURGE",
              details: `Requisition ${order.orderId} removed. Stock reverted.`,
              target: id
            });
        }
      } catch(e){}
    }

    return NextResponse.json({ success: true, message: "Registry settled." });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
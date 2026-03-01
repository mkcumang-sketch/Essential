import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { orderId, status, warehouse } = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status, warehouse: warehouse },
      { new: true }
    );

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
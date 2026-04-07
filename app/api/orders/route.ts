export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import { revalidatePath } from 'next/cache';

// 🌟 GET ORDERS — users: strictly by session user id; admins: all
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to see your orders." },
        { status: 401 }
      );
    }

    const Order =
      mongoose.models.Order ||
      mongoose.model("Order", new mongoose.Schema({}, { strict: false }));

    const sessionUser = session.user as { id?: string; role?: string };
    let orders: unknown[] = [];

    if (sessionUser.role === "SUPER_ADMIN") {
      orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    } else {
      const userId = sessionUser.id;
      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Please sign in." },
          { status: 401 }
        );
      }
      orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, data: orders, orders });
  } catch (error) {
    console.error("Orders Fetch Error:", error);
    return NextResponse.json({ success: false, error: "We could not load orders." });
  }
}

// 🌟 MUTATIONS — SUPER_ADMIN only (no client-supplied user impersonation)
export async function PUT(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if ((session?.user as { role?: string })?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "You do not have access to do that." }, { status: 403 });
    }

    const body = await req.json();
    const orderId = body._id || body.id;
    const newStatus = body.status;

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { success: false, error: "Order ID or status missing." },
        { status: 400 }
      );
    }

    const Order =
      mongoose.models.Order ||
      mongoose.model("Order", new mongoose.Schema({}, { strict: false }));
    await Order.findByIdAndUpdate(orderId, { status: newStatus });

    return NextResponse.json({ success: true, message: "Order status updated." });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "We could not update the order status." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return PUT(req);
}

export async function PATCH(req: Request) {
  return PUT(req);
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if ((session?.user as { role?: string })?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "You do not have access to do that." }, { status: 403 });
    }

    const url = new URL(req.url);
    let orderId = url.searchParams.get("id");

    if (!orderId) {
      const body = await req.json().catch(() => ({}));
      orderId = body._id || body.id;
    }

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID missing." }, { status: 400 });
    }

    const Order =
      mongoose.models.Order ||
      mongoose.model("Order", new mongoose.Schema({}, { strict: false }));
    await Order.findByIdAndDelete(orderId);

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: "Order deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: "We could not delete the order." }, { status: 500 });
  }
}

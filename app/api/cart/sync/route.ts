export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AbandonedCart } from "@/models/AbandonedCart";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const OrderSchema = new mongoose.Schema(
  {
    orderId: String,
    userId: String,
    customer: { name: String, email: String, phone: String },
    items: Array,
    totalAmount: Number,
    status: { type: String, default: "PENDING" },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, totalAmount, user } = body;

    const sessionUserId = session?.user?.id;

    if (sessionUserId) {
      const dbUser = await User.findById(sessionUserId)
        .select("name email phone")
        .lean()
        .catch(() => null);
      const customer = {
        name:
          (dbUser as { name?: string } | null)?.name ||
          user?.name ||
          "Vault Client",
        email:
          (dbUser as { email?: string } | null)?.email ||
          session.user?.email ||
          "",
        phone: (dbUser as { phone?: string } | null)?.phone || user?.phone || "",
      };

      const existingCart = await Order.findOne({
        userId: sessionUserId,
        status: "PENDING",
      });

      if (existingCart) {
        existingCart.items = items;
        existingCart.totalAmount = totalAmount;
        existingCart.customer = customer;
        existingCart.createdAt = new Date();
        await existingCart.save();
      } else {
        await Order.create({
          orderId: `CART-${Date.now().toString().slice(-6)}`,
          userId: sessionUserId,
          customer,
          items,
          totalAmount,
          status: "PENDING",
        });
      }

      await AbandonedCart.findOneAndUpdate(
        { userId: sessionUserId },
        {
          userId: sessionUserId,
          name: customer.name,
          email: String(customer.email || "").toLowerCase().trim(),
          phone: String(customer.phone || "").trim(),
          items: Array.isArray(items) ? items : [],
          cartTotal: Number(totalAmount) || 0,
          status: "ABANDONED",
          lastInteraction: new Date(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return NextResponse.json({ success: true });
    }

    // Guest: marketing lead only — no session user id; match by contact from body
    if (!user || (!user.email && !user.phone)) {
      return NextResponse.json(
        { success: false, error: "Sign in to sync your cart." },
        { status: 400 }
      );
    }

    const orConditions: Record<string, string>[] = [];
    if (user.email)
      orConditions.push({ "customer.email": String(user.email).toLowerCase().trim() });
    if (user.phone) orConditions.push({ "customer.phone": String(user.phone).trim() });

    const guestQuery =
      orConditions.length === 1
        ? { ...orConditions[0], status: "PENDING" as const }
        : { $or: orConditions, status: "PENDING" as const };

    const guestCart = await Order.findOne(guestQuery);

    if (guestCart) {
      guestCart.items = items;
      guestCart.totalAmount = totalAmount;
      guestCart.customer = user;
      guestCart.createdAt = new Date();
      await guestCart.save();
    } else {
      await Order.create({
        orderId: `CART-${Date.now().toString().slice(-6)}`,
        customer: user,
        items,
        totalAmount,
        status: "PENDING",
      });
    }

    const leadFilters: Record<string, string>[] = [];
    if (user.email)
      leadFilters.push({ email: String(user.email).toLowerCase().trim() });
    if (user.phone) leadFilters.push({ phone: String(user.phone).trim() });

    if (leadFilters.length > 0) {
      await AbandonedCart.findOneAndUpdate(
        { $or: leadFilters },
        {
          name: user.name || "Vault Client",
          email: user.email ? String(user.email).toLowerCase().trim() : "",
          phone: user.phone ? String(user.phone).trim() : "",
          items: Array.isArray(items) ? items : [],
          cartTotal: Number(totalAmount) || 0,
          status: "ABANDONED",
          lastInteraction: new Date(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart Sync Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

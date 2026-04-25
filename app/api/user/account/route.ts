export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/usertemp";

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", new mongoose.Schema({}, { strict: false }));
const Review =
  mongoose.models.Review ||
  mongoose.model("Review", new mongoose.Schema({}, { strict: false }));
const Ticket =
  mongoose.models.Ticket ||
  mongoose.model("Ticket", new mongoose.Schema({}, { strict: false }));

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    // 🚀 FIRST DECLARATION (Correct)
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to view your account." },
        { status: 401 }
      );
    }

    const profileRaw = await User.findById(userId)
      .select("-password -__v")
      .lean();
    if (!profileRaw || Array.isArray(profileRaw)) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    const profile = profileRaw as Record<string, unknown>;

    // 🚀 DATA LEAK FIX: Sirf current user ke orders lao
    // (Duplicate 'const userId = ...' removed from here)
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 }).lean();

    const successfulStatuses = ["PROCESSING", "DISPATCHED", "DELIVERED"];
    const successfulOrders = (orders as { status?: string; totalAmount?: number }[]).filter(
      (o) => o.status && successfulStatuses.includes(String(o.status))
    );
    const totalSpent = successfulOrders.reduce(
      (sum, o) => sum + (Number(o.totalAmount) || 0),
      0
    );

    const tier = totalSpent >= 100000 ? "Gold Vault" : "Silver Vault";

    await User.findByIdAndUpdate(userId, {
      $set: { totalSpent, loyaltyTier: tier },
    });

    const reviews = await Review.find({ userId }).sort({ createdAt: -1 }).lean();
    const tickets = await Ticket.find({ userId }).sort({ createdAt: -1 }).lean();

    const dashboardData = {
      profile: {
        name: (profile.name as string) || session.user?.name,
        email: session.user?.email || profile.email || "",
        phone: (profile.phone as string) || "",
        tier,
        totalSpent,
        memberSince: profile.createdAt || new Date(),
        language: (profile.language as string) || "English",
        currency: (profile.currency as string) || "INR",
      },
      assets: {
        walletBalance: Number(profile.walletPoints) || 0,
        rewardPoints: Number(profile.walletPoints) || 0,
        referralCode:
          (profile.myReferralCode as string) ||
          `VIP-${String(userId).slice(-6).toUpperCase()}`,
        referralEarnings: Number(profile.totalEarned) || 0,
        activeCoupons: (profile.coupons as unknown[]) || [],
      },
      collections: {
        wishlist: (profile.wishlist as unknown[]) || [],
        recentlyViewed: (profile.recentlyViewed as unknown[]) || [],
        recommendations: [],
      },
      orders: orders.map((o: Record<string, unknown>) => ({
        id: o.orderId,
        date: o.createdAt,
        total: o.totalAmount,
        status: o.status,
        items: o.items || [],
      })),
      activity: {
        reviews,
        tickets,
        notifications: (profile.notifications as unknown[]) || [],
      },
      security: {
        loginHistory: (profile.loginHistory as unknown[]) || [
          { device: "Current Device", date: new Date(), ip: "Secured" },
        ],
      },
    };

    return NextResponse.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error("Vault Aggregation Error:", error);
    return NextResponse.json(
      { success: false, error: "We could not load your account. Try again." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({
        success: true,
        data: {
          orders: [],
          totalSpent: 0,
          tier: "Silver",
          walletPoints: 0,
          totalEarned: 0,
          myReferralCode: "",
          loyaltyTier: "Silver Vault",
        },
      });
    }

    const userDoc = await User.findById(userId)
      .select("walletPoints totalEarned myReferralCode loyaltyTier")
      .lean()
      .catch(() => null);
    const u = userDoc && !Array.isArray(userDoc) ? (userDoc as Record<string, unknown>) : null;

    const Order =
      mongoose.models.Order ||
      mongoose.model("Order", new mongoose.Schema({}, { strict: false }));

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    const orderRows = orders as { totalAmount?: unknown }[];

    const totalSpent = orderRows.reduce(
      (acc, o) => acc + (Number(o.totalAmount) || 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        orders,
        totalSpent,
        tier: totalSpent >= 100000 ? "Gold" : "Silver",
        walletPoints: Number(u?.walletPoints) || 0,
        totalEarned: Number(u?.totalEarned) || 0,
        myReferralCode: (u?.myReferralCode as string) || "",
        loyaltyTier: (u?.loyaltyTier as string) || "Silver Vault",
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
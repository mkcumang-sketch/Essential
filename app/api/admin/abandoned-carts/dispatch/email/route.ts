import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import { sendVipRecoveryEmail } from "@/utils/sendVipRecoveryEmail";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const AbandonedCartSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Vault Client" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    cartTotal: { type: Number, default: 0 },
    status: { type: String, default: "ABANDONED" },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

const AbandonedCart =
  mongoose.models.AbandonedCart ||
  mongoose.model("AbandonedCart", AbandonedCartSchema);

async function isSuperAdminRequest(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return token && (token as any).role === "SUPER_ADMIN";
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isSuperAdminRequest(req))) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { leadId } = await req.json();
    if (!leadId) {
      return NextResponse.json({ success: false, error: "Missing leadId" }, { status: 400 });
    }

    await connectDB();

    const leadRaw = await AbandonedCart.findById(leadId).lean();
    if (!leadRaw || Array.isArray(leadRaw)) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }
    const lead = leadRaw as { email?: string; name?: string };
    if (!lead.email) {
      return NextResponse.json({ success: false, error: "Lead has no email" }, { status: 400 });
    }

    const appUrl = process.env.NEXTAUTH_URL || "https://essential-ivory.vercel.app";
    const recoveryLink = `${appUrl}/cart`;

    await sendVipRecoveryEmail({
      to: lead.email,
      customerName: lead.name,
      link: recoveryLink,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "VIP email dispatch failed" },
      { status: 500 }
    );
  }
}


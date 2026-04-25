import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";

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
      return NextResponse.json({ success: false, error: "You do not have access to do that." }, { status: 403 });
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
    const lead = leadRaw as { phone?: string; name?: string };
    if (!lead.phone) {
      return NextResponse.json({ success: false, error: "Lead has no phone" }, { status: 400 });
    }

    const appUrl = process.env.NEXTAUTH_URL || "https://essential-ivory.vercel.app";
    const recoveryLink = `${appUrl}/cart`;

    const digits = String(lead.phone).replace(/[^0-9]/g, "");
    const mobiles = digits.length === 10 ? `91${digits}` : digits;

    const message = `Dear ${lead.name || "Client"}, your curated selection has been safely secured in our private vault. Tap here to complete your exclusive acquisition: ${recoveryLink}`;

    const whatsappUrl = `https://wa.me/${mobiles}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({ success: true, url: whatsappUrl });
  } catch (error) {
    console.error("WhatsApp dispatch error:", error);
    return NextResponse.json({ success: false, error: "WhatsApp dispatch failed." }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { phone, cart } = body;

    const cartTotal = Array.isArray(cart)
      ? cart.reduce((acc: number, item: { offerPrice?: number; price?: number; qty?: number }) => {
          const price = item.offerPrice || item.price || 0;
          return acc + price * (item.qty || 1);
        }, 0)
      : 0;

    if (session?.user?.id) {
      const uid = session.user.id;
      const dbUser = await User.findById(uid).select("phone").lean() as { phone?: string } | null;
      const resolvedPhone =
        (typeof phone === "string" && phone.trim()) ||
        (dbUser?.phone && String(dbUser.phone).trim()) ||
        `VAULT-${uid}`;

      const lead = await Lead.findOneAndUpdate(
        { userId: uid },
        {
          userId: uid,
          phone: resolvedPhone,
          cartItems: Array.isArray(cart) ? cart : [],
          cartTotal,
          status: "ABANDONED",
          lastActive: new Date(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return NextResponse.json({
        success: true,
        leadId: lead._id,
        message: "Thanks! We saved your details.",
      });
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const lead = await Lead.findOneAndUpdate(
      { phone: phone.trim() },
      {
        $set: {
          phone: phone.trim(),
          cartItems: Array.isArray(cart) ? cart : [],
          cartTotal,
          status: "ABANDONED",
          lastActive: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      leadId: lead._id,
      message: "Thanks! We saved your details.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Lead Capture Error:", message);
    return NextResponse.json({ error: "We could not save your details. Try again." }, { status: 500 });
  }
}

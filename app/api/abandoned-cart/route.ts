import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userDetails, cartItems, totalAmount, referredBy } = body;

    // Database mein live cart update ya create karein
    const cart = await prisma.siteContent.upsert({
      where: { key: `cart_${userDetails.phone}` },
      update: { value: { userDetails, cartItems, totalAmount, referredBy, updatedAt: new Date() } },
      create: { 
        key: `cart_${userDetails.phone}`, 
        value: { userDetails, cartItems, totalAmount, referredBy, updatedAt: new Date() } 
      }
    });

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Spy failed" }, { status: 500 });
  }
}
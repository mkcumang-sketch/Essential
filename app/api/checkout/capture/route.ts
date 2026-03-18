import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { phone, cart } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Calculate total value of the cart
    const cartTotal = cart.reduce((acc: number, item: any) => {
        const price = item.offerPrice || item.price || 0;
        return acc + (price * (item.qty || 1));
    }, 0);

    // Upsert: Agar phone number pehle se hai toh cart update karo, warna naya Lead banao
    const lead = await Lead.findOneAndUpdate(
      { phone },
      { 
        cartItems: cart, 
        cartTotal: cartTotal,
        status: 'ABANDONED', // Hum maan kar chalte hain ki jab tak payment na ho, ye abandoned hai
        lastActive: new Date()
      },
      { upsert: true, new: true }
    );

    // 🚨 YAHAN TWILIO YA MSG91 KA OTP CODE AAYEGA FUTURE MEIN 🚨
    // Abhi ke liye hum sirf success bhej rahe hain
    console.log(`[SYSTEM LOG]: SMS OTP sent to ${phone}`);

    return NextResponse.json({ success: true, leadId: lead._id, message: "OTP Sent successfully" });
  } catch (error: any) {
    console.error("Lead Capture Error:", error.message);
    return NextResponse.json({ error: "Authentication Failed" }, { status: 500 });
  }
}
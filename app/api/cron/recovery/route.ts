import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { sendRecoverySMS } from '@/lib/sms';

export async function GET(req: Request) {
  // Security Check: Sirf Authorized Cron Job hi ise trigger kar sake
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized Node Access" }, { status: 401 });
  }

  try {
    await connectDB();
    
    // 1. Un leads ko dhundo jo 24 ghante se "ABANDONED" hain aur jinko offer nahi bheja gaya
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deadCarts = await Lead.find({
      status: 'ABANDONED',
      updatedAt: { $lt: oneDayAgo },
      offerSent: false
    });

    const results = [];

    for (const lead of deadCarts) {
      // 🚨 AI SMART DISCOUNT LOGIC
      // Hum cart value ke hisaab se discount decide karenge
      const cartTotal = lead.cartItems.reduce((acc: number, item: any) => acc + item.price, 0);
      
      let discount = "5%";
      let coupon = "IMPERIAL5";

      if (cartTotal > 500000) { 
        discount = "₹25,000 Flat OFF"; 
        coupon = "ELITE25K"; 
      } else if (cartTotal > 100000) { 
        discount = "10% OFF"; 
        coupon = "PRESTIGE10"; 
      }

      // 2. Generate Personal Recovery Link
      const recoveryLink = `https://essentialrush.com/checkout?leadId=${lead._id}&coupon=${coupon}`;

      // 3. Trigger SMS
      const success = await sendRecoverySMS(lead.phone, "Guest", recoveryLink, discount);

      if (success) {
        lead.offerSent = true;
        lead.status = 'OFFER_SENT';
        await lead.save();
        results.push({ phone: lead.phone, status: 'SENT' });
      }
    }

    return NextResponse.json({ success: true, recovered: results.length, data: results });

  } catch (error) {
    return NextResponse.json({ error: "Recovery Engine Failure" }, { status: 500 });
  }
}
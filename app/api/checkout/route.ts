import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Agent from '@/models/Agent';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';

// 🚨 KILL CACHE 🚨
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { customer, cart, affiliateCode } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Portfolio is empty." }, { status: 400 });
    }

    const session = await getServerSession();
    const userId = session?.user?.id || new mongoose.Types.ObjectId(); 

    let subTotal = 0;
    let taxAmount = 0;
    const orderItems = [];

    for (const item of cart) {
      const dbProduct = await Product.findById(item._id);
      if (!dbProduct) continue;

      const itemPrice = Number(dbProduct.basePrice || dbProduct.price || dbProduct.offerPrice || 0);
      const qty = Number(item.qty || 1);
      const itemTax = (itemPrice * 18) / 100; 

      subTotal += (itemPrice * qty);
      taxAmount += (itemTax * qty);

      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.title || dbProduct.name,
        qty: qty,
        price: itemPrice,
      });
    }

    const shippingCost = subTotal > 100000 ? 0 : 5000;
    const totalAmount = subTotal + taxAmount + shippingCost;
    
    // Generate Order ID
    const orderNumber = `IM-ORD-${Math.random().toString(36).toUpperCase().substring(2, 8)}`;

    // 🚨 100% PERFECT SCHEMA MATCH (Fixes your screenshot error) 🚨
    // Traffic Source Detection Logic
    const referer = req.headers.get('referer') || '';
    let trafficSource = 'Direct';
    if (affiliateCode) trafficSource = 'Referral';
    else if (referer.includes('google') || referer.includes('facebook')) trafficSource = 'Campaign';

    const newOrder = await Order.create({
      orderId: orderNumber,        
      user: userId,                
      customer: {                  
        name: customer.name || "VIP",
        email: customer.email || "vip@vault.com",
        phone: customer.phone || "0000000000",
        address: customer.address || "Vault HQ",
        city: customer.city || "Geneva",
        zipCode: customer.zipCode || "000000",
        country: customer.country || "India" // 🚨 Added Country
      },
      items: orderItems,
      subTotal: subTotal || 0,           
      taxAmount: taxAmount || 0,         
      shippingCost: shippingCost || 0,
      totalAmount: totalAmount || 0,     
      status: 'PENDING',                 
      paymentStatus: 'PENDING',
      affiliateCode: affiliateCode || null,
      trafficSource: trafficSource // 🚨 Added Traffic Tracker
    });
    
    // Deduct stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty, totalSold: item.qty } });
    }

    // 🚨 UPDATE AFFILIATE DASHBOARD 🚨
    if (affiliateCode) {
        try {
            await Agent.findOneAndUpdate(
                { code: affiliateCode.toUpperCase() },
                { $inc: { sales: 1, revenue: totalAmount } }
            );
        } catch(e) { console.log("Affiliate sync skipped"); }
    }

    return NextResponse.json({ success: true, orderId: orderNumber, totalAmount }, { status: 201 });
  } catch (error: any) {
    console.error("Checkout Validation Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Resend } from 'resend';

// 🌟 Initialize Resend with your API Key 🌟
const resend = new Resend(process.env.RESEND_API_KEY);

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

const OrderSchema = new mongoose.Schema({
    orderId: String,
    customer: { name: String, email: String, phone: String, address: String, city: String, state: String, pincode: String },
    items: Array,
    totalAmount: Number,
    paymentMethod: String,
    status: { type: String, default: 'PROCESSING' },
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { items, totalAmount, customer, paymentMethod } = body;
        
        const generatedOrderId = `ORD-${Date.now().toString().slice(-6)}`;

        // 1. Database Operations
        const existingPendingOrder = await Order.findOne({
            $or: [{ 'customer.email': customer.email }, { 'customer.phone': customer.phone }],
            status: 'PENDING'
        });

        if (existingPendingOrder) {
            existingPendingOrder.items = items;
            existingPendingOrder.totalAmount = totalAmount;
            existingPendingOrder.customer = customer;
            existingPendingOrder.paymentMethod = paymentMethod;
            existingPendingOrder.status = 'PROCESSING';
            existingPendingOrder.orderId = generatedOrderId;
            existingPendingOrder.createdAt = new Date();
            await existingPendingOrder.save();
        } else {
            await Order.create({
                orderId: generatedOrderId,
                customer: customer,
                items: items,
                totalAmount: totalAmount,
                paymentMethod: paymentMethod,
                status: 'PROCESSING'
            });
        }

        // 🌟 2. SEND LUXURY EMAIL VIA RESEND 🌟
        try {
            await resend.emails.send({
                // Important: For free Resend accounts without a registered domain, 
                // you must use 'onboarding@resend.dev' as the 'from' address.
                from: 'Essential Rush <onboarding@resend.dev>', 
                to: [customer.email, process.env.ADMIN_EMAIL as string].filter(Boolean), // Sends to customer AND a copy to admin (if ADMIN_EMAIL is set)
                subject: `Order Confirmed: ${generatedOrderId} - Essential Rush`,
                html: `
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAFAFA; border: 1px solid #eaeaea; border-radius: 12px;">
                        <div style="text-align: center; padding-bottom: 30px; border-bottom: 1px solid #eaeaea; margin-bottom: 30px;">
                            <h1 style="font-family: Georgia, serif; font-size: 28px; letter-spacing: 6px; text-transform: uppercase; margin: 0; color: #000;">Essential</h1>
                            <p style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #888; margin-top: 5px;">Fine Horology</p>
                        </div>
                        
                        <h2 style="font-size: 24px; color: #000; margin-bottom: 10px;">Order Confirmed.</h2>
                        <p style="color: #555; line-height: 1.6; font-size: 15px;">Dear ${customer.name},</p>
                        <p style="color: #555; line-height: 1.6; font-size: 15px;">Thank you for your purchase. Your order <strong>#${generatedOrderId}</strong> is currently being processed. We will notify you once your premium timepieces have been dispatched.</p>
                        
                        <div style="background-color: #fff; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; margin: 30px 0;">
                            <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-top: 0; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">Order Summary</h3>
                            ${items.map((item: any) => `
                                <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-bottom: 15px; border-bottom: 1px solid #fafafa;">
                                    <span style="color: #000; font-weight: bold; font-size: 14px;">${item.qty}x ${item.name}</span>
                                    <span style="color: #000; font-size: 14px;">₹${(Number(item.offerPrice || item.price) * item.qty).toLocaleString()}</span>
                                </div>
                            `).join('')}
                            <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 18px; font-weight: bold; color: #000;">
                                <span>Total Amount (COD)</span>
                                <span>₹${totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 40px;">
                            <p style="font-size: 12px; color: #888; line-height: 1.5;">If you have any questions regarding your order, please reply to this email or contact our support team.</p>
                            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #ccc; margin-top: 30px;">© 2026 Essential Rush. All Rights Reserved.</p>
                        </div>
                    </div>
                `
            });
        } catch (emailError) {
            // Agar email fail bhi ho jaye, toh order fail nahi hona chahiye
            console.error("Resend Email failed:", emailError);
        }

        return NextResponse.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
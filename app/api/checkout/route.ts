import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { sendMail } from '@/utils/sendMail';

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = true;
};

// Database Model
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false, timestamps: true }));

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // 1. Generate Premium Order ID
        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        
        // 2. Prepare Order Payload
        const newOrderData = {
            ...body,
            orderId,
            status: 'PENDING',
            createdAt: new Date()
        };

        // 3. 💾 Save Order to MongoDB
        const newOrder = await Order.create(newOrderData);

        // 4. 💌 Prepare Email Data variables
        const emailData = {
            name: body.customer?.name || 'Valued Client',
            amount: Number(body.totalAmount || 0).toLocaleString('en-IN'),
            phone: body.customer?.phone || 'Not Provided',
            city: body.customer?.city || 'Not Provided',
        };

        // ==========================================
        // 🚀 TRIGGER BOTH EMAILS (Non-blocking)
        // ==========================================
        
        // A. Alert Mail to BOTH Admins (Umang & Shresth)
        if (process.env.ADMIN_ALERT_EMAILS) {
            await sendMail(
                process.env.ADMIN_ALERT_EMAILS, // Comma-separated variable from .env
                `New Acquisition Alert: #${orderId}`, 
                emailData,
                'ADMIN'
            ).catch(e => console.log("Admin mail failed (Silent):", e));
        }

        // B. Thank You Mail to the Customer
        if (body.customer?.email) {
            await sendMail(
                body.customer.email, 
                `Order Confirmation: #${orderId}`, 
                emailData,
                'CUSTOMER'
            ).catch(e => console.log("Customer mail failed (Silent):", e));
        }
        // ==========================================

        // 5. Return success to the checkout page instantly
        return NextResponse.json({ 
            success: true, 
            message: "Order placed successfully",
            orderId: orderId 
        });

    } catch (error) {
        console.error("Checkout API Error:", error);
        return NextResponse.json({ success: false, error: "Failed to process checkout" }, { status: 500 });
    }
}
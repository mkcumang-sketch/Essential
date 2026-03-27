import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { sendMail } from '@/utils/sendMail'; // 💌 Import the Mail Engine

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = true;
};

// Direct Model definition to avoid import errors
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false, timestamps: true }));

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // 1. Generate a unique Order ID
        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        
        // 2. Create the order payload
        const newOrderData = {
            ...body,
            orderId,
            status: 'PENDING',
        };

        // 3. Save Order to Database
        const newOrder = await Order.create(newOrderData);

        // 4. Prepare data for the Emails
        const emailData = {
            name: body.customer?.name || 'Valued Customer',
            amount: Number(body.totalAmount || 0).toLocaleString('en-IN'),
            phone: body.customer?.phone || 'Not Provided',
            city: body.customer?.city || 'Not Provided',
        };

        // ==========================================
        // 💌 5. TRIGGER BOTH EMAILS
        // ==========================================
        
        // A. Send Mail to Admin (You)
        if (process.env.ADMIN_EMAIL) {
            await sendMail(
                process.env.ADMIN_EMAIL, 
                `New Acquisition Alert: #${orderId}`, 
                emailData,
                'ADMIN'
            );
        }

        // B. Send Mail to Customer (If they provided an email)
        if (body.customer?.email) {
            await sendMail(
                body.customer.email, 
                `Order Confirmation: #${orderId}`, 
                emailData,
                'CUSTOMER'
            );
        }

        // ==========================================

        return NextResponse.json({ success: true, order: newOrder });

    } catch (error) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
    }
}

// GET method for Godmode dashboard to read orders
export async function GET() {
    try {
        await connectDB();
        const orders = await Order.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
    }
}

// PATCH method for Godmode dashboard to update order status
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const { id, status } = await req.json();
        await Order.findByIdAndUpdate(id, { status });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    try {
        // 1. Database se connect karo
        await connectDB();
        
        const body = await req.json();
        const trackingId = body.orderId?.trim();
        const email = body.email?.trim().toLowerCase();
        
        // 2. Agar dono cheezein nahi aayi toh reject karo
        if (!trackingId || !email) {
            return NextResponse.json(
                { success: false, message: "Please provide both Order ID and Billing Email." }, 
                { status: 400 }
            );
        }

        // Order Model load karo
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

        // 3. Pehle custom orderId (jaise ORD-12345) se search karo
        let foundOrder = await Order.findOne({ orderId: trackingId }).lean() as any;
        
        // 4. Fallback: Agar purana order hai aur MongoDB ki _id (24 characters) use hui thi
        if (!foundOrder && mongoose.Types.ObjectId.isValid(trackingId)) {
            foundOrder = await Order.findById(trackingId).lean() as any;
        }

        // Agar order nahi mila
        if (!foundOrder) {
            return NextResponse.json(
                { success: false, message: "Order not found. Please check your Order ID." }, 
                { status: 404 }
            );
        }

        // 🔒 5. STRICT SECURITY (IDENTITY GLUE): Verify Billing Email
        // Yahan hum check kar rahe hain ki jis bande ka email hai, usi ko data dikhe
        const orderEmail = (foundOrder.customer?.email || foundOrder.shippingData?.email || "").toLowerCase();
        
        if (orderEmail !== email) {
            return NextResponse.json(
                { success: false, message: "Billing email does not match this order." }, 
                { status: 403 } // 403 Forbidden
            );
        }

        // 6. Frontend Format Matching (The UI Fix)
        // Frontend ko `firstItemName` aur `trackingId` chahiye
        const firstItemName = foundOrder.items && foundOrder.items.length > 0 
            ? foundOrder.items[0].name || foundOrder.items[0].title || "Luxury Asset"
            : "Luxury Asset";

        const safeOrderDetails = {
            _id: foundOrder._id,
            orderId: foundOrder.orderId || foundOrder._id.toString().slice(-8).toUpperCase(),
            status: foundOrder.status || "PENDING",
            totalAmount: foundOrder.totalAmount,
            firstItemName: firstItemName,            // UI ke liye item ka naam
            trackingId: foundOrder.trackingId || "", // Courier ki Tracking ID (e.g. Delhivery)
            createdAt: foundOrder.createdAt
        };

        // 7. Success Response Frontend ko bhej do
        return NextResponse.json({ 
            success: true, 
            order: safeOrderDetails 
        });

    } catch (error) {
        console.error("Tracking API Error:", error);
        return NextResponse.json(
            { success: false, message: "Server Error while tracking order." }, 
            { status: 500 }
        );
    }
}
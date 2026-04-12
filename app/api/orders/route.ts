export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import { revalidatePath, revalidateTag } from 'next/cache';

async function verifySuperAdmin(session: any) {
    if (!session?.user) return false;
    if (session.user.role === "SUPER_ADMIN") return true;
    const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    const dbUser = await User.findById(session.user.id || session.user._id).lean() as any;
    return dbUser?.role === "SUPER_ADMIN";
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        const isSuperAdmin = await verifySuperAdmin(session);
        const Order = mongoose.models.Order || mongoose.model("Order", new mongoose.Schema({}, { strict: false }));

        let orders = [];
        if (isSuperAdmin) {
            orders = await Order.find({}).sort({ createdAt: -1 }).lean();
        } else {
            const userId = (session.user as any).id;
            orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
        }
        return NextResponse.json({ success: true, data: orders, orders });
    } catch (error) { return NextResponse.json({ success: false, error: "We could not load orders." }, { status: 500 }); }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const isSuperAdmin = await verifySuperAdmin(session);
        if (!isSuperAdmin) return NextResponse.json({ success: false, error: "Access Denied." }, { status: 403 });

        const body = await req.json();
        const orderId = body._id || body.id;
        if (!orderId) return NextResponse.json({ success: false, error: "Order ID missing." }, { status: 400 });

        const updateData: any = {};
        if (body.status !== undefined) updateData.status = body.status;
        if (body.trackingId !== undefined) updateData.trackingId = body.trackingId;

        const Order = mongoose.models.Order || mongoose.model("Order", new mongoose.Schema({}, { strict: false }));
        const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
        const query = isMongoId ? { $or: [{ _id: orderId }, { orderId: orderId }] } : { orderId: orderId };

        const updatedOrder = await Order.findOneAndUpdate(query, updateData, { new: true });

        // 🌟 1. THE PYRAMID REWARD TRIGGER (Anti-Fraud) 🌟
        if (updatedOrder && body.status === 'DELIVERED' && updatedOrder.pointsCredited === false) {
            const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}, { strict: false }));
            const reward = Number(updatedOrder.pendingPoints || 0);

            if (reward > 0) {
                // Give 10% Points to BUYER (Cashback)
                if (updatedOrder.userId) {
                    await User.findByIdAndUpdate(updatedOrder.userId, { $inc: { walletPoints: reward } });
                }
                // Give 10% Points to REFERRER (The Pyramid Maker)
                if (updatedOrder.referrerId) {
                    await User.findByIdAndUpdate(updatedOrder.referrerId, { $inc: { walletPoints: reward } });
                }
                
                // Mark as paid so they can't be given twice
                updatedOrder.pointsCredited = true;
                await updatedOrder.save();
                console.log(`🤑 PYRAMID SCHEME ACTIVATED: ${reward} points sent to users for order ${updatedOrder.orderId}`);
            }
        }

        // 🚀 2. AUTO-PURGE ABANDONED CARTS 🚀
        if (updatedOrder && body.status && ['PROCESSING', 'DISPATCHED', 'DELIVERED'].includes(body.status)) {
            try {
                const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', new mongoose.Schema({}, { strict: false }));
                const email = updatedOrder.customer?.email || updatedOrder.shippingData?.email;
                const phone = updatedOrder.customer?.phone || updatedOrder.shippingData?.phone;
                
                const orConditions = [];
                if (email) orConditions.push({ email: email.trim().toLowerCase() });
                if (phone) orConditions.push({ phone: phone.trim() });

                if (orConditions.length > 0) {
                    await AbandonedCart.findOneAndDelete({ $or: orConditions });
                }
            } catch (purgeError) {
                console.error("Auto-purge error in Orders API:", purgeError);
            }
        }

        revalidatePath('/', 'layout'); revalidatePath('/godmode'); revalidatePath('/admin/abandoned-carts'); revalidateTag('orders', 'layout');
        return NextResponse.json({ success: true, message: "Order status updated." });
    } catch (error) { return NextResponse.json({ success: false, error: "Update failed." }, { status: 500 }); }
}

export async function POST(req: Request) { return PUT(req); }
export async function PATCH(req: Request) { return PUT(req); }

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const isSuperAdmin = await verifySuperAdmin(session);
        if (!isSuperAdmin) return NextResponse.json({ success: false, error: "Access Denied." }, { status: 403 });

        const url = new URL(req.url);
        let orderId = url.searchParams.get("id");
        if (!orderId) { const body = await req.json().catch(() => ({})); orderId = body._id || body.id; }
        if (!orderId) return NextResponse.json({ success: false, error: "Order ID missing." }, { status: 400 });

        const Order = mongoose.models.Order || mongoose.model("Order", new mongoose.Schema({}, { strict: false }));
        const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
        const query = isMongoId ? { $or: [{ _id: orderId }, { orderId: orderId }] } : { orderId: orderId };
        await Order.findOneAndDelete(query);

        revalidatePath('/', 'layout'); revalidatePath('/godmode'); revalidatePath('/admin/orders'); revalidateTag('orders', 'layout');
        return NextResponse.json({ success: true, message: "Order deleted." });
    } catch (error) { return NextResponse.json({ success: false, error: "Deletion failed." }, { status: 500 }); }
}
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { AbandonedCart } from '@/models/AbandonedCart';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// Order schema for tracking Sales and Abandoned Carts
const OrderSchema = new mongoose.Schema({
    orderId: String,
    customer: { name: String, email: String, phone: String },
    items: Array,
    totalAmount: Number,
    status: { type: String, default: 'PENDING' },
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { items, totalAmount, user } = body;

        if (!user || (!user.email && !user.phone)) {
            return NextResponse.json({ success: false, error: "User info missing" });
        }

        // 🌟 THE FIX: Dynamically build the $or conditions 🌟
        // Isse TypeScript error nahi aayega aur empty fields search nahi hongi
        const orConditions = [];
        if (user.email) orConditions.push({ 'customer.email': user.email });
        if (user.phone) orConditions.push({ 'customer.phone': user.phone });

        // Check if an abandoned cart (PENDING order) already exists for this user
        const existingCart = await Order.findOne({
            $or: orConditions,
            status: 'PENDING'
        });

        if (existingCart) {
            // Update existing cart
            existingCart.items = items;
            existingCart.totalAmount = totalAmount;
            existingCart.createdAt = new Date(); // Reset time
            await existingCart.save();
        } else {
            // Create new PENDING order (Abandoned Cart Lead)
            await Order.create({
                orderId: `CART-${Date.now().toString().slice(-6)}`,
                customer: user,
                items: items,
                totalAmount: totalAmount,
                status: 'PENDING' 
            });
        }

        // Mirror lead into dedicated AbandonedCart collection for Recovery Vault UI.
        const leadFilters: any[] = [];
        if (user.email) leadFilters.push({ email: String(user.email).toLowerCase().trim() });
        if (user.phone) leadFilters.push({ phone: String(user.phone).trim() });

        if (leadFilters.length > 0) {
            await AbandonedCart.findOneAndUpdate(
                { $or: leadFilters },
                {
                    name: user.name || 'Vault Client',
                    email: user.email ? String(user.email).toLowerCase().trim() : '',
                    phone: user.phone ? String(user.phone).trim() : '',
                    items: Array.isArray(items) ? items : [],
                    cartTotal: Number(totalAmount) || 0,
                    status: 'ABANDONED',
                    lastInteraction: new Date(),
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Cart Sync Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
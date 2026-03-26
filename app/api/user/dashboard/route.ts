import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Ensure DB Connection
let isConnected = false;
const connectDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected || mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string, { maxPoolSize: 10 });
    isConnected = true;
};

// Define Schema references if they don't exist yet
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, phone } = await req.json();

        if (!email && !phone) {
            return NextResponse.json({ success: false, error: "User identity missing" }, { status: 400 });
        }

        // 1. DYNAMIC ORDERS FETCH: Sirf is user ke orders nikalo (Exclude PENDING/Abandoned carts)
        const userOrders = await Order.find({
            $or: [
                { 'customer.email': email }, 
                { 'customer.phone': phone }
            ],
            status: { $ne: 'PENDING' }
        }).sort({ createdAt: -1 }).lean();

        // Map the orders for the frontend UI
        const formattedOrders = userOrders.map(order => ({
            id: order.orderId,
            total: order.totalAmount || 0,
            date: order.createdAt,
            timeline: [
                { step: "Order Placed", date: new Date(order.createdAt).toLocaleDateString(), completed: true },
                { step: "Processing", date: "Pending", completed: order.status === 'PROCESSING' || order.status === 'DISPATCHED' || order.status === 'DELIVERED' },
                { step: "Dispatched", date: "Pending", completed: order.status === 'DISPATCHED' || order.status === 'DELIVERED' },
                { step: "Delivered", date: "Pending", completed: order.status === 'DELIVERED' }
            ]
        }));

        // 2. Fetch User Record for Points/Referral (Create mock defaults if fields are missing in DB)
        const dbUser = await User.findOne({ $or: [{ email }, { phone }] });
        const walletPoints = dbUser?.walletPoints || 0;
        const refCode = dbUser?.referralCode || `VIP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        // 3. Construct the Personalized Payload
        const dashData = {
            profile: {
                completeness: dbUser?.address ? 100 : 75,
                loginHistory: [{ ip: "192.168.1.1", date: new Date().toISOString() }]
            },
            orders: formattedOrders,
            wallet: {
                points: walletPoints,
                totalEarned: walletPoints,
                referralCode: refCode
            },
            // For now, keep the rest as empty/default arrays until you build these backend modules
            recommendations: [],
            coupons: [],
            wishlist: [],
            recentlyViewed: [],
            addresses: dbUser?.address ? [{ id: 1, type: "Home", address: dbUser.address, isDefault: true }] : [],
            savedCards: [],
            notifications: [],
            tickets: [],
            reviews: [] 
        };

        return NextResponse.json({ success: true, data: dashData });

    } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
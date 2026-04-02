export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = true;
};

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
const Review = mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({}, { strict: false }));
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', new mongoose.Schema({}, { strict: false }));

export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession();
        
        if (!session?.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized Vault Access" }, { status: 401 });
        }

        const email = session.user.email;

        // ✅ DATA FETCHING & TYPING
        const profile: any = await User.findOne({ email }).lean() || {};
        const orders: any[] = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 }).lean();
        
        // ✅ CALCULATION (Isi ke gayab hone se laal line aa rahi thi)
        const totalSpent: number = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        let tier: string = 'BRONZE';
        if (totalSpent > 500000) tier = 'PLATINUM';
        else if (totalSpent > 200000) tier = 'GOLD';
        else if (totalSpent > 50000) tier = 'SILVER';

        const reviews: any[] = await Review.find({ email }).sort({ createdAt: -1 }).lean();
        const tickets: any[] = await Ticket.find({ email }).sort({ createdAt: -1 }).lean();

        // ✅ FINAL PAYLOAD
        const dashboardData = {
            profile: {
                name: profile.name || session.user.name,
                email: email,
                phone: profile.phone || '',
                tier: tier, 
                totalSpent: totalSpent, 
                memberSince: profile.createdAt || new Date(),
                language: profile.language || 'English',
                currency: profile.currency || 'INR'
            },
            assets: {
                walletBalance: profile.walletBalance || 0,
                rewardPoints: profile.rewardPoints || 0,
                referralCode: profile.referralCode || `VIP-${email.substring(0,4).toUpperCase()}${Math.floor(Math.random()*1000)}`,
                referralEarnings: profile.referralEarnings || 0,
                activeCoupons: profile.coupons || []
            },
            collections: {
                wishlist: profile.wishlist || [],
                recentlyViewed: profile.recentlyViewed || [],
                recommendations: [] 
            },
            orders: orders.map(o => ({
                id: o.orderId,
                date: o.createdAt,
                total: o.totalAmount,
                status: o.status,
                items: o.items || []
            })),
            activity: {
                reviews: reviews,
                tickets: tickets,
                notifications: profile.notifications || []
            },
            security: {
                loginHistory: profile.loginHistory || [{ device: 'Current Device', date: new Date(), ip: 'Secured' }]
            }
        };

        return NextResponse.json({ success: true, data: dashboardData });

    } catch (error) {
        console.error("Vault Aggregation Error:", error);
        return NextResponse.json({ success: false, error: "Internal Vault Error" }, { status: 500 });
    }
}
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/models/usertemp';

export async function GET() {
    try {
        await connectDB();
        
        const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        
        // 📊 OVERALL STATS
        const allOrders = await Order.find({}).lean();
        const totalRevenue = allOrders.reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0);
        const totalOrders = allOrders.length;
        const deliveredOrders = allOrders.filter((o: any) => o.status === 'DELIVERED');
        const pendingOrders = allOrders.filter((o: any) => ['PENDING', 'PROCESSING'].includes(o.status));
        
        // 📈 MONTHLY REVENUE (Last 12 months)
        const monthlyRevenue: Record<string, number> = {};
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyRevenue[key] = 0;
        }
        
        for (const order of allOrders) {
            if (order.createdAt) {
                const d = new Date(order.createdAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                if (monthlyRevenue[key] !== undefined) {
                    monthlyRevenue[key] += Number(order.totalAmount || 0);
                }
            }
        }
        
        const monthlyRevenueArray = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
            month,
            revenue: Math.round(revenue),
            orders: allOrders.filter((o: any) => {
                if (!o.createdAt) return false;
                const d = new Date(o.createdAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                return key === month;
            }).length
        }));
        
        // 🥧 CATEGORY BREAKDOWN
        const categoryStats: Record<string, { revenue: number; orders: number }> = {};
        for (const order of allOrders) {
            const items = order.items || [];
            for (const item of items) {
                const category = item.category || 'Investment Grade';
                if (!categoryStats[category]) {
                    categoryStats[category] = { revenue: 0, orders: 0 };
                }
                categoryStats[category].revenue += Number(item.price || 0) * (item.qty || 1);
                categoryStats[category].orders += item.qty || 1;
            }
        }
        
        const categoryArray = Object.entries(categoryStats)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 8);
        
        // 👑 TOP REFERRALS (Users who brought most new customers)
        const topReferrers = await User.find({ 
            totalReferrals: { $gt: 0 } 
        })
        .sort({ totalReferrals: -1 })
        .limit(10)
        .lean();
        
        const referrerData = topReferrers.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            referralCode: u.myReferralCode,
            totalReferrals: u.totalReferrals || 0,
            totalEarned: u.totalEarned || 0,
            walletPoints: u.walletPoints || 0
        }));
        
        // 📦 ORDER STATUS BREAKDOWN
        const statusStats: Record<string, number> = {};
        const statusList = ['PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];
        for (const status of statusList) {
            statusStats[status] = 0;
        }
        for (const order of allOrders) {
            const s = order.status || 'PENDING';
            if (statusStats[s] !== undefined) {
                statusStats[s]++;
            } else {
                statusStats['PENDING']++;
            }
        }
        
        // 💰 WALLET STATS
        const walletStats = await User.aggregate([
            { $group: { _id: null, totalPoints: { $sum: '$walletPoints' }, totalEarned: { $sum: '$totalEarned' } } }
        ]);

        // 🚨 FRAUD STATS
        const fraudStats = {
            suspiciousOrders: allOrders.filter((o: any) => o.fraudStatus === 'REVIEW').length,
            blockedOrders: allOrders.filter((o: any) => o.fraudStatus === 'BLOCK').length,
            flaggedOrders: allOrders.filter((o: any) => o.fraudStatus).length
        };
        
        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    totalRevenue,
                    totalOrders,
                    deliveredOrders: deliveredOrders.length,
                    pendingOrders: pendingOrders.length,
                    averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
                },
                monthlyRevenue: monthlyRevenueArray,
                categories: categoryArray,
                topReferrers: referrerData,
                orderStatus: Object.entries(statusStats).map(([status, count]) => ({ status, count })),
                wallet: walletStats[0] || { totalPoints: 0, totalEarned: 0 },
                fraud: fraudStats
            }
        });
    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({ success: false, error: "Analytics failed" }, { status: 500 });
    }
}

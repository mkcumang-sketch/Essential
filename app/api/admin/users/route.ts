export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';

// 🌟 BULLETPROOF DATABASE CONNECTION 🌟
let isConnected = false;
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, {
            bufferCommands: true,
            maxPoolSize: 10,
        });
        isConnected = true;
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ DB Connection Error:", error);
        throw new Error("Database connection failed!");
    }
};

// GET: Fetch all users for admin dashboard
export async function GET(req: Request) {
    try {
        await connectDB();
        
        // 🚨 FIREWALL: Verify admin session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || (session.user as any).role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
        }

        // 🚨 FIREWALL: Fetch users with security
        const users = await User.find({})
            .select('-password -__v')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: {
                users: users || [],
                totalUsers: users?.length || 0
            }
        });

    } catch (error) {
        console.error("Admin Get Users Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to fetch users" 
        }, { status: 500 });
    }
}

// PUT: Update user totalSpent and loyaltyTier
export async function PUT(req: Request) {
    try {
        await connectDB();
        
        // 🚨 FIREWALL: Verify admin session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || (session.user as any).role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
        }

        const { userId, totalSpent, loyaltyTier } = await req.json();

        // 🛡️ INPUT VALIDATION
        if (!userId || typeof userId !== 'string') {
            return NextResponse.json({ success: false, error: "Valid user ID is required" }, { status: 400 });
        }

        if (totalSpent !== undefined && (typeof totalSpent !== 'number' || totalSpent < 0)) {
            return NextResponse.json({ success: false, error: "Total spent must be a positive number" }, { status: 400 });
        }

        if (loyaltyTier && !['Silver Vault', 'Gold Vault'].includes(loyaltyTier)) {
            return NextResponse.json({ success: false, error: "Invalid loyalty tier" }, { status: 400 });
        }

        // 🚨 FIREWALL: Check if user exists
        const user = await User.findById(userId).select('-password -__v');
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // 🚨 FIREWALL: Update user
        const updateData: any = {};
        if (totalSpent !== undefined) updateData.totalSpent = totalSpent;
        if (loyaltyTier) updateData.loyaltyTier = loyaltyTier;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password -__v');

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
        }

        // 🚨 FIREWALL: Add notification for user
        await User.findByIdAndUpdate(userId, {
            $push: {
                notifications: {
                    title: "👑 Account Updated",
                    desc: `Your loyalty status has been updated by an administrator.`,
                    unread: true,
                    time: new Date()
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: "User updated successfully",
            data: {
                user: updatedUser
            }
        });

    } catch (error) {
        console.error("Admin Update User Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to update user" 
        }, { status: 500 });
    }
}

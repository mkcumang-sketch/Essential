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

// GET: Fetch user's wishlist
export async function GET(req: Request) {
    try {
        await connectDB();
        
        // 🚨 FIREWALL: Verify user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // 🚨 FIREWALL: Fetch user with populated wishlist
        const userRaw = await User.findById(session.user.id)
            .select('-password -__v')
            .populate({
                path: 'wishlist',
                select: 'name price imageUrl brand _id'
            })
            .lean();

        if (!userRaw || Array.isArray(userRaw)) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }
        const user = userRaw as { wishlist?: unknown[] };

        return NextResponse.json({
            success: true,
            data: {
                wishlist: user.wishlist || []
            }
        });

    } catch (error) {
        console.error("Get Wishlist Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to fetch wishlist" 
        }, { status: 500 });
    }
}

// POST: Add product to wishlist
export async function POST(req: Request) {
    try {
        await connectDB();
        
        // 🚨 FIREWALL: Verify user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();

        // 🛡️ INPUT VALIDATION
        if (!productId || typeof productId !== 'string') {
            return NextResponse.json({ success: false, error: "Valid product ID is required" }, { status: 400 });
        }

        // 🚨 FIREWALL: Check if product exists (optional but recommended)
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        const productRaw = await Product.findById(productId).select('_id').lean();
        if (!productRaw || Array.isArray(productRaw)) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        // 🚨 FIREWALL: Add to wishlist if not already present
        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { 
                $addToSet: { wishlist: productId }, // $addToSet prevents duplicates
                $push: {
                    notifications: {
                        title: "💝 Added to Wishlist",
                        desc: "A new item has been added to your wishlist.",
                        unread: true,
                        time: new Date()
                    }
                }
            },
            { new: true }
        ).select('-password -__v');

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: "Failed to add to wishlist" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Product added to wishlist",
            data: {
                wishlist: updatedUser.wishlist || []
            }
        });

    } catch (error) {
        console.error("Add to Wishlist Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to add to wishlist" 
        }, { status: 500 });
    }
}

// DELETE: Remove product from wishlist
export async function DELETE(req: Request) {
    try {
        await connectDB();
        
        // 🚨 FIREWALL: Verify user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();

        // 🛡️ INPUT VALIDATION
        if (!productId || typeof productId !== 'string') {
            return NextResponse.json({ success: false, error: "Valid product ID is required" }, { status: 400 });
        }

        // 🚨 FIREWALL: Remove from wishlist
        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { $pull: { wishlist: productId } },
            { new: true }
        ).select('-password -__v');

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: "Failed to remove from wishlist" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Product removed from wishlist",
            data: {
                wishlist: updatedUser.wishlist || []
            }
        });

    } catch (error) {
        console.error("Remove from Wishlist Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to remove from wishlist" 
        }, { status: 500 });
    }
}

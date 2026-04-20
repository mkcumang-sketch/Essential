export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/usertemp';

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
    } catch (error) {
        console.error("❌ DB Connection Error:", error);
        throw new Error("Database connection failed!");
    }
};

// GET: Fetch all user addresses
export async function GET(req: Request) {
    try {
        await connectDB();
        
        // 🚨 FIREWALL: Verify user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Please sign in." }, { status: 401 });
        }

        // 🚨 FIREWALL: Fetch user with security
        const userRaw = await User.findById(session.user.id).select('-password -__v').lean();
        if (!userRaw || Array.isArray(userRaw)) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }
        const user = userRaw as { addresses?: unknown[] };

        return NextResponse.json({
            success: true,
            data: {
                addresses: user.addresses || []
            }
        });

    } catch (error) {
        console.error("Get Addresses Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "We could not load your addresses." 
        }, { status: 500 });
    }
}

// POST: Add new address
export async function POST(req: Request) {
    try {
        await connectDB();
        
        // 🚨 FIREWALL: Verify user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Please sign in." }, { status: 401 });
        }

        const { type, address, isDefault } = await req.json();

        // 🛡️ INPUT VALIDATION
        if (!address || typeof address !== 'string' || address.trim().length < 10) {
            return NextResponse.json({ success: false, error: "Please enter a full address." }, { status: 400 });
        }

        const addressType = type || 'Home';
        const makeDefault = Boolean(isDefault);

        // 🚨 FIREWALL: If setting as default, unset other defaults first
        const updateOperation: any = {
            $push: {
                addresses: {
                    type: addressType,
                    address: address.trim(),
                    isDefault: makeDefault
                }
            }
        };

        if (makeDefault) {
            updateOperation.$set = { 'addresses.$[elem].isDefault': false };
            updateOperation.arrayFilters = [{ 'elem.isDefault': true }];
        }

        // 🚨 FIREWALL: Update user with new address
        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            updateOperation,
            { new: true, arrayFilters: makeDefault ? [{ 'elem.isDefault': true }] : undefined }
        ).select('-password -__v');

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: "We could not save your address." }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Address saved.",
            data: {
                addresses: updatedUser.addresses || []
            }
        });

    } catch (error) {
        console.error("Add Address Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "We could not save your address." 
        }, { status: 500 });
    }
}

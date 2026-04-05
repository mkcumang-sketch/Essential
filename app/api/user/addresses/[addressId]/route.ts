export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

// DELETE: Remove specific address
export async function DELETE(req: Request, { params }: { params: Promise<{ addressId: string }> }) {
    try {
        await connectDB();
        
        // 🚨 FIREWALL: Verify user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Please sign in." }, { status: 401 });
        }

        const { addressId } = await params;

        // 🛡️ INPUT VALIDATION
        if (!addressId || typeof addressId !== 'string') {
            return NextResponse.json({ success: false, error: "Invalid address ID" }, { status: 400 });
        }

        // 🚨 FIREWALL: Find and validate user
        const user = await User.findById(session.user.id).select('-password -__v');
        
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // 🚨 FIREWALL: Check if address exists and belongs to user (IDOR FIX)
        const addressExists = user.addresses?.some((addr: any) => 
            addr._id?.toString() === addressId && addr._id?.toString() === addressId
        );

        if (!addressExists) {
            return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 });
        }

        // 🚨 FIREWALL: Remove the address
        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        ).select('-password -__v');

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: "We could not delete this address." }, { status: 500 });
        }

        // 🚨 FIREWALL: If deleted address was default, set first remaining address as default
        const remainingAddresses = updatedUser.addresses || [];
        const hasDefaultAddress = remainingAddresses.some((addr: any) => addr.isDefault);

        if (!hasDefaultAddress && remainingAddresses.length > 0) {
            await User.findByIdAndUpdate(
                session.user.id,
                { $set: { 'addresses.0.isDefault': true } }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Address removed.",
            data: {
                addresses: remainingAddresses
            }
        });

    } catch (error) {
        console.error("Delete Address Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "We could not delete this address." 
        }, { status: 500 });
    }
}

// PUT: Update specific address
export async function PUT(req: Request, { params }: { params: Promise<{ addressId: string }> }) {
    try {
        await connectDB();
        
        // 🚨 FIREWALL: Verify user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Please sign in." }, { status: 401 });
        }

        const { addressId } = await params;
        const { type, address, isDefault } = await req.json();

        // 🛡️ INPUT VALIDATION
        if (!addressId || typeof addressId !== 'string') {
            return NextResponse.json({ success: false, error: "Invalid address ID" }, { status: 400 });
        }

        if (!address || typeof address !== 'string' || address.trim().length < 10) {
            return NextResponse.json({ success: false, error: "Please enter a full address." }, { status: 400 });
        }

        // 🚨 FIREWALL: Find and validate user
        const user = await User.findById(session.user.id).select('-password -__v');
        
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // 🚨 FIREWALL: Check if address exists and belongs to user (IDOR FIX)
        const addressExists = user.addresses?.some((addr: any) => 
            addr._id?.toString() === addressId && addr._id?.toString() === addressId
        );

        if (!addressExists) {
            return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 });
        }

        const makeDefault = Boolean(isDefault);

        // 🚨 FIREWALL: Update the address
        const updateOperation: any = {
            $set: {
                'addresses.$[elem].type': type || 'Home',
                'addresses.$[elem].address': address.trim(),
                'addresses.$[elem].isDefault': makeDefault
            }
        };

        // If setting as default, unset other defaults first
        if (makeDefault) {
            updateOperation.$set['addresses.$[elem2].isDefault'] = false;
        }

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            updateOperation,
            { 
                new: true,
                arrayFilters: makeDefault ? 
                    [{ 'elem._id': addressId }, { 'elem2.isDefault': true, 'elem2._id': { $ne: addressId } }] :
                    [{ 'elem._id': addressId }]
            }
        ).select('-password -__v');

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: "We could not update this address." }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Address updated.",
            data: {
                addresses: updatedUser.addresses || []
            }
        });

    } catch (error) {
        console.error("Update Address Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "We could not update this address." 
        }, { status: 500 });
    }
}

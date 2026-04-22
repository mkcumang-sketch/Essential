import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { AbandonedCart } from '@/models/AbandonedCart';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id: targetId } = await params;

        if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
            return NextResponse.json({ success: false, message: 'Invalid Cart ID' }, { status: 400 });
        }

        const deletedCart = await AbandonedCart.findByIdAndDelete(targetId);

        if (!deletedCart) {
            return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
        }

        revalidatePath('/Godmode/abandoned-carts');
        revalidatePath('/Godmode', 'layout');

        return NextResponse.json(
            { success: true, message: 'Cart Purged' },
            { headers: { 'Cache-Control': 'no-store, max-age=0' } }
        );
    } catch (error: any) {
        return NextResponse.json({ success: false, message: 'Server Database Error' }, { status: 500 });
    }
}
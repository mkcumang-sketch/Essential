import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { AbandonedCart } from '@/models/AbandonedCart';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        
        // 1. Database se delete karo
        const deletedCart = await AbandonedCart.findByIdAndDelete(params.id);

        if (!deletedCart) {
            return NextResponse.json({ success: false, message: 'Cart not found in Vault' }, { status: 404 });
        }

        // 2. THE NUKE: Next.js Cache ko jala do
        revalidatePath('/admin/abandoned-carts');
        revalidatePath('/admin', 'layout'); 

        return NextResponse.json({ success: true, message: 'Cart Permanently Purged' });
        
    } catch (error) {
        console.error('Vault Deletion Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to purge cart' }, { status: 500 });
    }
}
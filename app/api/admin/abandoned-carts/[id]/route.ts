import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { AbandonedCart } from '@/models/AbandonedCart';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // <-- Next.js 15 Promise Type
) {
    try {
        await connectDB();
        
        // 1. Params ko await karo (The Fix!)
        const resolvedParams = await params;
        
        // 2. Database se delete karo
        const deletedCart = await AbandonedCart.findByIdAndDelete(resolvedParams.id);

        if (!deletedCart) {
            return NextResponse.json({ success: false, message: 'Cart not found in Vault' }, { status: 404 });
        }

        // 3. THE NUKE: Next.js Cache flush
        revalidatePath('/admin/abandoned-carts');
        revalidatePath('/admin', 'layout'); 

        return NextResponse.json({ success: true, message: 'Cart Permanently Purged' });
        
    } catch (error) {
        console.error('Vault Deletion Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to purge cart' }, { status: 500 });
    }
}
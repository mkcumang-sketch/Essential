import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { AbandonedCart } from '@/models/AbandonedCart';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        await connectDB();
        const resolvedParams = await params;
        const targetId = resolvedParams.id;

        // 🚨 TERMINAL MEIN DEKHNA: Ye print hoga jab tu delete dabayega
        console.log("🔥 ATTEMPTING TO DELETE CART ID:", targetId);
        
        const deletedCart = await AbandonedCart.findByIdAndDelete(targetId);

        if (!deletedCart) {
            console.log("❌ CART NOT FOUND IN DATABASE!");
            return NextResponse.json({ success: false, message: 'Cart already deleted or ID mismatch' }, { status: 404 });
        }

        console.log("✅ CART PERMANENTLY DELETED FROM DB!");
        
        revalidatePath('/admin/abandoned-carts');
        revalidatePath('/admin', 'layout'); 

        return NextResponse.json({ 
            success: true, 
            message: 'Cart Purged' 
        }, { 
            headers: { 'Cache-Control': 'no-store, max-age=0' } 
        });

    } catch (error: any) {
        console.error("🔴 MONGODB CRASH:", error.message);
        return NextResponse.json({ success: false, message: 'Server Database Error' }, { status: 500 });
    }
}
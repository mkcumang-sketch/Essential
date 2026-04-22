import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        await connectDB();
        const resolvedParams = await params;
        
        const deletedProduct = await Product.findByIdAndDelete(resolvedParams.id);

        if (!deletedProduct) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        // 💥 CACHE NUKE: Iske bina bhoot wapas aayega
        revalidatePath('/Godmode/products');
        revalidatePath('/shop');
        revalidatePath('/collection');
        revalidatePath('/', 'layout'); 

        return NextResponse.json({ success: true, message: 'Product Deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error deleting product' }, { status: 500 });
    }
}
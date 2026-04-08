import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import User from '@/models/User'; // Adjust import if your model path is different

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // <-- Next.js 15 Promise Type
) {
    try {
        await connectDB();
        
        // 1. Params ko await karo (The Fix!)
        const resolvedParams = await params;
        
        // 2. Database se delete karo
        const deletedUser = await User.findByIdAndDelete(resolvedParams.id);

        if (!deletedUser) {
            return NextResponse.json({ success: false, message: 'VIP Member not found' }, { status: 404 });
        }

        // 3. THE NUKE: Next.js Cache flush
        revalidatePath('/admin/users');
        revalidatePath('/admin', 'layout');

        return NextResponse.json({ success: true, message: 'Member Records Purged' });
        
    } catch (error) {
        console.error('CRM Deletion Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to delete member' }, { status: 500 });
    }
}
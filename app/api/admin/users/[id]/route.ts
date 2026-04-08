import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        
        // 1. Database se delete karo
        const deletedUser = await User.findByIdAndDelete(params.id);

        if (!deletedUser) {
            return NextResponse.json({ success: false, message: 'VIP Member not found' }, { status: 404 });
        }

        // 2. THE NUKE: Next.js Cache ko jala do
        revalidatePath('/admin/users');
        revalidatePath('/admin', 'layout');

        return NextResponse.json({ success: true, message: 'Member Records Purged' });
        
    } catch (error) {
        console.error('CRM Deletion Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to delete member' }, { status: 500 });
    }
}
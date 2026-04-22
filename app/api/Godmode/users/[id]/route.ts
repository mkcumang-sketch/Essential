import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import User from '@/models/usertemp';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const noCacheHeaders = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
};

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        await connectDB();
        const resolvedParams = await params;
        
        const deletedUser = await User.findByIdAndDelete(resolvedParams.id);

        if (!deletedUser) {
            return NextResponse.json({ success: false, message: 'VIP Member not found' }, { status: 404, headers: noCacheHeaders });
        }

        revalidatePath('/Godmode/users');
        revalidatePath('/Godmode', 'layout');

        return NextResponse.json({ success: true, message: 'Client Records Purged' }, { headers: noCacheHeaders });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to delete client' }, { status: 500, headers: noCacheHeaders });
    }
}
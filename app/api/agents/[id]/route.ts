export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id: affiliateId } = await params;

        const Agent = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }));
        
        // 🚀 HARD DELETE FROM DB
        await Agent.findByIdAndDelete(affiliateId);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const affiliateId = params.id;

        const Agent = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }));
        
        // 🚀 HARD DELETE FROM DB
        await Agent.findByIdAndDelete(affiliateId);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
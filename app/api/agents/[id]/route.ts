import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// DB Connection
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// Handle DELETE request for Affiliate Partners
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        
        // Ensure Agent schema exists dynamically
        const Agent = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }));
        
        const affiliateId = params.id;

        if (!affiliateId) {
            return NextResponse.json({ success: false, error: "Affiliate ID is missing" }, { status: 400 });
        }

        // 🚀 Permanently delete from MongoDB
        await Agent.findByIdAndDelete(affiliateId);

        return NextResponse.json({ success: true, message: "Affiliate partner permanently removed." });

    } catch (error) {
        console.error("Affiliate Deletion Error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete affiliate" }, { status: 500 });
    }
}
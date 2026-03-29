import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Celebrity from '@/models/Celebrity';
import mongoose from 'mongoose';

// POST: Add new Celebrity
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, title, imageUrl, cloudinaryPublicId } = body;

        if (!name || !imageUrl) {
            return NextResponse.json({ success: false, error: "Name and Image are required." }, { status: 400 });
        }

        const celebrityModel = mongoose.models.Celebrity || Celebrity;
        const newCelebrity = await celebrityModel.create({
            name,
            title: title || "Global Ambassador",
            imageUrl,
            cloudinaryPublicId
        });

        return NextResponse.json({ success: true, data: newCelebrity });
    } catch (error) {
        console.error("Celebrity API Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// GET: Fetch all Celebrities
export async function GET() {
    try {
        await connectDB();
        const celebrityModel = mongoose.models.Celebrity || Celebrity;
        const celebs = await celebrityModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: celebs });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
// Add this at the bottom of the file
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;
        if (!id) return NextResponse.json({ success: false, error: "ID missing" });

        const Celebrity = mongoose.models.Celebrity || mongoose.model('Celebrity', new mongoose.Schema({}, { strict: false }));
        await Celebrity.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Ambassador Deleted from Database" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }
}
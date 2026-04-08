import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = true;
};

// Direct Model Definition
const Redirect = mongoose.models.Redirect || mongoose.model('Redirect', new mongoose.Schema({
    oldUrl: { type: String, required: true },
    newUrl: { type: String, required: true },
    isPermanent: { type: Boolean, default: true }, // 301 vs 302
    active: { type: Boolean, default: true }
}, { timestamps: true }));

export async function GET() {
    try {
        await connectDB();
        const redirects = await Redirect.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: redirects });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        // Ensure oldUrl starts with /
        if (body.oldUrl && !body.oldUrl.startsWith('/')) {
            body.oldUrl = '/' + body.oldUrl;
        }
        if (body.newUrl && !body.newUrl.startsWith('http') && !body.newUrl.startsWith('/')) {
            body.newUrl = '/' + body.newUrl;
        }

        const newRedirect = await Redirect.create(body);
        return NextResponse.json({ success: true, data: newRedirect });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to create redirect" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { id } = await req.json();
        await Redirect.findByIdAndDelete(id);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
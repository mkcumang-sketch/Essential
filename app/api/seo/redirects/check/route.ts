import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 💡 Direct Model Definition (No import needed - error fixed!)
const Redirect = mongoose.models.Redirect || mongoose.model('Redirect', new mongoose.Schema({}, { strict: false }));

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = true;
};

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const path = searchParams.get('path');

        if (!path) return NextResponse.json({ redirectUrl: null });

        await connectDB();

        // Check if there is an active redirect for this exact old URL
        const redirectRule: any= await Redirect.findOne({ oldUrl: path, active: true }).lean();

        if (redirectRule) {
            return NextResponse.json({ 
                redirectUrl: redirectRule.newUrl, 
                isPermanent: redirectRule.isPermanent 
            });
        }

        return NextResponse.json({ redirectUrl: null });

    } catch (error) {
        return NextResponse.json({ redirectUrl: null }, { status: 500 });
    }
}
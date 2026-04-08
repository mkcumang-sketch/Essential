import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import mongoose from 'mongoose';
import User from '@/models/User';

const connectDB = async () => {
    if (mongoose.connection.readyState < 1) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }
};

// 🛡️ GET SINGLE USER
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // 🚨 NEXT 15 FIX: Params is a Promise
) {
    try {
        await connectDB();
        const { id } = await params; // 🚨 MUST AWAIT

        const user = await User.findById(id).lean();
        if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// 🛡️ DELETE USER
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // 🚨 NEXT 15 FIX
) {
    try {
        await connectDB();
        const { id } = await params; // 🚨 MUST AWAIT

        const user = await User.findByIdAndDelete(id);
        if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

        revalidatePath('/', 'layout');
        revalidateTag('users', 'layout');
        return NextResponse.json({ success: true, message: "User deleted." });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
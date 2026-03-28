import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// DB Connection
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

// 🌟 Ensure User Model exists 🌟
const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = params.id;

        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
        }

        // 🚀 Hard delete user personal records from MongoDB 🚀
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ success: false, error: "User not found or already erased" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User data permanently erased." });

    } catch (error: any) {
        console.error("User Erasure API Error:", error);
        return NextResponse.json({ success: false, error: "Failed to erase user data" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        // 1. Check if user is legally logged in
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        const { phone } = await req.json();
        if (!phone || phone.length < 10) {
            return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
        }

        // 2. Connect to DB
        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

        // 3. Check if someone else is already using this phone number
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return NextResponse.json({ error: "This phone number is already registered!" }, { status: 400 });
        }

        // 4. Update the current user's phone number
        await User.findByIdAndUpdate((session.user as any).id, { phone });

        return NextResponse.json({ success: true, message: "Vault secured!" });

    } catch (error) {
        console.error("Update Phone Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
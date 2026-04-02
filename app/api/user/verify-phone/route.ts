export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, phone } = await req.json();

        if (!email || !phone) {
            return NextResponse.json({ success: false, error: "Email and Phone are required" }, { status: 400 });
        }

        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        // 🚨 THE RULE: 1 GMAIL = 1 PHONE 🚨
        // Pehle check karo ki kya ye phone number already kisi aur ke paas hai?
        const existingUserWithPhone = await User.findOne({ phone: phone });
        
        // Agar number mila, aur uska email is current email se alag hai -> ERROR!
        if (existingUserWithPhone && existingUserWithPhone.email !== email) {
            return NextResponse.json({ 
                success: false, 
                error: "This phone number is already linked to another Gmail account." 
            }, { status: 400 });
        }

        // Agar sab theek hai (number naya hai ya usi same user ka hai), toh save karo
        await User.findOneAndUpdate(
            { email: email },
            { phone: phone },
            { new: true, upsert: true } 
        );

        return NextResponse.json({ success: true, message: "Phone verified securely." });
    } catch (error: any) {
        // Handle MongoDB Duplicate Key Error (Code 11000) just in case
        if (error.code === 11000) {
             return NextResponse.json({ success: false, error: "This number is already registered." }, { status: 400 });
        }
        console.error("Phone Verification Error:", error);
        return NextResponse.json({ success: false, error: "Verification failed." }, { status: 500 });
    }
}
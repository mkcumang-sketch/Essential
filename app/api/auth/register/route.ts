import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, phone, password, referredBy } = await req.json();

        if (!name || !phone || !password) {
            return NextResponse.json({ success: false, error: "Please provide all required fields." }, { status: 400 });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return NextResponse.json({ success: false, error: "Phone number is already registered." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 🌟 EMPIRE REWARDS CODE GENERATOR 🌟
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        const myReferralCode = `EST-${name.substring(0, 3).toUpperCase()}${randomStr}`;

        // 🌟 THE BULLETPROOF FIX: Prevent MongoDB E11000 Duplicate Null Email Error 🌟
        const fallbackEmail = `${phone}@essential-guest.com`;

        await User.create({
            name,
            phone,
            email: fallbackEmail, // Fixes the crash!
            password: hashedPassword,
            role: 'USER',
            myReferralCode, 
            referredBy: referredBy || null, 
            walletPoints: 0,
            totalEarned: 0
        });

        return NextResponse.json({ success: true, message: "Vault Access Granted." }, { status: 201 });
    } catch (error: any) {
        console.error("Auth Engine Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
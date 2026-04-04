import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

// Helper to generate referral code
const generateReferralCode = (name: string) => {
    const prefix = name.split(' ')[0].toUpperCase().slice(0, 4).replace(/[^A-Z0-9]/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase().replace(/[^A-Z0-9]/g, '');
    return `ESS${prefix}${random}`.replace(/[^A-Z0-9]/g, '').substring(0, 8);
};

export async function POST(req: Request) {
    try {
        // Connect to MongoDB
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

        const body = await req.json();
        const { name, phone, password } = body;

        if (!name || !phone || !password) {
            return NextResponse.json({ success: false, error: "Please fill all fields" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return NextResponse.json({ success: false, error: "Account with this phone number already exists!" }, { status: 400 });
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in MongoDB
        await User.create({
            name,
            phone,
            password: hashedPassword,
            role: 'USER',
            myReferralCode: generateReferralCode(name),
            walletPoints: 500, // Welcome bonus
            totalEarned: 0,
            loyaltyTier: 'Silver Vault'
        });

        return NextResponse.json({ success: true, message: "Account created successfully!" }, { status: 201 });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json({ success: false, error: "Database error while creating account." }, { status: 500 });
    }
}
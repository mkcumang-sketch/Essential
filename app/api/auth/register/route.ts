import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose'; // 🔥 THE SUPERFAST ENGINE
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 🌟 USER SCHEMA
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String }, 
    role: { type: String, default: 'USER' }, 
    image: { type: String }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function POST(req: Request) {
    try {
        await connectDB(); // ⚡ Connects in Microseconds!
        
        const { name, phone, password } = await req.json();

        if (!name || !phone || !password) {
            return NextResponse.json({ success: false, error: "Please provide all fields." }, { status: 400 });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return NextResponse.json({ success: false, error: "Phone number already registered." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            phone,
            password: hashedPassword,
            role: 'USER'
        });

        return NextResponse.json({ success: true, message: "Account created securely." }, { status: 201 });
    } catch (error) {
        console.error("Auth Engine Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
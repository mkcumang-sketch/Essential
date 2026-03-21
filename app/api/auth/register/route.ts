import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 🌟 USER SCHEMA (For Clients & Admins)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String }, // Hashed password
    role: { type: String, default: 'USER' }, // USER or SUPER_ADMIN
    image: { type: String }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, phone, password } = await req.json();

        if (!name || !phone || !password) {
            return NextResponse.json({ success: false, error: "Please provide all fields." }, { status: 400 });
        }

        // Check if phone number already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return NextResponse.json({ success: false, error: "Phone number already registered." }, { status: 400 });
        }

        // 🛡️ SECURITY: Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            phone,
            password: hashedPassword,
            role: 'USER'
        });

        return NextResponse.json({ success: true, message: "Account created securely." }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
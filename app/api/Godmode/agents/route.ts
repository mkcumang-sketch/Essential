import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { UserBehavior } from '@/models/UserBehavior'; // Tera main user model
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await connectDB();
        
        // 1. Form se aane wala data pakdo
        const { name, email, code, commission, role } = await req.json();

        // 2. Validation: Koi field khali toh nahi chhod di?
        if (!name || !email || !code) {
            return NextResponse.json({ success: false, message: "Name, Email, and Unique Code are required." }, { status: 400 });
        }

        // 3. Check karo ki email ya code pehle se toh nahi hai
        const existingAgent = await UserBehavior.findOne({ 
            $or: [{ email: email }, { referralCode: code }] 
        });

        if (existingAgent) {
            return NextResponse.json({ success: false, message: "This Email or Code is already in use!" }, { status: 400 });
        }

        // 4. Random password bana do (Kyunki agent seedha apne link se track hoga, login ki zyada zaroorat nahi abhi)
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // 5. Database mein save kar do
        const newAgent = await UserBehavior.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role || 'Agent', 
            referralCode: code,
            commissionPercentage: Number(commission) || 5
        });

        return NextResponse.json({ 
            success: true, 
            message: "Partner Provisioned Successfully!" 
        });

    } catch (error: any) {
        console.error("Add Agent Error:", error);
        return NextResponse.json({ success: false, message: "Server Error while adding agent." }, { status: 500 });
    }
}
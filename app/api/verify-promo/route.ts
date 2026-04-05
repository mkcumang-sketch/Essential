import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

let isConnected = false;
const connectDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected || mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string, { maxPoolSize: 10 });
    isConnected = true;
};

// Flexible Schemas
const Agent = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }));
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', new mongoose.Schema({}, { strict: false }));

export async function POST(req: Request) {
    try {
        await connectDB();
        const { code } = await req.json();
        const upperCode = code.toUpperCase();

        // 1. Check if it's an Affiliate/Referral Code
        const agent = await Agent.findOne({ code: upperCode });
        if (agent) {
            // Assuming flat 10% off for referral codes
            return NextResponse.json({ success: true, type: 'referral', discountValue: 10, message: 'Referral code applied!' });
        }

        // 2. Check if it's a Marketing Coupon Code
        const coupon = await Coupon.findOne({ code: upperCode });
        if (coupon) {
            return NextResponse.json({ success: true, type: 'coupon', discountValue: Number(coupon.discountValue) || 0, message: 'Discount applied!' });
        }

        return NextResponse.json({ success: false, error: 'That code is not valid.' }, { status: 404 });

    } catch (error) {
        console.error("Promo Verify Error:", error);
        return NextResponse.json({ success: false, error: 'Something went wrong. Try again.' }, { status: 500 });
    }
}
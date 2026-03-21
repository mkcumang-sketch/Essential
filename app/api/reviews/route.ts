import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 🌟 1. DEFINE THE DATABASE SCHEMA (With Media & Visibility Support) 🌟
const reviewSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, default: 5 },
    product: { type: String, default: 'GLOBAL' },
    visibility: { type: String, default: 'pending' }, // 'public', 'pending', 'rejected'
    isAdminGenerated: { type: Boolean, default: false },
    media: { type: [String], default: [] }, // Array for Photos/Videos
    createdAt: { type: Date, default: Date.now }
});

// Avoid schema recompilation errors in Next.js
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

// 🌟 2. DATABASE CONNECTION HELPER 🌟
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("✅ MongoDB Connected for Reviews");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
};

// 🌟 3. GET REVIEWS (Smart Filtering for Admin vs Public) 🌟
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const isAdmin = searchParams.get('admin') === 'true';

        // THE MASTER LOGIC: 
        // If Admin requests -> Send ALL reviews (Pending, Public, Shadowbanned)
        // If Public Website requests -> Send ONLY 'public' reviews
        const query = isAdmin ? {} : { visibility: 'public' };

        const reviews = await Review.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: reviews });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
    }
}

// 🌟 4. POST NEW REVIEW (From Customer or Admin) 🌟
export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const newReview = await Review.create({
            userName: body.userName,
            comment: body.comment,
            rating: body.rating,
            product: body.product || 'GLOBAL',
            visibility: body.visibility || 'pending', // Defaults to pending
            isAdminGenerated: body.isAdminGenerated || false,
            media: body.media || [] // Saves Cloudinary URLs
        });

        return NextResponse.json({ success: true, data: newReview });
    } catch (error) {
        console.error("POST Review Error:", error);
        return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 });
    }
}

// 🌟 5. PATCH REVIEW (Godmode Approval / Shadowban) 🌟
export async function PATCH(req: Request) {
    try {
        await connectDB();
        const { reviewId, visibility } = await req.json();

        if (!reviewId || !visibility) {
            return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId, 
            { visibility }, 
            { new: true }
        );

        return NextResponse.json({ success: true, data: updatedReview });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, default: 5 },
    product: { type: String, default: 'GLOBAL' },
    visibility: { type: String, default: 'pending' }, 
    isAdminGenerated: { type: Boolean, default: false },
    media: { type: [String], default: [] }, 
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try { await mongoose.connect(process.env.MONGODB_URI as string); } catch (error) {}
};

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const isAdmin = searchParams.get('admin') === 'true';
        const query = isAdmin ? {} : { visibility: 'public' };
        const reviews = await Review.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: reviews });
    } catch (error) { return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 }); }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // 🌟 BOT CHECK: If honeyPot is filled, it's a bot!
        if (body.honeyPot && body.honeyPot.length > 0) {
            console.log("[SECURITY] Bot submission blocked via Honeypot.");
            return NextResponse.json({ success: false, message: "Security Check Failed" }, { status: 400 });
        }

        const newReview = await Review.create({
            userName: body.userName, 
            comment: body.comment, 
            rating: body.rating, 
            product: body.product || 'GLOBAL',
            visibility: 'pending', 
            isAdminGenerated: body.isAdminGenerated || false, 
            media: body.media || [] 
        });

        return NextResponse.json({ success: true, data: newReview });
    } catch (error) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function PATCH(req: Request) {
    try {
        await connectDB();
        const { reviewId, visibility } = await req.json();
        if (!reviewId || !visibility) return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
        const updatedReview = await Review.findByIdAndUpdate(reviewId, { visibility }, { new: true });
        return NextResponse.json({ success: true, data: updatedReview });
    } catch (error) { return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 500 }); }
}
// Add this at the bottom of the file
export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;
        if (!id) return NextResponse.json({ success: false, error: "ID missing" });

        const Review = mongoose.models.Review || mongoose.model('Review', new mongoose.Schema({}, { strict: false }));
        await Review.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Review Deleted from Database" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }
}
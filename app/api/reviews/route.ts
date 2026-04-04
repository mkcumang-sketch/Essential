import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 🌟 1. BULLETPROOF DB CONNECTION
let isConnected = false;
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) return;
    try { 
        await mongoose.connect(process.env.MONGODB_URI as string); 
        isConnected = true;
    } catch (error) {
        console.error("❌ MongoDB Connection Error (Reviews):", error);
    }
};

// 🌟 2. SCHEMA DEFINITION
const reviewSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userId: { type: String, index: true, sparse: true },
    comment: { type: String, required: true },
    rating: { type: Number, default: 5 },
    product: { type: String, default: 'GLOBAL' },
    visibility: { type: String, default: 'pending' }, 
    isAdminGenerated: { type: Boolean, default: false },
    media: { type: [String], default: [] }, 
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

// 🌟 3. STRICT SECURITY VERIFICATION (MILITARY GRADE)
const isSuperAdminRequest = async (req: NextRequest) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    return token && (token as any).role === 'SUPER_ADMIN';
};

// ==========================================
// 🚀 API ROUTES
// ==========================================

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const wantsAdminView = searchParams.get('admin') === 'true';

        if (wantsAdminView) {
            if (!(await isSuperAdminRequest(req))) {
                console.log("🚨 Unauthorized Admin Review Access Blocked!");
                return NextResponse.json({ success: false, error: 'Forbidden Access' }, { status: 403 });
            }
        }

        const query = wantsAdminView ? {} : { visibility: 'public' };
        const reviews = await Review.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: reviews });
    } catch (error) { 
        console.error("GET Reviews Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 }); 
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        if (body.honeyPot && body.honeyPot.length > 0) {
            console.log("🛡️ [SECURITY] Bot submission blocked via Honeypot.");
            return NextResponse.json({ success: false, message: "Security Check Failed" }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Sign in required to submit a review" },
                { status: 401 }
            );
        }

        const userName =
            typeof body.userName === "string" && body.userName.trim()
                ? body.userName.trim()
                : session.user?.name || "Member";

        const newReview = await Review.create({
            userName,
            userId,
            comment: String(body.comment || "").slice(0, 8000),
            rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
            product: body.product || "GLOBAL",
            visibility: "pending",
            isAdminGenerated: Boolean(session && (session.user as { role?: string }).role === "SUPER_ADMIN" && body.isAdminGenerated),
            media: Array.isArray(body.media) ? body.media : [],
        });

        return NextResponse.json({ success: true, data: newReview });
    } catch (error) { 
        console.error("POST Review Error:", error);
        return NextResponse.json({ success: false }, { status: 500 }); 
    }
}

export async function PATCH(req: NextRequest) {
    try {
        if (!(await isSuperAdminRequest(req))) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
        await connectDB();
        const { reviewId, visibility } = await req.json();
        
        if (!reviewId || !visibility) {
            return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
        }
        
        const updatedReview = await Review.findByIdAndUpdate(reviewId, { visibility }, { new: true });
        return NextResponse.json({ success: true, data: updatedReview });
    } catch (error) { 
        console.error("PATCH Review Error:", error);
        return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 500 }); 
    }
}

export async function DELETE(req: NextRequest) {
    try {
        if (!(await isSuperAdminRequest(req))) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }
        await connectDB();
        
        const body = await req.json();
        const { id } = body;
        
        if (!id) return NextResponse.json({ success: false, error: "ID missing" }, { status: 400 });

        await Review.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Review permanently deleted from Vault" });
    } catch (error) {
        console.error("DELETE Review Error:", error);
        return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }
}
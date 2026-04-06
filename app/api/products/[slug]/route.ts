import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 🛡️ DATABASE CONNECTION HELPER
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    await mongoose.connect(process.env.MONGODB_URI);
};

// 📦 PRODUCT MODEL (Using existing or creating new)
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        // 1. SECURITY CHECK: Only SUPER_ADMIN can patch products
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 403 });
        }

        // 2. CONNECT DATABASE
        await connectDB();

        // 3. RESOLVE PARAMS (Next.js 15 requirement)
        const resolvedParams = await params;
        const slug = resolvedParams.slug;

        if (!slug) {
            return NextResponse.json({ success: false, error: "Product identifier is missing." }, { status: 400 });
        }

        // 4. PARSE REQUEST BODY
        const dataToUpdate = await req.json();

        // 5. UPDATE IN MONGODB
        // First try: Update by MongoDB _id
        let updatedProduct = null;
        
        if (mongoose.Types.ObjectId.isValid(slug)) {
            updatedProduct = await Product.findByIdAndUpdate(
                slug,
                { $set: dataToUpdate },
                { new: true }
            );
        }

        // Fallback: Update by custom 'id' field or 'slug'
        if (!updatedProduct) {
            updatedProduct = await Product.findOneAndUpdate(
                { $or: [{ id: slug }, { slug: slug }] },
                { $set: dataToUpdate },
                { new: true }
            );
        }

        // 6. CHECK IF PRODUCT WAS FOUND
        if (!updatedProduct) {
            return NextResponse.json({ 
                success: false, 
                error: "Timepiece not found in the vault." 
            }, { status: 404 });
        }

        // 7. SUCCESS RESPONSE
        return NextResponse.json({ 
            success: true, 
            message: "Vault updated successfully.",
            product: updatedProduct 
        });

    } catch (error: any) {
        console.error("PATCH Route Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || "Internal Server Error" 
        }, { status: 500 });
    }
}

// 🚨 PREVENT UNAUTHORIZED METHODS
export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
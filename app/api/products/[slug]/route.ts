import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        if (!process.env.MONGODB_URI) {
            return NextResponse.json({ success: false, error: "Database is not connected." }, { status: 500 });
        }

        await connectDB();
        
        const { slug } = await params;
        
        if (!slug) {
            return NextResponse.json({ success: false, error: "Product ID missing in URL" }, { status: 400 });
        }

        const dataToUpdate = await req.json();
        
        // 3. Update in MongoDB
        let updatedProduct = await Product.findByIdAndUpdate(
            slug, 
            { $set: dataToUpdate }, 
            { new: true }
        );

        // 4. Fallback Update
        if (!updatedProduct) {
            updatedProduct = await Product.findOneAndUpdate(
                { $or: [{ id: slug }, { slug: slug }] },
                { $set: dataToUpdate },
                { new: true }
            );
        }

        if (!updatedProduct) {
            return NextResponse.json({ success: false, error: "We could not find that watch." }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updatedProduct });

    } catch (error: any) {
        console.error("Update Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

// 🚨 Any type lagaya taaki TypeScript pareshan na kare
export async function PATCH(req: Request, { params }: { params: any }) {
    try {
        if (!process.env.MONGODB_URI) {
            return NextResponse.json({ success: false, error: "Database is not connected." }, { status: 500 });
        }

        await connectDB();
        
        // 🚨 THE FIX: Next.js 15 requires AWAITING params! (Dabbe ko kholna zaroori hai)
        const resolvedParams = await params;
        const slug = resolvedParams.slug;
        
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
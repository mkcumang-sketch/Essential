import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
};

const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
    try {
        // 1. Check if Vercel has MongoDB URI
        if (!process.env.MONGODB_URI) {
            return NextResponse.json({ success: false, error: "MONGODB_URI missing in Vercel" }, { status: 500 });
        }

        await connectDB();
        
        // 2. Check if slug exists
        const slug = params?.slug;
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

        // 4. Fallback (Agar ID ki jagah string ho)
        if (!updatedProduct) {
            updatedProduct = await Product.findOneAndUpdate(
                { $or: [{ id: slug }, { slug: slug }] },
                { $set: dataToUpdate },
                { new: true }
            );
        }

        if (!updatedProduct) {
            return NextResponse.json({ success: false, error: `Product ID [${slug}] not found in DB` }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updatedProduct });

    } catch (error: any) {
        console.error("Update Error:", error);
        return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
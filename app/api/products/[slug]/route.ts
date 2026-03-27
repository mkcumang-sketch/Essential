import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Database Connection
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is missing");
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
};

const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

// 🚨 YAHAN CHANGE HAI: params: { slug: string }
export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
    try {
        await connectDB();
        
        const dataToUpdate = await req.json();
        
        // 🚨 YAHAN BHI CHANGE HAI: params.slug
        const updatedProduct = await Product.findByIdAndUpdate(
            params.slug, 
            { $set: dataToUpdate }, 
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ success: false, error: "Product not found in database" }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updatedProduct });

    } catch (error) {
        console.error("Product Update Error:", error);
        return NextResponse.json({ success: false, error: "Server Error while saving" }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Database Connection
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is missing in .env");
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
};

// Define Schema (Strict: false taaki SEO jaisa naya data aaram se save ho jaye)
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

// PATCH METHOD: Updates existing product data
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        
        // Frontend se jo naya SEO data aaya hai
        const dataToUpdate = await req.json();
        
        // Database mein product dhoondo aur update karo
        const updatedProduct = await Product.findByIdAndUpdate(
            params.id, 
            { $set: dataToUpdate }, 
            { new: true } // Ye true rakhne se updated data wapas milta hai
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
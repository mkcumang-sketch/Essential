import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = true;
};

// Define Schema inline to avoid import issues
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const dataToUpdate = await req.json();
        
        const updatedProduct = await Product.findByIdAndUpdate(
            params.id, 
            { $set: dataToUpdate }, 
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, product: updatedProduct });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
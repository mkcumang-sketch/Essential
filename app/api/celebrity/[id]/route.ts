import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Celebrity from '@/models/Celebrity';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// PUT: Edit existing Celebrity
export async function PUT(req: Request, { params }: { params: { id: String } }) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, title, imageUrl, cloudinaryPublicId, oldCloudinaryPublicId } = body;
        const celebrityModel = mongoose.models.Celebrity || Celebrity;

        const celeb = await celebrityModel.findById(params.id);
        if (!celeb) return NextResponse.json({ success: false, error: "Celebrity not found." }, { status: 404 });

        // Force delete old image if new upload happened
        if (oldCloudinaryPublicId) {
            await cloudinary.uploader.destroy(oldCloudinaryPublicId);
        }

        celeb.name = name;
        celeb.title = title;
        celeb.imageUrl = imageUrl;
        celeb.cloudinaryPublicId = cloudinaryPublicId;
        await celeb.save();

        return NextResponse.json({ success: true, data: celeb });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: Deletes Celebrity (Removes DB entry AND Cloudinary image)
export async function DELETE(req: Request, { params }: { params: { id: String } }) {
    try {
        await connectDB();
        const celebrityModel = mongoose.models.Celebrity || Celebrity;
        const celeb = await celebrityModel.findByIdAndDelete(params.id);
        if (!celeb) return NextResponse.json({ success: false, error: "Celebrity not found." }, { status: 404 });
        
        if (celeb.cloudinaryPublicId) {
            await cloudinary.uploader.destroy(celeb.cloudinaryPublicId);
        }

        return NextResponse.json({ success: true, message: "Celebrity and asset removed." });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
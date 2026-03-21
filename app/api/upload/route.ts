import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// 🛡️ CONNECTING TO CLOUDINARY VAULT
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file = data.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ success: false, error: 'No media payload detected' }, { status: 400 });
        }

        // Convert file into a Node.js Buffer for secure stream upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 🌟 THE LUXURY ENGINE: Forcing High-Res processing
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'essential_vault', // Organized folder in your Cloudinary
                    quality: 'auto:best',      // 🔥 Forces pristine 4K clarity without artifacts
                    fetch_format: 'auto',      // 🔥 Automatically converts to WebP/AVIF for lightning-fast loading
                    flags: 'lossy'             // Ensures sharp edges on metallic/shiny surfaces (Watches)
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // Return the ultra-optimized secure URL to Godmode/Frontend
        return NextResponse.json({ success: true, url: (result as any).secure_url });
        
    } catch (error) {
        console.error("Media Engine Error:", error);
        return NextResponse.json({ success: false, error: 'Failed to process media asset' }, { status: 500 });
    }
}
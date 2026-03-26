import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// 🌟 CLOUDINARY CONFIGURATION 🌟
// Ensure your .env variables exactly match these names
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file received.' }, { status: 400 });
    }

    // Convert the File to a Buffer for Cloudinary stream
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary via Stream
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'essential_rush', // Cloudinary mein is naam ka folder ban jayega
          resource_type: 'auto',    // 'auto' zaroori hai taaki Images AND Videos dono upload ho sakein
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(buffer);
    });

    // Cloudinary ne secure URL de diya
    return NextResponse.json({ 
        success: true, 
        url: result.secure_url 
    });

  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
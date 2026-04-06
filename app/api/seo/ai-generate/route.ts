import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        const { name, description, type = 'product', brand = 'Essential', category = 'Fine Horology' } = await req.json();

        const productName = name || 'Luxury Timepiece';
        
        // 1. SMART TITLE GENERATOR (Premium Tone)
        const titles = [
            `${productName} | Exclusive ${category} | ${brand}`,
            `Buy ${productName} - Luxury ${category} | ${brand}`,
            `${brand} ${productName} | Masterpiece of Horology`
        ];
        const metaTitle = titles[Math.floor(Math.random() * titles.length)];

        // 2. SMART DESCRIPTION GENERATOR (Luxury Tone)
        const metaDescription = `Discover the exclusive ${productName} by ${brand}. A true masterpiece of ${category.toLowerCase()}, featuring exquisite craftsmanship and unparalleled elegance. Secure your luxury acquisition today.`;

        // 3. SMART KEYWORD GENERATOR
        const focusKeyword = `${brand} ${productName}`;

        // 4. Send exactly what the UI expects
        const seoData = {
            metaTitle,
            metaDescription,
            focusKeyword
        };

        // Artificial delay of 1 second so the UI shows the cool loading animation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return NextResponse.json({ success: true, data: seoData });

    } catch (error: any) {
        console.error("Local SEO Generation Error:", error);
        return NextResponse.json({ success: false, error: "Failed to generate SEO data locally." }, { status: 500 });
    }
}
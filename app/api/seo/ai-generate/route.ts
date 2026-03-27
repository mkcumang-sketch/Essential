import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { name, description, type = 'product', brand, category } = await req.json();

        // 1. Check if Key exists in Vercel
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ success: false, error: "GEMINI_API_KEY is missing in Vercel Variables!" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
        You are a world-class luxury SEO copywriter for an ultra-premium watch brand called "Essential".
        Task: Generate highly converting, SEO-optimized metadata for the following ${type}.
        
        Entity Details:
        Name: ${name || 'Luxury Timepiece'}
        Brand: ${brand || 'Essential'}
        Category: ${category || 'Fine Horology'}
        Description: ${description || 'A masterpiece of meticulous craftsmanship.'}

        Strict Constraints:
        1. metaTitle: Must be between 40-60 characters. Tone: Ultra-premium, exclusive. Must include the brand name.
        2. metaDescription: Must be between 120-155 characters. Drive curiosity, emphasize luxury/heritage, and include a subtle call to action.
        3. focusKeyword: 1-3 words maximum. The single most relevant search term for ranking.

        Output MUST be strictly a raw JSON object (no markdown, no backticks). Format:
        {
            "metaTitle": "string",
            "metaDescription": "string",
            "focusKeyword": "string"
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const seoData = JSON.parse(cleanJson);

        return NextResponse.json({ success: true, data: seoData });

    } catch (error: any) {
        console.error("AI SEO Generation Error:", error);
        // Ab agar fail hoga, toh exact reason alert mein dikhega!
        return NextResponse.json({ success: false, error: error.message || "Failed to parse AI response" }, { status: 500 });
    }
}
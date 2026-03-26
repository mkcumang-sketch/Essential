    import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { name, description, type = 'product', brand, category } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ success: false, error: "GEMINI_API_KEY is missing in .env" }, { status: 500 });
        }

        // Initialize Gemini AI (Using flash for instant response time)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // 🎯 THE LUXURY PROMPT ENGINEERING
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
        
        // Clean up formatting in case AI returns markdown ticks (```json)
        const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const seoData = JSON.parse(cleanJson);

        return NextResponse.json({ success: true, data: seoData });

    } catch (error) {
        console.error("AI SEO Generation Error:", error);
        return NextResponse.json({ success: false, error: "Failed to generate AI content" }, { status: 500 });
    }
}
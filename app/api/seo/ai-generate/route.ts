import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { name, description, type = 'product', brand, category } = await req.json();

        // 1. API Key Check
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ success: false, error: "GEMINI_API_KEY is missing in Vercel Variables!" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // 2. The Prompt
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

        let responseText = "";

        // ==========================================
        // 🛡️ BULLETPROOF AI FALLBACK ENGINE
        // ==========================================
        try {
            // Attempt 1: Newest Flash Model
            const model1 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result1 = await model1.generateContent(prompt);
            responseText = result1.response.text();
        } catch (err1) {
            console.log("Model 1.5-flash failed, trying 1.5-pro...");
            try {
                // Attempt 2: Premium Pro Model
                const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
                const result2 = await model2.generateContent(prompt);
                responseText = result2.response.text();
            } catch (err2) {
                console.log("Model 1.5-pro failed, trying 1.0-pro...");
                // Attempt 3: Legacy Stable Model (Guaranteed to work)
                const model3 = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
                const result3 = await model3.generateContent(prompt);
                responseText = result3.response.text();
            }
        }
        // ==========================================

        // Clean up formatting
        const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const seoData = JSON.parse(cleanJson);

        return NextResponse.json({ success: true, data: seoData });

    } catch (error: any) {
        console.error("AI SEO Generation Error:", error);
        return NextResponse.json({ success: false, error: error.message || "All AI models failed to generate content." }, { status: 500 });
    }
}
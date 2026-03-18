import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// 🚨 ENTERPRISE AI SERVICE (Requires OpenAI / Gemini API Key in .env)
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    // Security: Only SUPER_ADMIN can use company's AI credits
    if (session?.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "Access Denied. Tier 1 Clearance Required." }, { status: 403 });
    }

    const { productName, brand, type } = await req.json();

    let systemPrompt = "";
    if (type === 'description') {
      systemPrompt = `Write a 3-line ultra-luxury, highly converting product description for a ${brand} product named ${productName}. Tone: Apple/Rolex style. No cheap words like 'discount' or 'hurry'.`;
    } else if (type === 'seo') {
      systemPrompt = `Generate 10 high-volume SEO keywords and a 150-character meta description for a luxury product named ${productName} by ${brand}. Return in strict JSON format: {"keywords": [], "metaDesc": ""}`;
    }

    // Example using OpenAI API (Replace with your preferred AI provider)
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Fast and cost-effective
        messages: [{ role: "system", content: systemPrompt }]
      })
    });

    const data = await aiResponse.json();
    const resultText = data.choices[0].message.content;

    return NextResponse.json({ success: true, result: resultText });

  } catch (error) {
    console.error("AI Core Offline:", error);
    return NextResponse.json({ error: "AI Engine Failed" }, { status: 500 });
  }
}
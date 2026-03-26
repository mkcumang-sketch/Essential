import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = true;
};

const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).lean();

        let totalIndexed = 0;
        let missingMetaTitle = 0;
        let missingMetaDesc = 0;
        let missingAltText = 0;
        let totalScore = 0;
        let needsAttention: any[] = [];

        products.forEach((p: any) => {
            const seo = p.seo || {};
            
            if (!seo.noindex) totalIndexed++;

            let hasIssue = false;
            let score = 100;

            // Check Title
            if (!seo.metaTitle || seo.metaTitle.length < 30) {
                missingMetaTitle++;
                score -= 20;
                hasIssue = true;
            }

            // Check Description
            if (!seo.metaDescription || seo.metaDescription.length < 100) {
                missingMetaDesc++;
                score -= 20;
                hasIssue = true;
            }

            // Check Alt Text
            const imageCount = [p.imageUrl, ...(p.images || [])].filter(Boolean).length;
            const altTextCount = Object.keys(seo.imageAltTexts || {}).length;
            if (imageCount > altTextCount) {
                missingAltText++;
                score -= 10;
                hasIssue = true;
            }

            totalScore += Math.max(0, score);

            if (hasIssue || score < 80) {
                needsAttention.push({
                    id: p._id,
                    name: p.name,
                    slug: p.slug || p._id,
                    score: Math.max(0, score),
                    issues: {
                        title: !seo.metaTitle,
                        desc: !seo.metaDescription,
                        alt: imageCount > altTextCount
                    }
                });
            }
        });

        const avgScore = products.length > 0 ? Math.round(totalScore / products.length) : 0;

        return NextResponse.json({
            success: true,
            data: {
                totalIndexed,
                missingMetaTitle,
                missingMetaDesc,
                missingAltText,
                avgScore,
                needsAttention: needsAttention.slice(0, 10) // Top 10 issues
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: "SEO Analytics Failed" }, { status: 500 });
    }
}
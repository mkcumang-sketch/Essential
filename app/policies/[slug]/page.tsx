import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import CmsConfig from '@/models/CmsConfig'; 

// 🌟 THE MAGIC FIX: Forces Next.js to ALWAYS fetch fresh data from the Database 🌟
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPolicyData(slug: string) {
    try {
        await connectDB();
        const CmsModel = mongoose.models.CmsConfig || CmsConfig;
        const config = await CmsModel.findOne({});
        
        if (!config || !config.legalPages) return null;
        
        // Anti-Bug Matching: Converts both to lowercase and removes accidental hidden spaces
        const targetSlug = slug.toLowerCase().trim();
        
        return config.legalPages.find((page: any) => 
            page.slug?.toLowerCase().trim() === targetSlug
        );
    } catch (error) {
        console.error("Failed to fetch policy:", error);
        return null;
    }
}

export default async function DynamicPolicyPage({ params }: { params: { slug: string } }) {
    const pageData = await getPolicyData(params.slug);

    if (!pageData) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center pt-20">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-8"></div>
                <h1 className="text-3xl font-serif mb-4 text-black">Page Not Found</h1>
                <p className="text-gray-500 mb-8 max-w-sm text-center">
                    This policy document does not exist, or you might need to check the exact spelling of the URL link in Godmode.
                </p>
                <Link href="/" className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-colors">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-gray-400 hover:text-black mb-10 transition-colors w-max">
                    <ArrowLeft size={16}/> Back to Store
                </Link>
                
                <h1 className="text-4xl md:text-6xl font-serif mb-10 border-b border-gray-200 pb-8 tracking-tighter text-black">
                    {pageData.title}
                </h1>
                
                <div 
                    className="prose prose-lg max-w-none text-gray-600 prose-headings:font-serif prose-headings:text-black prose-a:text-[#D4AF37] prose-strong:text-black"
                    dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
            </div>
        </div>
    );
}
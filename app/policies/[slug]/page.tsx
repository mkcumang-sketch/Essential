import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import CmsConfig from '@/models/CmsConfig'; // Adjust path if your model is elsewhere

// 🌟 THIS FILE MAGICALLY CREATES PAGES BASED ON ADMIN PANEL SLUGS 🌟

async function getPolicyData(slug: string) {
    await connectDB();
    const CmsModel = mongoose.models.CmsConfig || CmsConfig;
    const config = await CmsModel.findOne({});
    
    if (!config || !config.legalPages) return null;
    
    // Find the exact page that matches the URL slug
    return config.legalPages.find((page: any) => page.slug === slug);
}

export default async function DynamicPolicyPage({ params }: { params: { slug: string } }) {
    const pageData = await getPolicyData(params.slug);

    if (!pageData) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center pt-20">
                <h1 className="text-3xl font-serif mb-4">Page Not Found</h1>
                <p className="text-gray-500 mb-8">This policy document does not exist or was removed.</p>
                <Link href="/" className="px-6 py-3 bg-black text-white text-xs font-bold rounded-full">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-10">
                    <ArrowLeft size={16}/> Back to Store
                </Link>
                
                <h1 className="text-4xl md:text-5xl font-serif mb-10 border-b border-gray-200 pb-6">
                    {pageData.title}
                </h1>
                
                {/* Renders the HTML saved from the Admin Panel */}
                <div 
                    className="prose prose-lg max-w-none text-gray-600 prose-headings:font-serif prose-headings:text-black prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
            </div>
        </div>
    );
}
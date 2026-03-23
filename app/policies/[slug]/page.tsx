import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, AlertTriangle } from 'lucide-react';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';
import CmsConfig from '@/models/CmsConfig'; 

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 🌟 SMART FETCHER: Brings back the page AND debug info 🌟
async function getPolicyData(rawSlug: string) {
    try {
        await connectDB();
        
        // Vercel strict model binding
        const CmsModel = mongoose.models.CmsConfig || CmsConfig;
        const config = await CmsModel.findOne({});
        
        // Clean the slug (Removes weird URL encoding like %20)
        const targetSlug = decodeURIComponent(rawSlug).toLowerCase().trim();
        
        if (!config || !config.legalPages) {
            return { error: "CMS_EMPTY", targetSlug, availableSlugs: [] };
        }
        
        const availableSlugs = config.legalPages.map((p: any) => p.slug?.toLowerCase().trim());
        const foundPage = config.legalPages.find((page: any) => 
            page.slug?.toLowerCase().trim() === targetSlug
        );

        if (!foundPage) {
            return { error: "NOT_FOUND", targetSlug, availableSlugs };
        }

        return { success: true, data: foundPage };

    } catch (error: any) {
        console.error("Policy Fetch Error:", error);
        return { error: "DB_ERROR", details: error.message };
    }
}

export default async function DynamicPolicyPage({ params }: { params: { slug: string } }) {
    const result = await getPolicyData(params.slug);

    // 🚨 IF SOMETHING FAILS, WE SHOW EXACTLY WHY ON THE SCREEN 🚨
    if (!result || result.error) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center pt-20 px-6 font-sans">
                <AlertTriangle size={60} className="text-red-500 mb-6" />
                <h1 className="text-4xl font-serif mb-4 text-black text-center">Page Not Found (Diagnostic Mode)</h1>
                
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm max-w-xl w-full mb-8">
                    <p className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest border-b pb-2">Error Details:</p>
                    
                    {result?.error === "DB_ERROR" && (
                        <p className="text-red-500 text-sm">Database Connection Failed: {result.details}</p>
                    )}
                    
                    {result?.error === "CMS_EMPTY" && (
                        <p className="text-orange-500 text-sm">Database connected, but no Legal Pages found in the CMS. Please save a page in Godmode first.</p>
                    )}

                    {result?.error === "NOT_FOUND" && (
                        <div className="space-y-3">
                            <p className="text-gray-600 text-sm">The URL you clicked does not match any saved policy.</p>
                            <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                                <span className="font-bold text-black">You requested:</span> "{result.targetSlug}"
                            </p>
                            <div className="text-xs font-mono bg-green-50 p-2 rounded text-green-700">
                                <span className="font-bold">Available in Database:</span> 
                                <ul className="list-disc pl-4 mt-1">
                                    {result.availableSlugs.length > 0 
                                        ? result.availableSlugs.map((s: string, i: number) => <li key={i}>"{s}"</li>)
                                        : <li>None</li>
                                    }
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <Link href="/godmode" className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-colors">
                    Go to Godmode to Fix
                </Link>
            </div>
        );
    }

    // ✅ IF SUCCESSFUL, SHOW THE PREMIUM PAGE ✅
    const pageData = result.data;

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
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function PolicyPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    
    const [pageData, setPageData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                // Cache bust karke latest CMS data mangwao
                const res = await fetch(`/api/cms?t=${new Date().getTime()}`);
                const json = await res.json();
                
                if (json.data && json.data.legalPages) {
                    // Slug match karo
                    const foundPage = json.data.legalPages.find((p: any) => p.slug === slug);
                    setPageData(foundPage || null);
                }
            } catch (error) {
                console.error("Failed to fetch policy:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) fetchPolicy();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ERROR STATE: Page Not Found (Jo aapko screenshot mein aa raha tha)
    if (!pageData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] text-center p-6">
                <AlertTriangle size={60} className="text-red-400 mb-6" strokeWidth={1}/>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-black mb-4">Page Not Found</h1>
                <p className="text-gray-500 max-w-md mb-8">
                    The document "<span className="font-bold text-black">{slug}</span>" does not exist in the database. Please check your Admin Panel.
                </p>
                <Link href="/" className="px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-all">
                    Return Home
                </Link>
            </div>
        );
    }

    // SUCCESS STATE: Render the Policy
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black pt-32 pb-20">
            <div className="max-w-[1000px] mx-auto px-6 md:px-12">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-12 transition-colors">
                    <ArrowLeft size={16} /> Back
                </button>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-12 border-b border-gray-200 pb-8">
                        {pageData.title}
                    </h1>
                    
                    {/* Render HTML content safely */}
                    <div 
                        className="prose prose-lg max-w-none text-gray-700 font-sans leading-relaxed
                                   prose-headings:font-serif prose-headings:font-bold prose-headings:text-black
                                   prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: pageData.content }} 
                    />
                </motion.div>
            </div>
        </div>
    );
}
import React from 'react';
import { ShieldCheck, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// 🌟 1. DATA FETCHER (Reads direct from your MongoDB/CMS via API) 🌟
async function getPolicyData(slug: string) {
    try {
        // Vercel auto-detect URL or fallback to localhost
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
        
        // Fetch CMS data completely fresh (no cache) to ensure Admin updates reflect instantly
        const res = await fetch(`${baseUrl}/api/cms`, { cache: 'no-store' });
        
        if (!res.ok) return null;
        
        const responseData = await res.json();
        const legalPages = responseData?.data?.legalPages || [];
        
        // Find the specific page that matches the URL slug
        const policy = legalPages.find((p: any) => p.slug === slug);
        
        return policy || null;
    } catch (error) {
        console.error("Failed to fetch policy:", error);
        return null;
    }
}

// 🌟 2. THE DYNAMIC PAGE GENERATOR (Next.js 15 Ready) 🌟
export default async function DynamicPolicyPage({ params }: { params: Promise<{ slug: string }> }) {
    
    // 🛠️ THE FIX: Next.js 15 requires awaiting the params before using them
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Fetch the data for this specific slug
    const policyData = await getPolicyData(slug);

    // 🛑 ERROR FALLBACK: If admin hasn't created the page yet or link is broken
    if (!policyData) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 font-sans">
                <AlertTriangle size={60} className="text-red-500 mb-6 opacity-80 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4 tracking-tighter">Page Not Found</h1>
                <p className="text-gray-500 mb-8 text-center max-w-md">The document "{slug}" does not exist in the database. Please check your Admin Panel.</p>
                <Link href="/" className="px-8 py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[4px] hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl">
                    Return Home
                </Link>
            </div>
        );
    }

    // ✅ SUCCESS: Render the page generated dynamically from Godmode
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black font-sans selection:bg-[#D4AF37] selection:text-black">
            
            {/* 🌟 HEADER 🌟 */}
            <header className="py-6 px-6 md:px-16 border-b border-gray-200 bg-white sticky top-0 z-50 flex items-center justify-between shadow-sm">
                <Link href="/" className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[3px] text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft size={16} /> Back to Store
                </Link>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-green-600" />
                    <span className="text-[9px] font-black uppercase tracking-[4px] text-gray-400 hidden sm:inline-block">Verified Document</span>
                </div>
            </header>

            {/* 🌟 CONTENT AREA (Matches Minimalist Theme) 🌟 */}
            <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[5px] mb-4">Legal Protocol</p>
                <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 text-black">{policyData.title}</h1>
                <div className="w-24 h-1.5 bg-[#D4AF37] mb-16"></div>
                
                {/* Dynamically injecting the HTML text written by Admin in Godmode */}
                <article 
                    className="prose prose-lg prose-gray max-w-none text-gray-700 leading-loose prose-headings:font-serif prose-headings:font-bold prose-headings:text-black prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline prose-p:mb-6"
                    dangerouslySetInnerHTML={{ __html: policyData.content }} 
                />
            </main>
            
            {/* 🌟 SIMPLE FOOTER 🌟 */}
            <footer className="bg-black text-white py-12 border-t-[8px] border-[#D4AF37] text-center">
                 <p className="text-[10px] font-black uppercase tracking-[6px] text-gray-500">© 2026 ESSENTIAL RUSH. SECURE SYSTEM.</p>
            </footer>
        </div>
    );
}
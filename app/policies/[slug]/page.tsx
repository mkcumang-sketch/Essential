"use client";

import { notFound } from 'next/navigation';
import Footer from '@/components/Footer'; // Aapka jo main footer component hai

export default async function PolicyPage({ params }: { params: any }) {
    const { slug } = await params;
    let policyData = null;

    try {
        // Backend API se page ka content uthana
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/cms`, { cache: 'no-store' });
        const data = await res.json();
        const legalPages = data?.data?.legalPages || [];
        policyData = legalPages.find((p: any) => p.slug === slug);
    } catch (e) {
        console.error("Fetch Error:", e);
    }

    if (!policyData) return notFound();

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col">
            {/* Main Content Area */}
            <main className="flex-grow pt-32 pb-20 px-6 md:px-12">
                <div className="max-w-5xl mx-auto w-full">
                    
                    {/* 🌟 LUXURY CONTENT RENDERER 🌟 */}
                    {/* Ye class backend se aayi images/videos ko handle karegi */}
                    <div 
                        className="luxury-viewer-engine"
                        dangerouslySetInnerHTML={{ __html: policyData.content }} 
                    />

                </div>
            </main>

            {/* 🏁 MAIN WEBSITE FOOTER 🏁 */}
            <Footer />
        </div>
    );
}
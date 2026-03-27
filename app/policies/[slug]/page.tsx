import { notFound } from 'next/navigation';
import Footer from '@/components/Footer'; // 🚨 Exact wahi footer jo main site par hai

export default async function PolicyPage({ params }: { params: any }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    let policyContent = "";

    try {
        const apiUrl = process.env.NEXTAUTH_URL || 'https://essential-gamma.vercel.app';
        const res = await fetch(`${apiUrl}/api/cms`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            const legalPages = data?.data?.legalPages || [];
            const matchedPolicy = legalPages.find((p: any) => p.slug === slug);
            if (matchedPolicy && matchedPolicy.content) {
                policyContent = matchedPolicy.content;
            }
        }
    } catch (error) {
        console.error("Error fetching policy:", error);
    }

    if (!policyContent) return notFound();

    return (
        // 🚨 MAIN FIX: Background Bright (#FAFAFA) and Text Dark (#333333)
        <div className="min-h-screen bg-[#FAFAFA] text-[#333333] flex flex-col w-full font-sans">
            
            <main className="flex-grow pt-32 pb-24 px-4 md:px-8 w-full max-w-4xl mx-auto">
                {/* 🌟 BRIGHT LUXURY VIEWER 🌟 */}
                <div 
                    className="luxury-viewer-engine w-full" 
                    dangerouslySetInnerHTML={{ __html: policyContent }} 
                />
            </main>
            
            {/* 🏁 EXACT SAME FOOTER AS FRONT PAGE */}
            <Footer />
        </div>
    );
}
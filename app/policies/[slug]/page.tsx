// app/policies/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer'; // Aapka same main footer

export default async function PolicyPage({ params }: { params: any }) {
    // 🚨 Next.js 15 optimization
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    let policyContent = "";
    let policyTitle = "Policy";

    try {
        const apiUrl = process.env.NEXTAUTH_URL || 'https://essential-gamma.vercel.app';
        const res = await fetch(`${apiUrl}/api/cms`, { 
            cache: 'no-store' // Hamesha fresh data layega
        });
        
        if (res.ok) {
            const data = await res.json();
            const legalPages = data?.data?.legalPages || [];
            
            const matchedPolicy = legalPages.find((p: any) => p.slug === slug);

            if (matchedPolicy && matchedPolicy.content) {
                policyContent = matchedPolicy.content;
                policyTitle = matchedPolicy.title;
            } else {
                return notFound(); // Galat slug par 404
            }
        } else {
            policyContent = "<h1>System Sync</h1><p>Our secure vault is syncing data...</p>";
        }
    } catch (error) {
        console.error("Error fetching policy:", error);
        policyContent = "<h1>System Sync</h1><p>Our secure vault is syncing data...</p>";
    }

    return (
        // 🚨 MAIN FIX: Poora page background forces to deep black
        <div className="min-h-screen bg-[#050505] !bg-[#050505] text-[#b3b3b3] flex flex-col w-full">
            
            {/* Main Content Area */}
            <main className="flex-grow pt-32 pb-20 px-6 md:px-12 w-full">
                {/* 🚨 Wrapper jo content ko perfect center rakhega readability ke liye */}
                <div className="max-w-5xl mx-auto w-full">
                    
                    {/* 🌟 LUXURY VIEWER ENGINE (app/globals.css mein define hai) 🌟 */}
                    <div 
                        className="luxury-viewer-engine w-full" 
                        dangerouslySetInnerHTML={{ __html: policyContent }} 
                    />

                </div>
            </main>

            {/* 🏁 Standardize Main Website Footer */}
            <Footer />
        </div>
    );
}
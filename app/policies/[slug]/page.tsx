import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';

export default async function PolicyPage({ params }: { params: any }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    let policyData = null;

    try {
        const apiUrl = process.env.NEXTAUTH_URL || 'https://essential-gamma.vercel.app';
        const res = await fetch(`${apiUrl}/api/cms`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            const legalPages = data?.data?.legalPages || [];
            policyData = legalPages.find((p: any) => p.slug === slug);
        }
    } catch (error) {
        console.error("Error fetching policy:", error);
    }

    if (!policyData || !policyData.content) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col w-full">
            <main className="flex-grow pt-32 pb-24 px-4 md:px-8">
                <div className="w-full max-w-5xl mx-auto">
                    {/* 🌟 MAGIC CLASS APPLIED HERE 🌟 */}
                    <div 
                        className="luxury-viewer-engine w-full" 
                        dangerouslySetInnerHTML={{ __html: policyData.content }} 
                    />
                </div>
            </main>
            
            {/* Main Website Footer */}
            <Footer />
        </div>
    );
}
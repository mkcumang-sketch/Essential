import { notFound } from 'next/navigation';
// Update import path to your footer component
// import Footer from '@/components/Footer';

export default async function PolicyPage({ params }: { params: any }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    let policyContent = "";
    let policyTitle = "";

    try {
        const apiUrl = process.env.NEXTAUTH_URL || 'https://essential-gamma.vercel.app';
        const res = await fetch(`${apiUrl}/api/cms`, { cache: 'no-store' });
        
        if (res.ok) {
            const data = await res.json();
            const legalPages = data?.data?.legalPages || [];
            const matchedPolicy = legalPages.find((p: any) => p.slug === slug);
            
            if (matchedPolicy && matchedPolicy.content) {
                policyContent = matchedPolicy.content;
                policyTitle = matchedPolicy.title;
            }
        }
    } catch (error) {
        console.error("Error fetching policy:", error);
    }

    if (!policyContent) return notFound();

    return (
        // 🚨 FIX: Forced Background White and Text Black/Dark Gray for Premium look
        <div className="min-h-screen bg-white text-gray-900 flex flex-col w-full font-sans antialiased">
            
            <main className="flex-grow pt-32 pb-24 px-6 md:px-12 w-full max-w-4xl mx-auto">
                <div className="border-b border-gray-200 pb-8 mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-black uppercase tracking-widest">{policyTitle}</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-4">Essential Rush Official Document</p>
                </div>
                
                {/* Content Renderer targeting specific tags for bright theme */}
                <div 
                    className="prose prose-lg prose-gray max-w-none 
                               prose-headings:font-serif prose-headings:text-black prose-headings:uppercase prose-headings:tracking-wider
                               prose-p:text-gray-700 prose-p:leading-relaxed
                               prose-a:text-[#D4AF37] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                               prose-strong:text-black prose-strong:font-bold
                               prose-ul:text-gray-700 prose-li:marker:text-[#D4AF37]
                               [&>img]:rounded-2xl [&>img]:shadow-2xl [&>img]:border [&>img]:border-gray-200 [&>img]:w-full [&>img]:my-12
                               [&>video]:rounded-2xl [&>video]:shadow-2xl [&>video]:border [&>video]:border-gray-200 [&>video]:w-full [&>video]:my-12"
                    dangerouslySetInnerHTML={{ __html: policyContent }} 
                />
            </main>
            
            {/* 🏁 Standardize Main Website Footer */}
            {/* <Footer /> */}
        </div>
    );
}
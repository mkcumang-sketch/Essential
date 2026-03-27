import { notFound } from 'next/navigation';

export default async function PolicyPage({ params }: { params: any }) {
    // 🚨 Next.js 15 Rule: Params ko await karna zaroori hai
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    let policyContent = "";

    try {
        // Backend API se CMS data fetch kar rahe hain
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'https://essential-gamma.vercel.app'}/api/cms`, { 
            cache: 'no-store' // Hamesha fresh data layega
        });
        
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();

        // Check if legal pages exist in DB
        const legalPages = data?.data?.legalPages || [];
        
        // URL wale slug se match karo (e.g., 'privacy-policy')
        const matchedPolicy = legalPages.find((p: any) => p.slug === slug);

        if (matchedPolicy) {
            policyContent = matchedPolicy.content;
        } else {
            return notFound(); // Agar page nahi mila toh 404 dikhayega, crash nahi hoga!
        }
    } catch (error) {
        console.error("Error fetching policy:", error);
        policyContent = "<h1>Temporary Error</h1><p>Our vault is currently syncing. Please refresh in a moment.</p>";
    }

    return (
        <main className="min-h-screen bg-[#050505] !bg-[#050505] w-full pt-32 pb-24 text-[#b3b3b3]">
            <div className="w-full max-w-5xl mx-auto px-4 md:px-8">
                {/* 🌟 MAGIC CLASS: Jo Admin panel ke HTML ko luxury banayegi */}
                <div 
                    className="luxury-content w-full" 
                    dangerouslySetInnerHTML={{ __html: policyContent }} 
                />
            </div>
        </main>
    );
}
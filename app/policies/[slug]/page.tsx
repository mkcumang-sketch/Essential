import { notFound } from 'next/navigation';

// Ye Next.js ka naya server component hai jo direct Database (CMS) se data layega
export default async function PolicyPage({ params }: { params: any }) {
    // 1. URL se slug nikalna (e.g., 'privacy-policy')
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    let policyContent = "";

    try {
        // 2. Apne Admin CMS se live data fetch karna
        const apiUrl = process.env.NEXTAUTH_URL || 'https://essential-gamma.vercel.app';
        const res = await fetch(`${apiUrl}/api/cms`, { 
            cache: 'no-store' // Hamesha fresh data layega, purana nahi
        });
        
        if (res.ok) {
            const data = await res.json();
            const legalPages = data?.data?.legalPages || [];
            
            // 3. Slug ke hisaab se sahi policy dhoondhna
            const matchedPolicy = legalPages.find((p: any) => p.slug === slug);

            // 🚨 YAHI WO FIX HAI: Hum direct content variable bana rahe hain
            if (matchedPolicy && matchedPolicy.content) {
                policyContent = matchedPolicy.content;
            } else {
                return notFound(); // Agar galat URL dala toh 404 page aayega, crash nahi hoga!
            }
        } else {
            policyContent = "<h1>System Sync</h1><p>Policies are currently synchronizing. Please check back in a moment.</p>";
        }
    } catch (error) {
        console.error("Error fetching policy:", error);
        policyContent = "<h1>System Update</h1><p>Our secure vault is syncing data...</p>";
    }

    return (
        <main className="min-h-screen bg-[#050505] !bg-[#050505] w-full pt-32 pb-24 text-[#b3b3b3]">
            <div className="w-full max-w-5xl mx-auto px-4 md:px-8">
                {/* 🌟 MAGIC CLASS: 'luxury-content' jo Admin HTML ko cinematic banayegi */}
                <div 
                    className="luxury-content w-full" 
                    dangerouslySetInnerHTML={{ __html: policyContent }} 
                />
            </div>
        </main>
    );
}
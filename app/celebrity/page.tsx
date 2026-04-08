"use client";
import CelebritySpotlight from "@/components/CelebritySpotlight";

// Client Component
function CelebrityClientPage({ celebrities }: { celebrities: any[] }) {
  return (
    <main className="pt-20 bg-black min-h-screen">
      <CelebritySpotlight celebrities={celebrities} />
      
      {/* Dynamic CTA */}
      <div className="pb-32 text-center">
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em] mb-8 italic">Get a similar style</p>
        <button className="bg-white text-black px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-gold-500 transition-all">
          Shop the edit
        </button>
      </div>
    </main>
  );
}

// Server Component for data fetching
async function getCelebritiesData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/site-content?key=celebrities`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch celebrity data');
  }
  const data = await res.json();
  return data.success ? (data.content || []) : [];
}

export default async function CelebrityPage() {
  const celebrities = await getCelebritiesData();
  return <CelebrityClientPage celebrities={celebrities} />;
}
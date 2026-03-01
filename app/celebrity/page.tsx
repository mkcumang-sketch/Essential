"use client";
import { useEffect, useState } from "react";
import CelebritySpotlight from "@/components/CelebritySpotlight";

export default function CelebrityPage() {
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCelebs = async () => {
      // Admin CMS se data fetch karna
      const res = await fetch("/api/site-content?key=celebrities");
      const data = await res.json();
      if(data.success) setCelebrities(data.content || []);
      setLoading(false);
    };
    fetchCelebs();
  }, []);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-gold-500 animate-pulse tracking-widest uppercase text-xs">Accessing The Vault...</div>;

  return (
    <main className="pt-20 bg-black min-h-screen">
      <CelebritySpotlight celebrities={celebrities} />
      
      {/* Dynamic CTA */}
      <div className="pb-32 text-center">
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.5em] mb-8 italic">Acquire the look of icons</p>
        <button className="bg-white text-black px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.3em] hover:bg-gold-500 transition-all">
          Shop Their Selection
        </button>
      </div>
    </main>
  );
}
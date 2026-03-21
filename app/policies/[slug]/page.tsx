'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CMS } from '@/models/CMS';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export default async function PolicyPage({ params }: { params: { slug: string } }) {
  await connectDB();
  
  // 🌟 FIXED TYPE ERROR HERE USING 'as any' 🌟
  const cmsData = await CMS.findOne({ type: 'global' }).lean() as any;
  const policy = cmsData?.legalPages?.find((p: any) => p.slug === params.slug);

  if (!policy) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-6xl font-serif italic mb-6">Node Not Found</h1>
        <p className="text-gray-400 tracking-widest uppercase font-black text-xs mb-10">The requested policy document does not exist.</p>
        <Link href="/" className="px-8 py-4 bg-[#D4AF37] text-black font-black uppercase tracking-widest rounded-full text-xs hover:bg-white transition-colors">Return to Base</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-[#D4AF37] selection:text-white">
      <nav className="w-full bg-black py-6 px-10 flex justify-between items-center border-b-[5px] border-[#D4AF37]">
         <Link href="/" className="text-white flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:text-[#D4AF37] transition-colors"><ArrowLeft size={16}/> Back to Store</Link>
         <h1 className="text-2xl font-serif font-black tracking-[5px] uppercase text-white">Essential</h1>
         <div className="w-20"></div>
      </nav>

      <main className="max-w-4xl mx-auto py-32 px-6 md:px-10">
         <div className="text-center mb-24 border-b border-gray-200 pb-16">
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[10px] mb-6">Corporate Protocol</p>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tighter leading-none italic text-black">{policy.title}</h1>
         </div>

         <div 
            className="prose prose-lg md:prose-xl prose-p:font-serif prose-p:text-gray-600 prose-p:leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-a:text-[#D4AF37] max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.content }} 
         />
      </main>

      <footer className="bg-black py-10 text-center border-t border-[#D4AF37]/30">
          <p className="text-[10px] font-black uppercase tracking-[5px] text-gray-600">© 2026 Essential Rush Enterprise.</p>
      </footer>
    </div>
  );
}
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ShieldAlert, CheckCircle2, Video, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RefundProtocol() {
  const accentColor = '#D4AF37';

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      <main className="max-w-4xl mx-auto px-6 py-20">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <Link href="/account" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[5px] text-gray-500 hover:text-[#D4AF37] transition-all mb-12">
            <ArrowLeft size={14}/> Back to Vault
          </Link>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-4 tracking-tighter">Reclamation <span className="text-[#D4AF37]">Protocol.</span></h1>
          <p className="text-gray-500 uppercase tracking-[8px] text-[9px] font-black">Asset Return Standards | Essential Rush</p>
        </motion.div>

        <div className="space-y-16 relative">
          <div className="absolute left-0 top-0 w-[1px] h-full bg-gradient-to-b from-[#D4AF37]/50 via-white/5 to-transparent"></div>

          {/* 30 Day Window */}
          <section className="pl-10 relative">
            <div className="absolute left-[-6px] top-0 w-3 h-3 bg-[#D4AF37] rounded-full shadow-[0_0_15px_#D4AF37]"></div>
            <h3 className="text-xl font-serif italic mb-4 flex items-center gap-3"><RotateCcw size={20} className="text-[#D4AF37]"/> 30-Day Evaluation Period</h3>
            <p className="text-gray-400 font-serif italic text-lg leading-relaxed">
              Aapke requisition (order) deliver hone ke baad aapke paas **30 days** ka waqt hota hai asset ko evaluate karne ka. Agar aap satisfy nahi hain, toh hum reclamation process shuru kar sakte hain.
            </p>
          </section>

          {/* Unboxing Video - CRITICAL */}
          <section className="pl-10 relative">
             <div className="absolute left-[-6px] top-0 w-3 h-3 bg-[#D4AF37] rounded-full opacity-50"></div>
            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-8 rounded-[30px]">
               <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-3 text-[#D4AF37]"><Video size={20}/> Mandatory Unboxing Protocol</h3>
               <p className="text-sm text-gray-400 leading-relaxed">
                 Luxury assets ki security ke liye, delivery ke waqt **unboxing video** banana anivarya (mandatory) hai. Bina video ke physical damage ya missing items ke claims entertain nahi kiye jayenge.
               </p>
            </div>
          </section>

          {/* Eligibility */}
          <section className="pl-10 relative">
            <div className="absolute left-[-6px] top-0 w-3 h-3 bg-[#D4AF37] rounded-full opacity-50"></div>
            <h3 className="text-xl font-serif italic mb-4 flex items-center gap-3"><CheckCircle2 size={20} className="text-[#D4AF37]"/> Eligibility Criteria</h3>
            <ul className="space-y-4 text-gray-500 text-sm font-black uppercase tracking-widest">
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span> Original Packaging Intact</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span> Security Seals Not Broken</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span> No Signs of Use on Straps/Glass</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
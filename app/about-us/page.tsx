'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutProtocol() {
  const accentColor = '#D4AF37';

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      <main className="max-w-7xl mx-auto px-6 py-24">
        
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-32">
          <Shield size={60} className="text-[#D4AF37] mx-auto mb-8 opacity-50" />
          <h1 className="text-6xl md:text-8xl font-serif italic mb-6 tracking-tighter">Our story</h1>
          <p className="text-gray-500 uppercase tracking-[10px] text-xs font-black">EST. 2020 | Kanpur HQ</p>
        </motion.div>

        {/* The Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-serif italic mb-8">A Visionary <span className="text-[#D4AF37]">Architect.</span></h2>
            <div className="space-y-6 text-gray-400 font-serif italic text-lg leading-relaxed">
              <p>Founded by <span className="text-white">Shresth Kumar</span> at the age of 16, Essential Rush was never just a brand—it was an empire in the making.</p>
              <p>In the heart of Kanpur, Shresth envisioned a world where timepieces weren't just tools, but keys to a private lifestyle of modern luxury.</p>
              <p>Today we help people everywhere find watches they love and keep for years.</p>
            </div>
          </motion.div>

          <motion.div className="relative group" initial={{ opacity: 0, scale: 0.9 }}>
            <div className="absolute -inset-4 bg-[#D4AF37]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-duration-700"></div>
            <div className="aspect-[4/5] bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-[40px] flex items-center justify-center overflow-hidden">
               {/* Place Shresth Kumar Image here */}
               <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[5px]">Founder photo</p>
            </div>
          </motion.div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-40">
          {[
            { icon: Globe, title: "Modern Design", desc: "Crafted for the global citizen." },
            { icon: Clock, title: "Precision", desc: "Every second is a calculated move." },
            { icon: Shield, title: "Trust", desc: "Real watches. Clear service. No games." }
          ].map((pillar, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[30px] hover:border-[#D4AF37]/50 transition-all group">
              <pillar.icon className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="text-xl font-serif italic mb-4">{pillar.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-40">
          <Link href="/#vault" className="px-12 py-6 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-[#D4AF37] transition-all">
             Shop watches <ArrowRight className="inline ml-2" size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
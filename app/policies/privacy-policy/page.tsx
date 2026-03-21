'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, EyeOff, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyProtocol() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* Mini Sidebar */}
      <aside className="w-full md:w-[350px] bg-[#0A0A0A] border-r border-white/5 p-10 flex flex-col">
        <Link href="/account" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-12"><ArrowLeft size={14}/> Dashboard</Link>
        <h2 className="text-4xl font-serif italic mb-10">Data <br/><span className="text-[#D4AF37]">Governance.</span></h2>
        <div className="space-y-4">
          {['Encryption', 'Collection', 'Usage', 'Rights'].map(item => (
            <div key={item} className="p-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[3px] text-gray-500 hover:text-white hover:bg-white/5 cursor-pointer transition-all">
              {item} Protocol
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-10 md:p-24 overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-16">
          <section>
            <ShieldCheck size={40} className="text-[#D4AF37] mb-6" />
            <h3 className="text-3xl font-serif italic mb-6">Security Commitment</h3>
            <p className="text-gray-400 font-serif italic text-lg leading-relaxed">
              Essential Rush operates on a zero-vulnerability principle. Your personal details are stored within our encrypted private vault, accessible only to facilitate your asset acquisitions.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-8 bg-[#0A0A0A] rounded-[30px] border border-white/5">
              <Lock className="text-[#D4AF37] mb-4" size={24} />
              <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-white">Encrypted Transit</h4>
              <p className="text-xs text-gray-500 leading-relaxed">All payment protocols are handled via 256-bit SSL encryption. We never hold your master keys (card details).</p>
            </div>
            <div className="p-8 bg-[#0A0A0A] rounded-[30px] border border-white/5">
              <EyeOff className="text-[#D4AF37] mb-4" size={24} />
              <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-white">Ghost Protocol</h4>
              <p className="text-xs text-gray-500 leading-relaxed">We do not sell your network data to third-party entities. Your empire's privacy is our highest priority.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
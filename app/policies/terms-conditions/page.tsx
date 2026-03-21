'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, Scale, Fingerprint, Globe2 } from 'lucide-react';

export default function TermsProtocol() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black p-10 md:p-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-24">
          <div>
            <h1 className="text-6xl font-serif italic text-white mb-2">Empire <span className="text-[#D4AF37]">Mandates.</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[6px] text-gray-500">Legal Framework | Ver. 2026.1</p>
          </div>
          <div className="px-6 py-3 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
            Governing Law: Republic of India
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-12">
            <section>
              <h4 className="text-[#D4AF37] text-xs font-black uppercase tracking-[4px] mb-6 flex items-center gap-3"><Fingerprint size={16}/> Intellectual Property</h4>
              <p className="text-gray-400 font-serif italic text-lg leading-relaxed">
                Essential Rush ki har image, design, aur "Special Sauce" humari private property hai. Copying our blueprint is a violation of the protocol.
              </p>
            </section>
            
            <section>
              <h4 className="text-[#D4AF37] text-xs font-black uppercase tracking-[4px] mb-6 flex items-center gap-3"><Scale size={16}/> Liability Limitation</h4>
              <p className="text-gray-400 font-serif italic text-lg leading-relaxed">
                Hum best quality assets provide karte hain, lekin server errors ya technical downtime ke liye hum limited liability hold karte hain.
              </p>
            </section>
          </div>

          <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
            <Globe2 size={200} className="absolute -right-20 -bottom-20 text-[#D4AF37] opacity-5"/>
            <h4 className="text-white text-xs font-black uppercase tracking-[4px] mb-8">Client Responsibility</h4>
            <p className="text-sm text-gray-500 leading-loose">
              By accessing the vault, aap confirm karte hain ki aap di gayi saari details (shipping, billing) accurate rakhenge. Improper information se requisitions cancel ki ja sakti hain.
            </p>
            <div className="mt-12 pt-8 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-gray-600">
              Founder: Shresth Kumar | Kanpur, UP
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, ShieldCheck, ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';

export default function ContactProtocol() {
  const accentColor = '#D4AF37';

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-20 relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37] blur-[180px] opacity-[0.04] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Navigation / Back to Policies */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-16">
          <Link href="/policies/privacy-policy" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[5px] text-gray-500 hover:text-[#D4AF37] transition-all w-max">
            <ArrowLeft size={14}/> Policy Index
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Left Side: Intelligence Brief */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ShieldCheck size={48} className="text-[#D4AF37] mb-10 opacity-60" />
            <h1 className="text-6xl md:text-8xl font-serif italic mb-8 tracking-tighter leading-tight">
              Secure <br/> <span className="text-[#D4AF37]">Channel.</span>
            </h1>
            <p className="text-gray-400 font-serif italic text-xl mb-12 max-w-md leading-relaxed">
              Our intelligence team is standing by to facilitate your empire's needs. Initiate a secure transmission below.
            </p>
            
            <div className="space-y-10">
              <div className="flex items-center gap-6 group">
                <div className="p-5 bg-[#0A0A0A] border border-white/5 rounded-[20px] group-hover:border-[#D4AF37]/50 transition-all">
                  <Mail className="text-[#D4AF37]" size={22}/>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[4px] text-gray-600 mb-1">Transmission Email</p>
                  <p className="text-xl font-serif italic text-white">support@essentialrush.store</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="p-5 bg-[#0A0A0A] border border-white/5 rounded-[20px] group-hover:border-[#D4AF37]/50 transition-all">
                  <MapPin className="text-[#D4AF37]" size={22}/>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[4px] text-gray-600 mb-1">Command Center</p>
                  <p className="text-xl font-serif italic text-white">Kanpur, Uttar Pradesh, India</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="p-5 bg-[#0A0A0A] border border-white/5 rounded-[20px] group-hover:border-[#D4AF37]/50 transition-all">
                  <Globe className="text-[#D4AF37]" size={22}/>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[4px] text-gray-600 mb-1">Global Presence</p>
                  <p className="text-xl font-serif italic text-white">Lucknow | Delhi | Mumbai</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Secure Transmission Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0A0A0A] border border-white/5 p-10 md:p-16 rounded-[50px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative z-10"
          >
            <form className="space-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[5px] text-gray-500 ml-2">Client Identity</label>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-black border border-white/5 p-6 rounded-[25px] focus:border-[#D4AF37] outline-none transition-all font-serif italic text-white placeholder:text-gray-800" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[5px] text-gray-500 ml-2">Secure Routing (Email)</label>
                <input 
                  type="email" 
                  placeholder="identity@vault.com" 
                  className="w-full bg-black border border-white/5 p-6 rounded-[25px] focus:border-[#D4AF37] outline-none transition-all font-serif italic text-white placeholder:text-gray-800" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[5px] text-gray-500 ml-2">Manifest Details</label>
                <textarea 
                  rows={4} 
                  placeholder="What is your requisition?" 
                  className="w-full bg-black border border-white/5 p-6 rounded-[25px] focus:border-[#D4AF37] outline-none transition-all font-serif italic text-white placeholder:text-gray-800 resize-none" 
                />
              </div>

              <button className="w-full py-7 bg-[#D4AF37] text-black font-black uppercase tracking-[6px] text-[11px] rounded-[25px] hover:bg-white hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-4 group">
                Initiate Transmission 
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
            
            <p className="mt-8 text-center text-[9px] font-black uppercase tracking-[4px] text-gray-700">
              End-to-End Encrypted Channel
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
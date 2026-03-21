'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, UserPlus, LogIn, ArrowRight, 
  Fingerprint, KeyRound, Chrome 
} from 'lucide-react';
import Link from 'next/link';
import { signIn } from "next-auth/react";

export default function AuthGateway() {
  const accentColor = '#D4AF37';

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* Background Cinematic Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37] blur-[250px] opacity-[0.03] rounded-full pointer-events-none"></div>

      {/* Header Branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <ShieldCheck size={50} className="text-[#D4AF37] mx-auto mb-6 opacity-60" />
        <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter mb-4">Entry <span className="text-[#D4AF37]">Protocol.</span></h1>
        <p className="text-gray-500 uppercase tracking-[10px] text-[10px] font-black">Secure Authentication | Essential Rush</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">
        
        {/* OPTION 1: ESTABLISH NEW IDENTITY (Register) */}
        <motion.div 
          whileHover={{ y: -10 }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[40px] flex flex-col items-center text-center group hover:border-[#D4AF37]/40 transition-all duration-500"
        >
          <div className="w-20 h-20 bg-[#D4AF37]/5 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <UserPlus className="text-[#D4AF37]" size={32} />
          </div>
          <h2 className="text-2xl font-serif italic mb-4">New Client Protocol</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 font-serif italic">
            Establish your identity to access the private vault, track requisitions, and earn empire rewards.
          </p>
          <Link href="/account/register" className="w-full py-5 border border-[#D4AF37]/30 text-[#D4AF37] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all">
            Create Identity
          </Link>
        </motion.div>

        {/* OPTION 2: ACCESS EXISTING VAULT (Login) */}
        <motion.div 
          whileHover={{ y: -10 }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#111] to-black border border-[#D4AF37]/30 p-12 rounded-[40px] flex flex-col items-center text-center shadow-2xl group hover:border-[#D4AF37] transition-all duration-500"
        >
          <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <LogIn className="text-[#D4AF37]" size={32} />
          </div>
          <h2 className="text-2xl font-serif italic mb-4">Access Private Vault</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 font-serif italic">
            Authenticate your credentials to view your secured assets and manage your empire wallet.
          </p>
          
          <div className="w-full space-y-4">
            <button 
              onClick={() => signIn("google")}
              className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(212,175,55,0.2)]"
            >
              <Chrome size={16} /> Authenticate via Google
            </button>
            
            <Link href="/account/login-email" className="block text-[9px] text-gray-500 uppercase tracking-[4px] font-black hover:text-white transition-colors mt-4">
              Access via Encryption Key (Email)
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Security Footer */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.6 }}
        className="mt-20 flex items-center gap-8 text-[9px] font-black uppercase tracking-[4px] text-gray-700"
      >
        <div className="flex items-center gap-2"><Fingerprint size={14}/> Biometric Secure</div>
        <div className="flex items-center gap-2"><KeyRound size={14}/> 256-Bit Encrypted</div>
      </motion.div>

      <Link href="/" className="mt-12 text-[10px] text-gray-600 uppercase tracking-widest hover:text-[#D4AF37] transition-all border-b border-gray-900 pb-1">
        Return to Base Station
      </Link>

    </div>
  );
}
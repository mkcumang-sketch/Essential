"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Truck, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RequisitionSuccess() {
  useEffect(() => {
    // Clear cart after success
    localStorage.removeItem('luxury_cart');
  }, []);

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-10 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#002B19_0%,#050505_100%)] opacity-40"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="text-center z-10"
      >
        <motion.div 
          initial={{ rotate: -180, opacity: 0 }} 
          animate={{ rotate: 0, opacity: 1 }} 
          transition={{ duration: 1 }}
          className="text-[#D4AF37] text-8xl mb-12 flex justify-center"
        >♞</motion.div>
        
        <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter mb-8">Requisition Successful.</h1>
        <p className="text-[#D4AF37] text-xs font-black uppercase tracking-[15px] mb-16">ALLOCATION NODE: GENEVA-42</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto mb-20">
           <div className="space-y-4">
              <ShieldCheck className="mx-auto text-green-500" size={32}/>
              <p className="text-[10px] font-black uppercase tracking-widest">Equity Secured</p>
           </div>
           <div className="space-y-4 border-x border-white/10">
              <Truck className="mx-auto text-[#D4AF37]" size={32}/>
              <p className="text-[10px] font-black uppercase tracking-widest">Transit Initialized</p>
           </div>
           <div className="space-y-4">
              <Crown className="mx-auto text-yellow-500" size={32}/>
              <p className="text-[10px] font-black uppercase tracking-widest">VIP Registry Added</p>
           </div>
        </div>

        <Link href="/" className="px-16 py-6 bg-white text-black rounded-full font-black uppercase tracking-[6px] text-[11px] hover:bg-[#D4AF37] hover:text-white transition-all inline-flex items-center gap-4">
          Return to Private Gallery <ArrowRight size={18}/>
        </Link>
      </motion.div>

      {/* Floating Particle Effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
         {[...Array(20)].map((_, i) => (
           <motion.div 
            key={i}
            animate={{ y: [0, -1000], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: Math.random() * 10 + 5, delay: Math.random() * 5 }}
            className="absolute bg-[#D4AF37] w-px h-10"
            style={{ left: `${Math.random() * 100}%`, bottom: '-10%' }}
           />
         ))}
      </div>
    </div>
  );
}
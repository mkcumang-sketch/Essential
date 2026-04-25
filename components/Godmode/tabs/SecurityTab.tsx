"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, AlertTriangle } from 'lucide-react';

export default function SecurityTab() {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-2xl mx-auto mt-10 md:mt-20 w-full px-4">
       <div className="bg-[#111] border border-red-500/30 p-8 md:p-16 rounded-[30px] md:rounded-[40px] flex flex-col items-center text-center shadow-[0_0_100px_rgba(239,68,68,0.1)] w-full">
          <div className="p-4 md:p-6 bg-red-500/10 rounded-full mb-6 md:mb-8"><Fingerprint size={40} className="md:w-[60px] md:h-[60px] text-red-500" /></div>
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">System Integrity</h3>
          <p className="text-gray-400 text-[10px] md:text-sm mb-8 md:mb-12">All external nodes are secure. Execute full lockdown in case of breach.</p>
          <button className="w-full md:w-auto min-h-[44px] px-6 md:px-10 py-4 md:py-5 bg-red-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-500 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:scale-105">
             <AlertTriangle size={16} className="md:w-[18px] md:h-[18px]"/> Initiate Lockdown
          </button>
       </div>
    </motion.div>
  );
}
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

interface AiEngineProps {
  pricingRules: any;
  setPricingRules: (rules: any) => void;
  handleSaveAIRules: () => void;
}

export default function AiEngine({
  pricingRules,
  setPricingRules,
  handleSaveAIRules,
}: AiEngineProps) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} key="ai" className="max-w-3xl mx-auto space-y-8 md:space-y-10 w-full px-2">
       <div className="text-center mb-6 md:mb-10">
           <BrainCircuit size={40} className="md:w-[60px] md:h-[60px] text-[#00F0FF] mx-auto mb-4 md:mb-6"/>
           <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Algorithmic Valuation</h2>
           <p className="text-gray-400 text-xs md:text-sm px-4">Dynamic fluctuation based on market velocity.</p>
       </div>

       <div className="bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[30px] border border-[#00F0FF]/30 space-y-6 md:space-y-8 shadow-[0_0_50px_rgba(0,240,255,0.05)] w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 md:pb-6 gap-4">
             <div>
                <h4 className="text-base md:text-lg font-bold text-white">Enable Deep Learning</h4>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">Permit automatic price recalibration for limited stock assets.</p>
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${pricingRules.isAiPricingActive ? 'text-[#00F0FF]' : 'text-gray-600'}`}>{pricingRules.isAiPricingActive ? 'ONLINE' : 'OFFLINE'}</span>
                <button onClick={() => setPricingRules({...pricingRules, isAiPricingActive: !pricingRules.isAiPricingActive})} className={`w-16 min-h-[32px] md:h-8 rounded-full p-1 transition-colors ${pricingRules.isAiPricingActive ? 'bg-[#00F0FF]' : 'bg-gray-800'}`}>
                   <div className={`w-6 h-6 bg-white rounded-full transition-transform ${pricingRules.isAiPricingActive ? 'translate-x-8' : 'translate-x-0'}`}></div>
                </button>
             </div>
          </div>

          <div>
             <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">Absolute Price Ceiling</label>
                <span className="text-xl md:text-2xl font-mono text-[#00F0FF]">{pricingRules.maxMarkupPercent}%</span>
             </div>
             <input type="range" min="0" max="50" value={pricingRules.maxMarkupPercent} onChange={(e) => setPricingRules({...pricingRules, maxMarkupPercent: Number(e.target.value)})} className="w-full h-2 min-h-[44px] md:min-h-auto bg-transparent md:bg-gray-800 rounded-full appearance-none cursor-pointer" style={{accentColor: '#00F0FF'}} />
             <p className="text-[10px] md:text-xs text-gray-600 mt-0 md:mt-4">Restricts the maximum allowable deviation from the base coordinate.</p>
          </div>

          <button onClick={handleSaveAIRules} className="w-full min-h-[44px] py-4 md:py-5 bg-[#00F0FF] text-black font-bold uppercase tracking-widest rounded-xl text-[10px] md:text-sm hover:bg-white transition-all mt-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
             Compile Algorithm
          </button>
       </div>
    </motion.div>
  );
}
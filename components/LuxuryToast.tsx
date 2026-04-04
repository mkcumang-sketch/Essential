"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle } from 'lucide-react';

export const LuxuryToast = ({ show, message, onClose }: any) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
          className="fixed bottom-10 left-1/2 z-[2000] bg-black/90 backdrop-blur-xl border border-[#D4AF37]/50 px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 min-w-[300px]"
        >
          <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[3px] text-[#D4AF37]">Cart updated</p>
            <p className="text-white text-sm font-serif italic">{message}</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-500 hover:text-white transition-colors">
            <CheckCircle size={20} className="text-green-500" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
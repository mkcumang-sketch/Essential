"use client";

import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle, X } from 'lucide-react';

// 1. Context Create Kiya
const ToastContext = createContext<any>(null);

// 2. Provider Component (Ye poori app ko wrap karega)
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Global Function jise koi bhi page call kar sakta hai
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            
            {/* 🌟 THE GLOBAL LUXURY TOAST UI 🌟 */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
                        className="fixed bottom-10 left-1/2 z-[9999] bg-black/95 backdrop-blur-xl border border-[#D4AF37]/50 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] pointer-events-none"
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-red-500/20 text-red-500'}`}>
                            {toast.type === 'success' ? <ShoppingBag size={20} /> : <X size={20} />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[3px] text-[#D4AF37]">Update</p>
                            <p className="text-white text-sm font-serif italic">{toast.message}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ToastContext.Provider>
    );
};

// 3. Custom Hook (Taaki pages mein easily use ho sake)
export const useToast = () => useContext(ToastContext);
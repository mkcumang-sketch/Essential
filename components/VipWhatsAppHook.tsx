"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';

export const VipWhatsAppHook = ({ isOpen, onClose, onUnlock }: { isOpen: boolean, onClose: () => void, onUnlock: (phone: string) => void }) => {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleUnlock = async () => {
        if (phone.length < 10) return;
        setStatus('loading');
        
        // 🚨 Yahan backend API call aayegi number save karne ke liye
        // Example: await fetch('/api/leads', { method: 'POST', body: JSON.stringify({ phone, source: 'VIP_POPUP' }) });

        setTimeout(() => {
            setStatus('success');
            onUnlock(phone); // Parent component ko number bhej do
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[5000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                        className="bg-[#0A0A0A] border border-[#D4AF37]/30 w-full max-w-md rounded-[30px] p-8 relative shadow-2xl overflow-hidden"
                    >
                        {/* Luxury Glow Background */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-[#D4AF37]/20 blur-[60px] rounded-full pointer-events-none"></div>

                        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>

                        {status === 'success' ? (
                            <div className="text-center py-8">
                                <CheckCircle size={50} className="text-green-500 mx-auto mb-6" />
                                <h3 className="text-2xl font-serif text-white font-bold mb-2">Vault Unlocked</h3>
                                <p className="text-gray-400 text-sm mb-6">Your VIP code has been applied automatically.</p>
                                <div className="bg-[#D4AF37]/10 border border-[#D4AF37] border-dashed rounded-xl p-4 mb-6">
                                    <span className="text-[#D4AF37] font-mono text-xl tracking-[5px] font-bold">ESSENTIAL10</span>
                                </div>
                                <button onClick={onClose} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-200 transition-all">
                                    Continue to Secure Checkout
                                </button>
                            </div>
                        ) : (
                            <div className="text-center mt-4">
                                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Gift size={28} className="text-[#D4AF37]" />
                                </div>
                                <h2 className="text-2xl font-serif text-white font-bold mb-2 tracking-tight">Unlock 10% VIP Discount</h2>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                    Enter your WhatsApp number to receive your secret VIP Vault key and instant support.
                                </p>

                                <div className="space-y-4">
                                    <div className="relative flex items-center">
                                        <MessageCircle size={18} className="absolute left-4 text-gray-500" />
                                        <input 
                                            type="tel" 
                                            placeholder="+91 Phone Number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                            className="w-full bg-[#111] border border-gray-800 text-white rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#D4AF37] transition-colors font-mono text-sm placeholder:text-gray-600 placeholder:font-sans"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleUnlock}
                                        disabled={phone.length < 10 || status === 'loading'}
                                        className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-[10px] rounded-xl flex justify-center items-center gap-2 hover:bg-[#F3E5AB] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {status === 'loading' ? 'Verifying...' : 'Unlock My Discount'} <ArrowRight size={14} />
                                    </button>
                                </div>
                                <p className="text-[9px] text-gray-600 mt-6 uppercase tracking-[1px]">
                                    We respect your privacy. No spam, ever.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
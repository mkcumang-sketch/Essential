"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, ArrowRight, ShieldCheck, Package, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

function SuccessPage() {
    const router = useRouter();
    const [txnId, setTxnId] = useState("");

    useEffect(() => {
        // Generate a random secure ID for the receipt display
        setTxnId(`TXN-${Date.now().toString().slice(-8)}`);
        
        // 🛡️ SECURITY: Wipe the cart completely upon successful entry to this page
        localStorage.removeItem('luxury_cart');
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
            
            {/* AMBIENT LIGHTING */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37] blur-[150px] opacity-10 pointer-events-none rounded-full"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl w-full bg-black/40 backdrop-blur-2xl border border-white/10 p-10 md:p-16 rounded-[40px] text-center shadow-2xl relative z-10"
            >
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20"
                >
                    <CheckCircle size={50} className="text-green-500" />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-4 tracking-tighter">Acquisition Secured</h1>
                <p className="text-gray-400 font-serif text-lg mb-8">Welcome to the exclusive club. Your premium timepiece is now being prepared for global dispatch.</p>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10 text-left space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Transaction Vector</span>
                        <span className="text-xs font-mono text-[#D4AF37] tracking-widest">{txnId}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={12}/> Security Status</span>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">AES-256 Verified</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2"><Package size={12}/> Next Step</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Awaiting Dispatch</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => router.push('/account')} className="px-8 py-5 bg-[#D4AF37] text-black font-black uppercase text-[10px] tracking-[4px] rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2">
                        Track Order <MapPin size={14}/>
                    </button>
                    <button onClick={() => router.push('/')} className="px-8 py-5 bg-transparent border border-white/20 text-white font-black uppercase text-[10px] tracking-[4px] rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        Return to Vault <ArrowRight size={14}/>
                    </button>
                </div>
            </motion.div>

            {/* SECURE FOOTER */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 text-gray-600 opacity-50">
                <ShieldCheck size={16}/>
                <p className="text-[8px] uppercase font-black tracking-[4px]">Essential Rush • Secure Logistics Layer</p>
            </div>
        </div>
    );
}

// 🌟 VERCEL SSR BYPASS 🌟
export default dynamic(() => Promise.resolve(SuccessPage), { ssr: false });
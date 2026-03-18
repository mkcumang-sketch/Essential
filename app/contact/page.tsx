"use client";

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Phone, Mail, MapPin, ShieldCheck, 
  Send, Clock, Globe, Lock, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// ================= ANIMATION UTILS =================
const FadeUp = ({ children, delay = 0, className = "" }: any) => (
  <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }} className={className}>
    {children}
  </motion.div>
);

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 700 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 700 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <motion.div className="fixed top-0 left-0 w-8 h-8 border border-[#D4AF37] rounded-full pointer-events-none z-[999] hidden md:flex items-center justify-center mix-blend-difference" style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}>
      <div className="w-1 h-1 bg-[#D4AF37] rounded-full"></div>
    </motion.div>
  );
};

// ================= MAIN COMPONENT =================
function ConciergeNode() {
  const router = useRouter();
  
  const [formState, setFormState] = useState({ name: '', phone: '', subject: 'Bespoke Allocation', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send inquiry to our leads API
      await fetch('/api/leads', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          name: formState.name, 
          phone: formState.phone, 
          product: `INQUIRY: ${formState.subject}` 
        }) 
      });
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
        setFormState({ name: '', phone: '', subject: 'Bespoke Allocation', message: '' });
      }, 1500); // Simulate secure transmission delay
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const directWhatsApp = () => {
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent("Initialize Secure Imperial Requisition Line.")}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden relative">
      <CustomCursor />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,#002B19_0%,#050505_70%)] opacity-40 pointer-events-none"></div>

      {/* ♞ FROSTED NAVIGATION ♞ */}
      <nav className="fixed top-0 w-full h-24 md:h-28 bg-[#050505]/80 backdrop-blur-xl z-[150] border-b border-white/5 flex items-center justify-between px-6 md:px-16">
        <button onClick={() => router.back()} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[4px] text-gray-400 hover:text-[#D4AF37] transition-colors"><ArrowLeft size={18}/> Return</button>
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer mt-2">
          <div className="text-[#D4AF37] text-3xl md:text-4xl mb-0.5 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">♞</div>
          <h1 className="text-xl md:text-2xl font-serif font-black tracking-[12px] uppercase text-white group-hover:text-[#D4AF37] transition-colors">Essential</h1>
        </Link>
        <div className="flex items-center gap-6">
           <button onClick={() => router.push('/catalogue')} className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 hover:text-[#D4AF37] transition-colors hidden md:block">The Vault</button>
        </div>
      </nav>

      {/* ♞ THE CONCIERGE ENGINE ♞ */}
      <main className="pt-40 md:pt-56 pb-32 px-6 md:px-16 max-w-[2000px] mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-32 md:mb-40">
          <FadeUp>
            <div className="w-16 h-16 mx-auto bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] mb-8 border border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
               <Lock size={24}/>
            </div>
            <h1 className="text-6xl md:text-9xl lg:text-[120px] font-serif tracking-tighter leading-none italic mb-8">The Private <br/> Concierge.</h1>
            <p className="text-gray-400 font-serif italic text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed">
              Discreet acquisitions, bespoke sourcing, and secure asset allocations. Our advisors are at your absolute disposal.
            </p>
          </FadeUp>
        </div>

        {/* SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
           
           {/* LEFT: THE INQUIRY FORM */}
           <div className="lg:col-span-7">
             <FadeUp delay={0.2}>
                <div className="bg-[#0A0A0A] p-10 md:p-16 rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37] blur-[200px] opacity-[0.03] rounded-full pointer-events-none"></div>
                  
                  <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
                     <ShieldCheck className="text-[#D4AF37]" size={28}/>
                     <h3 className="text-3xl font-serif italic">Secure Transmission</h3>
                  </div>

                  <AnimatePresence mode="wait">
                    {isSuccess ? (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-20 text-center flex flex-col items-center">
                        <CheckCircle2 className="text-[#D4AF37] mb-6" size={60}/>
                        <h4 className="text-4xl font-serif italic mb-4">Transmission Secured</h4>
                        <p className="text-gray-500 font-serif italic text-lg">A senior advisor will contact you on your secure line shortly.</p>
                      </motion.div>
                    ) : (
                      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 ml-4">Legal Name</label>
                            <input required value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-6 rounded-3xl text-white font-serif italic text-lg outline-none focus:border-[#D4AF37] transition-all shadow-inner" placeholder="E.g. James Sterling" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 ml-4">Secure Contact Line</label>
                            <input required value={formState.phone} onChange={e => setFormState({...formState, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 p-6 rounded-3xl text-white font-serif italic text-lg outline-none focus:border-[#D4AF37] transition-all shadow-inner" placeholder="+41 00 000 0000" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 ml-4">Nature of Inquiry</label>
                          <select value={formState.subject} onChange={e => setFormState({...formState, subject: e.target.value})} className="w-full bg-black/50 border border-white/10 p-6 rounded-3xl text-white font-serif italic text-lg outline-none focus:border-[#D4AF37] transition-all shadow-inner appearance-none cursor-pointer">
                             <option value="Bespoke Allocation">Bespoke Watch Allocation</option>
                             <option value="Asset Sourcing">Rare Asset Sourcing</option>
                             <option value="Sell/Trade">Sell or Trade a Timepiece</option>
                             <option value="General Concierge">General Concierge Support</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 ml-4">Confidential Message</label>
                          <textarea required value={formState.message} onChange={e => setFormState({...formState, message: e.target.value})} rows={4} className="w-full bg-black/50 border border-white/10 p-6 rounded-3xl text-white font-serif italic text-lg outline-none focus:border-[#D4AF37] transition-all shadow-inner resize-none" placeholder="Provide reference numbers or specific requirements..." />
                        </div>

                        <button disabled={isSubmitting} type="submit" className="w-full bg-[#D4AF37] text-black py-8 rounded-full font-black uppercase tracking-[8px] text-[11px] hover:bg-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)] mt-4 flex items-center justify-center gap-4 disabled:opacity-50">
                          {isSubmitting ? "Encrypting..." : "Transmit to Concierge"} <Send size={18}/>
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
             </FadeUp>
           </div>

           {/* RIGHT: GLOBAL NODES & DIRECT CONTACT */}
           <div className="lg:col-span-5 space-y-12">
             <FadeUp delay={0.4}>
                <div className="bg-[#D4AF37] p-12 rounded-[50px] text-black shadow-[0_30px_60px_rgba(212,175,55,0.2)]">
                   <h3 className="text-3xl font-serif italic tracking-tighter mb-8 border-b border-black/10 pb-6">Direct Priority Line</h3>
                   <p className="text-sm font-black uppercase tracking-[4px] opacity-60 mb-2">Available 24/7</p>
                   <p className="text-4xl font-serif font-black mb-10">+41 22 731 9111</p>
                   <button onClick={directWhatsApp} className="w-full bg-black text-white py-6 rounded-full font-black uppercase tracking-[6px] text-[10px] hover:bg-[#002B19] transition-all flex items-center justify-center gap-4 shadow-2xl">
                      Initialize Secure WhatsApp <Phone size={16}/>
                   </button>
                </div>
             </FadeUp>

             <FadeUp delay={0.5}>
                <div className="p-10 border border-white/10 rounded-[50px] bg-[#0A0A0A]">
                   <div className="flex items-center gap-4 mb-10">
                      <Globe className="text-[#D4AF37]" size={24}/>
                      <h3 className="text-2xl font-serif italic">Global Nodes</h3>
                   </div>
                   <div className="space-y-8">
                      {[
                        { city: "Geneva, CH", desc: "Global Headquarters & Authentication Lab" },
                        { city: "London, UK", desc: "Private Client Lounge (Mayfair)" },
                        { city: "Dubai, UAE", desc: "Middle East Logistics Hub" }
                      ].map((node, i) => (
                        <div key={i} className="flex gap-6 items-start border-b border-white/5 last:border-0 pb-6 last:pb-0">
                           <MapPin className="text-gray-600 mt-1" size={20}/>
                           <div>
                             <h4 className="text-xl font-serif italic text-white mb-2">{node.city}</h4>
                             <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-500">{node.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </FadeUp>
           </div>

        </div>
      </main>

      {/* ♞ FOOTER ♞ */}
      <footer className="py-12 border-t border-white/5 text-center relative z-10">
         <p className="text-[9px] font-black uppercase tracking-[10px] text-gray-600">© 2026 Essential Rush. End-to-End Encrypted Node.</p>
      </footer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ConciergeNode), { ssr: false });
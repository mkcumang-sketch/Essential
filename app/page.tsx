"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, User, Truck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [settings, setSettings] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Database se Admin ka set kiya hua data laao
  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => setSettings(data));
  }, []);

  // Auto Slider Logic (Har 5 second mein image badlegi)
  useEffect(() => {
    if (settings?.heroSlides?.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % settings.heroSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [settings]);

  // Loading State (Swiss Red Spinner)
  if (!settings) return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#E3000F] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const activeSlide = settings.heroSlides[currentSlide] || settings.heroSlides[0];

  return (
    <div className="space-y-0 pb-20 overflow-x-hidden bg-[#F8F9FA]">
      
      {/* 1. DYNAMIC HERO MULTI-SLIDER (Swiss Theme) */}
      <section className="relative h-[85vh] bg-[#111827] flex items-center justify-center overflow-hidden border-b-4 border-[#E3000F]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {/* Dark Charcoal overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent z-10" />
            <img src={activeSlide?.imageUrl} className="w-full h-full object-cover opacity-70" alt="Hero" />
          </motion.div>
        </AnimatePresence>
        
        <div className="relative z-20 text-center text-white px-6">
          <motion.p 
            key={`sub-${currentSlide}`} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-[#E3000F] uppercase tracking-[0.5em] text-[10px] font-bold mb-6"
          >
            {activeSlide?.subtext || "Since 1946"}
          </motion.p>
          <motion.h1 
            key={`head-${currentSlide}`} 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }} 
            className="text-6xl md:text-8xl font-luxury italic mb-10 text-white drop-shadow-lg"
          >
            {activeSlide?.heading.split(' ').slice(0, -1).join(' ')} <br /> 
            <span className="font-sans font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {activeSlide?.heading.split(' ').slice(-1)}
            </span>
          </motion.h1>
          <button className="bg-[#E3000F] text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-[#E3000F] transition-all shadow-2xl shadow-red-900/50">
            Explore Collection
          </button>
        </div>

        {/* Slide Indicators (Swiss Red Active state) */}
        <div className="absolute bottom-10 z-20 flex gap-3">
          {settings.heroSlides.map((_: any, i: number) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-10 bg-[#E3000F]' : 'w-4 bg-white/30'}`} />
          ))}
        </div>
      </section>

      {/* 2. DYNAMIC LOGO / CATEGORY SCROLL (MARQUEE) */}
      <section className="py-12 bg-white border-b border-zinc-200 overflow-hidden relative shadow-sm">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex whitespace-nowrap gap-20 w-max items-center px-10"
        >
          {/* Double array for seamless infinite scroll loop */}
          {[...settings.categories, ...settings.categories].map((cat: any, i: number) => (
            <Link key={i} href={cat.link || "#"} className="flex flex-col items-center gap-4 group cursor-pointer hover:-translate-y-2 transition-transform">
              <div className="w-24 h-24 rounded-full border-2 border-zinc-100 overflow-hidden p-1 group-hover:border-[#E3000F] transition-colors bg-white shadow-sm">
                 <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#111827] group-hover:text-[#E3000F] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* 3. PREMIUM SERVICES (Swiss Trust Elements) */}
      <section className="grid grid-cols-1 md:grid-cols-3 bg-[#F8F9FA] max-w-7xl mx-auto py-10">
        {[
          { title: "Global Warranty", icon: ShieldCheck, desc: "5 Years international protection." },
          { title: "Authorized Dealer", icon: User, desc: "100% Authentic Timepieces." },
          { title: "Insured Transit", icon: Truck, desc: "Secured global door-to-door delivery." }
        ].map((s, i) => (
          <div key={i} className="p-16 text-center space-y-6 hover:bg-white transition-all group rounded-2xl m-4 border border-transparent hover:border-zinc-200 hover:shadow-xl cursor-default">
            <s.icon size={48} className="mx-auto text-[#111827] group-hover:scale-110 group-hover:text-[#E3000F] transition-all duration-300" />
            <h3 className="text-2xl font-luxury italic text-[#111827]">{s.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed italic">{s.desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
}
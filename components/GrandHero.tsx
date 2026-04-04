"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function GrandHero({ content }: { content: any }) {
  const [index, setIndex] = useState(0);
  // Admin se aayi images ya default luxury images
  const slides = content?.heroSlider?.length > 0 ? content.heroSlider : [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2680",
    "https://images.unsplash.com/photo-1547996663-b85580e9329d?q=80&w=2574"
  ];

  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      {/* BACKGROUND SCENE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img src={slides[index]} className="w-full h-full object-cover" alt="Hero background" />
        </motion.div>
      </AnimatePresence>

      {/* FLOATING 3D WATCH EFFECT */}
      <motion.div 
        animate={{ 
          y: [0, -30, 0],
          rotateZ: [0, 5, 0],
          filter: ["drop-shadow(0 20px 30px rgba(212,175,55,0.2))", "drop-shadow(0 40px 50px rgba(212,175,55,0.4))", "drop-shadow(0 20px 30px rgba(212,175,55,0.2))"]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-30 w-[300px] md:w-[500px] pointer-events-none"
      >
        <img src="https://pngimg.com/uploads/watches/watches_PNG9894.png" className="w-full h-auto drop-shadow-2xl" alt="Featured Watch" />
      </motion.div>

      {/* TEXT OVERLAY */}
      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center"
        >
          <h2 className="text-gold-500 font-bold uppercase tracking-[0.5em] text-[10px] md:text-xs mb-4">
            {content?.homeHero?.subHeading || "ESTABLISHED 2026"}
          </h2>
          <h1 className="text-white font-serif italic text-6xl md:text-[10rem] leading-none tracking-tighter mb-8">
            {content?.homeHero?.heading || "Essential Rush"}
          </h1>
          <div className="pointer-events-auto">
            <Link href="/collection" className="bg-white text-black px-12 py-5 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-gold-500 hover:text-black transition-all duration-500 rounded-full">
              Browse watches
            </Link>
          </div>
        </motion.div>
      </div>

      {/* SLIDER INDICATORS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        {slides.map((_: any, i: number) => (
          <div key={i} className={`h-[2px] transition-all duration-500 ${index === i ? "w-12 bg-gold-500" : "w-4 bg-white/20"}`} />
        ))}
      </div>
    </section>
  );
}
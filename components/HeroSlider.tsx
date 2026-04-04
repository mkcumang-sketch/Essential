"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSlider({ slides }: { slides: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides[current].type === 'image') {
      const timer = setTimeout(() => nextSlide(), 5000); // 5 sec for images
      return () => clearTimeout(timer);
    }
  }, [current]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div 
          key={current}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {slides[current].type === 'video' ? (
            <video 
              src={slides[current].url} autoPlay muted playsInline preload="none"
              onEnded={nextSlide}
              className="h-full w-full object-cover opacity-60"
            />
          ) : (
            <img src={slides[current].url} className="h-full w-full object-cover opacity-60" />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <motion.h1 initial={{ y: 30 }} animate={{ y: 0 }} className="text-6xl md:text-8xl font-serif italic mb-6">
              {slides[current].heading}
            </motion.h1>
            <button className="bg-[#D4AF37] text-black px-12 py-4 rounded-full font-black uppercase tracking-[6px] text-[10px]">
              Shop now
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
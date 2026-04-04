"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Menu, Search, ShoppingBag, ArrowLeft, ShieldCheck, Award, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// ================= ANIMATION UTILS =================
const FadeUp = ({ children, delay = 0, className = "" }: any) => (
  <motion.div initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }} viewport={{ once: true }} className={className}>
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
function HeritageEngine() {
  const router = useRouter();
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.2 });

  const textY = useTransform(smoothScroll, [0, 1], ["0%", "150%"]);
  const textOpacity = useTransform(smoothScroll, [0, 0.5], [1, 0]);
  const imageScale = useTransform(smoothScroll, [0, 1], [1, 1.2]);

  const timeline = [
    { year: "1839", title: "Where it began", desc: "Craftsmen in Geneva set the standard for fine watchmaking that we still follow today." },
    { year: "1926", title: "Built to last", desc: "Tough cases and careful seals so watches keep time even in harsh conditions." },
    { year: "1969", title: "Self-winding wins", desc: "Watches that wind as you move—less fuss, more wear." },
    { year: "2026", title: "Essential Rush", desc: "We pick standout watches for people who want quality without the noise." }
  ];

  return (
    <div className="bg-[#050505] text-[#FAFAFA] font-sans selection:bg-[#D4AF37] selection:text-black min-h-screen overflow-x-hidden">
      <CustomCursor />

      {/* ♞ FROSTED NAVIGATION ♞ */}
      <nav className="fixed top-0 w-full h-24 md:h-28 bg-[#050505]/80 backdrop-blur-xl z-[150] border-b border-white/5 flex items-center justify-between px-6 md:px-16 transition-all">
        <button onClick={() => router.back()} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[4px] hover:text-[#D4AF37] transition-colors"><ArrowLeft size={18}/> Back</button>
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer mt-2">
          <div className="text-[#D4AF37] text-3xl md:text-4xl mb-0.5 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">♞</div>
          <h1 className="text-xl md:text-2xl font-serif font-black tracking-[12px] uppercase text-white group-hover:text-[#D4AF37] transition-colors">Essential</h1>
        </Link>
        <div className="flex items-center gap-6">
           <button onClick={() => router.push('/catalogue')} className="hover:text-[#D4AF37] transition-colors"><Search size={22}/></button>
           <button onClick={() => router.push('/checkout')} className="hover:text-[#D4AF37] transition-colors"><ShoppingBag size={22}/></button>
        </div>
      </nav>

      {/* ♞ CINEMATIC PARALLAX HERO ♞ */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.img 
          style={{ scale: imageScale }}
          src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover grayscale filter contrast-125 opacity-40" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
        
        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 text-center px-6">
           <p className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[20px] md:tracking-[30px] mb-8">Since day one</p>
           <h1 className="text-6xl md:text-[140px] lg:text-[180px] font-serif tracking-tighter leading-[0.8] text-white italic drop-shadow-2xl">
             Built for <br/> the long run.
           </h1>
        </motion.div>
      </section>

      {/* ♞ THE PHILOSOPHY ♞ */}
      <section className="py-32 md:py-48 px-6 md:px-20 max-w-[1400px] mx-auto text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37] blur-[250px] opacity-[0.05] rounded-full pointer-events-none"></div>
        <FadeUp>
          <div className="text-[#D4AF37] mb-12 flex justify-center"><ShieldCheck size={50} strokeWidth={1}/></div>
          <h2 className="text-4xl md:text-7xl font-serif italic mb-16 leading-tight tracking-tighter">"We do not just sell watches. We help you own something worth passing down."</h2>
          <p className="text-gray-400 font-serif text-xl md:text-3xl leading-relaxed max-w-4xl mx-auto italic">
            Every watch we offer is checked with care. Our team in Geneva runs a full 30-day review so you know what you buy is real, sound, and ready to wear for years.
          </p>
        </FadeUp>
      </section>

      {/* ♞ THE TIMELINE ♞ */}
      <section className="py-32 md:py-48 bg-[#0A0A0A] border-t border-white/5 relative">
        <div className="max-w-[1600px] mx-auto px-6 md:px-20">
          <FadeUp className="text-center mb-32">
            <h2 className="text-5xl md:text-8xl font-serif italic tracking-tighter text-white">Our path</h2>
          </FadeUp>
          
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent md:-translate-x-1/2"></div>
            
            <div className="space-y-24 md:space-y-40">
              {timeline.map((item, i) => (
                <FadeUp key={i} delay={0.2}>
                  <div className={`flex flex-col md:flex-row items-center justify-between w-full relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="hidden md:block w-5/12"></div>
                    
                    {/* Glowing Node */}
                    <div className="absolute left-[-11px] md:left-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full bg-[#050505] border-2 border-[#D4AF37] z-10 shadow-[0_0_15px_#D4AF37]"></div>
                    
                    <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                      <h3 className="text-5xl md:text-7xl font-serif text-[#D4AF37] mb-6">{item.year}</h3>
                      <h4 className="text-3xl font-serif italic text-white mb-6 tracking-tighter">{item.title}</h4>
                      <p className="text-gray-400 text-lg leading-relaxed font-serif italic">{item.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ♞ CRAFTSMANSHIP GRID ♞ */}
      <section className="py-32 md:py-48 bg-[#050505] relative overflow-hidden">
        <div className="max-w-[2000px] mx-auto px-6 md:px-20">
          <FadeUp className="mb-24 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-12">
            <div>
              <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[10px] mb-6">The workshop</p>
              <h2 className="text-6xl md:text-[100px] font-serif tracking-tighter italic">Swiss skill</h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Hand finish", desc: "Tiny details polished by hand so the movement looks as good as it runs.", img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800" },
              { title: "Timing tests", desc: "Checked to run accurately—stricter than everyday factory checks.", img: "https://images.unsplash.com/photo-1508685096489-77a46807e604?q=80&w=800" },
              { title: "Final build", desc: "Put together by watchmakers who have done this for decades.", img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=800" }
            ].map((craft, i) => (
              <FadeUp key={i} delay={i * 0.2}>
                <div className="group relative h-[600px] rounded-[40px] overflow-hidden bg-black shadow-2xl">
                  <img src={craft.img} className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity duration-1000 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end">
                    <h4 className="text-3xl font-serif italic text-white mb-4 group-hover:-translate-y-2 transition-transform">{craft.title}</h4>
                    <p className="text-gray-400 font-serif italic text-lg opacity-0 group-hover:opacity-100 transition-opacity">{craft.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ♞ FOOTER CALL TO ACTION ♞ */}
      <section className="py-40 bg-[#001A0F] text-center border-t border-[#D4AF37]/20">
        <FadeUp>
          <div className="w-20 h-20 mx-auto rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-10"><Compass size={32}/></div>
          <h2 className="text-5xl md:text-7xl font-serif italic mb-10">Find your watch</h2>
          <p className="text-gray-400 text-xl md:text-2xl font-serif italic max-w-2xl mx-auto mb-16">Browse watches chosen for quality and lasting style.</p>
          <button onClick={() => router.push('/catalogue')} className="bg-[#D4AF37] text-black px-16 py-6 rounded-full text-[10px] font-black uppercase tracking-[8px] hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center gap-4 mx-auto group">
            Browse catalogue <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform"/>
          </button>
        </FadeUp>
      </section>

    </div>
  );
}

export default dynamic(() => Promise.resolve(HeritageEngine), { ssr: false });
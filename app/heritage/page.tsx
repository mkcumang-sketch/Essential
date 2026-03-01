"use client";
import Link from "next/link";
import { ArrowRight, Anchor, Cpu, Wind } from "lucide-react";

export default function HeritagePage() {
  return (
    <div className="min-h-screen bg-white text-black font-serif">
      
      {/* 🏔️ SECTION 1: THE MOUNTAIN HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          alt="Swiss Alps"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
        <div className="relative z-10 text-center space-y-6 px-4">
          <p className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] animate-pulse">Est. 1924 • Swiss Valleys</p>
          <h1 className="text-6xl md:text-[100px] leading-none uppercase italic tracking-tighter">Born in <br /> the Silence.</h1>
          <div className="w-20 h-[1px] bg-black mx-auto mt-10"></div>
        </div>
      </section>

      {/* 🛠️ SECTION 2: CRAFTSMANSHIP GRID */}
      <section className="py-32 max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-6xl italic uppercase tracking-tighter">The Hands <br /> of Time</h2>
            <p className="text-gray-500 font-sans leading-loose text-sm max-w-md">
              Every Essential Rush timepiece undergoes 400 hours of precision calibration. Our master watchmakers in the Jura Mountains assemble 120 microscopic parts by hand, ensuring that your legacy ticks with absolute perfection.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2">
                <Cpu className="w-6 h-6 text-gold" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest">Nano-Calibration</h4>
                <p className="text-[10px] text-gray-400 font-sans italic">Accuracy within 0.02 seconds.</p>
              </div>
              <div className="space-y-2">
                <Wind className="w-6 h-6 text-gold" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest">Atmospheric Sealed</h4>
                <p className="text-[10px] text-gray-400 font-sans italic">Protected against 50ATM pressure.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1974" 
              className="w-full h-auto shadow-2xl grayscale hover:grayscale-0 transition-all duration-[2s]" 
            />
            <div className="absolute -bottom-10 -left-10 bg-black text-white p-10 hidden md:block">
               <p className="text-xs italic">"We don't build watches. We forge memories."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 📜 SECTION 3: THE LEGACY TIMELINE */}
      <section className="bg-[#FDFBF7] py-32 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl italic uppercase mb-20 tracking-tighter">A Century of Precision</h3>
          <div className="space-y-20 relative">
             {/* Vertical Line */}
             <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200 -translate-x-1/2 hidden md:block"></div>
             
             {[
               { year: "1924", event: "The first prototype forged in a small Swiss workshop." },
               { year: "1958", event: "Introduced the first anti-magnetic diver's masterpiece." },
               { year: "2025", event: "Essential Rush goes global with the Digital Vault." }
             ].map((item, i) => (
               <div key={i} className={`flex flex-col md:flex-row items-center justify-between ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-full md:w-[40%] text-center md:text-left space-y-2">
                     <span className="text-gold text-2xl font-black font-sans">{item.year}</span>
                     <p className="text-xs uppercase font-bold tracking-widest leading-relaxed">{item.event}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-black border-4 border-white z-10 my-4 md:my-0"></div>
                  <div className="w-full md:w-[40%]"></div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 🏁 CTA SECTION */}
      <section className="py-40 text-center bg-white">
          <h2 className="text-4xl italic mb-10">Own the Heritage.</h2>
          <Link href="/collection" className="bg-black text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-gold hover:text-black transition-all">
             Enter The Collection <ArrowRight className="ml-4 w-4 h-4 inline" />
          </Link>
      </section>

    </div>
  );
}
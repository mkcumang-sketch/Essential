"use client";
import Navbar from "@/components/Navbar";
import { ShieldCheck, Users, Globe, Clock } from "lucide-react";

export default function About() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar theme="dark" />
      
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"/>
         <img src="https://images.unsplash.com/photo-1548171915-e79a380a2a4b?q=80&w=2400" className="absolute inset-0 w-full h-full object-cover opacity-50"/>
         <div className="relative z-20 text-center px-6">
            <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Our Legacy</h1>
            <p className="text-gold-500 text-xs font-bold uppercase tracking-[0.3em]">Est. 2026</p>
         </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-24 space-y-12 text-center">
         <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300">
            "Essential Rush wasn't born to sell watches. We were born to curate time. 
            We believe that a timepiece isn't just an accessory; it's a custodian of your legacy."
         </p>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
            {[
               { icon: ShieldCheck, label: "Certified Authentic" },
               { icon: Users, label: "20k+ Members" },
               { icon: Globe, label: "Global Shipping" },
               { icon: Clock, label: "24/7 Concierge" },
            ].map((item, i) => (
               <div key={i} className="flex flex-col items-center gap-4 p-6 border border-white/10 rounded-2xl hover:border-gold-500 transition-colors">
                  <item.icon className="text-gold-500" size={32}/>
                  <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
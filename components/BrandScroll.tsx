"use client";
import { motion } from "framer-motion";

const brands = [
  "Rolex", "Patek Philippe", "Audemars Piguet", "Richard Mille", "Omega", "Cartier"
];

export default function BrandScroll() {
  return (
    <div className="py-12 bg-black border-y border-white/5 overflow-hidden flex relative z-20">
      <motion.div 
        className="flex gap-20 items-center whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...brands, ...brands, ...brands].map((brand, i) => (
          <h3 key={i} className="text-4xl md:text-6xl font-serif text-white/10 font-bold italic uppercase tracking-tighter hover:text-gold-500 transition-colors cursor-pointer">
            {brand}
          </h3>
        ))}
      </motion.div>
    </div>
  );
}
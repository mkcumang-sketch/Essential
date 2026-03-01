"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BrandMarquee({ brands }: { brands: any[] }) {
  // Safe array check taaki crash na ho
  const safeBrands = brands?.length > 0 ? brands : [
    { name: "Rolex", slug: "rolex" },
    { name: "Patek Philippe", slug: "patek-philippe" },
    { name: "Omega", slug: "omega" },
    { name: "Cartier", slug: "cartier" },
    { name: "Audemars Piguet", slug: "audemars-piguet" }
  ];

  // Infinite scroll ke liye double array
  const displayBrands = [...safeBrands, ...safeBrands];

  return (
    <section className="py-20 bg-black overflow-hidden border-y border-white/5">
      <div className="mb-10 text-center">
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 italic">
          Featured Manufactures
        </h2>
      </div>

      <div className="flex w-full">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex flex-nowrap gap-20 items-center whitespace-nowrap"
        >
          {displayBrands.map((brand, i) => (
            <Link 
              key={i} 
              href={`/brand/${brand.slug || brand.name.toLowerCase().replace(/\s/g, "-")}`}
              className="group flex items-center gap-4 transition-all"
            >
              <img 
                // Auto Logo Generator Logic
                src={brand.logo || `https://logo.clearbit.com/${brand.name.toLowerCase().replace(/\s/g, "")}.com?size=200`} 
                alt={brand.name}
                className="h-8 md:h-12 w-auto object-contain brightness-0 invert opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                onError={(e) => (e.currentTarget.style.display = "none")} // Hide if logo not found
              />
              <span className="text-white/10 group-hover:text-gold-500 font-serif italic text-2xl md:text-4xl transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
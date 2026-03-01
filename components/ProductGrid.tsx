"use client";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function ProductGrid({ products }: { products: any[] }) {
  return (
    <section className="py-24 px-10 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end mb-16 border-b border-[#E5E1DA] pb-8">
        <div>
          <h2 className="text-4xl italic font-light">Curated Masterpieces</h2>
          <p className="text-zinc-400 text-sm mt-2 uppercase tracking-widest">Hand-picked by our Master Horologists</p>
        </div>
        <button className="flex items-center gap-2 text-[#C9A24D] font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all">
          View All <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {products.map((p, idx) => (
          <motion.div 
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/5] bg-[#F2F0EB] overflow-hidden border border-transparent group-hover:border-[#C9A24D]/30 transition-all duration-500">
              <img 
                src={p.images[0]} 
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-1000" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all" />
              <button className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl flex items-center gap-2">
                <ShoppingBag size={14} /> Add to Cart
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-[10px] text-[#C9A24D] font-black uppercase tracking-[0.2em] mb-1">{p.brand}</p>
              <h3 className="text-sm font-medium tracking-tight group-hover:text-[#C9A24D] transition-colors uppercase">{p.title}</h3>
              <p className="mt-2 font-bold text-lg italic">₹{p.price.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
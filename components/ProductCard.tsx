"use client";
import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ watch, addToCart }: { watch: any, addToCart: any }) => {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group bg-white p-10 rounded-[60px] border border-gray-100 hover:shadow-xl transition-all relative flex flex-col h-full">
      <Link href={`/product/${watch.slug || watch._id}`} className="flex aspect-[4/5] bg-[#FDFDFD] rounded-[45px] overflow-hidden mb-10 items-center justify-center p-12">
        <motion.img whileHover={{ scale: 1.1 }} src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain" />
      </Link>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[5px] italic">{watch.brand}</p>
          <h4 className="text-3xl font-serif text-[#050505] leading-tight mb-8 tracking-tighter">{watch.name || watch.title}</h4>
        </div>
        <div className="flex justify-between items-center mt-auto pt-8 border-t border-gray-50">
          <p className="text-3xl text-[#002B19] font-black tracking-tighter font-serif">₹{Number(watch.offerPrice || watch.price).toLocaleString('en-IN')}</p>
          <button onClick={(e) => { e.preventDefault(); addToCart(watch); }} className="p-5 bg-[#050505] text-white rounded-3xl hover:bg-[#D4AF37] transition-all shadow-xl"><Plus size={24}/></button>
        </div>
      </div>
    </motion.div>
  );
};

// 🚨 YEH SABSE ZAROORI LINE HAI
export default ProductCard;
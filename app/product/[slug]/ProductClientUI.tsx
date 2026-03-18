"use client";

import React, { useState } from 'react';
import { useCartStore } from '@/store/cartStore'; // 🚨 Global Store Connected
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, ShieldCheck } from 'lucide-react';

export default function ProductClientUI({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  
  // Variant Management (Color/Size)
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [mainImage, setMainImage] = useState(product.images?.[0]?.url || '');
  const [qty, setQty] = useState(1);

  const currentPrice = product.basePrice + (selectedVariant?.priceAdjustment || 0);

  const handleAddToCart = () => {
    if (!selectedVariant) return alert("Please select a variant");
    
    addItem({
      productId: product._id,
      name: product.title,
      price: currentPrice,
      qty: qty,
      sku: selectedVariant.sku,
      imageUrl: mainImage
    });
    
    alert("Asset added to your portfolio securely.");
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-16 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
      
      {/* GALLERY */}
      <div>
        <div className="aspect-square bg-[#111] rounded-[30px] p-8 border border-white/5 flex items-center justify-center">
           <img src={mainImage} className="w-full h-full object-contain" alt={product.title} />
        </div>
        <div className="flex gap-4 mt-6">
           {product.images?.map((img: any, i: number) => (
              <img 
                key={i} 
                src={img.url} 
                onMouseEnter={() => setMainImage(img.url)}
                className={`w-20 h-20 rounded-xl cursor-pointer border ${mainImage === img.url ? 'border-[#D4AF37]' : 'border-white/10'}`} 
              />
           ))}
        </div>
      </div>

      {/* DETAILS & VARIANTS */}
      <div className="pt-8">
        <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[6px] mb-4">{product.brand}</p>
        <h1 className="text-5xl font-serif italic mb-6 leading-tight">{product.title}</h1>
        
        <div className="text-4xl font-black mb-8">₹{currentPrice.toLocaleString()}</div>

        {/* VARIANTS SELECTOR */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Select Variant</p>
            <div className="flex flex-wrap gap-4">
               {product.variants.map((variant: any) => (
                 <button 
                   key={variant.sku}
                   onClick={() => setSelectedVariant(variant)}
                   className={`px-6 py-3 rounded-full text-xs font-bold border transition-all ${selectedVariant?.sku === variant.sku ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50'}`}
                 >
                   {variant.attributes?.color} / {variant.attributes?.size}
                 </button>
               ))}
            </div>
          </div>
        )}

        <button 
          onClick={handleAddToCart}
          className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-[4px] text-xs hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3"
        >
          <ShoppingBag size={18}/> Secure Allocation
        </button>

        <div className="mt-10 pt-10 border-t border-white/10 text-gray-400 font-serif italic text-lg leading-relaxed">
           {product.description}
        </div>
      </div>
    </div>
  );
}
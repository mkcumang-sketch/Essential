"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Search, Plus, LayoutGrid, SlidersHorizontal, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}>{children}</motion.div>
);

export default function ImperialCollectionNode() {
  const router = useRouter();
  const params = useParams();
  const rawSlug = params?.slug;
  const slugStr = typeof rawSlug === 'string' ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] ?? '' : '';
  const collectionName = slugStr
    ? slugStr.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    : 'Collection';

  const [watches, setWatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await fetch(`/api/products?search=${collectionName}&limit=20`);
        if (res.ok) {
          const result = await res.json();
          const exactMatches = result.data?.filter((w: any) => 
            w.brand.toLowerCase().includes(collectionName.toLowerCase()) || 
            w.category?.toLowerCase().includes(collectionName.toLowerCase())
          ) || result.data; 
          setWatches(exactMatches || []);
        }
        const cart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
        setCartCount(cart.length);
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchCollection();
  }, [collectionName]);

  const handleAllocation = (product: any) => {
    const cart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
    localStorage.setItem('luxury_cart', JSON.stringify([...cart, product]));
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#050505] font-sans">
      <nav className="h-28 bg-white/90 backdrop-blur-2xl border-b border-gray-100 flex items-center justify-between px-6 md:px-20 sticky top-0 z-[100]">
        <Link href="/" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[4px] hover:text-[#D4AF37] transition-all"><ArrowLeft size={20}/> <span className="hidden sm:inline">Imperial Home</span></Link>
        <div className="text-center absolute left-1/2 -translate-x-1/2 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="text-[#002B19] text-3xl mb-0.5 group-hover:scale-110 transition-transform">♞</div><h1 className="text-[12px] font-serif font-black tracking-[10px] uppercase">Essential</h1>
        </div>
        <div className="flex items-center gap-6 md:gap-8"><Search size={20} className="text-gray-400 hover:text-black cursor-pointer hidden md:block" onClick={() => router.push('/catalogue')}/><div className="relative cursor-pointer group" onClick={() => router.push('/checkout')}><ShoppingBag size={24} className="group-hover:scale-110 transition-transform"/>{cartCount > 0 && <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">{cartCount}</span>}</div></div>
      </nav>

      <main>
        <section className="bg-[#050505] text-white py-32 md:py-56 px-6 md:px-20 relative overflow-hidden flex flex-col items-center text-center">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 blur-[150px] rounded-full"></div>
           <FadeUp><p className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[15px] mb-8">Curated Collection</p></FadeUp>
           <FadeUp delay={0.2}><h1 className="text-6xl md:text-9xl lg:text-[140px] font-serif italic tracking-tighter leading-none relative z-10 drop-shadow-2xl px-4">{collectionName}</h1></FadeUp>
        </section>

        <section className="max-w-[2200px] mx-auto p-6 md:p-12 lg:p-24">
          <div className="flex justify-between items-center mb-16 border-b border-gray-200 pb-10"><div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[5px] text-gray-500"><LayoutGrid size={16}/> {loading ? "Scanning Vault..." : `${watches.length} Assets Found`}</div></div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">{[...Array(6)].map((_, i) => (<div key={i} className="bg-white p-10 rounded-[60px] border border-gray-100 animate-pulse h-[550px]"><div className="aspect-[4/5] bg-gray-50 rounded-[40px] mb-8"></div></div>))}</div>
            ) : watches.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 text-center"><div className="text-7xl md:text-9xl text-gray-200 mb-10 italic font-serif">Empty Vault</div><button onClick={() => router.push('/catalogue')} className="mt-12 px-12 py-5 bg-[#002B19] text-[#D4AF37] rounded-full text-[10px] font-black uppercase tracking-[5px] shadow-2xl hover:bg-black transition-all">Return to Global Catalogue</button></motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
                {watches.map((watch, i) => (
                  <motion.div key={watch._id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group bg-white p-8 md:p-10 rounded-[50px] md:rounded-[60px] border border-gray-100 hover:shadow-2xl transition-all duration-700 relative flex flex-col h-full">
                    <Link href={`/product/${watch._id}`} className="aspect-[4/5] bg-[#FDFDFD] rounded-[45px] overflow-hidden mb-8 md:mb-10 flex items-center justify-center p-8 md:p-12 relative border border-gray-50 group-hover:border-[#D4AF37]/20 transition-colors shadow-inner"><motion.img whileHover={{ scale: 1.1, rotate: -2 }} transition={{ duration: 1 }} src={watch.imageUrl} className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)]" /></Link>
                    <div className="flex-1 flex flex-col"><p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[5px] italic mb-2">{watch.brand}</p><h4 className="text-2xl md:text-3xl font-serif font-black italic tracking-tighter leading-tight text-[#050505] group-hover:text-[#D4AF37] transition-colors line-clamp-2">{watch.name}</h4>
                      <div className="mt-auto pt-8 border-t border-gray-50 flex justify-between items-center"><p className="text-3xl text-[#002B19] font-black tracking-tighter font-serif italic">₹{watch.price.toLocaleString()}</p><button onClick={() => handleAllocation(watch)} className="p-5 bg-black text-white rounded-[25px] hover:bg-[#D4AF37] transition-all shadow-xl active:scale-95"><Plus size={24}/></button></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
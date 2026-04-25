"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Plus, Sparkles } from 'lucide-react';

interface Watch {
  _id: string;
  slug?: string;
  name?: string;
  title?: string;
  imageUrl?: string;
  images?: string[];
  offerPrice?: number;
  price?: number;
}

export default function NewArrivalsClient({ initialLiveWatches }: { initialLiveWatches: Watch[] }) {
      const router = useRouter();
      const [cart, setCart] = useState<any[]>([]);

      useEffect(() => {
            setCart(JSON.parse(localStorage.getItem('luxury_cart') || '[]'));
      }, []);

      const addToCart = (product: Watch) => {
            const exists = cart.find(item => item._id === product._id);
            const newCart = exists ? cart.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i) : [...cart, { ...product, qty: 1 }];
            setCart(newCart);
            localStorage.setItem('luxury_cart', JSON.stringify(newCart));
            router.push('/checkout');
      };

      return (
            <div className="min-h-screen bg-[#FAFAFA] text-[#050505] font-sans">
                  <header className="w-full bg-white border-b border-gray-200 py-6 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black"><ArrowLeft size={16} /> Back to Store</Link>
                        <h1 className="text-2xl font-serif font-black tracking-[5px] uppercase absolute left-1/2 -translate-x-1/2">Essential</h1>
                        <div className="relative cursor-pointer" onClick={() => router.push('/checkout')}>
                              <ShoppingBag size={24} className="text-black" />
                              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">{cart.length}</span>}
                        </div>
                  </header>

                  <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-20">
                        <div className="mb-16 flex flex-col items-center text-center">
                              <Sparkles size={40} className="text-[#D4AF37] mb-6" />
                              <h2 className="text-5xl md:text-7xl font-serif italic text-black tracking-tighter mb-4">New Arrivals</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                              {initialLiveWatches.map((watch: Watch, i: number) => (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={watch._id || i} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative">
                                          <Link href={`/product/${watch.slug || watch._id}`} className="flex aspect-[4/5] bg-gray-50 rounded-[30px] overflow-hidden mb-8 items-center justify-center p-8 cursor-pointer">
                                                <img src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={watch.name || watch.title} />
                                          </Link>
                                          <div className="flex-1 flex flex-col justify-between">
                                                <h4 className="text-2xl font-serif text-[#050505] leading-tight mb-4 tracking-tighter group-hover:text-[#D4AF37] transition-colors line-clamp-2">{watch.name || watch.title}</h4>
                                                <div className="flex justify-between items-end mt-auto pt-6 border-t border-gray-100">
                                                      <p className="text-2xl text-black font-black font-serif">₹{Number(watch.offerPrice || watch.price).toLocaleString('en-IN')}</p>
                                                      <button onClick={(e) => { e.preventDefault(); addToCart(watch); }} className="p-4 bg-black text-white rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all"><Plus size={20} /></button>
                                                </div>
                                          </div>
                                    </motion.div>
                              ))}
                        </div>
                  </main>
            </div>
      );
}
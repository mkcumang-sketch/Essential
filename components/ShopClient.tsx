"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Plus, X, ArrowLeft, Check, SlidersHorizontal, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function ShopClient({ initialProducts }: { initialProducts: any[] }) {
      const router = useRouter();
      const { data: session } = useSession();
      const [cart, setCart] = useState<any[]>([]);
      const [searchQuery, setSearchQuery] = useState("");
      const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
      const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
      const [sortBy, setSortBy] = useState("NEWEST");

      useEffect(() => {
            setCart(JSON.parse(localStorage.getItem('luxury_cart') || '[]'));
      }, []);

      const toggleFilter = (setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
            setState(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
      };

      const filteredAndSortedProducts = useMemo(() => {
            let result = [...initialProducts];
            if (searchQuery) {
                  const q = searchQuery.toLowerCase();
                  result = result.filter(p => (p.name || p.title || "").toLowerCase().includes(q) || (p.brand || "").toLowerCase().includes(q));
            }
            if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand));
            if (selectedCategories.length > 0) result = result.filter(p => selectedCategories.includes(p.category));

            if (sortBy === "PRICE_LOW") result.sort((a, b) => (Number(a.offerPrice || a.price) - Number(b.offerPrice || b.price)));
            else if (sortBy === "PRICE_HIGH") result.sort((a, b) => (Number(b.offerPrice || b.price) - Number(a.offerPrice || a.price)));
            else result.sort((a, b) => (b.priority || 0) - (a.priority || 0));
            return result;
      }, [initialProducts, searchQuery, selectedBrands, selectedCategories, sortBy]);

      const addToCart = (product: any, e: React.MouseEvent) => {
            e.preventDefault(); e.stopPropagation();
            if (!session) { router.push('/login'); return; }
            const exists = cart.find(item => item._id === product._id);
            const newCart = exists ? cart.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i) : [...cart, { ...product, qty: 1 }];
            setCart(newCart);
            localStorage.setItem('luxury_cart', JSON.stringify(newCart));
      };

      return (
            <div className="min-h-screen bg-[#FAFAFA] text-black font-sans">
                  <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                              <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500 hover:text-black"><ArrowLeft size={20} /></Link>
                              <h1 className="text-lg md:text-2xl font-serif font-black tracking-[4px] uppercase text-black">Essential</h1>
                        </div>
                        <div className="flex items-center gap-6">
                              <div className="relative cursor-pointer group" onClick={() => router.push('/checkout')}>
                                    <ShoppingBag size={22} className="text-black group-hover:scale-110 transition-transform" />
                                    {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">{cart.length}</span>}
                              </div>
                        </div>
                  </header>

                  <main className="max-w-[1800px] mx-auto px-4 md:px-8 py-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                              <h2 className="text-3xl font-serif italic text-black tracking-tight">The Collection</h2>
                              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border border-gray-200 text-[10px] font-black uppercase py-2 px-4 rounded-lg outline-none cursor-pointer">
                                    <option value="NEWEST">Newest First</option>
                                    <option value="PRICE_LOW">Price: Low to High</option>
                                    <option value="PRICE_HIGH">Price: High to Low</option>
                              </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
                              {filteredAndSortedProducts.map((watch: any) => (
                                    <Link href={`/product/${watch._id}`} key={watch._id} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative">
                                          <div className="flex aspect-[4/5] bg-gray-50 rounded-[30px] overflow-hidden mb-8 items-center justify-center p-8 relative">
                                                <img src={watch.images?.[0]} className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" alt={watch.name || watch.title} />
                                          </div>
                                          <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                      <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[3px] mb-2">{watch.brand}</p>
                                                      <h4 className="text-2xl font-serif text-[#050505] leading-tight mb-4 tracking-tighter group-hover:text-[#D4AF37] transition-colors line-clamp-2">{watch.name || watch.title}</h4>
                                                </div>
                                                <div className="flex justify-between items-end mt-auto pt-6 border-t border-gray-100">
                                                      <p className="text-2xl text-black font-black font-serif">₹{Number(watch.offerPrice || watch.price).toLocaleString()}</p>
                                                      <button onClick={(e) => addToCart(watch, e)} className="p-4 bg-black text-white rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-colors shadow-lg"><Plus size={20} /></button>
                                                </div>
                                          </div>
                                    </Link>
                              ))}
                        </div>
                  </main>
            </div>
      );
}
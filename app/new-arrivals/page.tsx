"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Plus, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

function NewArrivalsPage() {
    const router = useRouter();
    const [liveWatches, setLiveWatches] = useState<any[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Safe Client-Side Cart Loading
        setCart(JSON.parse(localStorage.getItem('luxury_cart') || '[]'));
        
        const fetchProducts = async () => {
            try {
                const ts = new Date().getTime();
                const res = await fetch(`/api/products?t=${ts}`);
                const data = await res.json();
                if(data.data) {
                    // Sort by priority/newest
                    setLiveWatches(data.data.sort((a:any, b:any) => (b.priority || 0) - (a.priority || 0)));
                }
            } catch(e) {
                console.error("Error fetching products");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product: any) => {
        const exists = cart.find(item => item._id === product._id);
        const newCart = exists ? cart.map(i => i._id === product._id ? {...i, qty: i.qty+1} : i) : [...cart, {...product, qty: 1}];
        setCart(newCart);
        localStorage.setItem('luxury_cart', JSON.stringify(newCart));
        router.push('/checkout');
    };

    if (isLoading) return <div className="h-screen bg-[#FAFAFA] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#050505] font-sans selection:bg-[#D4AF37] selection:text-white">
            
            {/* HEADER */}
            <header className="w-full bg-white border-b border-gray-200 py-6 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"><ArrowLeft size={16}/> Back to Store</Link>
                <h1 className="text-2xl font-serif font-black tracking-[5px] uppercase absolute left-1/2 -translate-x-1/2">Essential</h1>
                <div className="relative cursor-pointer group" onClick={() => router.push('/checkout')}>
                    <ShoppingBag size={24} className="text-black group-hover:scale-110 transition-transform"/>
                    {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">{cart.length}</span>}
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-20">
                <div className="mb-16 flex flex-col items-center text-center">
                    <Sparkles size={40} className="text-[#D4AF37] mb-6" />
                    <h2 className="text-5xl md:text-7xl font-serif italic text-black tracking-tighter mb-4">New Arrivals</h2>
                    <p className="text-[10px] font-black uppercase tracking-[5px] text-gray-500">Fresh watches just in</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {liveWatches.map((watch: any, i: number) => (
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: i*0.05}} key={watch._id || i} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:shadow-2xl hover:border-[#D4AF37]/30 transition-all duration-500 flex flex-col h-full relative">
                            {watch.badge && <span className="absolute top-8 left-8 bg-[#D4AF37] text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md z-20">{watch.badge}</span>}
                            
                            <div className="flex justify-between items-start mb-6">
                                {watch.stock < 3 ? <span className="bg-red-500 text-white text-[8px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full animate-pulse">Few Left</span> : <span></span>}
                                <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[3px] ml-auto">{watch.brand}</p>
                            </div>
                            
                            <Link href={`/product/${watch.slug || watch._id}`} className="flex aspect-[4/5] bg-gray-50 rounded-[30px] overflow-hidden mb-8 items-center justify-center p-8 relative cursor-pointer">
                                <img src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
                            </Link>
                            
                            <div className="flex-1 flex flex-col justify-between">
                                <h4 className="text-2xl font-serif text-[#050505] leading-tight mb-4 tracking-tighter group-hover:text-[#D4AF37] transition-colors line-clamp-2">{watch.name || watch.title}</h4>
                                <div className="flex justify-between items-end mt-auto pt-6 border-t border-gray-100">
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl text-black font-black tracking-tighter font-serif">₹{Number(watch.offerPrice || watch.price || watch.basePrice || 0).toLocaleString('en-IN')}</p>
                                            {(watch.offerPrice && (watch.price || watch.basePrice) > watch.offerPrice) && <p className="text-gray-300 line-through text-[10px] font-black">₹{Number(watch.price || watch.basePrice || 0).toLocaleString()}</p>}
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.preventDefault(); addToCart(watch); }} className="p-4 bg-black text-white rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-colors shadow-lg"><Plus size={20}/></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}

// 🌟 THIS LINE BYPASSES THE VERCEL BUILD CRASH 🌟
export default dynamic(() => Promise.resolve(NewArrivalsPage), { ssr: false });
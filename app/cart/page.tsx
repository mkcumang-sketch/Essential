"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import dynamic from 'next/dynamic';

function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Sirf browser mein load hoga, Vercel ko crash nahi karega
        setCart(JSON.parse(localStorage.getItem('luxury_cart') || '[]'));
        setIsLoaded(true);
    }, []);

    const removeItem = (id: string) => {
        const newCart = cart.filter(item => item._id !== id);
        setCart(newCart);
        localStorage.setItem('luxury_cart', JSON.stringify(newCart));
    };

    const cartTotal = cart.reduce((total, item) => total + ((item.offerPrice || item.price) * (item.qty || 1)), 0);

    if (!isLoaded) return <div className="h-screen bg-[#FAFAFA] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black">
            <header className="w-full bg-white border-b border-gray-200 py-6 px-6 md:px-12 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black"><ArrowLeft size={16}/> Continue Shopping</Link>
                <h1 className="text-2xl font-serif font-black tracking-[5px] uppercase absolute left-1/2 -translate-x-1/2">Essential</h1>
            </header>

            <main className="max-w-4xl mx-auto pt-16 pb-20 px-6">
                <h2 className="text-4xl font-serif text-black mb-10 flex items-center gap-4"><ShoppingBag size={32} className="text-[#D4AF37]"/> Your Asset Cart</h2>
                
                {cart.length === 0 ? (
                    <div className="bg-white p-12 rounded-[30px] border border-gray-200 text-center shadow-sm">
                        <ShoppingBag size={60} className="mx-auto text-gray-300 mb-6"/>
                        <h3 className="text-2xl font-serif mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 text-sm mb-8">Browse our collection to add premium timepieces.</p>
                        <Link href="/" className="px-8 py-4 bg-black text-white font-bold uppercase text-xs rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors">Explore Vault</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {cart.map((item, i) => (
                            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={i} className="bg-white p-6 rounded-[25px] border border-gray-200 flex items-center gap-6 shadow-sm">
                                <div className="w-24 h-24 bg-gray-50 rounded-xl p-2 shrink-0">
                                    <img src={item.imageUrl || (item.images && item.images[0])} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.brand}</p>
                                    <h4 className="text-lg font-serif font-bold text-black">{item.name}</h4>
                                    <p className="text-sm font-bold mt-2">₹{Number(item.offerPrice || item.price).toLocaleString('en-IN')}</p>
                                </div>
                                <button onClick={() => removeItem(item._id)} className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={18}/></button>
                            </motion.div>
                        ))}
                        
                        <div className="bg-black text-white p-8 rounded-[30px] mt-10 shadow-xl">
                            <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-6">
                                <span className="font-serif text-xl">Total Investment</span>
                                <span className="text-3xl font-serif font-black text-[#D4AF37]">₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <button onClick={() => router.push('/checkout')} className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase tracking-[4px] rounded-2xl hover:bg-white transition-colors text-sm">Proceed to Checkout</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// 🌟 THE MAGIC FIX: Bypasses Vercel SSR Crash 🌟
export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
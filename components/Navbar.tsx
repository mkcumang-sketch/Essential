"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { User, Search, ShoppingBag, Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 🌟 Glassmorphism Scroll Effect
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
                    
                    {/* LEFT: Hamburger (Mobile) & Links (Desktop) */}
                    <div className="flex-1 flex items-center justify-start">
                        <button className="md:hidden text-gray-900" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} strokeWidth={1.5} />
                        </button>
                        <nav className="hidden md:flex gap-8">
                            <Link href="/#collection" className="text-[10px] uppercase tracking-[2px] font-medium text-gray-900 hover:text-gray-500 transition-colors">Timepieces</Link>
                            <Link href="/#heritage" className="text-[10px] uppercase tracking-[2px] font-medium text-gray-900 hover:text-gray-500 transition-colors">Heritage</Link>
                        </nav>
                    </div>

                    {/* CENTER: The Brand Identity */}
                    <div className="flex-1 flex justify-center">
                        <Link href="/" className="text-2xl md:text-3xl font-serif tracking-[6px] uppercase text-gray-900">
                            Essential
                        </Link>
                    </div>

                    {/* RIGHT: Dynamic Auth & Cart */}
                    <div className="flex-1 flex justify-end items-center gap-5 md:gap-8">
                        <button className="hidden md:block text-gray-900 hover:text-gray-500 transition-colors">
                            <Search size={20} strokeWidth={1.5} />
                        </button>
                        
                        {/* 💎 THE DYNAMIC AUTH ENGINE 💎 */}
                        <div className="flex items-center">
                            {status === 'loading' ? (
                                <div className="w-4 h-4 rounded-full border-[2px] border-gray-200 border-t-gray-900 animate-spin"></div>
                            ) : status === 'authenticated' ? (
                                <Link href="/account" className="flex items-center gap-2 text-gray-900 hover:text-gray-500 transition-colors group">
                                    <ShieldCheck size={20} strokeWidth={1.5} className="text-green-600 group-hover:text-gray-500 transition-colors" />
                                    <span className="hidden md:block text-[10px] uppercase tracking-[2px] font-bold">Vault</span>
                                </Link>
                            ) : (
                                <Link href="/login" className="flex items-center gap-2 text-gray-900 hover:text-gray-500 transition-colors">
                                    <User size={20} strokeWidth={1.5} />
                                    <span className="hidden md:block text-[10px] uppercase tracking-[2px] font-medium">Sign In</span>
                                </Link>
                            )}
                        </div>

                        <Link href="/checkout" className="text-gray-900 hover:text-gray-500 transition-colors relative">
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            {/* Optional: Add a red dot here if cart has items */}
                        </Link>
                    </div>
                </div>
            </header>

            {/* 📱 MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-white flex flex-col px-6 py-8">
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-xl font-serif tracking-[4px] uppercase text-gray-900">Essential</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 p-2"><X size={28} strokeWidth={1.5}/></button>
                        </div>
                        
                        <div className="flex flex-col gap-8 text-center flex-1 justify-center">
                            <Link href="/#collection" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif text-gray-900 hover:text-gray-500">Timepieces</Link>
                            <Link href="/#heritage" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif text-gray-900 hover:text-gray-500">Our Heritage</Link>
                            
                            {/* Dynamic Mobile Auth Link */}
                            {status === 'authenticated' ? (
                                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif text-green-700 hover:text-green-900 flex items-center justify-center gap-3">
                                    <ShieldCheck size={28}/> Access Vault
                                </Link>
                            ) : (
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-serif text-gray-900 hover:text-gray-500 flex items-center justify-center gap-3">
                                    <User size={28}/> Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
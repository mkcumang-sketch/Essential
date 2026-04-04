"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { 
    Filter, ChevronDown, ShoppingBag, Star, X, Search, 
    ArrowRight, SlidersHorizontal, ArrowLeft, ShieldCheck, CheckCircle 
} from 'lucide-react';

export default function CataloguePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
    const [sortOption, setSortOption] = useState<string>('NEWEST');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { showToast } = useToast();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // 🚀 BULLETPROOF FETCH LOGIC
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const ts = new Date().getTime();
                const res = await fetch(`/api/products?t=${ts}`);
                
                // Agar response 200 OK nahi hai toh json parse mat karo, seedha error throw karo
                if (!res.ok) throw new Error("Backend connection failed");
                
                const data = await res.json();
                
                if (data && data.data) {
                    setProducts(data.data);
                } else if (Array.isArray(data)) {
                    setProducts(data); // Fallback just in case API structure changes
                }
            } catch (error) {
                console.error("Failed to fetch catalogue:", error);
                // Agar error aaya toh khali array set kar do
                setProducts([]); 
            } finally {
                // 'finally' block ensures ki loader hamesha band hoga, chahe error aaye ya success
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Derived Filters Data (Dynamic from Database)
    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category).filter(Boolean));
        return ['ALL', ...Array.from(cats)];
    }, [products]);

    const brands = useMemo(() => {
        const brnds = new Set(products.map(p => p.brand).filter(Boolean));
        return ['ALL', ...Array.from(brnds)];
    }, [products]);

    // Apply Filters & Sorting
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // 1. Category Filter
        if (selectedCategory !== 'ALL') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // 2. Brand Filter
        if (selectedBrand !== 'ALL') {
            result = result.filter(p => p.brand === selectedBrand);
        }

        // 3. Search Filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name?.toLowerCase().includes(query) || 
                p.brand?.toLowerCase().includes(query)
            );
        }

        // 4. Sorting
        switch (sortOption) {
            case 'PRICE_LOW':
                result.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
                break;
            case 'PRICE_HIGH':
                result.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
                break;
            case 'NEWEST':
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'RELEVANCE':
            default:
                result.sort((a, b) => (b.priority || 0) - (a.priority || 0));
                break;
        }

        return result;
    }, [products, selectedCategory, selectedBrand, sortOption, searchQuery]);

    // Add to Cart Logic
    const addToCart = (product: any, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product page
        const cart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
        const exists = cart.find((item: any) => item._id === product._id);
        const newCart = exists 
            ? cart.map((i: any) => i._id === product._id ? {...i, qty: i.qty+1} : i) 
            : [...cart, {...product, qty: 1}];
        
        localStorage.setItem('luxury_cart', JSON.stringify(newCart));
        showToast("Added to your cart.", "success");
        
        // Optional: Dispatch event to update navbar cart count if using event listeners
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('cartUpdated')); 
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-24">
                <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#050505] pb-24">
            
            {/* 🌟 CATALOGUE HEADER 🌟 */}
            <div className="bg-black text-white pt-32 pb-16 px-6 md:px-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-gray-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={14}/> Back to Hub
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-serif italic mb-4 tracking-tighter">The Catalogue.</h1>
                    <p className="text-sm text-gray-400 font-mono uppercase tracking-widest">Explore our complete collection of masterpieces.</p>
                </div>
            </div>

            {/* 🌟 MAIN SHOP LAYOUT 🌟 */}
            <div className="max-w-[1800px] mx-auto px-4 md:px-10 mt-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
                
                {/* --- MOBILE FILTER BUTTON --- */}
                <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm sticky top-24 z-40">
                    <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                        <Filter size={18}/> Filters & Sort
                    </button>
                    <span className="text-xs font-mono text-gray-500">{filteredProducts.length} Results</span>
                </div>

                {/* --- LEFT SIDEBAR (FILTERS) --- */}
                <aside className={`fixed inset-0 z-[200] lg:relative lg:z-0 lg:w-72 shrink-0 bg-white lg:bg-transparent flex flex-col transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <div className="flex flex-col h-full lg:h-auto lg:sticky lg:top-32 bg-white lg:bg-transparent lg:p-0 p-6 overflow-y-auto custom-scrollbar">
                        
                        <div className="flex justify-between items-center lg:hidden mb-8 border-b pb-4">
                            <h3 className="text-xl font-serif font-bold">Filters</h3>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={18}/></button>
                        </div>

                        {/* Search Box */}
                        <div className="mb-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Search</h4>
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-black transition-colors shadow-sm">
                                <Search size={16} className="text-gray-400 mr-2"/>
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Find a watch..." 
                                    className="w-full text-sm outline-none bg-transparent"
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="mb-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Categories</h4>
                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategory === cat ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-black'}`}>
                                            {selectedCategory === cat && <CheckCircle size={10} strokeWidth={4}/>}
                                        </div>
                                        <span className={`text-sm ${selectedCategory === cat ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Brands */}
                        <div className="mb-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Brands</h4>
                            <div className="space-y-3">
                                {brands.map((brand) => (
                                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrand === brand ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-black'}`}>
                                            {selectedBrand === brand && <CheckCircle size={10} strokeWidth={4}/>}
                                        </div>
                                        <span className={`text-sm ${selectedBrand === brand ? 'font-bold text-black' : 'text-gray-600 group-hover:text-black'}`}>{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Reset Button */}
                        <button 
                            onClick={() => { setSelectedCategory('ALL'); setSelectedBrand('ALL'); setSearchQuery(''); setSortOption('RELEVANCE'); setIsMobileFilterOpen(false); }}
                            className="mt-auto lg:mt-0 py-4 w-full bg-gray-100 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Reset All Filters
                        </button>
                    </div>
                </aside>

                {/* --- RIGHT PRODUCT GRID --- */}
                <div className="flex-1">
                    
                    {/* Top Bar (Sorting & Count) */}
                    <div className="hidden lg:flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-sm font-bold text-gray-500">Showing <span className="text-black">{filteredProducts.length}</span> Results</p>
                        
                        <div className="flex items-center gap-3">
                            <SlidersHorizontal size={16} className="text-gray-400"/>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Sort By:</span>
                            <select 
                                value={sortOption} 
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-sm font-bold p-2 rounded-lg outline-none focus:border-black cursor-pointer"
                            >
                                <option value="RELEVANCE">Relevance</option>
                                <option value="NEWEST">Newest Arrivals</option>
                                <option value="PRICE_LOW">Price: Low to High</option>
                                <option value="PRICE_HIGH">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* The Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="bg-white rounded-[40px] border border-gray-100 py-32 flex flex-col items-center justify-center text-center shadow-sm">
                            <Search size={60} className="text-gray-300 mb-6"/>
                            <h3 className="text-3xl font-serif mb-2">No watches found.</h3>
                            <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
                            <button onClick={() => { setSelectedCategory('ALL'); setSelectedBrand('ALL'); setSearchQuery(''); }} className="mt-8 px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors">Clear Filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {filteredProducts.map((watch, idx) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        key={watch._id} 
                                    >
                                        <Link href={`/product/${watch.slug || watch._id}`} className="group bg-white p-6 rounded-[30px] border border-gray-100 hover:shadow-2xl hover:-translate-y-1 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col h-full relative cursor-pointer">
                                            
                                            {/* Badges */}
                                            <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                                                {watch.badge && <span className="bg-[#D4AF37] text-black text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-md">{watch.badge}</span>}
                                                {watch.stock < 3 && watch.stock > 0 && <span className="bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest animate-pulse">Few Left</span>}
                                                {watch.stock <= 0 && <span className="bg-gray-800 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest">Out of Stock</span>}
                                            </div>

                                            {/* Image */}
                                            <div className="flex aspect-square bg-gray-50 rounded-[20px] overflow-hidden mb-6 items-center justify-center p-6 relative">
                                                <img src={watch.imageUrl || (watch.images && watch.images[0])} alt={watch.name} className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[3px] mb-1">{watch.brand}</p>
                                                    <h4 className="text-xl font-serif text-[#050505] leading-tight mb-2 tracking-tighter group-hover:text-[#D4AF37] transition-colors line-clamp-2">{watch.name}</h4>
                                                    
                                                    {/* Amazon Style Rating (Mock or Real) */}
                                                    <div className="flex items-center gap-1 mb-4 text-[#D4AF37]">
                                                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"}/>)}
                                                        <span className="text-[10px] font-mono text-gray-400 ml-1">(4.8)</span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xl text-black font-black tracking-tighter font-serif">₹{Number(watch.offerPrice || watch.price).toLocaleString('en-IN')}</p>
                                                        </div>
                                                        {(watch.offerPrice && watch.price > watch.offerPrice) && (
                                                            <p className="text-gray-400 line-through text-[10px] font-bold mt-0.5">₹{Number(watch.price).toLocaleString('en-IN')}</p>
                                                        )}
                                                    </div>
                                                    
                                                    {watch.stock > 0 ? (
                                                        <button 
                                                            onClick={(e) => addToCart(watch, e)} 
                                                            className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors shadow-md group-hover:scale-110"
                                                        >
                                                            <ShoppingBag size={16}/>
                                                        </button>
                                                    ) : (
                                                        <button disabled className="w-10 h-10 bg-gray-200 text-gray-400 rounded-xl flex items-center justify-center cursor-not-allowed">
                                                            <X size={16}/>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Mobile Filter Overlay Background */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="fixed inset-0 bg-black/60 z-[190] lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, Plus, Sparkles, ChevronDown, X, ArrowLeft, Check, SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { ProductCardSkeleton } from '@/components/LoadingSkeletons';

// 🌟 PREMIUM TOAST COMPONENT 🌟
const LuxuryToast = ({ show, message, type = "success" }: any) => (
    <AnimatePresence>
        {show && (
            <motion.div 
                initial={{ opacity: 0, y: 50, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-10 left-1/2 z-[3000] bg-white/95 backdrop-blur-xl border border-gray-200 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]"
            >
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-red-500/20 text-red-500'}`}
                >
                    {type === 'success' ? <ShoppingBag size={20} /> : <X size={20} />}
                </motion.div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-[#D4AF37]">Cart updated</p>
                    <p className="text-gray-900 text-sm font-serif italic">{message}</p>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default function CataloguePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 🚨 MULTI-SELECT FILTERS (AMAZON STYLE) 🚨
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("NEWEST");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const showLuxuryToast = (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ show: true, message: msg, type });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products`, {
            next: { revalidate: 60 }
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    setCart(JSON.parse(localStorage.getItem('luxury_cart') || '[]'));
  }, []);

  // Extract Unique Filters Dynamically
  const availableBrands = useMemo(() => Array.from(new Set(products.map(p => p.brand).filter(Boolean))), [products]);
  const availableCategories = useMemo(() => Array.from(new Set(products.map(p => p.category).filter(Boolean))), [products]);

  // Handle Checkbox Toggles
  const toggleFilter = (setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
      setState(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter(p => p.name?.toLowerCase().includes(lowerQuery) || p.brand?.toLowerCase().includes(lowerQuery));
    }
    if (selectedBrands.length > 0) {
        result = result.filter(p => selectedBrands.includes(p.brand));
    }
    if (selectedCategories.length > 0) {
        result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (sortBy === "PRICE_LOW") result.sort((a, b) => (Number(a.offerPrice || a.price) - Number(b.offerPrice || b.price)));
    else if (sortBy === "PRICE_HIGH") result.sort((a, b) => (Number(b.offerPrice || b.price) - Number(a.offerPrice || a.price)));
    else result.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return result;
  }, [products, searchQuery, selectedBrands, selectedCategories, sortBy]);

  // Add to Cart Logic
  const addToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (status === 'unauthenticated' || !session) {
        showLuxuryToast("Please Login to add items.", "error");
        setTimeout(() => router.push('/login'), 2000); 
        return;
    }
    const exists = cart.find(item => item._id === product._id);
    const newCart = exists ? cart.map(i => i._id === product._id ? {...i, qty: i.qty+1} : i) : [...cart, {...product, qty: 1}];
    setCart(newCart);
    localStorage.setItem('luxury_cart', JSON.stringify(newCart));
    showLuxuryToast(`${product.name} added to your collection.`, "success");

    try {
        const cartTotal = newCart.reduce((total, item) => total + (Number(item.offerPrice || item.price) * item.qty), 0);
        await fetch(`/api/cart/sync?t=${Date.now()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: newCart, totalAmount: cartTotal, user: { email: session.user?.email } })
        });
    } catch (err) {}
  };

  // 🌟 THE SIDEBAR FILTER COMPONENT (FIXED CLICK LOGIC) 🌟
  const FilterSidebar = () => (
      <div className="w-full">
          <div className="flex justify-between items-center mb-8 lg:hidden">
              <h3 className="font-serif font-bold text-2xl text-black">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
          </div>
          
          {/* Brands Filter */}
          <div className="mb-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-2">Brands</h4>
              <div className="space-y-3">
                  {availableBrands.map((brand: any) => (
                      <div 
                          key={brand} 
                          onClick={() => toggleFilter(setSelectedBrands, brand)} // 🚨 FIX: Click logic added
                          className="flex items-center gap-3 cursor-pointer group"
                      >
                          <div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-all ${selectedBrands.includes(brand) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                              {selectedBrands.includes(brand) && <Check size={12} className="text-white" />}
                          </div>
                          <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}`}>{brand}</span>
                      </div>
                  ))}
              </div>
          </div>

          {/* Categories Filter */}
          <div className="mb-10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-2">Categories</h4>
              <div className="space-y-3">
                  {availableCategories.map((cat: any) => (
                      <div 
                          key={cat} 
                          onClick={() => toggleFilter(setSelectedCategories, cat)} // 🚨 FIX: Click logic added
                          className="flex items-center gap-3 cursor-pointer group"
                      >
                          <div className={`w-4 h-4 rounded-sm flex items-center justify-center border transition-all ${selectedCategories.includes(cat) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                              {selectedCategories.includes(cat) && <Check size={12} className="text-white" />}
                          </div>
                          <span className={`text-sm transition-colors ${selectedCategories.includes(cat) ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}`}>{cat}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black font-sans selection:bg-black selection:text-white">
      <LuxuryToast show={toast.show} message={toast.message} type={toast.type} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
             <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500 hover:text-black">
                 <ArrowLeft size={20} />
             </Link>
             <h1 className="text-lg md:text-2xl font-serif font-black tracking-[4px] uppercase text-black">Essential</h1>
         </div>
         
         {/* Search Bar (Desktop) */}
         <div className="hidden md:flex items-center relative w-1/3 max-w-md">
             <Search size={16} className="absolute left-4 text-gray-400" />
             <input 
                type="text" 
                placeholder="Search premium watches..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100/50 border border-gray-200 text-xs py-2.5 pl-10 pr-4 rounded-full outline-none focus:border-black focus:bg-white transition-all"
             />
         </div>

         <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group" onClick={() => router.push('/checkout')}>
              <ShoppingBag size={22} className="text-black group-hover:scale-110 transition-transform" />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">{cart.length}</span>}
            </div>
         </div>
      </header>

      {/* MOBILE SEARCH & FILTER TOGGLE */}
      <div className="md:hidden px-4 py-4 bg-white border-b border-gray-200 flex gap-2 sticky top-[65px] z-40">
          <div className="relative flex-1">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-100 border border-gray-200 text-xs py-2.5 pl-9 pr-3 rounded-lg outline-none" />
          </div>
          <button onClick={() => setIsMobileFilterOpen(true)} className="px-4 bg-black text-white rounded-lg flex items-center gap-2 text-xs font-bold uppercase">
              <SlidersHorizontal size={14}/> Filters
          </button>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8 flex items-start gap-8 relative">
          
          {/* 🚨 LEFT SIDEBAR (AMAZON STYLE) 🚨 */}
          <aside className="hidden lg:block w-[250px] flex-shrink-0 sticky top-[100px] max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pr-4">
              <FilterSidebar />
          </aside>

          {/* MOBILE FILTER MODAL */}
          <AnimatePresence>
              {isMobileFilterOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[4000] lg:hidden flex">
                      <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.3 }} className="w-[85%] max-w-[320px] bg-white h-full p-6 overflow-y-auto shadow-2xl">
                          <FilterSidebar />
                      </motion.div>
                      <div className="flex-1" onClick={() => setIsMobileFilterOpen(false)}></div>
                  </motion.div>
              )}
          </AnimatePresence>

          {/* RIGHT MAIN CONTENT */}
          <div className="flex-1 w-full min-w-0">
              
              {/* Top Action Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
                  <h2 className="text-xl md:text-3xl font-serif font-bold text-black">
                      {loading ? "Searching the Vault..." : (searchQuery ? `Results for "${searchQuery}"` : "All Timepieces")}
                      {!loading && (
                          <span className="block md:inline md:ml-4 text-xs font-sans text-gray-500 font-normal uppercase tracking-widest mt-1 md:mt-0">
                              {filteredAndSortedProducts.length} items found
                          </span>
                      )}
                  </h2>

                  <div className="relative group min-w-[180px] w-full md:w-auto">
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 text-xs font-bold uppercase tracking-wider py-2.5 pl-4 pr-10 rounded-lg outline-none focus:border-black cursor-pointer shadow-sm">
                          <option value="NEWEST">Newest Arrivals</option>
                          <option value="PRICE_LOW">Price: Low to High</option>
                          <option value="PRICE_HIGH">Price: High to Low</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
              </div>

              {/* 🚨 PRODUCTS GRID - 4 COLUMNS (AMAZON STYLE) 🚨 */}
              {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
                      {[...Array(6)].map((_, i) => (
                          <ProductCardSkeleton key={i} />
                      ))}
                  </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                  <div className="py-32 text-center bg-white rounded-3xl border border-gray-200 shadow-sm">
                      <Search size={40} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-2xl font-serif font-bold text-black mb-2">No matches found</h3>
                      <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
                      <button onClick={() => {setSearchQuery(""); setSelectedBrands([]); setSelectedCategories([]);}} className="mt-6 px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-all">Clear All Filters</button>
                  </div>
              ) : (
                  // Grid: 2 on mobile, 3 on tablet, 4 on desktop
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
                      <AnimatePresence mode='popLayout'>
                          {filteredAndSortedProducts.map((watch) => (
                              <motion.div 
                                  layout 
                                  initial={{ opacity: 0, scale: 0.95 }} 
                                  animate={{ opacity: 1, scale: 1 }} 
                                  exit={{ opacity: 0, scale: 0.9 }} 
                                  transition={{ duration: 0.3 }} 
                                  key={watch._id} 
                                  className="group bg-white p-4 rounded-[16px] border border-gray-200 hover:border-black hover:shadow-lg transition-all duration-300 flex flex-col h-full relative cursor-pointer" 
                                  onClick={() => router.push(`/product/${watch.slug || watch._id}`)}
                              >
                                  {watch.badge && <span className="absolute top-3 left-3 bg-black text-white text-[7px] md:text-[8px] font-bold px-2 py-1 rounded uppercase z-20 shadow-sm">{watch.badge}</span>}
                                  
                                  <div className="flex aspect-square bg-gray-50/80 rounded-xl overflow-hidden mb-4 items-center justify-center p-4 relative">
                                      <img 
                                          src={watch.imageUrl || (watch.images && watch.images[0]) || '/placeholder-watch.png'} 
                                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                                          loading="lazy" 
                                          alt={watch.name}
                                      />
                                  </div>

                                  <div className="flex-1 flex flex-col justify-between">
                                      <div>
                                          <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-[2px] mb-1">{watch.brand}</p>
                                          <h4 className="text-xs md:text-sm font-serif text-black leading-snug mb-3 font-bold line-clamp-2">{watch.name}</h4>
                                      </div>
                                      
                                      <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-100">
                                          <div>
                                              {watch.offerPrice && watch.offerPrice < watch.price && (
                                                  <p className="text-[8px] text-gray-400 line-through mb-0.5">₹{Number(watch.price).toLocaleString()}</p>
                                              )}
                                              <p className="text-sm md:text-lg text-black font-bold tracking-tight">
                                                  ₹{Number(watch.offerPrice || watch.price).toLocaleString()}
                                              </p>
                                          </div>
                                          <button 
                                              onClick={(e) => addToCart(watch, e)} 
                                              className="w-7 h-7 md:w-8 md:h-8 bg-gray-100 text-black rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center active:scale-90"
                                          >
                                              <Plus size={14}/>
                                          </button>
                                      </div>
                                  </div>
                              </motion.div>
                          ))}
                      </AnimatePresence>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}
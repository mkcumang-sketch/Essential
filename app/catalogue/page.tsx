"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Filter, ShoppingCart, 
  Star, ChevronDown, Check, Zap 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RetailCatalogue() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [availability, setAvailability] = useState<string>('all');

  useEffect(() => {
    const fetchVault = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const json = await res.json();
          setProducts(Array.isArray(json) ? json : (json.data || []));
        }
      } catch (error) {
        console.error("Vault Offline");
      } finally {
        setLoading(false);
      }
    };
    fetchVault();
  }, []);

  // Derived Data for Filters
  const categories = Array.from(new Set(products.map(p => p.category || 'Luxury')));
  const brands = Array.from(new Set(products.map(p => p.brand || 'Imperial')));

  // Filter Logic
  const handleFilter = (type: string, value: string) => {
    if (type === 'category') {
      setSelectedCategories(prev => prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]);
    } else if (type === 'brand') {
      setSelectedBrands(prev => prev.includes(value) ? prev.filter(b => b !== value) : [...prev, value]);
    }
  };

  // Apply Filters & Sorting
  let filteredProducts = products.filter(p => {
    const matchesSearch = (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (p.brand?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
    const matchesAvailability = availability === 'all' || 
      (availability === 'in-stock' && p.stock > 0) || 
      (availability === 'out-of-stock' && p.stock <= 0);
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesAvailability;
  });

  if (sortOption === 'low-high') filteredProducts.sort((a, b) => a.price - b.price);
  if (sortOption === 'high-low') filteredProducts.sort((a, b) => b.price - a.price);

  // Cart Logic (Amazon Style Quick Add)
  const addToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Card click na ho
    const cart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
    cart.push(product);
    localStorage.setItem('luxury_cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
    // Optional: yahan se router.push('/checkout') bhi kar sakte ho
  };

  return (
    <div className="min-h-screen bg-[#F1F2F4] text-[#050505] font-sans">
      
      {/* ♞ AMAZON-STYLE TOP NAVBAR ♞ */}
      <nav className="bg-[#0A0A0A] text-white py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-[100]">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <Link href="/" className="text-2xl text-[#D4AF37] hover:scale-110 transition-transform">♞</Link>
          <h1 className="text-lg font-serif italic tracking-widest hidden md:block">Essential Rush</h1>
        </div>
        
        {/* Massive Search Bar */}
        <div className="flex-1 max-w-2xl flex items-center bg-white rounded-md overflow-hidden h-11">
           <div className="pl-4 pr-2 text-gray-500"><Search size={20}/></div>
           <input 
             placeholder="Search watches, gadgets, brands..." 
             className="w-full h-full text-black outline-none text-sm font-medium"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           <button className="bg-[#D4AF37] h-full px-6 text-black font-black uppercase text-xs tracking-widest hover:bg-[#b5952f] transition-colors">Search</button>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto justify-end">
           <button onClick={() => router.push('/account')} className="text-xs font-bold hover:text-[#D4AF37]">Hello, Sign in<br/><span className="text-sm font-black">Account & Lists</span></button>
           <button onClick={() => router.push('/checkout')} className="flex items-center gap-2 font-black text-[#D4AF37] hover:text-white transition-colors"><ShoppingCart size={28}/> Cart</button>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto py-6 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* ♞ LEFT SIDEBAR (FILTERS) ♞ */}
         <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 space-y-8 pr-4 border-r border-gray-300">
            <div>
               <h3 className="font-bold text-lg mb-4">Categories</h3>
               <div className="space-y-3">
                 {categories.map((cat: any) => (
                   <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-400 bg-white group-hover:border-black'}`}>
                       {selectedCategories.includes(cat) && <Check size={14} className="text-black"/>}
                     </div>
                     <span className="text-sm text-gray-700 group-hover:text-black font-medium">{cat}</span>
                   </label>
                 ))}
               </div>
            </div>

            <hr className="border-gray-300"/>

            <div>
               <h3 className="font-bold text-lg mb-4">Brands</h3>
               <div className="space-y-3">
                 {brands.map((brand: any) => (
                   <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-400 bg-white group-hover:border-black'}`}>
                       {selectedBrands.includes(brand) && <Check size={14} className="text-black"/>}
                     </div>
                     <span className="text-sm text-gray-700 group-hover:text-black font-medium">{brand}</span>
                   </label>
                 ))}
               </div>
            </div>

            <hr className="border-gray-300"/>

            <div>
               <h3 className="font-bold text-lg mb-4">Price Range</h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <span className="text-sm text-gray-600 font-medium">₹</span>
                   <input 
                     type="number" 
                     placeholder="Min" 
                     value={priceRange.min}
                     onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[#D4AF37] outline-none"
                   />
                   <span className="text-sm text-gray-600 font-medium">to ₹</span>
                   <input 
                     type="number" 
                     placeholder="Max" 
                     value={priceRange.max}
                     onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 100000 }))}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[#D4AF37] outline-none"
                   />
                 </div>
                 {/* Quick Price Filters */}
                 <div className="flex flex-wrap gap-2">
                   {[
                     { label: 'Under ₹5K', min: 0, max: 5000 },
                     { label: '₹5K - ₹15K', min: 5000, max: 15000 },
                     { label: '₹15K - ₹30K', min: 15000, max: 30000 },
                     { label: 'Over ₹30K', min: 30000, max: 100000 }
                   ].map((range) => (
                     <button
                       key={range.label}
                       onClick={() => setPriceRange({ min: range.min, max: range.max })}
                       className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] transition-colors"
                     >
                       {range.label}
                     </button>
                   ))}
                 </div>
               </div>
            </div>

            <hr className="border-gray-300"/>

            <div>
               <h3 className="font-bold text-lg mb-4">Availability</h3>
               <div className="space-y-3">
                 {[
                   { value: 'all', label: 'All Products' },
                   { value: 'in-stock', label: 'In Stock' },
                   { value: 'out-of-stock', label: 'Out of Stock' }
                 ].map((option) => (
                   <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${availability === option.value ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-400 bg-white group-hover:border-black'}`}>
                       {availability === option.value && <Check size={14} className="text-black"/>}
                     </div>
                     <span className="text-sm text-gray-700 group-hover:text-black font-medium">{option.label}</span>
                   </label>
                 ))}
               </div>
            </div>

            {/* Clear Filters Button */}
            <button
               onClick={() => {
                 setSelectedCategories([]);
                 setSelectedBrands([]);
                 setPriceRange({ min: 0, max: 100000 });
                 setAvailability('all');
                 setSearchQuery('');
               }}
               className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
            >
               Clear All Filters
            </button>
         </aside>

         {/* ♞ MAIN PRODUCT GRID ♞ */}
         <div className="lg:col-span-9 xl:col-span-10">
            
            {/* Top Results Bar */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
               <p className="text-sm text-gray-600 font-medium">Showing <strong className="text-black">{filteredProducts.length}</strong> results</p>
               <div className="flex items-center gap-3">
                 <span className="text-sm font-bold text-gray-700">Sort by:</span>
                 <select 
                   value={sortOption} 
                   onChange={(e) => setSortOption(e.target.value)}
                   className="bg-[#F1F2F4] border border-gray-300 text-sm font-medium p-2.5 rounded-md outline-none focus:border-[#D4AF37] cursor-pointer"
                 >
                   <option value="newest">Featured / Newest</option>
                   <option value="low-high">Price: Low to High</option>
                   <option value="high-low">Price: High to Low</option>
                 </select>
               </div>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
               <div className="bg-white p-20 text-center rounded-lg border border-gray-200">
                 <h3 className="text-2xl font-bold text-gray-400 mb-2">No results found</h3>
                 <p className="text-gray-500">Try adjusting your filters or search query.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 <AnimatePresence>
                   {filteredProducts.map((product, i) => {
                     // Calculate Discount
                     const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
                     const discountPercent = hasDiscount ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

                     return (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.95 }} 
                         animate={{ opacity: 1, scale: 1 }} 
                         key={product._id} 
                         onClick={() => router.push(`/product/${product._id}`)} 
                         className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group cursor-pointer flex flex-col"
                       >
                          {/* Image Box */}
                          <div className="aspect-square bg-[#FAFAFA] p-6 relative flex items-center justify-center">
                             {/* Badges */}
                             <div className="absolute top-3 left-3 flex flex-col gap-2">
                               {hasDiscount && <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-sm shadow-sm">{discountPercent}% OFF</span>}
                               {product.stock <= 3 && product.stock > 0 && <span className="bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-1 rounded-sm shadow-sm">Few Left</span>}
                             </div>
                             <img src={product.imageUrl} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          
                          {/* Product Details */}
                          <div className="p-5 flex-1 flex flex-col">
                             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{product.brand || 'Brand'}</p>
                             <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                             
                             {/* Fake Reviews (Amazon Style) */}
                             <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, idx) => <Star key={idx} size={14} className="fill-yellow-400 text-yellow-400"/>)}
                                <span className="text-xs text-blue-600 hover:underline ml-1 cursor-pointer">({Math.floor(Math.random() * 500) + 50})</span>
                             </div>

                             {/* Pricing Section */}
                             <div className="mt-auto mb-4">
                                <div className="flex items-end gap-2">
                                   <span className="text-2xl font-black text-black">₹{product.price?.toLocaleString()}</span>
                                   {hasDiscount && <span className="text-sm text-gray-500 line-through mb-1">₹{product.compareAtPrice?.toLocaleString()}</span>}
                                </div>
                                {/* Prime Style Delivery Badge */}
                                <div className="text-xs text-gray-600 mt-1 flex items-center gap-1"><Zap size={12} className="text-[#D4AF37]"/> Free Delivery by <strong>Tomorrow</strong></div>
                             </div>

                             {/* Add to Cart Button */}
                             <button 
                               onClick={(e) => addToCart(product, e)} 
                               className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black font-medium py-3 rounded-full text-sm transition-colors border border-[#FCD200] shadow-sm flex items-center justify-center gap-2"
                             >
                               <ShoppingCart size={16}/> Add to Cart
                             </button>
                          </div>
                       </motion.div>
                     );
                   })}
                 </AnimatePresence>
               </div>
            )}
         </div>
      </main>
    </div>
  );
}
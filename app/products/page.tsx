"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hamari Mongoose API se data lao
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 flex gap-10">
      {/* Sidebar Filters */}
      <aside className="w-64 hidden lg:block space-y-8">
        <div>
          <h3 className="font-bold border-b pb-2 mb-4 tracking-tighter text-lg">FILTERS</h3>
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <p className="font-bold text-xs uppercase mb-3">Category</p>
              <div className="space-y-2">
                {["Men", "Women", "Unisex", "Kids"].map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
                    <input type="checkbox" className="accent-black" /> {cat}
                  </label>
                ))}
              </div>
            </div>
            {/* Price Filter */}
            <div>
              <p className="font-bold text-xs uppercase mb-3">Price Range</p>
              <input type="range" min="1000" max="500000" className="w-full accent-black" />
              <div className="flex justify-between text-[10px] mt-2 text-zinc-500 font-bold">
                <span>₹1,000</span>
                <span>₹5,00,000+</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <h1 className="text-2xl font-light tracking-widest uppercase">Luxury Timepieces ({products.length})</h1>
          <select className="text-sm border-none bg-transparent font-bold focus:ring-0 cursor-pointer">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-zinc-100 animate-pulse rounded" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
            {products.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Collection() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const items = data?.data || [];
        setProducts(Array.isArray(items) ? items : []);
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="pt-32 px-6 max-w-[1800px] mx-auto">
        <h2 className="text-3xl font-serif italic text-gold-500 mb-8">Watches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.length > 0 ? products.map((p: any) => (
             <Link href={`/product/${p.id}`} key={p.id} className="group block bg-[#0a0a0a] border border-white/10 p-4 rounded-xl">
                <div className="aspect-[3/4] overflow-hidden mb-4 rounded-lg bg-white relative">
                   <img src={p.images?.[0]} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"/>
                </div>
                <h3 className="text-white font-bold text-sm uppercase">{p.title}</h3>
                <p className="text-gold-500 font-serif italic">₹{Number(p.price).toLocaleString()}</p>
             </Link>
          )) : <p className="text-gray-500 animate-pulse">Loading…</p>}
        </div>
      </div>
    </div>
  );
}
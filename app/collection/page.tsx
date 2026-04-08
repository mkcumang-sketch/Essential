import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// Client Component
function CollectionClientPage({ products }: { products: any[] }) {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="pt-32 px-6 max-w-[1800px] mx-auto">
        <h2 className="text-3xl font-serif italic text-gold-500 mb-8">Watches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.length > 0 ? products.map(p => (
             <Link href={`/product/${p.id}`} key={p.id} className="group block bg-[#0a0a0a] border border-white/10 p-4 rounded-xl">
                <div className="aspect-[3/4] overflow-hidden mb-4 rounded-lg bg-white relative">
                   <img src={p.images[0]} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"/>
                </div>
                <h3 className="text-white font-bold text-sm uppercase">{p.title}</h3>
                <p className="text-gold-500 font-serif italic">₹{p.price.toLocaleString()}</p>
             </Link>
          )) : <p className="text-gray-500 animate-pulse">Loading…</p>}
        </div>
      </div>
    </div>
  );
}

// Server Component for data fetching
async function getCollectionProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await res.json();
  return data.data; // Assuming data.data contains the products array
}

export default async function Collection() {
  const products = await getCollectionProducts();
  return <CollectionClientPage products={products} />;
}
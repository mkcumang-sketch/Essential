"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard"; // Create this next

export default function BrandPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandData = async () => {
      // API call to fetch products filtered by brand slug
      const res = await fetch(`/api/products?brand=${slug}`);
      const data = await res.json();
      if(data.success) setProducts(data.products);
      setLoading(false);
    };
    fetchBrandData();
  }, [slug]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-gold-500 animate-pulse">SEARCHING VAULT...</div>;

  return (
    <main className="min-h-screen bg-[#050505] pt-32 px-6 md:px-12 pb-20">
      <header className="mb-16 border-b border-white/5 pb-10">
        <h1 className="text-white font-serif italic text-6xl md:text-8xl capitalize tracking-tighter">
          {slug?.toString().replace("-", " ")}
        </h1>
        <p className="text-gold-500 text-[10px] uppercase font-black tracking-[0.4em] mt-4">
          Curated selection of masterworks
        </p>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.length > 0 ? (
          products.map((p: any) => <ProductCard key={p._id} product={p} />)
        ) : (
          <p className="text-gray-600 italic uppercase text-[10px] tracking-widest">No pieces available in current inventory.</p>
        )}
      </div>
    </main>
  );
}
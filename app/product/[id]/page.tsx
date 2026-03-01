"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // 1. Single Product Lao
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setProduct(data.product);
        });

      // 2. Similar Products Lao (Titan style suggestion)
      fetch("/api/products")
        .then(res => res.json())
        .then(data => {
          if (data.success) setSimilar(data.products.slice(0, 4));
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-gold-600 animate-pulse uppercase tracking-widest font-bold">Luxury is Loading...</div>;
  if (!product) return <div className="p-20 text-center">Product Not Found</div>;

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left: Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-zinc-50 overflow-hidden rounded-xl border border-zinc-100">
            <img src={product.images[0]} className="w-full h-full object-contain mix-blend-multiply" alt={product.title} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, i: number) => (
              <div key={i} className="aspect-square bg-zinc-50 border border-zinc-200 p-2 cursor-pointer hover:border-black transition">
                <img src={img} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <p className="text-gold-700 font-bold tracking-[0.2em] text-xs uppercase mb-2">{product.brand}</p>
          <h1 className="text-4xl font-light mb-4 uppercase tracking-tight">{product.title}</h1>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-bold italic">₹{product.price.toLocaleString()}</span>
            <span className="text-zinc-400 line-through">₹{(product.price * 1.2).toLocaleString()}</span>
            <span className="text-green-600 font-bold text-sm">(20% OFF)</span>
          </div>

          <p className="text-zinc-600 leading-relaxed mb-8 border-l-4 border-zinc-100 pl-6 italic">
            {product.description || "A masterpiece of engineering and timeless design, crafted for those who define excellence."}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-10">
            <button className="flex-1 bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-zinc-800 transition flex items-center justify-center gap-2">
              <ShoppingBag size={20} /> Add to Cart
            </button>
            <button className="p-5 border border-zinc-300 rounded-full hover:bg-zinc-50 transition">
              <Heart size={24} className="text-zinc-400" />
            </button>
          </div>

          {/* Trust Badges (Titan Style) */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-100">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck size={24} className="text-gold-700" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Authentic Product</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck size={24} className="text-gold-700" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw size={24} className="text-gold-700" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">7 Day Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 border-t border-zinc-100">
        <h2 className="text-2xl font-light tracking-widest uppercase mb-12 text-center">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {similar.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
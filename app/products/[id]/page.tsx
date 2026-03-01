"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShieldCheck, Zap, Clock, Globe, ArrowRight, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          setMainImage(data.product.images?.[0] || ""); 
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    addToCart(product);
    router.push("/checkout");
  };

  if (loading) return <div className="h-screen bg-black text-gold-500 flex items-center justify-center font-bold tracking-[0.5em] uppercase animate-pulse">Inspecting...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-ivory text-royal-900 font-sans selection:bg-gold-500 selection:text-white">
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT: IMMERSIVE GALLERY (Sticky) */}
        <div className="relative h-[60vh] lg:h-screen lg:sticky lg:top-0 bg-[#F5F5F5] flex items-center justify-center overflow-hidden border-r border-gray-200">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <motion.img 
            key={mainImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={mainImage} 
            className="max-w-[80%] max-h-[70vh] object-contain mix-blend-multiply z-10 drop-shadow-2xl" 
          />
          
          {/* Thumbnails */}
          <div className="absolute bottom-8 flex gap-4 z-20">
             {product.images?.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 border bg-white p-2 transition-all duration-300 ${mainImage === img ? "border-gold-500 -translate-y-2 shadow-lg" : "border-gray-200 opacity-60 hover:opacity-100"}`}
              >
                <img src={img} className="w-full h-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: THE STORY (Scrollable) */}
        <div className="flex flex-col justify-center px-8 md:px-24 py-24 lg:min-h-screen bg-white">
          
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-gold-600 font-bold uppercase tracking-[0.3em] text-xs">{product.brand}</span>
              <div className="h-[1px] w-12 bg-gray-300"></div>
              <span className="text-green-700 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-green-50 px-2 py-1 rounded">
                <ShieldCheck className="w-3 h-3" /> Authenticated
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-royal-900 mb-6 leading-tight italic">
              {product.title}
            </h1>

            <p className="text-4xl md:text-5xl font-serif text-gray-900 mb-2">₹{product.price?.toLocaleString("en-IN")}</p>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-12">
              Inclusive of all taxes • Insured Shipping
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mb-16">
              <button 
                onClick={handleBuyNow}
                className="w-full bg-royal-900 text-white py-6 font-bold uppercase tracking-[0.2em] hover:bg-gold-500 hover:text-black transition-all duration-300 shadow-xl flex items-center justify-center gap-3 text-sm"
              >
                <Zap className="w-4 h-4" /> Acquire Now
              </button>
              <button 
                onClick={() => addToCart(product)}
                className="w-full border border-royal-900 text-royal-900 py-6 font-bold uppercase tracking-[0.2em] hover:bg-royal-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 text-sm"
              >
                Add to Vault
              </button>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-y-8 gap-x-4 border-t border-gray-100 pt-12">
              <div className="flex gap-4">
                 <Clock className="w-6 h-6 text-gold-600 mt-1" />
                 <div>
                    <h4 className="font-bold text-royal-900 uppercase text-[10px] tracking-widest mb-1">Movement</h4>
                    <p className="text-xs text-gray-500">Swiss Mechanical</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <Globe className="w-6 h-6 text-gold-600 mt-1" />
                 <div>
                    <h4 className="font-bold text-royal-900 uppercase text-[10px] tracking-widest mb-1">Warranty</h4>
                    <p className="text-xs text-gray-500">2 Years International</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <Star className="w-6 h-6 text-gold-600 mt-1" />
                 <div>
                    <h4 className="font-bold text-royal-900 uppercase text-[10px] tracking-widest mb-1">Condition</h4>
                    <p className="text-xs text-gray-500">Brand New / Unworn</p>
                 </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-12">
               <h3 className="font-serif text-2xl italic text-royal-900 mb-4">The Legacy</h3>
               <p className="text-gray-500 leading-loose font-light text-justify text-sm md:text-base">
                 {product.description || "Every curve, every polished edge reflects a dedication to perfection. Designed for the modern connoisseur, this timepiece represents the pinnacle of horological craftsmanship. Acquired directly from certified partners, ensuring absolute authenticity."}
               </p>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
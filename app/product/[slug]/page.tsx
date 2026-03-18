"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ShieldCheck, Award, Truck, Star, Lock, MapPin, Sparkles, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LuxuryProductPage({ params }: { params: any }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [dynamicPrice, setDynamicPrice] = useState<number | null>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      try {
        let identifier = "";
        try {
            const resolvedParams = await params;
            identifier = resolvedParams?.slug || resolvedParams?.id;
        } catch (e) {
            console.log("Params skipped");
        }

        if (!identifier) identifier = window.location.pathname.split('/').pop() || "";
        if (!identifier || identifier === "undefined") { setLoading(false); return; }

        let sessionId = localStorage.getItem('er_session');
        if (!sessionId) {
            sessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('er_session', sessionId);
        }

        // 1. Fetch Product
        const res = await fetch(`/api/products/${identifier}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const data = json.data ? json.data : json;
          
          if (data && (data._id || data.slug)) {
              setProduct(data);

              // AI Tracking
              fetch('/api/ai/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sessionId, action: 'VIEW', productId: data._id, category: data.category })
              }).catch(()=>{});

              // Dynamic Pricing
              fetch(`/api/ai/pricing?productId=${data._id}&sessionId=${sessionId}`)
                .then(r => r.json())
                .then(p => { if(p.dynamicPrice) setDynamicPrice(p.dynamicPrice) }).catch(()=>{});
              
              // Fetch Approved Reviews
              fetch(`/api/reviews?productId=${data._id}`)
                .then(r => r.json())
                .then(data => { if(data.success) setReviews(data.data) }).catch(()=>{});
          }
        }

        // Fetch Recommendations
        const recRes = await fetch(`/api/ai/recommendations?sessionId=${sessionId}`);
        if(recRes.ok) {
            const recData = await recRes.json();
            setRecommended(recData.recommended.filter((w:any) => w.slug !== identifier && w._id !== identifier).slice(0, 4));
        }

      } catch (error) { console.error("Error loading asset"); } finally { setLoading(false); }
    };
    
    initPage();
  }, [params]);

  const addToCart = (itemToCart = product) => {
    setIsAdding(true);
    const sessionId = localStorage.getItem('er_session');
    
    fetch('/api/ai/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'CART', productId: itemToCart._id, category: itemToCart.category })
    }).catch(()=>{});

    let cart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
    const itemFinalPrice = dynamicPrice || itemToCart.offerPrice || itemToCart.price || itemToCart.basePrice;
    
    const exists = cart.find((item: any) => item._id === itemToCart._id);
    if (exists) {
      cart = cart.map((item: any) => item._id === itemToCart._id ? { ...item, qty: item.qty + 1 } : item);
    } else {
      cart.push({ ...itemToCart, qty: 1, finalPriceAdded: itemFinalPrice });
    }
    localStorage.setItem('luxury_cart', JSON.stringify(cart));
    setTimeout(() => { setIsAdding(false); router.push('/checkout'); }, 500);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, product: product._id })
      });
      if(res.ok) {
        setReviewSubmitted(true);
        setReviewForm({ userName: '', rating: 5, comment: '' });
      }
    } catch (error) { alert("Failed to submit review"); }
  };

  if (loading) return <div className="h-screen bg-[#050505] flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="h-screen bg-[#050505] text-white flex flex-col gap-6 items-center justify-center font-serif italic text-2xl">Asset removed from Vault.<button onClick={()=>router.push('/')} className="text-sm font-sans not-italic text-[#D4AF37] border border-[#D4AF37] px-6 py-2 rounded-full">Return to Vault</button></div>;

  const displayPrice = dynamicPrice || product.offerPrice || product.price || product.basePrice || 0;
  const originalPrice = product.price || product.basePrice || 0;
  const discountPercent = originalPrice > displayPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;
  
  // Handle Multiple Images safely
  const imagesArray = product.images?.length > 0 ? product.images : [product.imageUrl];
  const specs = product.specifications || {};

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black font-sans">
      
      {/* ♞ LUXURY NAVBAR ♞ */}
      <nav className="w-full bg-[#050505]/90 backdrop-blur-2xl border-b border-white/5 py-6 px-10 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => router.push('/')} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] transition-colors"><ArrowLeft size={16}/> Back to Vault</button>
        <div className="text-3xl text-[#D4AF37] font-serif font-black tracking-[10px] flex items-center gap-4">♞ <span className="hidden md:block text-white uppercase">ESSENTIAL</span></div>
        <div className="w-24"></div> 
      </nav>

      <div className="max-w-[1700px] mx-auto py-16 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
          
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#D4AF37] blur-[350px] opacity-[0.05] pointer-events-none"></div>

          {/* COLUMN 1: Multi-Image Gallery */}
          <div className="lg:col-span-5 flex gap-6 z-10">
             <div className="hidden md:flex flex-col gap-4 overflow-y-auto custom-scrollbar max-h-[600px] pr-2">
                {imagesArray.map((img: string, idx: number) => (
                  <div key={idx} onMouseEnter={()=>setActiveImage(idx)} className={`w-20 h-20 border-2 rounded-2xl overflow-hidden cursor-pointer p-3 transition-all ${activeImage === idx ? 'border-[#D4AF37] bg-white/10' : 'border-white/5 bg-white/5 opacity-50 hover:opacity-100'}`}>
                    <img src={img} className="w-full h-full object-contain" />
                  </div>
                ))}
             </div>
             <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-[40px] p-12 flex items-center justify-center relative shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <motion.img key={activeImage} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} src={imagesArray[activeImage]} className="w-full max-h-[600px] object-contain drop-shadow-[0_30px_60px_rgba(212,175,55,0.15)] relative z-10" />
             </div>
          </div>

          {/* COLUMN 2: Product Details & Specs */}
          <div className="lg:col-span-4 space-y-8 z-10 pt-4">
              <div>
                 <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[8px] mb-4">{product.brand || 'Luxury Vault'}</p>
                 <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter leading-[1.1]">{product.name || product.title}</h1>
              </div>
              
              <div className="flex items-center gap-4 border-b border-white/10 pb-8">
                 <div className="flex text-[#D4AF37]"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                 <span className="text-gray-400 text-xs font-black uppercase tracking-widest cursor-pointer hover:text-white">{reviews.length} Verified Reviews</span>
              </div>

              <div className="space-y-3 py-4">
                 {discountPercent > 0 && <div className="flex items-end gap-4"><span className="text-[#D4AF37] text-2xl font-light mb-1">-{discountPercent}%</span><span className="text-5xl font-black font-serif tracking-tighter">₹{Number(displayPrice).toLocaleString('en-IN')}</span></div>}
                 {discountPercent === 0 && <div className="text-5xl font-black font-serif tracking-tighter">₹{Number(displayPrice).toLocaleString('en-IN')}</div>}
                 
                 {originalPrice > displayPrice && <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Global MSRP: <span className="line-through">₹{Number(originalPrice).toLocaleString('en-IN')}</span></p>}
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Taxes & Duties Included</p>
              </div>

              <p className="text-gray-400 text-lg leading-relaxed font-serif italic">"{product.description || 'A timeless piece of horological mastery, forged for those who command the room.'}"</p>

              {/* Dynamic Specifications */}
              {Object.keys(specs).length > 0 && (
                <div className="border-t border-white/10 pt-8 mt-8">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-[#D4AF37] mb-6">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(specs).map(([key, val]: any, i:number) => (
                      <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">{key}</p>
                        <p className="text-sm font-bold text-white">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* COLUMN 3: Buy Box */}
          <div className="lg:col-span-3 z-10">
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-[40px] p-8 shadow-2xl sticky top-32">
                 <p className="text-3xl font-black font-serif mb-6">₹{Number(displayPrice).toLocaleString('en-IN')}</p>
                 
                 <div className="space-y-4 mb-8">
                    <p className="flex items-center gap-3 text-xs font-bold text-gray-300"><Truck size={16} className="text-[#D4AF37]"/> <span>Complimentary Insured Delivery</span></p>
                    <p className="flex items-center gap-3 text-xs font-bold text-gray-300"><MapPin size={16} className="text-[#D4AF37]"/> <span>Delivering to Authorized Nodes</span></p>
                 </div>

                 <h4 className={`text-sm font-black uppercase tracking-widest mb-8 px-4 py-2 inline-block rounded-full ${product.stock > 0 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {product.stock > 0 ? 'Available in Vault' : 'Vault Locked'}
                 </h4>

                 <button onClick={()=>addToCart(product)} disabled={isAdding || product.stock <= 0} className="w-full bg-[#D4AF37] hover:bg-white text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[4px] mb-4 shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all disabled:opacity-50">
                    {isAdding ? "Processing..." : "Add to Portfolio"}
                 </button>

                 <div className="mt-8 flex items-center justify-center gap-3 text-gray-500 text-[10px] font-black uppercase tracking-[3px]">
                    <Lock size={14}/> Military Grade Encryption
                 </div>
              </div>
          </div>
      </div>

      {/* ♞ REVIEW SYSTEM (Frontend) ♞ */}
      <div className="max-w-[1700px] mx-auto py-16 px-6 md:px-12 border-t border-white/5">
        <h2 className="text-3xl font-serif italic text-white mb-10">Client Experiences</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
           <div className="lg:col-span-1">
              <h3 className="text-lg font-black uppercase tracking-widest text-[#D4AF37] mb-6">Submit Your Experience</h3>
              {reviewSubmitted ? (
                 <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-green-500 text-sm font-bold">
                    Thank you. Your review has been securely transmitted for concierge approval. It is currently private.
                 </div>
              ) : (
                <form onSubmit={submitReview} className="space-y-5 bg-[#0A0A0A] p-8 rounded-[30px] border border-white/5">
                   <input required value={reviewForm.userName} onChange={(e)=>setReviewForm({...reviewForm, userName: e.target.value})} placeholder="Your Name" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37]" />
                   <select value={reviewForm.rating} onChange={(e)=>setReviewForm({...reviewForm, rating: Number(e.target.value)})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37]">
                      <option value="5">5 Stars - Exceptional</option>
                      <option value="4">4 Stars - Excellent</option>
                      <option value="3">3 Stars - Good</option>
                   </select>
                   <textarea required value={reviewForm.comment} onChange={(e)=>setReviewForm({...reviewForm, comment: e.target.value})} rows={4} placeholder="Describe your experience..." className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37]" />
                   <button type="submit" className="w-full py-4 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white font-black uppercase rounded-xl text-[10px] tracking-[3px] transition-all">Submit Securely</button>
                </form>
              )}
           </div>
           <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? <p className="text-gray-500 font-serif italic">No public reviews available for this asset yet.</p> : 
                reviews.map((rev, i) => (
                  <div key={i} className="bg-[#0A0A0A] p-8 rounded-[30px] border border-white/5">
                     <div className="flex items-center gap-4 mb-4">
                        <UserCircle size={40} className="text-gray-600" />
                        <div>
                           <p className="font-bold text-white flex items-center gap-2">{rev.userName} {rev.isAdminGenerated && <ShieldCheck size={14} className="text-[#D4AF37]"/>}</p>
                           <div className="flex text-[#D4AF37] mt-1">{[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={10} fill="currentColor"/>)}</div>
                        </div>
                     </div>
                     <p className="text-gray-400 font-serif italic text-sm leading-relaxed">"{rev.comment}"</p>
                  </div>
                ))
              }
           </div>
        </div>
      </div>

      {/* ♞ AI RECOMMENDED SECTION ♞ */}
      {recommended.length > 0 && (
         <div className="bg-[#0A0A0A] border-t border-white/5 py-24 px-6 md:px-12 mt-20">
            <div className="max-w-[1700px] mx-auto">
               <div className="flex flex-col items-center justify-center text-center mb-16">
                  <Sparkles size={30} className="text-[#D4AF37] mb-6" strokeWidth={1} />
                  <h2 className="text-4xl md:text-5xl font-serif tracking-tighter mb-4 text-white">Curated For You</h2>
                  <p className="text-[10px] font-black uppercase tracking-[8px] text-gray-500">Based on your horological preferences</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {recommended.map((rec: any, i: number) => (
                     <Link href={`/product/${rec.slug || rec._id}`} key={i} className="group bg-[#050505] p-8 rounded-[40px] border border-white/5 hover:border-[#D4AF37]/30 transition-all flex flex-col h-full">
                        <div className="aspect-[4/5] bg-white/5 rounded-3xl flex items-center justify-center p-8 mb-8 overflow-hidden relative">
                           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                           <img src={rec.imageUrl || (rec.images && rec.images[0])} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700 relative z-0 drop-shadow-xl" />
                        </div>
                        <div className="flex-1 flex flex-col">
                           <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-[4px] mb-2">{rec.brand || 'Luxury'}</p>
                           <p className="text-white text-xl font-serif italic group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-6">{rec.name || rec.title}</p>
                           <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                              <p className="text-2xl font-black font-serif">₹{Number(rec.offerPrice || rec.price || rec.basePrice || 0).toLocaleString('en-IN')}</p>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  ShieldCheck, CreditCard, Wallet, Gift, Users, MapPin, Globe, CheckCircle, Phone, RefreshCcw, Lock
} from 'lucide-react';
import Link from 'next/link';

function PremiumCheckout() {
      const router = useRouter();
// 🛡️ Safe fallback: Agar build time pe session na mile toh empty object return karega
const sessionContext = useSession() || { data: null, status: 'unauthenticated' };
const { data: session, status } = sessionContext;

  const [cart, setCart] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [customer, setCustomer] = useState({
    name: '', email: '', phone: '', address: '', city: '', zipCode: '', country: 'India', source: 'Direct'
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
    setCart(savedCart);
    
    const urlParams = new URLSearchParams(window.location.search);
    const sourceParam = urlParams.get('source') || urlParams.get('utm_source');
    if (sourceParam) {
        const normalizedSource = sourceParam.charAt(0).toUpperCase() + sourceParam.slice(1).toLowerCase();
        localStorage.setItem('traffic_source', normalizedSource);
    }
    const savedSource = localStorage.getItem('traffic_source') || 'Direct';
    
    if (session?.user) {
        setCustomer(prev => ({ 
            ...prev, 
            name: session.user?.name || '', 
            email: session.user?.email || '',
            source: savedSource
        }));
        
        fetch(`/api/user/dashboard?email=${session.user?.email}`)
          .then(res => res.json())
          .then(data => { if (data.success && data.data) setWalletBalance(data.data.walletBalance); })
          .catch(()=>{});
    } else {
        setCustomer(prev => ({ ...prev, source: savedSource }));
    }
  }, [session]);

  const subtotal = cart.reduce((acc, item) => acc + (item.offerPrice || item.price || item.basePrice || 0) * item.qty, 0);
  const discountAmount = isPromoApplied ? subtotal * 0.10 : 0; 
  const walletDeduction = useWallet ? Math.min(walletBalance, subtotal - discountAmount) : 0;
  const grandTotal = subtotal - discountAmount - walletDeduction;

  const handleApplyPromo = () => {
      if(promoCode.length > 3) setIsPromoApplied(true);
      else alert("Invalid Promo Code"); // 🌟 Simple English
  };

  const handleCheckout = async (e: React.FormEvent) => {
      e.preventDefault();
      if (cart.length === 0) return alert("Your cart is empty."); // 🌟 Simple English
      setIsSubmitting(true);

      const affiliateRef = localStorage.getItem('affiliate_ref');

      try {
          const res = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  items: cart,
                  customer,
                  promoCode: isPromoApplied ? promoCode : null,
                  useWallet,
                  userEmail: session?.user?.email,
                  affiliateRef,
                  totalAmount: grandTotal
              })
          });

          const data = await res.json();
          if (data.success) {
              localStorage.removeItem('luxury_cart'); 
              setOrderSuccess(true);
          } else {
              alert("Payment Failed. Please check your details and try again."); // 🌟 Simple English
          }
      } catch (error) { alert("Network Error. Please check your connection."); }
      finally { setIsSubmitting(false); }
  };

  if (orderSuccess) {
      return (
          <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center px-6 selection:bg-[#D4AF37] selection:text-black">
              <CheckCircle size={80} className="text-[#D4AF37] mb-8" />
              <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-4 tracking-tighter font-bold">Order Placed.</h1> {/* 🌟 Simple English */}
              <p className="text-gray-400 text-sm md:text-xl mb-10 max-w-lg font-serif italic leading-relaxed">Thank you for your purchase. We are preparing your watch for delivery.</p> {/* 🌟 Simple English */}
              <Link href="/account" className="px-10 py-5 bg-[#D4AF37] text-black font-black uppercase tracking-[5px] text-[10px] rounded-full shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:bg-white transition-all">
                  Track My Order {/* 🌟 Simple English */}
              </Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black font-sans selection:bg-black selection:text-white relative overflow-hidden">
      
      {/* 🌟 ATMOSPHERIC BACKGROUND VIDEO (Fixed to Window) 🌟 */}
      <div className="fixed inset-0 z-0">
          <video src="https://cdn.pixabay.com/video/2020/05/24/40092-424840899_large.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-[#FAFAFA]/90 backdrop-blur-md"></div>
      </div>

      {/* 🌟 HEADER 🌟 */}
      <header className="bg-[#050505] py-5 px-6 md:px-12 flex justify-between items-center border-b-[4px] border-[#D4AF37] relative z-20 shadow-xl">
         <Link href="/" className="text-2xl font-serif font-black tracking-[5px] uppercase text-white hover:text-[#D4AF37] transition-colors">Essential</Link>
         <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]"><Lock size={14}/> Secure Checkout</div> {/* 🌟 Simple English */}
      </header>

      <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-20">
         
         {/* 🌟 LEFT COLUMN: FORM (GLASSMORPHISM) 🌟 */}
         <div className="lg:col-span-7 space-y-12 bg-white/60 backdrop-blur-2xl p-8 md:p-12 rounded-[40px] shadow-2xl border border-white">
            <div className="border-b border-gray-300 pb-6">
                <h2 className="text-4xl font-serif tracking-tight text-[#050505] font-bold">Delivery Details</h2> {/* 🌟 Simple English */}
            </div>
            
            <form onSubmit={handleCheckout} className="space-y-8" id="checkout-form">
                
                <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-200">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4"><Globe size={14}/> Order Source</label> {/* 🌟 Simple English */}
                    <div className="w-full bg-white/50 border border-gray-200 p-4 rounded-xl text-sm font-bold text-gray-600 flex justify-between items-center cursor-not-allowed">
                        <span>{customer.source}</span>
                        <ShieldCheck size={16} className="text-green-600"/>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2"><Users size={14}/> Full Name</label>
                        <input required value={customer.name} onChange={e=>setCustomer({...customer, name: e.target.value})} className="w-full bg-white/80 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="John Doe"/>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2"><Phone size={14}/> Phone Number</label> {/* 🌟 Simple English */}
                        <input required value={customer.phone} onChange={e=>setCustomer({...customer, phone: e.target.value})} className="w-full bg-white/80 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="+91 98765 43210"/>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address (For Order Receipt)</label> {/* 🌟 Simple English */}
                    <input required type="email" value={customer.email} onChange={e=>setCustomer({...customer, email: e.target.value})} className="w-full bg-white/80 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" placeholder="john@example.com"/>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2"><MapPin size={14}/> Shipping Address</label> {/* 🌟 Simple English */}
                    <textarea required value={customer.address} onChange={e=>setCustomer({...customer, address: e.target.value})} rows={3} className="w-full bg-white/80 border border-gray-200 p-4 rounded-2xl text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all custom-scrollbar" placeholder="House/Flat No., Street Name, Area..."/>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <input required value={customer.city} onChange={e=>setCustomer({...customer, city: e.target.value})} className="w-full bg-white/80 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black transition-all" placeholder="City"/>
                        <input required value={customer.zipCode} onChange={e=>setCustomer({...customer, zipCode: e.target.value})} className="w-full bg-white/80 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black transition-all" placeholder="Pincode"/>
                        <input required value={customer.country} onChange={e=>setCustomer({...customer, country: e.target.value})} className="w-full bg-gray-100 border border-gray-200 p-4 rounded-xl text-sm text-gray-500 outline-none cursor-not-allowed" readOnly />
                    </div>
                </div>
            </form>
         </div>

         {/* 🌟 RIGHT COLUMN: ORDER SUMMARY (OBSIDIAN BLACK) 🌟 */}
         <div className="lg:col-span-5 bg-[#050505] p-8 md:p-12 rounded-[40px] text-white shadow-2xl relative overflow-hidden border border-gray-800">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white blur-[150px] opacity-[0.05] pointer-events-none rounded-full"></div>

            <h3 className="text-3xl font-serif mb-8 border-b border-white/10 pb-6 relative z-10 font-bold">Order Summary</h3> {/* 🌟 Simple English */}

            <div className="space-y-6 mb-10 max-h-[350px] overflow-y-auto custom-scrollbar pr-4 relative z-10">
                {cart.length === 0 ? <p className="text-gray-400 italic font-serif">Your cart is empty.</p> : cart.map((item, i) => (
                   <div key={i} className="flex gap-5 items-center group">
                       <div className="w-24 h-24 bg-white rounded-2xl p-2 shrink-0 border border-gray-800 group-hover:border-white transition-colors">
                          <img src={item.imageUrl || item.images?.[0]} className="w-full h-full object-contain mix-blend-multiply" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[9px] font-bold uppercase text-gray-400 tracking-widest mb-1">{item.brand}</p>
                          <h4 className="text-lg font-serif text-white line-clamp-1">{item.name}</h4>
                          <p className="text-[11px] text-gray-500 mt-2 font-bold">Qty: {item.qty}</p>
                       </div>
                       <div className="text-right">
                          <p className="font-serif font-bold text-white text-xl">₹{((item.offerPrice || item.price || item.basePrice || 0) * item.qty).toLocaleString()}</p>
                       </div>
                   </div>
                ))}
            </div>

            <div className="space-y-6 mb-12 relative z-10">
                <div className="flex gap-3">
                   <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 flex items-center gap-3 focus-within:border-white transition-colors">
                      <Gift size={18} className="text-gray-400" />
                      <input value={promoCode} onChange={e=>setPromoCode(e.target.value)} disabled={isPromoApplied} className="bg-transparent border-none outline-none text-sm text-white w-full py-5 uppercase font-mono" placeholder="Promo Code" /> {/* 🌟 Simple English */}
                   </div>
                   <button onClick={handleApplyPromo} disabled={isPromoApplied} className={`px-8 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg ${isPromoApplied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white text-black hover:bg-gray-200'}`}>
                      {isPromoApplied ? 'Applied' : 'Apply'}
                   </button>
                </div>

                {walletBalance > 0 && (
                   <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex justify-between items-center hover:border-white/30 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white text-black rounded-xl shadow-md"><Wallet size={20}/></div>
                         <div>
                            <p className="text-[10px] font-bold uppercase tracking-[4px] text-gray-400">My Wallet</p> {/* 🌟 Simple English */}
                            <p className="text-lg font-serif italic text-white mt-1">₹{walletBalance.toLocaleString()}</p>
                         </div>
                      </div>
                      <button onClick={()=>setUseWallet(!useWallet)} className={`w-14 h-7 rounded-full p-1 transition-colors ${useWallet ? 'bg-green-500' : 'bg-white/20'}`}>
                         <div className={`w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${useWallet ? 'translate-x-7' : 'translate-x-0'}`}></div>
                      </button>
                   </div>
                )}
            </div>

            <div className="space-y-5 border-t border-white/10 pt-8 mb-10 relative z-10">
                <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                   <span>Subtotal</span><span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                {isPromoApplied && (
                   <div className="flex justify-between text-xs text-green-400 font-bold uppercase tracking-widest">
                      <span>Discount</span><span>- ₹{discountAmount.toLocaleString()}</span> {/* 🌟 Simple English */}
                   </div>
                )}
                {useWallet && (
                   <div className="flex justify-between text-xs text-blue-400 font-bold uppercase tracking-widest">
                      <span>Wallet Used</span><span>- ₹{walletDeduction.toLocaleString()}</span> {/* 🌟 Simple English */}
                   </div>
                )}
                <div className="flex justify-between items-end border-t border-white/10 pt-8 mt-6">
                   <span className="text-sm font-bold uppercase tracking-[3px] text-gray-400">Total Price</span> {/* 🌟 Simple English */}
                   <span className="text-5xl font-serif font-black text-white italic tracking-tighter">₹{grandTotal.toLocaleString()}</span>
                </div>
            </div>

            <button type="submit" form="checkout-form" disabled={isSubmitting} className="w-full py-6 bg-white text-black rounded-full font-black uppercase text-[12px] tracking-[5px] hover:bg-gray-200 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 relative z-10 active:scale-95">
                {isSubmitting ? <span className="animate-spin"><RefreshCcw size={20}/></span> : <><Lock size={18}/> Place Order</>} {/* 🌟 Simple English */}
            </button>
         </div>

      </main>
    </div>
  );
}

// 🌟 VERCEL BUILD OPTIMIZER: Strictly disable Server-Side Rendering (SSR) for Checkout
export default dynamic(() => Promise.resolve(PremiumCheckout), { ssr: false });
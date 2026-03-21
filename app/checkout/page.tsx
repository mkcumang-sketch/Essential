"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, CreditCard, Wallet, Gift, Users, MapPin, Globe, CheckCircle, Phone, RefreshCcw
} from 'lucide-react';
import Link from 'next/link';

export default function PremiumCheckout() {
  const router = useRouter();
  const { data: session } = useSession();
  
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
      else alert("Invalid Requisition Code");
  };

  const handleCheckout = async (e: React.FormEvent) => {
      e.preventDefault();
      if (cart.length === 0) return alert("Your vault is empty.");
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
              alert("Transaction Failed. Ensure all database models are synced.");
          }
      } catch (error) { alert("Network Error"); }
      finally { setIsSubmitting(false); }
  };

  if (orderSuccess) {
      return (
          <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center px-6 selection:bg-[#D4AF37] selection:text-black">
              <CheckCircle size={80} className="text-[#D4AF37] mb-8" />
              <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-4 tracking-tighter">Asset Secured.</h1>
              <p className="text-gray-400 text-sm md:text-base mb-10 max-w-md font-serif italic">Your requisition has been verified. Global logistics will dispatch your asset shortly.</p>
              <Link href="/account" className="px-10 py-5 bg-[#D4AF37] text-black font-black uppercase tracking-[5px] text-[10px] rounded-full shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:bg-white transition-all">
                  Track in Vault
              </Link>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black font-sans selection:bg-[#D4AF37] selection:text-white">
      
      <header className="bg-[#050505] py-6 px-10 flex justify-between items-center border-b-[5px] border-[#D4AF37]">
         <Link href="/" className="text-2xl font-serif font-black tracking-[5px] uppercase text-white">Essential</Link>
         <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-[#D4AF37]"><ShieldCheck size={16}/> Secure SSL Checkout</div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
         
         <div className="lg:col-span-7 space-y-12">
            <div className="border-b border-gray-200 pb-6">
                <h2 className="text-4xl font-serif italic tracking-tighter text-[#050505]">Client Information</h2>
            </div>
            
            <form onSubmit={handleCheckout} className="space-y-8" id="checkout-form">
                
                <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4"><Globe size={14}/> Intelligence Node: Origin Route</label>
                    <div className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm font-bold text-gray-500 flex justify-between items-center cursor-not-allowed">
                        <span>{customer.source}</span>
                        <ShieldCheck size={16} className="text-[#D4AF37]"/>
                    </div>
                    <p className="text-[8px] text-gray-400 mt-3 font-mono uppercase tracking-widest">Source verified automatically by secure protocol.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Users size={14}/> Full Name</label>
                        <input required value={customer.name} onChange={e=>setCustomer({...customer, name: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37]" placeholder="John Doe"/>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Phone size={14}/> Phone Protocol</label>
                        <input required value={customer.phone} onChange={e=>setCustomer({...customer, phone: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37]" placeholder="+91 98765 43210"/>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address (For Vault Receipt)</label>
                    <input required type="email" value={customer.email} onChange={e=>setCustomer({...customer, email: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37]" placeholder="john@elite.com"/>
                </div>

                <div className="space-y-4 pt-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><MapPin size={14}/> Shipping Coordinates</label>
                    <textarea required value={customer.address} onChange={e=>setCustomer({...customer, address: e.target.value})} rows={3} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37]" placeholder="Street Address, Appt, Floor..."/>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <input required value={customer.city} onChange={e=>setCustomer({...customer, city: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37]" placeholder="City / Region"/>
                        <input required value={customer.zipCode} onChange={e=>setCustomer({...customer, zipCode: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37]" placeholder="Zip / Pincode"/>
                        <input required value={customer.country} onChange={e=>setCustomer({...customer, country: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37]" readOnly />
                    </div>
                </div>
            </form>
         </div>

         <div className="lg:col-span-5 bg-[#050505] p-10 md:p-12 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] blur-[100px] opacity-[0.05] pointer-events-none rounded-full"></div>

            <h3 className="text-2xl font-serif italic mb-8 border-b border-white/10 pb-6 relative z-10">Order Summary</h3>

            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                {cart.length === 0 ? <p className="text-gray-500 italic font-serif">Vault is empty.</p> : cart.map((item, i) => (
                   <div key={i} className="flex gap-4 items-center">
                       <div className="w-20 h-24 bg-white/5 rounded-xl p-2 shrink-0 border border-white/10">
                          <img src={item.imageUrl || item.images?.[0]} className="w-full h-full object-contain mix-blend-screen" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[8px] font-black uppercase text-[#D4AF37] tracking-widest">{item.brand}</p>
                          <h4 className="text-sm font-serif text-white line-clamp-1">{item.name}</h4>
                          <p className="text-[10px] text-gray-500 mt-1">Qty: {item.qty}</p>
                       </div>
                       <div className="text-right">
                          <p className="font-mono font-bold text-white text-sm">₹{((item.offerPrice || item.price || item.basePrice || 0) * item.qty).toLocaleString()}</p>
                       </div>
                   </div>
                ))}
            </div>

            <div className="space-y-6 mb-10 relative z-10">
                <div className="flex gap-3">
                   <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 flex items-center gap-3 focus-within:border-[#D4AF37] transition-colors">
                      <Gift size={16} className="text-gray-500" />
                      <input value={promoCode} onChange={e=>setPromoCode(e.target.value)} disabled={isPromoApplied} className="bg-transparent border-none outline-none text-xs text-white w-full py-4 uppercase font-mono" placeholder="Requisition Code" />
                   </div>
                   <button onClick={handleApplyPromo} disabled={isPromoApplied} className={`px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isPromoApplied ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-[#D4AF37] text-black hover:bg-white'}`}>
                      {isPromoApplied ? 'Applied' : 'Apply'}
                   </button>
                </div>

                {walletBalance > 0 && (
                   <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 p-5 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-[#D4AF37] text-black rounded-lg"><Wallet size={16}/></div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Empire Wallet</p>
                            <p className="text-xs font-mono font-bold text-white mt-1">Bal: ₹{walletBalance.toLocaleString()}</p>
                         </div>
                      </div>
                      <button onClick={()=>setUseWallet(!useWallet)} className={`w-12 h-6 rounded-full p-1 transition-colors ${useWallet ? 'bg-[#D4AF37]' : 'bg-white/20'}`}>
                         <div className={`w-4 h-4 bg-black rounded-full transition-transform ${useWallet ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                   </div>
                )}
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6 mb-8 relative z-10">
                <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                   <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                </div>
                {isPromoApplied && (
                   <div className="flex justify-between text-xs text-green-500 font-bold uppercase tracking-widest">
                      <span>Discount (Promo)</span><span>- ₹{discountAmount.toLocaleString()}</span>
                   </div>
                )}
                {useWallet && (
                   <div className="flex justify-between text-xs text-[#D4AF37] font-bold uppercase tracking-widest">
                      <span>Wallet Applied</span><span>- ₹{walletDeduction.toLocaleString()}</span>
                   </div>
                )}
                <div className="flex justify-between items-end border-t border-white/10 pt-6 mt-4">
                   <span className="text-sm font-black uppercase tracking-[4px] text-gray-300">Total Capital</span>
                   <span className="text-4xl font-serif font-black text-white">₹{grandTotal.toLocaleString()}</span>
                </div>
            </div>

            <button type="submit" form="checkout-form" disabled={isSubmitting} className="w-full py-6 bg-[#D4AF37] text-black rounded-2xl font-black uppercase text-[11px] tracking-[5px] hover:bg-white transition-all shadow-[0_10px_40px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3 relative z-10">
                {isSubmitting ? <span className="animate-spin"><RefreshCcw size={18}/></span> : <><CreditCard size={18}/> Authorize Transaction</>}
            </button>
         </div>

      </main>
    </div>
  );
}

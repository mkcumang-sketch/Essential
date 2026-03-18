"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, CheckCircle2, CreditCard, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LuxuryCheckout() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [customer, setCustomer] = useState({
      name: '', email: '', phone: '', address: '', city: '', zipCode: ''
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
    if (savedCart.length === 0) {
        router.push('/');
    } else {
        setCart(savedCart);
        const total = savedCart.reduce((acc: number, item: any) => acc + ((item.offerPrice || item.price || item.basePrice || 0) * (item.qty || 1)), 0);
        setCartTotal(total);
    }
  }, [router]);

  // 🚨 SILENT ABANDONED CART TRACKER
  useEffect(() => {
    const timer = setTimeout(() => {
      if (customer.phone.length >= 10) {
        fetch('/api/checkout/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: customer.phone, cart })
        }).catch(() => console.log("Trace missed"));
      }
    }, 2000); 
    return () => clearTimeout(timer);
  }, [customer.phone, cart]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address) return alert("Complete all required fields.");
    setIsLoading(true);
    const affiliateCode = localStorage.getItem('affiliate_ref');

    try {
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer, cart, affiliateCode })
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
            setOrderId(data.orderId);
            setStep(2); 
            localStorage.removeItem('luxury_cart');
        } else {
            alert("Transaction Failed: " + data.error);
        }
    } catch (error) {
        alert("Network Error.");
    } finally {
        setIsLoading(false);
    }
  };

  if (cart.length === 0 && step === 1) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#D4AF37] selection:text-black flex flex-col md:flex-row">
      <div className="w-full md:w-[45%] bg-[#050505] p-10 md:p-20 flex flex-col justify-between border-r border-white/5 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D4AF37] blur-[300px] opacity-[0.03] pointer-events-none"></div>
         <div className="relative z-10">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 text-xs font-black uppercase tracking-widest"><ChevronLeft size={14}/> Return to Vault</button>
            <div className="flex items-center gap-4 mb-16"><div className="text-[#D4AF37] text-3xl">♞</div><h1 className="text-xl font-serif font-black tracking-[10px] uppercase text-white">Essential</h1></div>
            <h2 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[8px] mb-8">Requisition Manifest</h2>
            <div className="space-y-8 mb-12 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
               {cart.map((item, i) => (
                  <div key={i} className="flex gap-6 items-center">
                     <div className="w-20 h-20 bg-white/5 rounded-2xl p-2 flex items-center justify-center border border-white/5">{item.imageUrl ? <img src={item.imageUrl} alt={item.name || item.title} className="h-full object-contain drop-shadow-xl" /> : <div className="text-xs text-gray-600">No Image</div>}</div>
                     <div className="flex-1"><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.brand || 'Luxury'}</p><h4 className="text-sm font-serif italic mb-1">{item.name || item.title}</h4><p className="text-[10px] font-black text-[#D4AF37]">QTY: {item.qty || 1}</p></div>
                     <p className="text-lg font-serif font-black">₹{((item.offerPrice || item.price || item.basePrice || 0) * (item.qty || 1)).toLocaleString('en-IN')}</p>
                  </div>
               ))}
            </div>
         </div>
         <div className="relative z-10 border-t border-white/10 pt-10 mt-auto">
            <div className="flex justify-between items-center mb-6 text-gray-400 text-xs font-bold uppercase tracking-widest"><span>Insured Dispatch</span><span className="text-[#D4AF37]">Complimentary</span></div>
            <div className="flex justify-between items-end"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Allocation</span><span className="text-4xl font-serif font-black tracking-tighter text-white">₹{cartTotal.toLocaleString('en-IN')}</span></div>
         </div>
      </div>

      <div className="w-full md:w-[55%] p-10 md:p-24 flex items-center justify-center relative overflow-y-auto custom-scrollbar">
         <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
               {step === 1 && (
                  <motion.div key="form" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
                     <ShieldCheck className="text-[#D4AF37] mb-8" size={40} strokeWidth={1} />
                     <h2 className="text-4xl font-serif tracking-tighter mb-4">Diplomatic Clearance</h2>
                     <p className="text-gray-400 text-sm leading-relaxed mb-12 font-medium">To secure this allocation within India, please provide your identity and destination coordinates.</p>
                     
                     <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input required type="text" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} placeholder="Full Legal Name" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] transition-colors" />
                            <input required type="tel" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} placeholder="Mobile (+91 xxxx-xxxxxx)" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] transition-colors" />
                        </div>
                        <input required type="email" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} placeholder="Primary Email Address" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] transition-colors" />
                        <div className="pt-4 pb-2"><p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-2"><Lock size={12}/> Delivery Coordinates</p></div>
                        <input required type="text" value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} placeholder="Street Address / Building" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] transition-colors" />
                        <div className="grid grid-cols-2 gap-5">
                            <input required type="text" value={customer.city} onChange={(e) => setCustomer({...customer, city: e.target.value})} placeholder="City / District" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] transition-colors" />
                            <input required type="text" value={customer.zipCode} onChange={(e) => setCustomer({...customer, zipCode: e.target.value})} placeholder="Pincode (e.g. 400001)" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] transition-colors" />
                        </div>
                        <div className="bg-[#050505] border border-[#D4AF37]/30 p-5 rounded-2xl flex items-center gap-4 mt-8">
                           <CreditCard className="text-[#D4AF37]" size={24}/>
                           <div><p className="text-sm font-bold">RTGS / Concierge Pay</p><p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Our team will contact you for payment.</p></div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full py-6 mt-8 bg-[#D4AF37] text-black font-black uppercase rounded-2xl text-[11px] tracking-[4px] hover:bg-white transition-all flex justify-center items-center gap-3 disabled:opacity-50 shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
                           {isLoading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <>Authorize Requisition <ArrowRight size={16}/></>}
                        </button>
                     </form>
                  </motion.div>
               )}

               {step === 2 && (
                  <motion.div key="success" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="text-center py-10">
                     <div className="w-32 h-32 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.2)]"><CheckCircle2 className="text-[#D4AF37]" size={50} /></div>
                     <h2 className="text-4xl font-serif tracking-tighter mb-4 text-white">Allocation Secured.</h2>
                     <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[5px] mb-8">Requisition ID: {orderId}</p>
                     <p className="text-gray-400 text-sm leading-relaxed font-medium mb-12 max-w-sm mx-auto">Your request has been logged into the global mainframe. Our concierge team will contact you shortly to arrange the secure transfer of funds and diplomatic delivery within India.</p>
                     <button onClick={() => router.push('/')} className="bg-white text-black px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#D4AF37] transition-colors">Return to Vault</button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldCheck, CheckCircle, Tag, X, Trash2, ArrowLeft, ShoppingBag, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// --- LUXURY TOAST COMPONENT ---
const LuxuryToast = ({ show, message, type = "success" }: any) => (
    <AnimatePresence>
        {show && (
            <motion.div 
                initial={{ opacity: 0, y: 50, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
                className="fixed bottom-10 left-1/2 z-[2000] bg-black/95 backdrop-blur-xl border border-[#D4AF37]/50 px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 min-w-[320px]"
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-[#D4AF37]">Checkout</p>
                    <p className="text-white text-sm font-serif italic">{message}</p>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session } = useSession();
    
    const [cart, setCart] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState<string | null>(null); // 🚨 Added for Tracking ID

    // 🎟️ PROMO STATES
    const [vaultKeyInput, setVaultKeyInput] = useState('');
    const [promoDetails, setPromoDetails] = useState<{code: string, type: 'product'|'global'|'referral', discountValue: number} | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [shippingData, setShippingData] = useState({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
    });

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
        setCart(savedCart);
        if (session?.user) {
            setShippingData(prev => ({...prev, name: session.user?.name || '', email: session.user?.email || '', phone: (session.user as any)?.phone || ''}));
        }
    }, [session]);

    const showLuxuryToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    const handleRemoveItem = (indexToRemove: number) => {
        const updatedCart = cart.filter((_, index) => index !== indexToRemove);
        setCart(updatedCart);
        localStorage.setItem('luxury_cart', JSON.stringify(updatedCart));
        showLuxuryToast("Removed from cart.", "success");

        if(updatedCart.length === 0) {
             setPromoDetails(null); 
        }
    };

    const { subtotal, totalDiscount, totalTransit, totalTaxes, grandTotal } = useMemo(() => {
        let sub = 0; let disc = 0; let transit = 0; let tax = 0;

        cart.forEach(item => {
            let itemPrice = Number(item.offerPrice || item.price);
            const qty = Number(item.qty);
            sub += itemPrice * qty;

            if (promoDetails?.type === 'product' && promoDetails.code === item.vipVaultKey?.toUpperCase()) {
                const productDisc = Number(item.vipDiscount || 0) * qty;
                disc += productDisc;
                itemPrice -= Number(item.vipDiscount || 0);
                if(itemPrice < 0) itemPrice = 0;
            }

            transit += Number(item.transitFee || 0) * qty;
            if (item.taxInclusive === false) {
                tax += (itemPrice * qty) * (Number(item.taxPercentage || 18) / 100);
            }
        });

        if (promoDetails?.code === 'ESSENTIAL10') {
             const globalDisc = (sub * 10) / 100;
             disc += globalDisc;
        } else if (promoDetails?.type === 'global' || promoDetails?.type === 'referral') {
            const globalDisc = (sub * promoDetails.discountValue) / 100;
            disc += globalDisc;
        }

        return { subtotal: sub, totalDiscount: disc, totalTransit: transit, totalTaxes: tax, grandTotal: (sub - disc) + transit + tax };
    }, [cart, promoDetails]);

    const handleApplyPromoCode = async () => {
        if (!vaultKeyInput.trim()) return;
        const code = vaultKeyInput.toUpperCase();
        setIsVerifying(true);
        
        try {
            if (code === 'ESSENTIAL10') {
                setPromoDetails({ code, type: 'global', discountValue: 10 });
                showLuxuryToast(`Code Applied: 10% Off!`, 'success');
                setVaultKeyInput('');
                return;
            }

            const isProductCode = cart.some(item => item.vipVaultKey?.toUpperCase() === code);
            if (isProductCode) {
                setPromoDetails({ code, type: 'product', discountValue: 0 }); 
                showLuxuryToast(`Watch code applied.`, 'success');
                setIsVerifying(false);
                return;
            }

            const res = await fetch('/api/verify-promo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await res.json();

            if (data.success) {
                const type = data.isReferral ? 'referral' : 'global';
                setPromoDetails({ code, type, discountValue: data.discountValue || 10 });
                showLuxuryToast(data.isReferral ? `Referral Applied: 10% Off!` : `Code Applied: ${data.discountValue}% Off!`, 'success');
                setVaultKeyInput('');
            } else {
                setPromoDetails(null);
                showLuxuryToast("That code is not valid. Try again.", "error");
            }
        } catch (err) {
            showLuxuryToast("Something went wrong. Try again.", "error");
        } finally {
            setIsVerifying(false);
        }
    };

    const processFinalOrder = async (e: React.FormEvent) => {
        e.preventDefault(); 
        if (cart.length === 0) return showLuxuryToast("Your cart is empty!", "error");
        
        setIsSubmitting(true);
        
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    totalAmount: grandTotal,
                    financialBreakdown: { subtotal, totalDiscount, totalTransit, totalTaxes },
                    appliedReferralCode: (promoDetails?.type === 'referral' || promoDetails?.type === 'global') ? promoDetails.code : null,
                    appliedVaultKey: promoDetails?.type === 'product' ? promoDetails.code : null,
                    customer: shippingData, 
                    paymentMethod: 'COD'
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.removeItem('luxury_cart');
                localStorage.removeItem('guest_lead_captured');
                setPlacedOrderId(data.orderId || `ORD-${Date.now().toString().slice(-6)}`); // 🚨 SAVE TRACKING ID
            } else {
                showLuxuryToast(data.error || "Order did not go through. Check details.", "error");
            }
        } catch (error) {
            showLuxuryToast("Connection interrupted. Try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🚨 UPDATED SUCCESS SCREEN WITH TRACKING ID 🚨
    if (placedOrderId) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center text-black selection:bg-black selection:text-white">
                <motion.div initial={{scale:0}} animate={{scale:1}}><CheckCircle size={80} className="text-green-600 mb-6 drop-shadow-md" /></motion.div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tighter uppercase">Order Confirmed</h1>
                <p className="text-gray-500 mb-8 max-w-md font-serif italic text-base">Your premium timepiece is being prepared. Please save your Tracking ID below to track your shipment.</p>
                
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-10 w-full max-w-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Your Tracking ID</p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl font-mono font-bold text-black">{placedOrderId}</span>
                        <button onClick={() => { navigator.clipboard.writeText(placedOrderId); showLuxuryToast("Tracking ID Copied!", "success"); }} className="p-2 bg-gray-100 rounded-lg hover:bg-black hover:text-white transition-all text-gray-500"><Copy size={18}/></button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link href="/shop" className="px-8 py-4 bg-gray-100 text-black font-black uppercase text-[10px] tracking-[2px] rounded-full hover:bg-gray-200 transition-all border border-gray-200">Keep Shopping</Link>
                    <Link href="/account" className="px-8 py-4 bg-black text-white font-black uppercase text-[10px] tracking-[2px] rounded-full hover:bg-gray-800 transition-all shadow-md">Track Order</Link>
                </div>
                <LuxuryToast show={toast.show} message={toast.message} type={toast.type} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black pb-20 font-sans relative selection:bg-black selection:text-white">
            <LuxuryToast show={toast.show} message={toast.message} type={toast.type} />
            
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm mb-12">
                <Link href="/cart" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft size={16}/> Back to Cart
                </Link>
                <h1 className="text-lg md:text-2xl font-serif font-black tracking-[4px] uppercase text-black absolute left-1/2 -translate-x-1/2">Essential</h1>
                <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest hidden md:flex">
                    <ShieldCheck size={14}/> 256-Bit Secure
                </div>
            </header>

            <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* --- Left Side: Shipping --- */}
                <div className="lg:col-span-7 space-y-10">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-black mb-2">Delivery Details</h2>
                        <p className="text-sm text-gray-500 font-serif italic mb-8">Where should we send your premium timepiece?</p>
                        <form onSubmit={processFinalOrder} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input required className="w-full bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black transition-colors shadow-sm" placeholder="Full Name" value={shippingData.name} onChange={e=>setShippingData({...shippingData, name:e.target.value})}/>
                                <input required className="w-full bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black transition-colors shadow-sm" placeholder="Phone Number" value={shippingData.phone} onChange={e=>setShippingData({...shippingData, phone:e.target.value})}/>
                            </div>
                            <input required type="email" className="w-full bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black transition-colors shadow-sm" placeholder="Email Address" value={shippingData.email} onChange={e=>setShippingData({...shippingData, email:e.target.value})}/>
                            <textarea required className="w-full bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black transition-colors shadow-sm" placeholder="Complete Delivery Address" rows={3} value={shippingData.address} onChange={e=>setShippingData({...shippingData, address:e.target.value})}/>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <input required className="bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black transition-colors shadow-sm" placeholder="PIN" value={shippingData.pincode} onChange={e=>setShippingData({...shippingData, pincode:e.target.value})}/>
                                <input required className="bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black transition-colors shadow-sm col-span-2" placeholder="City" value={shippingData.city} onChange={e=>setShippingData({...shippingData, city:e.target.value})}/>
                            </div>

                            <div className="pt-10">
                                <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-gray-400">Payment Method</h3>
                                <div className="p-6 border-2 border-black rounded-3xl bg-white flex items-center justify-between shadow-md">
                                    <div className="flex items-center gap-4"><div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">₹</div><span className="font-bold text-sm uppercase tracking-widest">Cash on Delivery</span></div>
                                    <CheckCircle size={24} className="text-black"/>
                                </div>
                            </div>

                            <button type="submit" disabled={isSubmitting || cart.length === 0} className="w-full py-6 bg-black text-white font-black uppercase tracking-[5px] text-[11px] rounded-2xl hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50 mt-6 flex items-center justify-center gap-3">
                                {isSubmitting ? 'Processing...' : 'Place order securely'}
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* --- Right Side: Summary --- */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-gray-200 p-8 md:p-10 rounded-[40px] sticky top-24 shadow-xl">
                        <h3 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-4 flex items-center gap-3"><ShoppingBag size={24} className="text-gray-400"/> Order summary</h3>
                        
                        <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {cart.length === 0 ? (
                                <p className="text-sm text-gray-500 italic text-center py-4">Your cart is empty.</p>
                            ) : (
                                cart.map((item, i) => (
                                    <div key={`${item._id}-${i}`} className="flex gap-4 relative group items-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center shrink-0">
                                            <img src={item.imageUrl || item.image || '/placeholder-watch.png'} className="max-h-full object-contain mix-blend-multiply" alt={item.name} />
                                        </div>
                                        <div className="flex-1 pr-8">
                                            <h4 className="text-xs font-black uppercase tracking-widest line-clamp-1 pr-2 text-black">{item.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-mono mt-1">QTY: {item.qty}</p>
                                            <p className="font-bold text-sm mt-1 text-black">₹{(Number(item.offerPrice || item.price) * item.qty).toLocaleString()}</p>
                                            {promoDetails?.type === 'product' && promoDetails.code === item.vipVaultKey?.toUpperCase() && (
                                                <span className="inline-block bg-green-50 text-green-700 border border-green-200 text-[8px] font-black px-2 py-0.5 rounded mt-2 uppercase tracking-widest">-₹{item.vipDiscount} VIP Code</span>
                                            )}
                                        </div>
                                        
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveItem(i)} 
                                            className="absolute top-0 right-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {/* --- PROMO & REFERRAL BOX --- */}
                        <div className="mb-10 p-6 bg-gray-50 rounded-[30px] border border-gray-200 shadow-inner">
                            <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-500 mb-3 flex items-center gap-2"><Tag size={12}/> Friend referral or VIP code</label>
                            <div className="flex gap-2">
                                <input value={vaultKeyInput} onChange={(e) => setVaultKeyInput(e.target.value)} className="flex-1 bg-white border border-gray-200 p-4 rounded-xl text-xs font-black uppercase outline-none focus:border-black shadow-sm" placeholder="EX: ESSENTIAL10" />
                                <button onClick={handleApplyPromoCode} type="button" disabled={isVerifying || cart.length === 0} className="px-6 bg-black text-white font-black text-[10px] uppercase rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 shadow-sm">
                                    {isVerifying ? '...' : 'Apply'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-gray-100 pt-8">
                            <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400 tracking-widest"><span>Subtotal</span><span className="text-black">₹{subtotal.toLocaleString()}</span></div>
                            
                            {totalDiscount > 0 && <div className="flex justify-between text-[11px] font-black uppercase text-green-600 tracking-widest">
                                <span>{promoDetails?.type === 'referral' ? 'Friend referral' : 'Discount'} ({promoDetails?.discountValue || 10}%)</span>
                                <span>-₹{totalDiscount.toLocaleString()}</span>
                            </div>}
                            
                            <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400 tracking-widest"><span>Transit & Insurance</span><span className="text-black">{totalTransit === 0 ? "Complimentary" : `₹${totalTransit.toLocaleString()}`}</span></div>
                            {totalTaxes > 0 && <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400 tracking-widest"><span>Taxes & Duties</span><span className="text-black">₹{totalTaxes.toLocaleString()}</span></div>}
                            
                            <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-100">
                                <span className="font-black text-xs uppercase tracking-[4px] text-gray-500">Grand Total</span>
                                <span className="text-4xl font-serif font-bold tracking-tighter text-black">₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
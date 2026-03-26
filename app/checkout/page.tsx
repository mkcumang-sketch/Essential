"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle, Key, Info, Tag, ShoppingBag, X } from 'lucide-react';
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
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-[#D4AF37]">Vault System</p>
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
    const [orderPlaced, setOrderPlaced] = useState(false);

    // 🎟️ REFERRAL / VAULT KEY STATES
    const [vaultKeyInput, setVaultKeyInput] = useState('');
    const [appliedVaultKey, setAppliedVaultKey] = useState('');
    
    // 🌟 TOAST STATES
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Shipping Details Form
    const [shippingData, setShippingData] = useState({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
    });

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
        setCart(savedCart);
        
        if (session?.user) {
            setShippingData(prev => ({
                ...prev,
                name: session.user?.name || '',
                email: session.user?.email || '',
                phone: (session.user as any)?.phone || ''
            }));
        }
    }, [session]);

    const showLuxuryToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ ...toast, show: false }), 4000);
    };

    // 👑 THE MASTER PRICING CALCULATOR (Smart Math Engine)
    const { subtotal, totalDiscount, totalTransit, totalTaxes, grandTotal } = useMemo(() => {
        let sub = 0; let disc = 0; let transit = 0; let tax = 0;

        cart.forEach(item => {
            let itemPrice = Number(item.offerPrice || item.price);
            const qty = Number(item.qty);
            sub += itemPrice * qty;

            // Referral Check: Code matches product's specific VIP Vault Key
            if (appliedVaultKey && item.vipVaultKey?.toUpperCase() === appliedVaultKey) {
                disc += Number(item.vipDiscount || 0) * qty;
                itemPrice -= Number(item.vipDiscount || 0);
            }

            transit += Number(item.transitFee || 0) * qty;
            if (item.taxInclusive === false) {
                tax += (itemPrice * qty) * (Number(item.taxPercentage || 18) / 100);
            }
        });

        return { subtotal: sub, totalDiscount: disc, totalTransit: transit, totalTaxes: tax, grandTotal: (sub - disc) + transit + tax };
    }, [cart, appliedVaultKey]);

    const handleApplyVaultKey = () => {
        if (!vaultKeyInput.trim()) return;
        const code = vaultKeyInput.toUpperCase();
        
        // Validation: Check if this code exists in any cart item
        const isValid = cart.some(item => item.vipVaultKey?.toUpperCase() === code);
        
        if (isValid) {
            setAppliedVaultKey(code);
            showLuxuryToast(`VIP Access Granted: Code ${code} Applied!`, 'success');
        } else {
            showLuxuryToast("Invalid Vault Key or not applicable to your selection.", "error");
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
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
                    appliedVaultKey,
                    customer: shippingData,
                    paymentMethod: 'COD'
                })
            });

            if (res.ok) {
                localStorage.removeItem('luxury_cart');
                setOrderPlaced(true); 
            } else {
                showLuxuryToast("Acquisition failed. Please verify your details.", "error");
            }
        } catch (error) {
            showLuxuryToast("Connection interrupted. Try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center text-white">
                <motion.div initial={{scale:0}} animate={{scale:1}}><CheckCircle size={100} className="text-[#D4AF37] mb-6 shadow-[0_0_50px_rgba(212,175,55,0.3)] rounded-full" /></motion.div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tighter uppercase">Order Secured</h1>
                <p className="text-gray-400 mb-10 max-w-md font-serif italic text-lg">Acquisition successful. Your timepieces are being prepared for armored transit.</p>
                <Link href="/shop" className="px-12 py-5 bg-[#D4AF37] text-black font-black uppercase text-[10px] tracking-[4px] rounded-full hover:bg-white transition-all shadow-2xl">Return to Vault</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black pt-24 pb-20 font-sans">
            <LuxuryToast show={toast.show} message={toast.message} type={toast.type} />
            
            <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* --- Left Side: Shipping --- */}
                <div className="lg:col-span-7 space-y-10">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-gray-400 hover:text-black transition-colors">
                        <ArrowLeft size={16} /> Back
                    </button>
                    
                    <h2 className="text-5xl font-serif font-bold border-b border-gray-200 pb-6 tracking-tighter">SECURE CHECKOUT.</h2>
                    
                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input required className="w-full bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black" placeholder="Full Name" value={shippingData.name} onChange={e=>setShippingData({...shippingData, name:e.target.value})}/>
                            <input required className="w-full bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black" placeholder="Phone Number" value={shippingData.phone} onChange={e=>setShippingData({...shippingData, phone:e.target.value})}/>
                        </div>
                        <input required className="w-full bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black" placeholder="Email Address" value={shippingData.email} onChange={e=>setShippingData({...shippingData, email:e.target.value})}/>
                        <textarea required className="w-full bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black" placeholder="Complete Delivery Address" rows={3} value={shippingData.address} onChange={e=>setShippingData({...shippingData, address:e.target.value})}/>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <input required className="bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black" placeholder="PIN" value={shippingData.pincode} onChange={e=>setShippingData({...shippingData, pincode:e.target.value})}/>
                            <input required className="bg-white border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black col-span-2" placeholder="City" value={shippingData.city} onChange={e=>setShippingData({...shippingData, city:e.target.value})}/>
                        </div>

                        <div className="pt-10">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-6">Payment Selection</h3>
                            <div className="p-6 border-2 border-black rounded-3xl bg-white flex items-center justify-between shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">₹</div>
                                    <span className="font-bold text-sm uppercase tracking-widest">Cash on Delivery</span>
                                </div>
                                <CheckCircle size={24} className="text-black"/>
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting || cart.length === 0} className="w-full py-6 bg-black text-white font-black uppercase tracking-[5px] text-[11px] rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all shadow-2xl disabled:opacity-50">
                            {isSubmitting ? 'Authenticating...' : 'Confirm Acquisition'}
                        </button>
                    </form>
                </div>

                {/* --- Right Side: Summary --- */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-[40px] sticky top-24 shadow-2xl">
                        <h3 className="text-2xl font-serif font-bold mb-8 border-b border-gray-100 pb-4">Vault Summary</h3>
                        
                        <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {cart.map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center">
                                        <img src={item.imageUrl} className="max-h-full mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-black uppercase tracking-widest line-clamp-1">{item.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-mono mt-1">QTY: {item.qty}</p>
                                        <p className="font-bold text-sm mt-1">₹{(Number(item.offerPrice || item.price) * item.qty).toLocaleString()}</p>
                                        {appliedVaultKey === item.vipVaultKey?.toUpperCase() && (
                                            <span className="inline-block bg-green-100 text-green-700 text-[8px] font-black px-2 py-0.5 rounded mt-2 uppercase tracking-widest">-₹{item.vipDiscount} VIP Code</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* --- VAULT KEY INPUT (REFERRAL) --- */}
                        <div className="mb-10 p-6 bg-gray-50 rounded-[30px] border border-gray-200">
                            <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-500 mb-3 block flex items-center gap-2"><Tag size={12}/> Referral / Vault Key</label>
                            <div className="flex gap-2">
                                <input value={vaultKeyInput} onChange={(e) => setVaultKeyInput(e.target.value)} className="flex-1 bg-white border border-gray-200 p-4 rounded-xl text-xs font-black uppercase outline-none focus:border-[#D4AF37]" placeholder="EX: ELITE10" />
                                <button onClick={handleApplyVaultKey} className="px-6 bg-black text-[#D4AF37] font-black text-[10px] uppercase rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all">Apply</button>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-gray-100 pt-8">
                            <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400 tracking-widest"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                            {totalDiscount > 0 && <div className="flex justify-between text-[11px] font-black uppercase text-green-600 tracking-widest"><span>Vault Benefit</span><span>-₹{totalDiscount.toLocaleString()}</span></div>}
                            <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400 tracking-widest"><span>Transit & Insurance</span><span>{totalTransit === 0 ? "Complimentary" : `₹${totalTransit.toLocaleString()}`}</span></div>
                            {totalTaxes > 0 && <div className="flex justify-between text-[11px] font-bold uppercase text-gray-400 tracking-widest"><span>Taxes & Duties</span><span>₹{totalTaxes.toLocaleString()}</span></div>}
                            
                            <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-100">
                                <span className="font-black text-xs uppercase tracking-[4px]">Grand Total</span>
                                <span className="text-4xl font-serif font-black tracking-tighter">₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
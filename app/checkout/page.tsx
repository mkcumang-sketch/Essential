"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle, Key, Info } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session } = useSession();
    
    const [cart, setCart] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // 👑 VIP Vault Key States
    const [vaultKeyInput, setVaultKeyInput] = useState('');
    const [appliedVaultKey, setAppliedVaultKey] = useState('');

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

    // 👑 THE MASTER PRICING CALCULATOR (Smart Math Engine) 👑
    const { subtotal, totalDiscount, totalTransit, totalTaxes, grandTotal } = useMemo(() => {
        let sub = 0;
        let disc = 0;
        let transit = 0;
        let tax = 0;

        cart.forEach(item => {
            let itemPrice = Number(item.offerPrice || item.price);
            const qty = Number(item.qty);

            sub += itemPrice * qty;

            // 1. VIP Discount Check
            if (appliedVaultKey && item.vipVaultKey && appliedVaultKey.toUpperCase() === item.vipVaultKey.toUpperCase()) {
                const discountValue = Number(item.vipDiscount || 0) * qty;
                disc += discountValue;
                itemPrice -= Number(item.vipDiscount || 0);
                if (itemPrice < 0) itemPrice = 0; // Price negative nahi ho sakti
            }

            // 2. Insured Transit Fee Check
            transit += Number(item.transitFee || 0) * qty;

            // 3. Tax / GST Check (Only add if Exclusive)
            if (item.taxInclusive === false) {
                const taxRate = Number(item.taxPercentage || 0) / 100;
                tax += (itemPrice * qty) * taxRate;
            }
        });

        return {
            subtotal: sub,
            totalDiscount: disc,
            totalTransit: transit,
            totalTaxes: tax,
            grandTotal: (sub - disc) + transit + tax
        };
    }, [cart, appliedVaultKey]);

    const handleApplyVaultKey = () => {
        if (!vaultKeyInput.trim()) return;
        setAppliedVaultKey(vaultKeyInput.toUpperCase());
        // UI Feedback can be handled via toast in a real app
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Your cart is empty!");
        
        setIsSubmitting(true);
        try {
            // Updated Payload with Exact Financial Breakdown
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

            const data = await res.json();
            if (res.ok && data.success) {
                localStorage.removeItem('luxury_cart');
                setOrderPlaced(true); 
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            alert("Network Error!");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
                <CheckCircle size={80} className="text-[#D4AF37] mb-6 shadow-[0_0_30px_rgba(212,175,55,0.4)] rounded-full" />
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">Acquisition Confirmed!</h1>
                <p className="text-gray-500 mb-8 max-w-md font-serif italic">Thank you for your trust. Your premium timepieces are being prepared for secure transit. Payment will be collected upon delivery.</p>
                <Link href="/shop" className="px-10 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[4px] rounded-full hover:bg-[#D4AF37] hover:text-black transition-all">
                    Return to Vault
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black pt-24 pb-20">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Side: Shipping Form */}
                <div className="lg:col-span-7 space-y-8">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-gray-400 hover:text-black transition-colors">
                        <ArrowLeft size={16} /> Back to Cart
                    </button>
                    
                    <h2 className="text-4xl font-serif font-bold border-b border-gray-200 pb-4">Secure Checkout</h2>
                    
                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Full Name</label><input required value={shippingData.name} onChange={e=>setShippingData({...shippingData, name: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="John Doe"/></div>
                            <div><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Phone Number</label><input required value={shippingData.phone} onChange={e=>setShippingData({...shippingData, phone: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="+91 9876543210"/></div>
                        </div>
                        <div><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Email Address</label><input required type="email" value={shippingData.email} onChange={e=>setShippingData({...shippingData, email: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="john@example.com"/></div>
                        <div><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Secure Delivery Address</label><textarea required value={shippingData.address} onChange={e=>setShippingData({...shippingData, address: e.target.value})} rows={3} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black custom-scrollbar" placeholder="House No, Street, Landmark..."/></div>
                        
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-1"><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">PIN Code</label><input required value={shippingData.pincode} onChange={e=>setShippingData({...shippingData, pincode: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="110001"/></div>
                            <div className="col-span-1"><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">City</label><input required value={shippingData.city} onChange={e=>setShippingData({...shippingData, city: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="Mumbai"/></div>
                            <div className="col-span-1"><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">State</label><input required value={shippingData.state} onChange={e=>setShippingData({...shippingData, state: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="Maharashtra"/></div>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-serif font-bold mb-4">Payment Method</h3>
                            <div className="p-5 border-2 border-black rounded-xl bg-gray-50 flex items-center justify-between cursor-pointer">
                                <span className="font-bold text-sm uppercase tracking-widest">Cash on Delivery (COD)</span>
                                <div className="w-5 h-5 rounded-full border-4 border-black flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                            </div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-3 flex items-center gap-2"><ShieldCheck size={14}/> Razorpay & Crypto integrations locked pending domain.</p>
                        </div>

                        <button type="submit" disabled={isSubmitting || cart.length === 0} className="w-full py-5 bg-black text-white font-black uppercase tracking-[4px] text-[10px] rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-50 mt-6 shadow-xl">
                            {isSubmitting ? 'Securing Assets...' : 'Confirm Acquisition'}
                        </button>
                    </form>
                </div>

                {/* Right Side: Order Summary & Math Engine */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-gray-200 p-8 md:p-10 rounded-[40px] sticky top-32 shadow-xl">
                        <h3 className="text-2xl font-serif font-bold mb-6 border-b border-gray-100 pb-4">Invoice Summary</h3>
                        
                        <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                            {cart.length === 0 ? <p className="text-sm text-gray-500 font-serif italic">Your vault is empty.</p> : cart.map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 flex items-center justify-center shrink-0 border border-gray-100">
                                        <img src={item.imageUrl || (item.images && item.images[0])} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.brand}</p>
                                        <h4 className="text-sm font-bold line-clamp-1 mb-1">{item.name}</h4>
                                        <div className="flex justify-between items-end w-full">
                                            <p className="text-xs text-gray-500 font-mono">Qty: {item.qty}</p>
                                            <p className="font-bold text-sm font-mono">₹{(Number(item.offerPrice || item.price) * item.qty).toLocaleString()}</p>
                                        </div>
                                        {/* Show applied discount badge if valid */}
                                        {appliedVaultKey && appliedVaultKey === item.vipVaultKey?.toUpperCase() && (
                                            <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase mt-2 w-max">-₹{item.vipDiscount} VIP Vault Discount</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 👑 VIP VAULT KEY INPUT 👑 */}
                        <div className="mb-8">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2"><Key size={12}/> VIP Vault Key</label>
                            <div className="flex gap-2">
                                <input 
                                    value={vaultKeyInput} 
                                    onChange={(e) => setVaultKeyInput(e.target.value)} 
                                    className="flex-1 bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm font-mono uppercase outline-none focus:border-[#D4AF37] placeholder-gray-300" 
                                    placeholder="Enter Code"
                                />
                                <button onClick={handleApplyVaultKey} className="px-6 bg-black text-[#D4AF37] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] hover:text-black transition-colors">Apply</button>
                            </div>
                        </div>

                        {/* 👑 FINANCIAL BREAKDOWN 👑 */}
                        <div className="border-t border-gray-100 pt-6 space-y-4">
                            <div className="flex justify-between text-sm text-gray-500 font-mono"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                            
                            {totalDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 font-mono font-bold"><span>Vault Discount</span><span>-₹{totalDiscount.toLocaleString()}</span></div>
                            )}
                            
                            <div className="flex justify-between text-sm text-gray-500 font-mono items-center">
                                <span className="flex items-center gap-1">Transit Fee <Info size={12} className="text-gray-300"/></span>
                                {totalTransit === 0 ? <span className="text-[#D4AF37] font-bold uppercase text-xs tracking-widest">Complimentary</span> : <span>₹{totalTransit.toLocaleString()}</span>}
                            </div>

                            {totalTaxes > 0 && (
                                <div className="flex justify-between text-sm text-gray-500 font-mono"><span>Duties & Taxes (Exclusive)</span><span>₹{totalTaxes.toLocaleString()}</span></div>
                            )}

                            <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-200">
                                <span className="font-bold text-lg uppercase tracking-widest">Grand Total</span>
                                <span className="text-3xl font-serif font-bold text-black tracking-tighter">₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            <ShieldCheck size={24} className="text-[#D4AF37] shrink-0" />
                            <p className="leading-relaxed">All transactions are secured with military-grade encryption. Assets are fully insured during transit.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
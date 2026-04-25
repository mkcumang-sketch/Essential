"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CreditCard, ChevronRight, Lock, KeyRound, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const LuxuryToast = ({ message, type, show }: { message: string, type: 'success' | 'error', show: boolean }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
            >
                <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <p className={`font-serif tracking-widest text-sm uppercase ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{message}</p>
            </motion.div>
        )}
    </AnimatePresence>
);

export default function CheckoutPage() {
    const { data: session } = useSession();
    const { clearCart } = useCartStore();
    
    const [cart, setCart] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

    const [vaultKeyInput, setVaultKeyInput] = useState('');
    const [promoDetails, setPromoDetails] = useState<{code: string, type: 'product'|'global'|'referral', discountValue: number} | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
    const [userWallet, setUserWallet] = useState({ available: 0, useWallet: false });

    const [shippingData, setShippingData] = useState({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
    });

    const fetchWalletBalance = async () => {
        try {
            const res = await fetch('/api/user/account');
            const data = await res.json();
            if (data.success) {
                setUserWallet(prev => ({ ...prev, available: data.data.assets.walletBalance }));
            }
        } catch (e) {}
    };

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
        setCart(savedCart);
        if (session?.user) {
            setShippingData(prev => ({...prev, name: session.user?.name || '', email: session.user?.email || '', phone: (session.user as any)?.phone || ''}));
            fetchWalletBalance();
        }
    }, [session]);

    const handleRemoveItem = (indexToRemove: number) => {
        const updatedCart = cart.filter((_, index) => index !== indexToRemove);
        setCart(updatedCart);
        localStorage.setItem('luxury_cart', JSON.stringify(updatedCart));
    };

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const subTotal = useMemo(() => {
        return cart.reduce((acc, item) => acc + ((item.offerPrice || item.price) * item.qty), 0);
    }, [cart]);

    const discountAmount = useMemo(() => {
        if (!promoDetails) return 0;
        if (promoDetails.type === 'global' || promoDetails.type === 'referral') {
            return (subTotal * promoDetails.discountValue) / 100;
        }
        return 0; 
    }, [subTotal, promoDetails]);

    const grandTotal = Math.max(0, subTotal - discountAmount);

    const lastCaptured = useRef("");
    useEffect(() => {
        const captureCart = async () => {
            if (cart.length > 0 && (shippingData.email || shippingData.phone)) {
                // Safe checking to prevent infinite loops
                const payloadStr = JSON.stringify({ e: shippingData.email, t: grandTotal, c: cart.length });
                if (lastCaptured.current === payloadStr) return;
                lastCaptured.current = payloadStr;

                try {
                    // Sanitize cart to prevent browser memory leaks
                    const cleanItems = cart.map(i => ({ _id: i._id, qty: i.qty, price: i.price }));
                    await fetch('/api/abandoned-cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: session?.user ? (session.user as any).id : null,
                            email: shippingData.email,
                            phone: shippingData.phone,
                            cartItems: cleanItems,
                            cartTotal: grandTotal,
                        })
                    });
                } catch(e) {}
            }
        };
        const timer = setTimeout(captureCart, 2000); 
        return () => clearTimeout(timer);
    }, [shippingData.email, shippingData.phone, cart.length, grandTotal, session]);


    const handleVerifyVaultKey = async () => {
        if (!vaultKeyInput.trim()) return;
        setIsVerifying(true);
        try {
            const res = await fetch('/api/verify-promo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: vaultKeyInput })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setPromoDetails({
                    code: vaultKeyInput,
                    type: data.type,
                    discountValue: data.discountValue
                });
                showToast(data.message || "Key Authenticated", "success");
            } else {
                showToast(data.error || "Invalid Key", 'error');
                setPromoDetails(null);
            }
        } catch (error) {
            showToast("Verification failed", 'error');
        } finally {
            setIsVerifying(false);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            showToast("Your cart is empty", 'error');
            return;
        }

        setIsSubmitting(true);
        const refCode = localStorage.getItem('active_referral') || (promoDetails?.type === 'referral' ? promoDetails.code : null);

        try {
            // CRITICAL FIX: Sanitize items to prevent browser crash (Circular JSON / Memory overload)
            const cleanItems = cart.map(item => ({
                _id: item._id,
                qty: item.qty
            }));

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cleanItems,
                    shippingData,
                    referralCode: refCode,
                    useWallet: userWallet.useWallet,
                    userId: session?.user ? (session.user as any).id : null,
                    totalAmount: grandTotal
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                if (data.isMock || data.amount === 0) {
                    showToast("Order Secured Successfully!", "success");
                    localStorage.removeItem('luxury_cart');
                    localStorage.removeItem('guest_lead_captured');
                    clearCart(); 
                    setPlacedOrderId(data.orderId || `ORD-${Date.now().toString().slice(-6)}`); 
                    return;
                }

                const rzpLoaded = await loadRazorpay();
                if (!rzpLoaded) {
                    showToast("Payment Gateway failed to load", 'error');
                    setIsSubmitting(false);
                    return;
                }

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: data.amount,
                    currency: data.currency || "INR",
                    name: "Essential Rush",
                    description: "Secure Checkout",
                    order_id: data.razorpayOrderId,
                    handler: async function (response: any) {
                        try {
                            const verifyRes = await fetch('/api/verify-payment', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    orderId: data.orderId,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature,
                                })
                            });
                            
                            if (verifyRes.ok) {
                                showToast("Transaction Authorized.", "success");
                                localStorage.removeItem('luxury_cart');
                                localStorage.removeItem('guest_lead_captured');
                                clearCart();
                                setPlacedOrderId(data.orderId);
                            } else {
                                showToast("Payment Verification Failed", 'error');
                            }
                        } catch (err) {
                            showToast("Error during verification", 'error');
                        }
                    },
                    prefill: {
                        name: shippingData.name,
                        email: shippingData.email,
                        contact: shippingData.phone,
                    },
                    theme: { color: "#333333" },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();

            } else {
                showToast(data.error || "Authorization Failed", 'error');
            }
        } catch (error) {
            showToast("System Malfunction. Try again.", 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (placedOrderId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-900">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="max-w-md w-full bg-white border border-gray-200 p-8 rounded-2xl shadow-xl text-center"
                >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                        <ShieldCheck className="w-10 h-10 text-green-600" />
                    </div>
                    
                    <h1 className="text-3xl font-bold mb-2">Order Confirmed</h1>
                    <p className="text-gray-500 text-sm mb-6">Your transaction has been securely processed.</p>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8 flex justify-between items-center">
                        <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Order ID</span>
                        <span className="font-mono font-semibold">{placedOrderId}</span>
                    </div>
                    
                    <a href="/godmode" className="inline-flex items-center justify-center w-full bg-black text-white px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-all">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 font-sans">
            <LuxuryToast {...toast} />
            
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">
                        Secure Checkout
                    </h1>
                    <p className="text-gray-500 tracking-wide flex items-center justify-center md:justify-start gap-2">
                        <Lock className="w-4 h-4" />
                        Encrypted 256-bit Connection
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-3/5">
                        <form onSubmit={handleCheckout} className="space-y-10">
                            <div className="space-y-6">
                                <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-2">I. Identity Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-500">Full Name</label>
                                        <input required type="text" value={shippingData.name} onChange={e => setShippingData({...shippingData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" placeholder="James Bond" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-500">Email Address</label>
                                        <input required type="email" value={shippingData.email} onChange={e => setShippingData({...shippingData, email: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" placeholder="contact@example.com" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-500">Phone Number</label>
                                        <input required type="tel" value={shippingData.phone} onChange={e => setShippingData({...shippingData, phone: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" placeholder="+91 98765 43210" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-2">II. Delivery Coordinates</h2>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-widest text-gray-500">Street Address</label>
                                        <input required type="text" value={shippingData.address} onChange={e => setShippingData({...shippingData, address: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" placeholder="123 Luxury Ave" />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-widest text-gray-500">City</label>
                                            <input required type="text" value={shippingData.city} onChange={e => setShippingData({...shippingData, city: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" placeholder="Mumbai" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-widest text-gray-500">State</label>
                                            <input type="text" value={shippingData.state} onChange={e => setShippingData({...shippingData, state: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-black transition-colors" placeholder="MH" />
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-xs uppercase tracking-widest text-gray-500">Pincode</label>
                                            <input required type="text" value={shippingData.pincode} onChange={e => setShippingData({...shippingData, pincode: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono tracking-widest focus:outline-none focus:border-black transition-colors" placeholder="400001" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || cart.length === 0}
                                className="w-full bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? 'Processing...' : 'Complete Payment'}
                                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                            </button>
                            
                            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 uppercase tracking-widest mt-4">
                                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL Secured</span>
                                <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Razorpay</span>
                            </div>
                        </form>
                    </div>

                    <div className="w-full lg:w-2/5">
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 sticky top-24 shadow-sm">
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center justify-between">
                                Order Summary
                                <span className="text-gray-500 text-[10px] font-mono">{cart.length} Items</span>
                            </h2>
                            
                            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 mb-8">
                                {cart.map((item, index) => (
                                    <div key={index} className="flex gap-4 group relative border-b border-gray-100 pb-4 last:border-0">
                                        <div className="relative w-16 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                            <Image src={item.images?.[0] || '/placeholder.png'} alt={item.name || item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-center flex-grow">
                                            <h3 className="font-semibold text-sm tracking-wide text-gray-800 line-clamp-2">{item.name || item.title}</h3>
                                            <p className="text-gray-500 font-mono text-xs mt-1">QTY: {item.qty}</p>
                                        </div>
                                        <div className="flex flex-col justify-between items-end text-right flex-shrink-0">
                                            <p className="font-mono text-sm tracking-wider font-semibold">₹{((item.offerPrice || item.price) * item.qty).toLocaleString('en-IN')}</p>
                                            <button 
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-gray-400 hover:text-red-500 transition-colors mt-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-8">
                                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">Promo Code</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-grow">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={vaultKeyInput}
                                            onChange={(e) => setVaultKeyInput(e.target.value.toUpperCase())}
                                            placeholder="ENTER CODE" 
                                            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 font-mono uppercase tracking-widest focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleVerifyVaultKey}
                                        disabled={isVerifying || !vaultKeyInput.trim()}
                                        className="bg-black text-white px-6 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
                                    >
                                        {isVerifying ? '...' : 'Apply'}
                                    </button>
                                </div>
                                {promoDetails && (
                                    <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Code Applied: {promoDetails.discountValue}% OFF
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4 text-sm font-mono tracking-wider border-t border-gray-200 pt-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subTotal.toLocaleString('en-IN')}</span>
                                </div>
                                
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount (-{promoDetails?.discountValue}%)</span>
                                        <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-200">
                                    <span className="font-bold text-xs uppercase tracking-widest text-gray-500">Grand Total</span>
                                    <span className="text-3xl font-bold tracking-tighter">₹{Math.max(0, grandTotal - (userWallet.useWallet ? userWallet.available : 0)).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {userWallet.available > 0 && (
                                <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-700">Wallet Balance</p>
                                        <p className="text-sm font-medium text-gray-900">₹{userWallet.available.toLocaleString('en-IN')}</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setUserWallet(prev => ({ ...prev, useWallet: !prev.useWallet }))}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${userWallet.useWallet ? 'bg-black text-white' : 'bg-white border border-gray-300 text-black hover:border-black'}`}
                                    >
                                        {userWallet.useWallet ? 'Applied' : 'Use Wallet'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
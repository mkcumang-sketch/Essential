"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session } = useSession();
    
    const [cart, setCart] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Shipping Details Form
    const [shippingData, setShippingData] = useState({
        name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
    });

    useEffect(() => {
        // Load Cart from LocalStorage
        const savedCart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
        setCart(savedCart);
        
        // Calculate Total
        const cartTotal = savedCart.reduce((sum: number, item: any) => sum + (Number(item.offerPrice || item.price) * item.qty), 0);
        setTotal(cartTotal);

        // Pre-fill user data if logged in
        if (session?.user) {
            setShippingData(prev => ({
                ...prev,
                name: session.user?.name || '',
                email: session.user?.email || '',
                phone: (session.user as any)?.phone || ''
            }));
        }
    }, [session]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Your cart is empty!");
        
        setIsSubmitting(true);
        try {
            // Send Order to Database
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    totalAmount: total,
                    customer: shippingData,
                    paymentMethod: 'COD' // Cash on Delivery for now
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                localStorage.removeItem('luxury_cart'); // Clear Cart
                setOrderPlaced(true); // Show Success Screen
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
                <CheckCircle size={80} className="text-green-500 mb-6" />
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8 max-w-md">Thank you for your purchase. We are preparing your premium timepieces for dispatch. You will pay via Cash on Delivery.</p>
                <Link href="/shop" className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-all">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black pt-24 pb-20">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Side: Shipping Form */}
                <div className="lg:col-span-7 space-y-8">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft size={16} /> Back to Cart
                    </button>
                    
                    <h2 className="text-3xl font-serif font-bold">Shipping Details</h2>
                    
                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="text-xs font-bold text-gray-500 mb-2 block">Full Name</label><input required value={shippingData.name} onChange={e=>setShippingData({...shippingData, name: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="John Doe"/></div>
                            <div><label className="text-xs font-bold text-gray-500 mb-2 block">Phone Number</label><input required value={shippingData.phone} onChange={e=>setShippingData({...shippingData, phone: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="+91 9876543210"/></div>
                        </div>
                        <div><label className="text-xs font-bold text-gray-500 mb-2 block">Email Address</label><input required type="email" value={shippingData.email} onChange={e=>setShippingData({...shippingData, email: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="john@example.com"/></div>
                        <div><label className="text-xs font-bold text-gray-500 mb-2 block">Complete Address</label><textarea required value={shippingData.address} onChange={e=>setShippingData({...shippingData, address: e.target.value})} rows={3} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="House No, Street, Landmark..."/></div>
                        
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-1"><label className="text-xs font-bold text-gray-500 mb-2 block">PIN Code</label><input required value={shippingData.pincode} onChange={e=>setShippingData({...shippingData, pincode: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="110001"/></div>
                            <div className="col-span-1"><label className="text-xs font-bold text-gray-500 mb-2 block">City</label><input required value={shippingData.city} onChange={e=>setShippingData({...shippingData, city: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="Mumbai"/></div>
                            <div className="col-span-1"><label className="text-xs font-bold text-gray-500 mb-2 block">State</label><input required value={shippingData.state} onChange={e=>setShippingData({...shippingData, state: e.target.value})} className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="Maharashtra"/></div>
                        </div>

                        {/* Payment Method Selector (Only COD active for now) */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                            <div className="p-4 border-2 border-black rounded-xl bg-gray-50 flex items-center justify-between cursor-pointer">
                                <span className="font-bold text-sm">Cash on Delivery (COD)</span>
                                <div className="w-5 h-5 rounded-full border-4 border-black flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><ShieldCheck size={12}/> Razorpay integration pending domain registration.</p>
                        </div>

                        <button type="submit" disabled={isSubmitting || cart.length === 0} className="w-full py-5 bg-black text-white font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 mt-6">
                            {isSubmitting ? 'Processing...' : 'Place Order Now'}
                        </button>
                    </form>
                </div>

                {/* Right Side: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-gray-200 p-8 rounded-[30px] sticky top-32 shadow-sm">
                        <h3 className="text-2xl font-serif font-bold mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
                        
                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {cart.length === 0 ? <p className="text-sm text-gray-500">Your cart is empty.</p> : cart.map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl p-2 flex items-center justify-center shrink-0">
                                        <img src={item.imageUrl || (item.images && item.images[0])} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase">{item.brand}</p>
                                        <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">₹{(Number(item.offerPrice || item.price) * item.qty).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-3">
                            <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm text-gray-500"><span>Shipping</span><span className="text-green-500 font-bold">FREE</span></div>
                            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                                <span className="font-bold">Total</span>
                                <span className="text-2xl font-bold">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-4 rounded-xl">
                            <Truck size={20} className="text-black" />
                            <p>Free Insured Shipping across India. Delivery within 3-5 business days.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
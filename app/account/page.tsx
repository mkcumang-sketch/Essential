"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, CheckCircle, Clock, ShieldCheck, Box, LogOut } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const TRACKING_STEPS = ["PENDING", "PROCESSING", "DISPATCHED", "TRANSIT", "DELIVERED"];

function ElegantAccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [myOrders, setMyOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 🛡️ SECURITY INTERCEPTOR: Redirect unauthenticated traffic to Login
    useEffect(() => {
        if (status === "unauthenticated") {
            // Send to login, and tell login to send them back here after success
            router.push('/login?callbackUrl=/account');
        }
    }, [status, router]);

    // 🔄 AUTO-FETCH CLIENT DATA
    useEffect(() => {
        const fetchClientOrders = async () => {
            if (status !== "authenticated" || !session?.user) return;
            
            try {
                const ts = new Date().getTime();
                const res = await fetch(`/api/orders?t=${ts}`);
                const data = await res.json();
                
                if (data.success && data.data) {
                    const userEmail = session.user.email?.toLowerCase();
                    const userPhone = (session.user as any).phone;

                    // Automatically filter orders matching the logged-in user's email or phone
                    const clientOrders = data.data.filter((o: any) => {
                        const orderEmail = o.customer?.email?.toLowerCase();
                        const orderPhone = o.customer?.phone;
                        return (userEmail && orderEmail === userEmail) || (userPhone && orderPhone === userPhone);
                    });
                    
                    setMyOrders(clientOrders);
                }
            } catch (error) {
                console.error("Tracking Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchClientOrders();
        }
    }, [status, session]);

    // Calculate progress percentage for the timeline bar
    const getProgressWidth = (status: string) => {
        const idx = TRACKING_STEPS.indexOf(status.toUpperCase());
        if (idx === -1) return "0%";
        if (status === "CANCELLED") return "100%";
        return `${(idx / (TRACKING_STEPS.length - 1)) * 100}%`;
    };

    // Show elegant loader while checking session or fetching data
    if (status === "loading" || (status === "authenticated" && isLoading)) {
        return (
            <div className="h-screen bg-white flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-medium uppercase tracking-[2px] text-gray-500">Authenticating Identity...</p>
            </div>
        );
    }

    // Do not render anything if unauthenticated (the useEffect will redirect them)
    if (status === "unauthenticated") return null;

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 selection:bg-gray-200 selection:text-black pb-32 font-sans">
            
            {/* MINIMAL HEADER */}
            <header className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-200 py-6 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <Link href="/" className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[2px] text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={16}/> Back to Store
                </Link>
                <h1 className="text-xl font-serif tracking-[4px] uppercase absolute left-1/2 -translate-x-1/2">Essential</h1>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-gray-400 hover:text-red-500 transition-colors">
                    Log Out <LogOut size={14}/>
                </button>
            </header>

            <main className="max-w-4xl mx-auto pt-16 px-6 md:px-10">
                
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Welcome, {session?.user?.name || 'Client'}</h2>
                    <p className="text-gray-500 text-sm max-w-lg mx-auto">Manage your acquisitions and track your global logistics shipments below.</p>
                </div>

                <div className="space-y-10">
                    <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Secure Session</p>
                            <h3 className="text-xl font-serif text-gray-900">{session?.user?.email || (session?.user as any)?.phone || 'Encrypted Identity'}</h3>
                        </div>
                        <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[2px]">{myOrders.length} Assets</span>
                    </div>

                    {myOrders.length === 0 ? (
                        <div className="bg-white border border-gray-200 p-16 rounded-3xl text-center shadow-sm">
                            <Box size={50} className="text-gray-300 mx-auto mb-6"/>
                            <h4 className="text-2xl font-serif text-gray-900 mb-4">No Acquisitions Found</h4>
                            <p className="text-gray-500 text-sm mb-8">We couldn't locate any active orders linked to your profile.</p>
                            <Link href="/#ourcollection" className="px-8 py-4 bg-black text-white font-medium uppercase text-[10px] tracking-[2px] rounded-full hover:bg-gray-800 transition-all inline-block">Explore Collection</Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {myOrders.map((order, i) => (
                                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: i*0.1}} key={order._id || i} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                    
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-100 pb-6">
                                        <div>
                                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                                            <p className="text-lg font-medium text-gray-900 tracking-widest">#{order.orderId?.slice(-6) || 'UKN'}</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">Total Value</p>
                                            <p className="text-xl font-serif text-gray-900">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>

                                    {/* Live Timeline Tracker */}
                                    <div className="mb-10">
                                        <div className="flex justify-between mb-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2"><MapPin size={14}/> Shipping Status</p>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' : order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-900'}`}>{order.status || 'PROCESSING'}</span>
                                        </div>
                                        
                                        <div className="relative w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                            <motion.div 
                                                initial={{ width: 0 }} 
                                                animate={{ width: getProgressWidth(order.status || 'PROCESSING') }} 
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`absolute top-0 left-0 h-full rounded-full ${order.status === 'CANCELLED' ? 'bg-red-500' : order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-900'}`}
                                            />
                                        </div>

                                        <div className="flex justify-between text-[9px] font-medium uppercase tracking-widest text-gray-400">
                                            {TRACKING_STEPS.map((step, idx) => (
                                                <span key={step} className={`text-center ${order.status === 'CANCELLED' ? 'text-gray-300' : TRACKING_STEPS.indexOf(order.status?.toUpperCase() || 'PROCESSING') >= idx ? 'text-gray-900' : ''}`}>{step}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-200 pb-2">Delivery Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-xs font-serif text-gray-900 mb-1">Destination Address</p>
                                                <p className="text-xs text-gray-500 leading-relaxed font-mono">{order.customer?.address}<br/>{order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-serif text-gray-900 mb-1">Contents</p>
                                                <p className="text-xs text-gray-500 font-mono">{order.items?.length || 1} Timepiece(s)</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-1"><Clock size={10}/> ETA: 3-5 Business Days</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-12 flex items-center justify-center gap-2 text-gray-400 border-t border-gray-200 pt-8">
                    <ShieldCheck size={14}/> <p className="text-[10px] uppercase font-bold tracking-[2px]">AES-256 Encrypted Connection</p>
                </div>
            </main>
        </div>
    );
}

export default dynamic(() => Promise.resolve(ElegantAccountPage), { ssr: false });
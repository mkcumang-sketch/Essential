"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, LogOut, ShieldCheck, Clock, Settings, Star, CreditCard, 
    Copy, Wallet, Coins, ArrowRightLeft, CheckCircle, MapPin, Download, Ticket, 
    Bell, Heart, Eye, MessageSquare, Shield, User, ShoppingBag, AlertCircle, ShieldAlert 
} from 'lucide-react';
import Link from 'next/link';

export default function PremiumAccountDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const [isCopied, setIsCopied] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [dashData, setDashData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorState, setErrorState] = useState(false);
    
    const [toastMsg, setToastMsg] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        } else if (status === "authenticated" && session?.user) {
            
            fetch('/api/user/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    phone: (session.user as any).phone || '', 
                    email: session.user.email 
                })
            })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    setDashData(json.data);
                    setErrorState(false);
                } else {
                    setErrorState(true);
                }
                setIsLoading(false);
            })
            .catch(() => {
                setErrorState(true);
                setIsLoading(false);
            });
        }
    }, [status, session, router]);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(""), 3000);
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        showToast("Referral Code Copied to Vault!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (status === "loading" || isLoading) return (
        <div className="min-h-screen bg-[#050505] flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    
    // 🚨 IF THE API FAILS, SHOW THIS CLEAN ERROR INSTEAD OF FAKE DATA
    if (errorState || !dashData) return (
        <div className="h-screen bg-[#050505] flex flex-col justify-center items-center text-center p-6">
            <ShieldAlert size={60} className="text-red-500 mb-6"/>
            <h2 className="text-3xl font-serif text-white mb-2">Vault Disconnected</h2>
            <p className="text-gray-500 max-w-sm mb-8">We are unable to sync with the central database. Please refresh the connection.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors">Refresh Vault</button>
        </div>
    );

    const MENU_ITEMS = [
        { id: 'OVERVIEW', label: 'Vault Overview', icon: User },
        { id: 'ORDERS', label: 'Orders & Invoices', icon: ShoppingBag },
        { id: 'EMPIRE_WALLET', label: 'Empire Wallet', icon: Wallet },
        { id: 'WISHLIST', label: 'Wishlist & Viewed', icon: Heart },
        { id: 'SETTINGS', label: 'Addresses & Security', icon: Shield },
        { id: 'SUPPORT', label: 'Reviews & Support', icon: MessageSquare },
    ];

    const userName = session?.user?.name || 'Premium Member';
    const userRole = (session?.user as any)?.role || 'USER';

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black pb-20 relative overflow-x-hidden">
            
            <AnimatePresence>
                {toastMsg && (
                    <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, scale: 0.9, x: "-50%" }} className="fixed bottom-10 left-1/2 z-[5000] bg-black/95 backdrop-blur-xl border border-[#D4AF37]/50 px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(212,175,55,0.15)] flex items-center gap-4">
                        <ShieldCheck size={20} className="text-[#D4AF37]"/>
                        <p className="text-white text-sm font-serif italic">{toastMsg}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="bg-black/80 backdrop-blur-xl border-b border-white/10 py-6 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-gray-500 hover:text-[#D4AF37] transition-colors">
                    <ArrowLeft size={16}/> Exit Vault
                </Link>
                <h1 className="text-2xl font-serif font-bold uppercase tracking-[10px] absolute left-1/2 -translate-x-1/2 hidden md:block text-white">Essential</h1>
                <div className="flex items-center gap-6">
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-gray-500 hover:text-red-500 transition-colors">
                        Lock Vault <LogOut size={16}/>
                    </button>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto pt-10 px-6 md:px-12 flex flex-col lg:flex-row gap-10 relative z-10">
                
                <aside className="w-full lg:w-[320px] shrink-0">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 text-white p-8 rounded-[30px] mb-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 text-[#D4AF37] opacity-10 pointer-events-none"><ShieldCheck size={150}/></div>
                        
                        <div className="w-16 h-16 bg-black border border-[#D4AF37]/50 rounded-full flex items-center justify-center text-[#D4AF37] text-2xl font-serif mb-4 relative z-10">
                            {userName.charAt(0)}
                        </div>
                        
                        <h3 className="font-serif text-2xl mb-1 relative z-10 text-white">{userName}</h3>
                        <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[2px] mb-6 relative z-10">
                            {userRole === 'SUPER_ADMIN' ? 'Site Administrator' : 'Elite Member'}
                        </p>
                        
                        {userRole === 'SUPER_ADMIN' && (
                            <div className="relative z-10 mb-6">
                                <Link href="/godmode" className="w-full py-3 bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all flex justify-center items-center gap-2">
                                    <ShieldCheck size={16}/> Admin Panel
                                </Link>
                            </div>
                        )}

                        <div className="relative z-10 border-t border-white/10 pt-6 mt-2">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[9px] uppercase tracking-widest text-gray-400">Profile Integrity</span>
                                <span className="text-[10px] font-bold text-[#D4AF37]">100%</span>
                            </div>
                            <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                                <div className="h-full bg-[#D4AF37]" style={{ width: `100%` }}></div>
                            </div>
                        </div>
                    </div>

                    <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible custom-scrollbar pb-4 lg:pb-0 bg-white/5 border border-white/10 p-4 rounded-[30px]">
                        {MENU_ITEMS.map((item) => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all w-full text-left ${activeTab === item.id ? 'bg-[#D4AF37] text-black shadow-lg' : 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                                <item.icon size={18} className={activeTab === item.id ? 'text-black' : ''}/> {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        {activeTab === 'OVERVIEW' && (
                            <motion.div key="1" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="space-y-8">
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-8 bg-white/5 border border-white/10 rounded-[30px] flex flex-col justify-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Orders</p>
                                        <h3 className="text-5xl font-serif text-white">{dashData.orders?.length || 0}</h3>
                                    </div>
                                    <div className="p-8 bg-gradient-to-br from-[#1a1a1a] to-black border border-[#D4AF37]/30 rounded-[30px] flex flex-col justify-center relative overflow-hidden">
                                        <div className="absolute right-[-20px] bottom-[-20px] opacity-20"><Wallet size={100} className="text-[#D4AF37]"/></div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 relative z-10">Empire Wallet</p>
                                        <h3 className="text-5xl font-serif text-[#D4AF37] relative z-10">₹0</h3>
                                    </div>
                                    <div className="p-8 bg-white/5 border border-white/10 rounded-[30px] flex flex-col justify-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Wishlist Items</p>
                                        <h3 className="text-5xl font-serif text-white">0</h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 shadow-sm">
                                        <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3"><Star size={18} className="text-[#D4AF37]"/> Curated For You</h4>
                                        <p className="text-xs text-gray-500 italic">No curations available yet.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div onClick={() => showToast("Certificates are being verified. Check back later.")} className="bg-white/5 p-6 rounded-[30px] border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 cursor-pointer transition-all group">
                                            <div className="w-14 h-14 bg-black border border-white/20 text-white rounded-full flex items-center justify-center mb-4 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors"><ShieldCheck size={24}/></div>
                                            <h4 className="font-bold text-xs uppercase tracking-widest">Certificates</h4>
                                        </div>
                                        <div onClick={() => showToast("Service Booking is currently offline.")} className="bg-white/5 p-6 rounded-[30px] border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 cursor-pointer transition-all group">
                                            <div className="w-14 h-14 bg-black border border-white/20 text-white rounded-full flex items-center justify-center mb-4 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors"><Settings size={24}/></div>
                                            <h4 className="font-bold text-xs uppercase tracking-widest">Book Service</h4>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'ORDERS' && (
                            <motion.div key="2" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="space-y-6">
                                {dashData.orders?.length === 0 ? (
                                    <div className="bg-white/5 p-12 rounded-[40px] text-center border border-white/10">
                                        <ShoppingBag size={50} className="mx-auto text-gray-600 mb-6"/>
                                        <p className="text-gray-400 font-serif text-lg">You haven't acquired any timepieces yet.</p>
                                        <Link href="/shop" className="mt-8 inline-block px-10 py-4 bg-[#D4AF37] text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-lg">Enter Vault</Link>
                                    </div>
                                ) : dashData.orders?.map((order: any) => (
                                    <div key={order._id} className="bg-white/5 p-8 rounded-[40px] border border-white/10 flex flex-col gap-6 hover:border-[#D4AF37]/50 transition-colors">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/10 pb-6">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Acquisition #{order._id?.slice(-6) || 'UKN'}</p>
                                                <h4 className="font-serif text-3xl font-bold text-white">₹{(order.totalAmount || 0).toLocaleString()}</h4>
                                            </div>
                                            <span className="px-6 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-full text-[10px] font-black uppercase tracking-widest w-max">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
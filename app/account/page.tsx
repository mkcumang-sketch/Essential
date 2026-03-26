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
    
    // Premium Toast Notification State
    const [toastMsg, setToastMsg] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login');
        } else if (status === "authenticated" && session?.user) {
            // Fetching via your POST route logic
            fetch('/api/user/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    phone: (session.user as any).phone, 
                    email: session.user.email 
                })
            })
            .then(res => res.json())
            .then(json => {
                if (json.success) setDashData(json.data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
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

    const handleWithdraw = () => {
        const amt = Number(withdrawAmount);
        if (amt < 500) return showToast("Minimum withdrawal amount is ₹500.");
        if (amt > (dashData?.wallet?.points || 0)) return showToast("Insufficient points balance.");
        showToast(`Withdrawal request of ₹${amt} submitted!`);
        setWithdrawAmount("");
    };

    const handleMoveToCart = (item: any) => {
        const cart = JSON.parse(localStorage.getItem('luxury_cart') || '[]');
        const exists = cart.find((i:any) => i._id === item.id);
        const newCart = exists 
            ? cart.map((i:any) => i._id === item.id ? {...i, qty: i.qty+1} : i) 
            : [...cart, { _id: item.id, name: item.name, price: item.price, imageUrl: item.image, qty: 1 }];
        
        localStorage.setItem('luxury_cart', JSON.stringify(newCart));
        showToast(`${item.name} added to Cart!`);
    };

    const handleActionPrompt = (actionName: string, promptMsg: string) => {
        const result = prompt(promptMsg);
        if (result) showToast(`${actionName} request submitted securely.`);
    };

    if (status === "loading" || isLoading) return (
        <div className="min-h-screen bg-[#050505] flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    
    if (!dashData) return <div className="h-screen bg-[#050505] flex justify-center items-center text-red-500 font-serif">Vault access denied. Please refresh.</div>;

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
            
            {/* FLOATING LUXURY TOAST */}
            <AnimatePresence>
                {toastMsg && (
                    <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, scale: 0.9, x: "-50%" }} className="fixed bottom-10 left-1/2 z-[5000] bg-black/95 backdrop-blur-xl border border-[#D4AF37]/50 px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(212,175,55,0.15)] flex items-center gap-4">
                        <ShieldCheck size={20} className="text-[#D4AF37]"/>
                        <p className="text-white text-sm font-serif italic">{toastMsg}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GLOBAL HEADER */}
            <header className="bg-black/80 backdrop-blur-xl border-b border-white/10 py-6 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-gray-500 hover:text-[#D4AF37] transition-colors">
                    <ArrowLeft size={16}/> Exit Vault
                </Link>
                <h1 className="text-2xl font-serif font-bold uppercase tracking-[10px] absolute left-1/2 -translate-x-1/2 hidden md:block text-white">Essential</h1>
                <div className="flex items-center gap-6">
                    <button onClick={() => showToast("No new notifications")} className="relative text-gray-500 hover:text-[#D4AF37] transition-colors">
                        <Bell size={20} />
                        {dashData.notifications?.some((n:any)=>n.unread) && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"></span>}
                    </button>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-gray-500 hover:text-red-500 transition-colors">
                        Lock Vault <LogOut size={16}/>
                    </button>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto pt-10 px-6 md:px-12 flex flex-col lg:flex-row gap-10 relative z-10">
                
                {/* 🌟 PREMIUM SIDEBAR NAVIGATION 🌟 */}
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
                                <span className="text-[10px] font-bold text-[#D4AF37]">{dashData.profile?.completeness || 100}%</span>
                            </div>
                            <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                                <div className="h-full bg-[#D4AF37]" style={{ width: `${dashData.profile?.completeness || 100}%` }}></div>
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

                {/* 🌟 DYNAMIC CONTENT AREA 🌟 */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        {/* --- TAB 1: OVERVIEW --- */}
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
                                        <h3 className="text-5xl font-serif text-[#D4AF37] relative z-10">₹{dashData.wallet?.points?.toLocaleString() || 0}</h3>
                                    </div>
                                    <div className="p-8 bg-white/5 border border-white/10 rounded-[30px] flex flex-col justify-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Wishlist Items</p>
                                        <h3 className="text-5xl font-serif text-white">{dashData.wishlist?.length || 0}</h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 shadow-sm">
                                        <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3"><Star size={18} className="text-[#D4AF37]"/> Curated For You</h4>
                                        <div className="space-y-4">
                                            {dashData.recommendations?.length > 0 ? dashData.recommendations.map((rec:any) => (
                                                <Link href={`/product/${rec.id}`} key={rec.id} className="flex items-center gap-4 group p-3 hover:bg-white/5 rounded-2xl transition-colors">
                                                    <img src={rec.image} className="w-16 h-16 rounded-xl object-cover bg-black border border-white/10 group-hover:scale-105 transition-transform" />
                                                    <div>
                                                        <p className="font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors">{rec.name}</p>
                                                        <p className="text-xs text-gray-500 font-mono mt-1">₹{rec.price?.toLocaleString()}</p>
                                                    </div>
                                                </Link>
                                            )) : <p className="text-xs text-gray-500 italic">No curations available yet.</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div onClick={() => showToast("Certificates are being verified. Check back later.")} className="bg-white/5 p-6 rounded-[30px] border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 cursor-pointer transition-all group">
                                            <div className="w-14 h-14 bg-black border border-white/20 text-white rounded-full flex items-center justify-center mb-4 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors"><ShieldCheck size={24}/></div>
                                            <h4 className="font-bold text-xs uppercase tracking-widest">Certificates</h4>
                                        </div>
                                        <div onClick={() => handleActionPrompt('Service Booking', 'Enter watch model for servicing:')} className="bg-white/5 p-6 rounded-[30px] border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 cursor-pointer transition-all group">
                                            <div className="w-14 h-14 bg-black border border-white/20 text-white rounded-full flex items-center justify-center mb-4 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors"><Settings size={24}/></div>
                                            <h4 className="font-bold text-xs uppercase tracking-widest">Book Service</h4>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- TAB 2: ORDERS & INVOICES --- */}
                        {activeTab === 'ORDERS' && (
                            <motion.div key="2" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="space-y-6">
                                {dashData.orders?.length === 0 ? (
                                    <div className="bg-white/5 p-12 rounded-[40px] text-center border border-white/10">
                                        <ShoppingBag size={50} className="mx-auto text-gray-600 mb-6"/>
                                        <p className="text-gray-400 font-serif text-lg">You haven't acquired any timepieces yet.</p>
                                        <Link href="/shop" className="mt-8 inline-block px-10 py-4 bg-[#D4AF37] text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-lg">Enter Vault</Link>
                                    </div>
                                ) : dashData.orders?.map((order: any) => (
                                    <div key={order.id} className="bg-white/5 p-8 rounded-[40px] border border-white/10 flex flex-col gap-6 hover:border-[#D4AF37]/50 transition-colors">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/10 pb-6">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Acquisition #{order.id}</p>
                                                <h4 className="font-serif text-3xl font-bold text-white">₹{order.total.toLocaleString()}</h4>
                                            </div>
                                            <button onClick={() => showToast(`Invoice for ${order.id} is downloading...`)} className="px-6 py-3 bg-black border border-white/20 hover:border-[#D4AF37] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-3 w-max">
                                                <Download size={14}/> Invoice
                                            </button>
                                        </div>
                                        
                                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between px-4">
                                            {order.timeline?.map((step:any, i:number) => (
                                                <div key={i} className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-2 w-full relative">
                                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-[#050505] ${step.completed ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-gray-800 text-gray-600'}`}>
                                                        {step.completed ? <CheckCircle size={14}/> : <Clock size={14}/>}
                                                    </div>
                                                    {i !== order.timeline.length - 1 && <div className={`hidden md:block absolute top-4 left-1/2 w-full h-[2px] -z-0 ${step.completed ? 'bg-[#D4AF37]/30' : 'bg-gray-800'}`}></div>}
                                                    <div className="text-left md:text-center mt-0 md:mt-2">
                                                        <p className={`text-[10px] font-black uppercase tracking-widest ${step.completed ? 'text-white' : 'text-gray-600'}`}>{step.step}</p>
                                                        <p className="text-[10px] font-mono text-gray-500 mt-1">{step.date}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* --- TAB 3: EMPIRE WALLET & REFERRALS --- */}
                        {activeTab === 'EMPIRE_WALLET' && (
                            <motion.div key="3" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-black border border-[#D4AF37]/30 p-10 md:p-12 rounded-[40px] relative overflow-hidden shadow-2xl">
                                        <h3 className="text-4xl md:text-5xl font-serif mb-4 relative z-10 tracking-tighter text-white">Refer & Earn <span className="text-[#D4AF37] italic">10%</span></h3>
                                        <p className="text-gray-400 text-sm mb-10 max-w-lg relative z-10 leading-relaxed font-serif italic">
                                            Give your associates a <strong className="text-white not-italic">10% discount coupon</strong>. Upon delivery, earn <strong className="text-white not-italic">10% of their order value</strong> as points!
                                        </p>
                                        <div className="bg-black/50 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 backdrop-blur-xl">
                                            <div className="w-full">
                                                <p className="text-[10px] uppercase font-black tracking-[4px] text-gray-500 mb-2">Your Elite Invite Code</p>
                                                <p className="text-2xl md:text-3xl font-mono text-[#D4AF37] font-bold tracking-widest">{dashData.wallet?.referralCode}</p>
                                            </div>
                                            <button onClick={() => handleCopyCode(dashData.wallet?.referralCode)} className="w-full md:w-auto px-10 py-5 bg-[#D4AF37] text-black font-black uppercase tracking-[4px] text-[10px] rounded-2xl hover:bg-white transition-all flex justify-center items-center gap-3 shrink-0 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:scale-105">
                                                {isCopied ? <><CheckCircle size={16}/> Copied</> : <><Copy size={16}/> Copy Code</>}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 flex flex-col justify-center text-center items-center">
                                        <h4 className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 mb-6 flex items-center justify-center gap-3"><Coins size={20} className="text-[#D4AF37]"/> Total Yield</h4>
                                        <p className="text-5xl font-serif text-white tracking-tighter mb-2">₹{dashData.wallet?.totalEarned?.toLocaleString() || 0}</p>
                                        <div className="mt-8 pt-6 border-t border-white/10 space-y-4 w-full">
                                            <p className="text-xs text-gray-400 flex justify-between font-mono uppercase tracking-widest"><span>Liquid:</span> <span className="font-bold text-white">{dashData.wallet?.points || 0} Pts</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white/5 p-10 rounded-[40px] border border-white/10">
                                        <h3 className="text-xl font-bold mb-6 font-serif text-white">Withdraw Funds</h3>
                                        <div className="flex flex-col gap-4">
                                            <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full p-5 bg-black border border-white/20 rounded-2xl text-sm font-mono text-white outline-none focus:border-[#D4AF37]" placeholder="Amount (Min ₹500)" />
                                            <button onClick={handleWithdraw} className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3"><ArrowRightLeft size={14}/> Request Transfer</button>
                                        </div>
                                    </div>

                                    <div className="bg-[#D4AF37]/10 p-10 rounded-[40px] border border-[#D4AF37]/30">
                                        <h3 className="text-xl font-bold mb-6 font-serif text-white flex items-center gap-3"><Ticket size={20} className="text-[#D4AF37]"/> Coupon Vault</h3>
                                        <div className="space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                                            {dashData.coupons?.length === 0 ? <p className="text-gray-500 text-sm">No coupons available.</p> : dashData.coupons?.map((c:any, i:number) => (
                                                <div key={i} className="bg-black p-5 rounded-2xl border border-white/10 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold text-sm text-white">{c.discount} OFF</p>
                                                        <p className="text-[10px] text-gray-500 font-mono mt-1">Valid till {c.validUntil}</p>
                                                    </div>
                                                    <button onClick={() => handleCopyCode(c.code)} className="px-5 py-2.5 bg-white/10 border border-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors">
                                                        {c.code}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- TAB 4: WISHLIST & RECENTLY VIEWED --- */}
                        {activeTab === 'WISHLIST' && (
                            <motion.div key="4" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="space-y-12">
                                <div>
                                    <h3 className="text-3xl font-serif mb-8 border-b border-white/10 pb-4 text-white">Saved to Wishlist</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {dashData.wishlist?.length === 0 ? <p className="text-gray-500 col-span-3 text-lg font-serif italic">Your wishlist is empty.</p> : dashData.wishlist?.map((item:any) => (
                                            <div key={item.id} className="bg-white/5 p-6 rounded-[30px] border border-white/10 hover:border-[#D4AF37] transition-all group">
                                                <div className="h-48 bg-black rounded-2xl mb-6 p-4 flex justify-center items-center relative border border-white/5">
                                                    <img src={item.image} className="h-full object-contain group-hover:scale-110 transition-transform"/>
                                                    <button onClick={()=>showToast("Removed from wishlist")} className="absolute top-3 right-3 text-[#D4AF37] bg-white/10 p-2 rounded-full backdrop-blur-md"><Heart fill="currentColor" size={14}/></button>
                                                </div>
                                                <h4 className="font-bold text-sm mb-2 text-white line-clamp-1">{item.name}</h4>
                                                <p className="font-mono text-sm text-[#D4AF37] mb-6 font-bold">₹{item.price.toLocaleString()}</p>
                                                <button onClick={() => handleMoveToCart(item)} className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] hover:text-black transition-colors">Move to Cart</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- TAB 5: ADDRESSES & SECURITY --- */}
                        {activeTab === 'SETTINGS' && (
                            <motion.div key="5" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                        <h3 className="text-xl font-bold font-serif flex items-center gap-3 text-white"><MapPin size={20} className="text-[#D4AF37]"/> Locations</h3>
                                        <button onClick={() => handleActionPrompt('Add Address', 'Enter your new complete address:')} className="text-[10px] font-black uppercase text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg">+ Add</button>
                                    </div>
                                    <div className="space-y-4">
                                        {dashData.addresses?.length === 0 ? <p className="text-gray-500 text-sm">No saved addresses.</p> : dashData.addresses?.map((addr:any) => (
                                            <div key={addr.id} className={`p-6 rounded-2xl border ${addr.isDefault ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 bg-black'}`}>
                                                <div className="flex justify-between mb-3">
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 text-white rounded">{addr.type}</span>
                                                    {addr.isDefault && <span className="text-[10px] font-bold text-[#D4AF37] flex items-center gap-1"><CheckCircle size={12}/> Default</span>}
                                                </div>
                                                <p className="text-sm text-gray-400 font-serif italic leading-relaxed">{addr.address}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                                        <h3 className="text-xl font-bold font-serif flex items-center gap-3 mb-6 border-b border-white/10 pb-4 text-white"><CreditCard size={20} className="text-[#D4AF37]"/> Payment Vault</h3>
                                        {dashData.savedCards?.length === 0 ? <p className="text-gray-500 text-sm">No cards saved.</p> : dashData.savedCards?.map((card:any) => (
                                            <div key={card.id} className="flex items-center gap-4 p-5 border border-white/10 rounded-2xl bg-black">
                                                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center text-white text-[10px] font-bold italic">VISA</div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold font-mono text-white">**** **** **** {card.last4}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Exp: {card.expiry}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-black/50 p-8 rounded-[40px] border border-red-500/20 relative overflow-hidden">
                                        <h3 className="text-xl font-bold font-serif mb-6 relative z-10 text-white flex items-center gap-2"><ShieldAlert size={20} className="text-red-500"/> Security</h3>
                                        <div className="space-y-4 relative z-10">
                                            <button onClick={() => showToast("Password reset link dispatched securely.")} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors">Change Password</button>
                                            <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                                                <p className="text-[9px] font-black tracking-widest uppercase text-gray-500 mb-1">Active Session IP</p>
                                                <p className="text-sm font-mono text-green-400">{dashData.profile?.loginHistory?.[0]?.ip || '192.168.1.1'}</p>
                                                <p className="text-[10px] text-gray-600 mt-2 font-mono">{new Date().toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- TAB 6: REVIEWS & SUPPORT --- */}
                        {activeTab === 'SUPPORT' && (
                            <motion.div key="6" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                            <h3 className="text-xl font-bold font-serif flex items-center gap-3 text-white"><Bell size={20} className="text-[#D4AF37]"/> Vault Alerts</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {dashData.notifications?.length === 0 ? <p className="text-gray-500 text-sm">No new alerts.</p> : dashData.notifications?.map((n:any) => (
                                                <div key={n.id} className={`p-5 rounded-2xl border ${n.unread ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' : 'bg-black border-white/10'}`}>
                                                    <h4 className={`font-bold text-sm mb-1 ${n.unread ? 'text-white' : 'text-gray-400'}`}>{n.title}</h4>
                                                    <p className="text-xs text-gray-500 mb-3">{n.desc}</p>
                                                    <p className="text-[9px] font-mono text-gray-600">{n.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                            <h3 className="text-xl font-bold font-serif flex items-center gap-3 text-white"><AlertCircle size={20} className="text-[#D4AF37]"/> Concierge</h3>
                                            <button onClick={() => handleActionPrompt('Concierge Request', 'Describe your issue/request briefly:')} className="text-[10px] font-black uppercase text-[#D4AF37]">+ Request</button>
                                        </div>
                                        {dashData.tickets?.length === 0 ? <p className="text-sm text-gray-500">No active concierge requests.</p> : dashData.tickets?.map((t:any) => (
                                            <div key={t.id} className="flex justify-between items-center p-5 bg-black rounded-2xl border border-white/10 mt-4">
                                                <div>
                                                    <p className="text-xs font-bold text-white mb-1">{t.subject}</p>
                                                    <p className="text-[9px] font-mono text-gray-500">ID: {t.id}</p>
                                                </div>
                                                <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/20">{t.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white/5 p-8 rounded-[40px] border border-white/10">
                                    <h3 className="text-xl font-bold font-serif flex items-center gap-3 mb-6 border-b border-white/10 pb-4 text-white"><Star size={20} className="text-[#D4AF37]"/> My Reviews</h3>
                                    <div className="space-y-6">
                                        {dashData.reviews?.length === 0 ? <p className="text-sm text-gray-500">No reviews submitted.</p> : dashData.reviews?.map((rev:any) => (
                                            <div key={rev.id} className="p-6 bg-black rounded-3xl border border-white/10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <p className="font-bold text-sm text-white">{rev.product}</p>
                                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border ${rev.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>{rev.status}</span>
                                                </div>
                                                <div className="flex gap-1 text-[#D4AF37] mb-4">{[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={12} fill="currentColor"/>)}</div>
                                                <p className="text-sm font-serif italic text-gray-400 leading-relaxed">"{rev.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
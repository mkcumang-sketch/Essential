"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from "next/dynamic";
import { 
    ArrowLeft, LogOut, ShieldCheck, Clock, Settings, Star, CreditCard, 
    Copy, Wallet, Coins, ArrowRightLeft, CheckCircle, MapPin, Download, Ticket, 
    Bell, Heart, Eye, MessageSquare, Shield, User, ShoppingBag, AlertCircle, ShieldAlert 
} from 'lucide-react';
import Link from 'next/link';

const CuratedGiftingSuite = dynamic(
  () => import("@/components/CuratedGiftingSuite"),
  { ssr: false }
);

const VirtualVault = dynamic(() => import("@/components/VirtualVault"), { ssr: false });

export default function PremiumAccountDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const [isCopied, setIsCopied] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    
    // 🚨 Store RAW API response (dashData.data.*) to avoid shape mismatch crashes.
    const [dashData, setDashData] = useState<any>({
        success: true,
        data: { orders: [], totalSpent: 0, tier: "Silver" },
    });
    const [isLoading, setIsLoading] = useState(true);
    const [errorState, setErrorState] = useState(false);
    
    const [toastMsg, setToastMsg] = useState("");
    const [vaultCount, setVaultCount] = useState(0);

    // 🎨 Theme Switcher (UI-only): Dark / Light / Luxury
    const [theme, setTheme] = useState<'dark' | 'light' | 'luxury'>('luxury');
    const isLight = theme === 'light';
    const isLuxury = theme === 'luxury';

    const pageClassName = isLight
        ? "min-h-screen bg-white text-black font-sans selection:bg-[#D4AF37] selection:text-black pb-20 relative overflow-x-hidden"
        : isLuxury
            ? "min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.18),transparent_62%),#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black pb-20 relative overflow-x-hidden"
            : "min-h-screen bg-[#0b0b0b] text-white font-sans selection:bg-[#D4AF37] selection:text-black pb-20 relative overflow-x-hidden";

    const surfaceBgClass = isLight ? "bg-white/90" : "bg-white/5";
    const surfaceBorderClass = isLight ? "border-black/10" : "border-white/10";
    const surfaceTextClass = isLight ? "text-black" : "text-white";

    const headerBgClass = isLight
        ? "bg-white/70 border-b border-black/10"
        : "bg-black/70 border-b border-white/10";

    const headerLinkClass = isLight ? "text-black/70 hover:text-[#D4AF37]" : "text-white/70 hover:text-[#D4AF37]";
    const navInactiveClass = isLight
        ? "bg-transparent text-black/60 border-black/10 hover:bg-black/5 hover:text-black hover:border-[#D4AF37]/35"
        : "bg-transparent text-white/40 border-white/10 hover:bg-white/10 hover:text-white hover:border-[#D4AF37]/35";
    const iconInactiveClass = isLight ? "text-black/55" : "text-white/55";
    const iconInactiveClassActive = "text-black";

    useEffect(() => {
        // 🚨 AGAR LOGIN NAHI HAI: Data turant uda do
        if (status === "unauthenticated") {
            setDashData({ success: true, data: { orders: [], totalSpent: 0, tier: "Silver" } });
            setIsLoading(false);
            router.push('/login');
            return;
        } 
        
        // 🚨 AGAR LOGIN HAI: Naya data laane se pehle memory saaf karo
        if (status === "authenticated" && session?.user) {
            const email = session?.user?.email;
            if (!email) {
                setErrorState(true);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setDashData({ success: true, data: { orders: [], totalSpent: 0, tier: "Silver" } }); // Reset before refetch

            // Nuclear cache buster: timestamp guarantees no cached response reuse.
            fetch(`/api/user/dashboard?t=${Date.now()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                cache: 'no-store' // Browser ko cache save karne se rokna
            })
            .then(async (res) => {
                const json = await res.json().catch(() => null);
                console.log("Raw API Response:", json);
                return json;
            })
            .then((json) => {
                const next = (json && typeof json === "object") ? json : null;
                const hasData = !!next?.data && typeof next.data === "object";
                const safe = hasData
                    ? {
                        success: true,
                        data: {
                            orders: Array.isArray(next.data.orders) ? next.data.orders : [],
                            totalSpent: Number.isFinite(Number(next.data.totalSpent)) ? Number(next.data.totalSpent) : 0,
                            tier: next.data.tier === "Gold" ? "Gold" : "Silver",
                        }
                    }
                    : { success: true, data: { orders: [], totalSpent: 0, tier: "Silver" } };

                setDashData(safe);
                setErrorState(false);
            })
            .catch(() => {
                setErrorState(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
        }
    }, [status, session, router]);

    // Virtual Vault count (localStorage driven). Kept UI-only to avoid touching cart/DB/NextAuth.
    useEffect(() => {
        const readVaultCount = () => {
            try {
                const raw = localStorage.getItem("luxury_wishlist") || "[]";
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed.length : 0;
            } catch {
                return 0;
            }
        };

        setVaultCount(readVaultCount());

        const handler = (e: any) => {
            const next = Number(e?.detail?.count ?? 0);
            setVaultCount(Number.isFinite(next) ? next : 0);
        };

        window.addEventListener("vaultCountChanged", handler);
        return () => window.removeEventListener("vaultCountChanged", handler);
    }, []);

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

    // 🚨 SAFAI ABHIYAN: Logout karte waqt browser ki memory (Cart etc) delete karna
    const handleLogout = async () => {
        localStorage.clear();
        sessionStorage.clear();
        await signOut({ callbackUrl: '/login' });
        window.location.reload(); // Hard reload to prevent cross-session UI leakage
    };

    // ⏳ LOADING STATE: Jab tak naya data na aaye, ye screen dikhegi
    if (status === "loading" || isLoading) return (
        <div className={`${isLight ? "min-h-screen bg-white text-black" : "min-h-screen bg-[#050505] text-white"} flex flex-col justify-center items-center`}>
            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[5px] animate-pulse">Securing Vault Data...</p>
        </div>
    );

    // 🚨 Session not ready/invalid: avoid rendering the dashboard.
    if (status === "unauthenticated") return null;
    
    // 🚨 IF THE API FAILS
    if (errorState) return (
        <div className={`${isLight ? "h-screen bg-white text-black" : "h-screen bg-[#050505] text-white"} flex flex-col justify-center items-center text-center p-6`}>
            <ShieldAlert size={60} className="text-red-500 mb-6"/>
            <h2 className={`text-3xl font-serif mb-2 ${isLight ? "text-black" : "text-white"}`}>Vault Disconnected</h2>
            <p className={`max-w-sm mb-8 ${isLight ? "text-gray-600" : "text-gray-500"}`}>We are unable to sync with the central database. Please refresh the connection.</p>
            <button onClick={() => window.location.reload()} className="px-10 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[5px] text-[11px] rounded-full hover:bg-white transition-colors shadow-[0_20px_60px_rgba(212,175,55,0.18)] border border-[#D4AF37]/40">
                Refresh Vault
            </button>
        </div>
    );

    // 🚨 No usable data: render safe empty state (never crash).
    if (!dashData?.data) return (
        <div className={`${isLight ? "min-h-screen bg-white text-black" : "min-h-screen bg-[#050505] text-white"} flex flex-col justify-center items-center text-center p-6`}>
            <AlertCircle size={60} className="text-[#D4AF37] mb-6"/>
            <h2 className={`text-3xl font-serif mb-2 ${isLight ? "text-black" : "text-white"}`}>No Data Found</h2>
            <p className={`max-w-sm mb-8 ${isLight ? "text-gray-600" : "text-gray-500"}`}>Your vault data is currently unavailable. Please refresh and try again.</p>
            <button onClick={() => window.location.reload()} className="px-10 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[5px] text-[11px] rounded-full hover:bg-white transition-colors shadow-[0_20px_60px_rgba(212,175,55,0.18)] border border-[#D4AF37]/40">
                Refresh Vault
            </button>
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

    const giftingWatches = useMemo(() => {
        const orders = Array.isArray(dashData?.data?.orders) ? dashData.data.orders : [];
        const rawItems: any[] = orders.flatMap((o: any) => o?.items || []);
        const seen = new Set<string>();
        const normalized = rawItems.map((item: any, idx: number) => {
            const id = String(item?._id || item?.id || item?.name || idx);
            return {
                id,
                name: item?.name || "Premium Timepiece",
                brand: item?.brand || "Essential",
                imageUrl: item?.imageUrl,
                image: item?.image,
                offerPrice: item?.offerPrice,
                price: item?.price,
            };
        });

        return normalized.filter((w) => {
            if (seen.has(w.id)) return false;
            seen.add(w.id);
            return true;
        });
    }, [dashData]);

    return (
        <div className={pageClassName}>
            
            <AnimatePresence>
                {toastMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.9, x: "-50%" }}
                        className={`fixed bottom-10 left-1/2 z-[5000] backdrop-blur-xl px-10 py-5 rounded-[28px] flex items-center gap-4 shadow-[0_20px_60px_rgba(212,175,55,0.18)] ${isLight ? "bg-white/95 border border-black/10" : "bg-black/85 border border-[#D4AF37]/50"}`}
                    >
                        <ShieldCheck size={20} className="text-[#D4AF37]"/>
                        <p className={`${isLight ? "text-black" : "text-white"} text-sm font-serif italic`}>{toastMsg}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className={`${headerBgClass} backdrop-blur-xl py-8 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-[0_18px_60px_rgba(0,0,0,0.45)]`}>
                <Link href="/" className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] ${headerLinkClass} transition-colors`}>
                    <ArrowLeft size={16}/> Exit Vault
                </Link>
                <h1 className={`text-2xl font-serif font-bold uppercase tracking-[10px] absolute left-1/2 -translate-x-1/2 hidden md:block ${surfaceTextClass}`}>Essential</h1>
                <div className="flex items-center gap-4 flex-wrap justify-end">
                    {/* 🚨 NAYA LOGOUT BUTTON */}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] ${isLight ? "text-black/70 hover:text-black border-black/10 hover:bg-[#D4AF37] hover:border-[#D4AF37]" : "text-white/70 hover:text-black border-white/10 hover:bg-[#D4AF37] hover:border-[#D4AF37]"} transition-colors px-6 py-3 rounded-full border shadow-[0_20px_50px_rgba(212,175,55,0.08)]`}
                    >
                        Lock Vault <LogOut size={16}/>
                    </button>

                    {/* 🎨 Theme Switcher */}
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-[3px] ${isLight ? "text-black/60" : "text-white/60"}`}>
                            Theme
                        </span>
                        <div className={`flex rounded-full border overflow-hidden ${isLight ? "border-black/10 bg-white/60" : "border-white/10 bg-black/30"}`}>
                            <button
                                type="button"
                                onClick={() => setTheme('dark')}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[3px] transition-colors ${theme === 'dark' ? 'bg-[#D4AF37] text-black' : isLight ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
                            >
                                Dark
                            </button>
                            <button
                                type="button"
                                onClick={() => setTheme('light')}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[3px] transition-colors ${theme === 'light' ? 'bg-[#D4AF37] text-black' : isLight ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
                            >
                                Light
                            </button>
                            <button
                                type="button"
                                onClick={() => setTheme('luxury')}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[3px] transition-colors ${theme === 'luxury' ? 'bg-[#D4AF37] text-black' : isLight ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'}`}
                            >
                                Luxury
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto pt-10 px-6 md:px-12 flex flex-col lg:flex-row gap-10 relative z-10">
                
                <motion.aside
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full lg:w-[320px] shrink-0"
                >
                    <div className={`${surfaceBgClass} backdrop-blur-xl border ${surfaceBorderClass} ${surfaceTextClass} p-10 rounded-[40px] mb-8 shadow-2xl relative overflow-hidden`}>
                        <div className="absolute -right-10 -top-10 text-[#D4AF37] opacity-10 pointer-events-none"><ShieldCheck size={150}/></div>
                        
                        <div className="w-20 h-20 bg-black border border-[#D4AF37]/50 rounded-full flex items-center justify-center text-[#D4AF37] text-3xl font-serif mb-5 relative z-10 shadow-[0_0_0_4px_rgba(212,175,55,0.08)]">
                            {userName.charAt(0)}
                        </div>
                        
                        <h3 className={`font-serif text-3xl mb-1 relative z-10 ${surfaceTextClass}`}>{userName}</h3>
                        <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[2px] mb-6 relative z-10">
                            {userRole === 'SUPER_ADMIN' ? 'Site Administrator' : 'Elite Member'}
                        </p>
                        
                        {userRole === 'SUPER_ADMIN' && (
                            <div className="relative z-10 mb-6">
                                <Link href="/godmode" className="w-full py-4 bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-[11px] uppercase tracking-[5px] rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all flex justify-center items-center gap-2 border border-[#D4AF37]/25 shadow-[0_20px_60px_rgba(212,175,55,0.08)]">
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

                    <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible custom-scrollbar pb-4 lg:pb-0 p-6 rounded-[40px] backdrop-blur-xl border ${surfaceBorderClass} ${surfaceBgClass}">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-4 px-7 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[4px] whitespace-nowrap transition-all w-full text-left border ${activeTab === item.id ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20' : navInactiveClass}`}
                            >
                                <item.icon size={18} className={activeTab === item.id ? iconInactiveClassActive : iconInactiveClass} /> {item.label}
                            </button>
                        ))}
                    </nav>
                </motion.aside>

                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        
                        {/* --- TAB 1: OVERVIEW --- */}
                        {activeTab === 'OVERVIEW' && (
                            <motion.div
                                key="1"
                                initial={{opacity:0, y:20}}
                                animate={{opacity:1, y:0}}
                                exit={{opacity:0}}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className={`p-10 ${surfaceBgClass} border ${surfaceBorderClass} rounded-[40px] flex flex-col justify-center hover:border-[#D4AF37]/35 transition-colors`}>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Orders</p>
                                        <h3 className={`text-5xl font-serif ${surfaceTextClass}`}>{dashData?.data?.orders?.length || 0}</h3>
                                    </div>
                                    <div className={`p-10 ${isLight ? "bg-gradient-to-br from-white to-gray-100" : "bg-gradient-to-br from-[#1a1a1a] to-black"} border border-[#D4AF37]/30 rounded-[40px] flex flex-col justify-center relative overflow-hidden shadow-[0_25px_80px_rgba(212,175,55,0.10)]`}>
                                        <div className="absolute right-[-20px] bottom-[-20px] opacity-20"><Wallet size={100} className="text-[#D4AF37]"/></div>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 relative z-10 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Empire Wallet</p>
                                        <h3 className="text-5xl font-serif text-[#D4AF37] relative z-10">₹0</h3>
                                    </div>
                                    <div className={`p-10 ${surfaceBgClass} border ${surfaceBorderClass} rounded-[40px] flex flex-col justify-center hover:border-[#D4AF37]/35 transition-colors`}>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Wishlist Items</p>
                                        <h3 className={`text-5xl font-serif ${surfaceTextClass}`}>{vaultCount}</h3>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={`${surfaceBgClass} p-10 rounded-[46px] border ${surfaceBorderClass} shadow-sm`}>
                                        <h4 className="text-sm font-black uppercase tracking-[5px] mb-6 flex items-center gap-3"><Star size={18} className="text-[#D4AF37]"/> Curated For You</h4>
                                        <p className="text-xs text-gray-500 italic">No curations available yet.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div
                                            onClick={() => showToast("Certificates are being verified. Check back later.")}
                                            className={`${surfaceBgClass} p-7 rounded-[34px] border ${surfaceBorderClass} flex flex-col items-center justify-center text-center ${isLight ? "hover:bg-black/5" : "hover:bg-white/10"} cursor-pointer transition-all group hover:border-[#D4AF37]/35`}
                                        >
                                            <div className="w-16 h-16 bg-black border border-white/20 text-white rounded-full flex items-center justify-center mb-5 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors"><ShieldCheck size={26}/></div>
                                            <h4 className="font-bold text-xs uppercase tracking-[5px]">Certificates</h4>
                                        </div>
                                        <div
                                            onClick={() => showToast("Service Booking is currently offline.")}
                                            className={`${surfaceBgClass} p-7 rounded-[34px] border ${surfaceBorderClass} flex flex-col items-center justify-center text-center ${isLight ? "hover:bg-black/5" : "hover:bg-white/10"} cursor-pointer transition-all group hover:border-[#D4AF37]/35`}
                                        >
                                            <div className="w-16 h-16 bg-black border border-white/20 text-white rounded-full flex items-center justify-center mb-5 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors"><Settings size={26}/></div>
                                            <h4 className="font-bold text-xs uppercase tracking-[5px]">Book Service</h4>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <CuratedGiftingSuite
                                        watches={giftingWatches}
                                        isLight={isLight}
                                        onToast={showToast}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* --- TAB 2: ORDERS --- */}
                        {activeTab === 'ORDERS' && (
                            <motion.div
                                key="2"
                                initial={{opacity:0, y:20}}
                                animate={{opacity:1, y:0}}
                                exit={{opacity:0}}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                {dashData?.data?.orders?.length === 0 ? (
                                    <div className={`${surfaceBgClass} p-10 md:p-12 rounded-[46px] text-center border ${surfaceBorderClass}`}>
                                        <ShoppingBag size={50} className="mx-auto text-gray-600 mb-6"/>
                                        <p className={`${isLight ? "text-gray-600" : "text-gray-400"} font-serif text-lg`}>You haven't acquired any timepieces yet.</p>
                                        <Link href="/shop" className="mt-8 inline-block px-12 py-5 bg-[#D4AF37] text-black text-[11px] font-black uppercase tracking-[5px] rounded-full hover:bg-white transition-all shadow-lg border border-[#D4AF37]/40">Enter Vault</Link>
                                    </div>
                                ) : dashData?.data?.orders?.map((order: any) => (
                                    <div key={order._id} className={`${surfaceBgClass} p-10 rounded-[46px] border ${surfaceBorderClass} flex flex-col gap-6 hover:border-[#D4AF37]/50 transition-colors shadow-lg`}>
                                        <div
                                            className={`flex flex-col md:flex-row justify-between md:items-center gap-4 border-b pb-6 ${isLight ? "border-black/10" : "border-white/10"}`}
                                        >
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Acquisition #{order.orderId || order._id?.slice(-6) || 'UKN'}</p>
                                                <h4 className={`font-serif text-3xl font-bold ${surfaceTextClass}`}>₹{(order.totalAmount || 0).toLocaleString()}</h4>
                                            </div>
                                            <span className={`px-6 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest w-max ${order.status === 'CANCELLED' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10'}`}>
                                                {order.status || 'PROCESSING'}
                                            </span>
                                        </div>
                                        
                                        {/* 🚨 ORDER ITEM DETAILS 🚨 */}
                                        {order.items && order.items.length > 0 && (
                                            <div className="space-y-4 pt-2">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Acquired Assets</p>
                                                {order.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-4 bg-black p-4 rounded-2xl border border-white/5">
                                                        <div className="w-16 h-16 bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                                                            {(item.imageUrl || item.image) ? (
                                                                <img src={item.imageUrl || item.image} alt="product" className="w-full h-full object-cover mix-blend-lighten" />
                                                            ) : (
                                                                <ShoppingBag size={20} className="text-gray-600"/>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h5 className={`text-sm font-bold ${surfaceTextClass} mb-1 line-clamp-1`}>{item.name || 'Premium Timepiece'}</h5>
                                                            <p className="text-[10px] text-gray-400 font-mono">Qty: {item.qty || 1} • ₹{Number(item.offerPrice || item.price || 0).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* --- TAB 3: EMPIRE WALLET --- */}
                        {activeTab === 'EMPIRE_WALLET' && (
                            <motion.div
                                key="3"
                                initial={{opacity:0, y:20}}
                                animate={{opacity:1, y:0}}
                                exit={{opacity:0}}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <div className={`p-12 md:p-12 ${isLight ? "bg-gradient-to-br from-white to-gray-100" : "bg-gradient-to-br from-[#1a1a1a] to-black"} border border-[#D4AF37]/30 rounded-[46px] relative overflow-hidden shadow-2xl`}>
                                    <div className="absolute right-0 bottom-0 opacity-10"><Wallet size={150} className="text-[#D4AF37]"/></div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 relative z-10 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Available Balance</p>
                                    <h3 className="text-6xl font-serif text-[#D4AF37] relative z-10">₹0</h3>
                                    <p className="text-xs text-gray-500 italic mt-2 relative z-10">Use your wallet balance for faster seamless acquisitions.</p>
                                    <div className="mt-8 flex gap-4 relative z-10">
                                        <button onClick={() => showToast("Withdrawal system is currently offline.")} className="px-10 py-4 bg-[#D4AF37] text-black text-[11px] font-black uppercase tracking-[5px] rounded-full hover:bg-white transition-all shadow-lg border border-[#D4AF37]/40">Withdraw Funds</button>
                                        <button
                                            onClick={() => showToast("No recent transactions.")}
                                            className={`px-10 py-4 text-[11px] font-black uppercase tracking-[5px] rounded-full transition-all ${
                                                isLight
                                                    ? "bg-white border border-black/10 text-black hover:bg-black/5 hover:border-[#D4AF37]/35"
                                                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#D4AF37]/35"
                                            }`}
                                        >
                                            View History
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- TAB 4: WISHLIST --- */}
                        {activeTab === 'WISHLIST' && (
                            <motion.div
                                key="4"
                                initial={{opacity:0, y:20}}
                                animate={{opacity:1, y:0}}
                                exit={{opacity:0}}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <VirtualVault isLight={isLight} />
                            </motion.div>
                        )}

                        {/* --- TAB 5: SETTINGS & ADDRESSES --- */}
                        {activeTab === 'SETTINGS' && (
                            <motion.div
                                key="5"
                                initial={{opacity:0, y:20}}
                                animate={{opacity:1, y:0}}
                                exit={{opacity:0}}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <div className={`${surfaceBgClass} p-10 rounded-[46px] border ${surfaceBorderClass}`}>
                                    <h3 className={`text-lg md:text-xl font-serif ${surfaceTextClass} mb-6 border-b ${surfaceBorderClass} pb-5 flex items-center gap-3`}>
                                        <MapPin size={20} className="text-[#D4AF37]"/> Saved Addresses
                                    </h3>
                                    <div className="text-center py-8">
                                        <p className="text-sm text-gray-500 italic mb-6">No saved addresses found in your vault.</p>
                                        <button onClick={() => showToast("Address management will be available soon.")} className="px-10 py-4 border border-[#D4AF37]/70 bg-transparent text-[#D4AF37] text-[11px] font-black uppercase tracking-[5px] rounded-full hover:bg-[#D4AF37] hover:text-black transition-all shadow-[0_20px_60px_rgba(212,175,55,0.10)]">+ Add New Address</button>
                                    </div>
                                </div>
                                <div className={`${surfaceBgClass} p-10 rounded-[46px] border ${surfaceBorderClass}`}>
                                    <h3 className={`text-lg md:text-xl font-serif ${surfaceTextClass} mb-6 border-b ${surfaceBorderClass} pb-5 flex items-center gap-3`}>
                                        <Shield size={20} className="text-[#D4AF37]"/> Account Security
                                    </h3>
                                    <div className="space-y-4">
                                        <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}><strong>Primary Email:</strong> {session?.user?.email}</p>
                                        <button
                                            onClick={() => showToast("Google Authenticated accounts cannot change passwords here.")}
                                            className={`mt-4 w-full sm:w-auto flex items-center justify-center gap-4 text-[11px] uppercase tracking-[5px] font-black transition-colors px-6 py-4 rounded-full border ${
                                                isLight
                                                    ? "text-black/60 border-black/10 hover:border-[#D4AF37]/35 bg-black/5 hover:bg-transparent hover:text-[#D4AF37]"
                                                    : "text-white/60 border-white/10 hover:border-[#D4AF37]/35 bg-white/5 hover:bg-white/10 hover:text-[#D4AF37]"
                                            }`}
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- TAB 6: REVIEWS & SUPPORT --- */}
                        {activeTab === 'SUPPORT' && (
                            <motion.div
                                key="6"
                                initial={{opacity:0, y:20}}
                                animate={{opacity:1, y:0}}
                                exit={{opacity:0}}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <div className={`${surfaceBgClass} p-12 md:p-16 rounded-[46px] text-center border ${surfaceBorderClass}`}>
                                    <MessageSquare size={50} className="mx-auto text-[#D4AF37] mb-6"/>
                                    <h3 className={`text-3xl md:text-4xl font-serif ${surfaceTextClass} mb-4`}>Concierge Support</h3>
                                    <p className={`${isLight ? "text-gray-600" : "text-gray-400"} text-sm mb-8 max-w-md mx-auto italic font-serif`}>Our luxury concierge team is available to assist you with your acquisitions, certificates, and inquiries.</p>
                                    <button onClick={() => showToast("Connecting to Concierge Team...")} className="px-12 py-5 bg-[#D4AF37] text-black text-[11px] font-black uppercase tracking-[5px] rounded-full hover:bg-white transition-all shadow-lg border border-[#D4AF37]/40">Open Support Ticket</button>
                                </div>
                            </motion.div>
                        )}
                        
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
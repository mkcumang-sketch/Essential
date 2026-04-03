"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { 
    ShieldCheck, Crown, Package, Clock, LogOut, 
    Wallet, Share2, Copy, CheckCircle2 // 👈 Ye naye icon add kiye
} from "lucide-react";

export default function PremiumAccountDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [dashData, setDashData] = useState<any>(null);
    const [toastMsg, setToastMsg] = useState("");

    const CuratedGiftingSuite = useMemo(
        () => dynamic(() => import("@/components/CuratedGiftingSuite"), { ssr: false }),
        []
    );
    const VirtualVault = useMemo(
        () => dynamic(() => import("@/components/VirtualVault"), { ssr: false }),
        []
    );

    const giftingWatches = useMemo(() => {
        const safeOrders: any[] = Array.isArray(dashData?.orders) ? dashData.orders : [];
        const rawItems: any[] = safeOrders.flatMap((o: any) => (Array.isArray(o?.items) ? o.items : []));
        const seen = new Set<string>();
        const normalized = rawItems.map((item: any, idx: number) => {
            const id = String(item?._id || item?.id || item?.sku || item?.name || idx);
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

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status !== "authenticated") return;

        fetch(`/api/user/dashboard?t=${Date.now()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((json) => {
                const data = json?.data ?? null;
                setDashData(data);
            })
            .catch(() => {
                setDashData(null);
            });
    }, [status]);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        window.setTimeout(() => setToastMsg(""), 2600);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast("Referral code copied to clipboard!");
        } catch (err) {
            showToast("Failed to copy code");
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#FAFAFA] text-black flex flex-col justify-center items-center">
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[5px] animate-pulse">
                    Loading Vault...
                </p>
            </div>
        );
    }

    if (status === "unauthenticated") return null;

    const email = session?.user?.email || "Unknown";
    const name = session?.user?.name || "Elite Member";

    const spent = Number(dashData?.totalSpent || 0) || 0;
    const goal = 100000;
    const progress = Math.min(100, Math.max(0, (spent / goal) * 100)) || 0;

    const tier = dashData?.tier === "Gold" ? "Gold" : "Silver";
    const remaining = tier === "Gold" ? 0 : Math.max(0, goal - spent);

    // 🌟 CONSTANT CLEAN LIGHT THEME CLASSES 🌟
    const pageClass = "min-h-screen bg-[#FAFAFA] text-gray-900 pb-20";
    const surfaceClass = "bg-white border border-gray-200";
    const mutedText = "text-gray-500";
    const subMutedText = "text-gray-400";

    return (
        <div className={pageClass}>
            <AnimatePresence>
                {toastMsg ? (
                    <motion.div
                        initial={{ opacity: 0, y: 18, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="fixed bottom-8 left-1/2 z-[1000] px-6 py-4 rounded-[22px] backdrop-blur-xl shadow-lg bg-white/95 border border-gray-200"
                    >
                        <p className="text-sm font-serif italic text-gray-900">{toastMsg}</p>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
                <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-6 flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 hover:text-[#D4AF37] transition-colors"
                    >
                        Store
                    </Link>

                    {/* 🚀 FIX: Mast sa Sign Out Button */}
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-200 bg-red-50 text-[10px] font-black uppercase tracking-[4px] text-red-600 hover:bg-red-100 transition-all shadow-sm"
                    >
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 md:px-10 pt-10 space-y-10">
                {/* Elite Vault Tier */}
                <section className={`${surfaceClass} rounded-[34px] p-8 md:p-10 shadow-sm relative overflow-hidden`}>
                    <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-[#D4AF37]/5 blur-2xl pointer-events-none" />
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[5px] ${subMutedText}`}>Account</p>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                                {name}
                            </h1>
                            <p className={`text-sm mt-2 ${mutedText}`}>
                                <span className="font-semibold text-gray-700">Email:</span> {email}
                            </p>
                        </div>
                        
                        <div className="min-w-[280px]">
                            <p className={`text-[10px] font-black uppercase tracking-[5px] ${subMutedText}`}>Elite Vault Tier</p>
                            <div className="mt-3 flex items-center justify-between gap-3">
                                <span className="text-sm font-serif text-gray-900 flex items-center gap-2">
                                    {tier === "Gold" ? <Crown size={16} className="text-[#D4AF37]" /> : <ShieldCheck size={16} className="text-[#D4AF37]" />}
                                    {tier} Vault
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[4px] text-[#D4AF37] font-bold">
                                    ₹{spent.toLocaleString()}
                                </span>
                            </div>

                            <div className="mt-3 h-2 rounded-full overflow-hidden bg-gray-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="h-full bg-[#D4AF37]"
                                />
                            </div>

                            <p className={`mt-3 text-xs ${mutedText}`}>
                                {tier === "Gold"
                                    ? "Gold Vault unlocked. Your access is prioritized."
                                    : remaining > 0
                                      ? `₹${remaining.toLocaleString()} away from Gold Vault privileges.`
                                      : "Awaiting tier calculation."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Orders */}
                <section className={`${surfaceClass} rounded-[34px] p-8 md:p-10 shadow-sm`}>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 flex items-center gap-2">
                            <Package size={18} className="text-[#D4AF37]" />
                            Order History
                        </h2>
                        <p className={`text-[10px] font-black uppercase tracking-[5px] ${subMutedText}`}>
                            Orders: {(Array.isArray(dashData?.orders) ? dashData.orders : [])?.length || 0}
                        </p>
                    </div>

                    {(Array.isArray(dashData?.orders) ? dashData.orders : [])?.length ? (
                        <div className="mt-8 space-y-6">
                            {(Array.isArray(dashData?.orders) ? dashData.orders : []).map((order: any) => {
                                const orderId = order?.orderId || order?._id?.slice?.(-6) || "—";
                                const statusText = String(order?.status || "PROCESSING");
                                const total = Number(order?.totalAmount ?? 0);
                                const items: any[] = Array.isArray(order?.items) ? order.items : [];

                                return (
                                    <div
                                        key={order?._id || `${orderId}`}
                                        className="bg-white rounded-[26px] border border-gray-200 p-6 md:p-8 shadow-sm"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-gray-100">
                                            <div>
                                                <p className={`text-[10px] font-black uppercase tracking-[5px] ${subMutedText}`}>
                                                    Acquisition #{orderId}
                                                </p>
                                                <p className="mt-1 text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                                                    <Clock size={16} className="text-[#D4AF37]" />
                                                    ₹{Number.isFinite(total) ? total.toLocaleString() : "0"}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[4px] border ${
                                                    statusText === "CANCELLED"
                                                        ? "border-red-200 text-red-600 bg-red-50"
                                                        : "border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/10"
                                                }`}
                                            >
                                                {statusText}
                                            </span>
                                        </div>
                                        
                                        {items?.length ? (
                                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {items?.map((item: any, idx: number) => {
                                                    const img = item?.imageUrl || item?.image;
                                                    const price = Number(item?.offerPrice ?? item?.price ?? 0);
                                                    return (
                                                        <div
                                                            key={String(item?._id || item?.id || `${orderId}-${idx}`)}
                                                            className="rounded-[22px] p-5 border transition-colors bg-gray-50 border-gray-200 hover:border-[#D4AF37]/50"
                                                        >
                                                            <div className="w-full aspect-[4/3] rounded-[18px] overflow-hidden border border-gray-200 bg-white">
                                                                {img ? (
                                                                    <img src={img} alt={item?.name || "product"} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className={`w-full h-full flex items-center justify-center text-xs ${mutedText}`}>
                                                                        Awaiting image
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="mt-4">
                                                                <p className="text-sm font-bold text-gray-900 line-clamp-1">
                                                                    {item?.name || "Awaiting your first acquisition"}
                                                                </p>
                                                                <p className={`mt-1 text-xs ${mutedText}`}>
                                                                    Qty: {item?.qty || 1} • ₹{Number.isFinite(price) ? price.toLocaleString() : "0"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="mt-6 rounded-[22px] p-6 border border-gray-200 bg-gray-50">
                                                <p className={`text-sm font-serif italic ${mutedText}`}>Awaiting item details for this order.</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-8 rounded-[26px] p-10 border border-gray-200 bg-gray-50 shadow-sm">
                            <h3 className="text-xl font-serif font-bold text-gray-900">Awaiting your first acquisition</h3>
                            <p className={`mt-2 text-sm ${mutedText}`}>Your vault will populate instantly after your first successful order.</p>
                            <Link
                                href="/shop"
                                className="inline-block mt-6 px-10 py-4 bg-[#D4AF37] text-white text-[11px] font-black uppercase tracking-[5px] rounded-full hover:bg-[#b5952f] transition-colors shadow-md"
                            >
                                Enter Shop
                            </Link>
                        </div>
                    )}
                </section>

                {/* 🌟 EMPIRE REWARDS ENGINE UI 🌟 */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
    
    {/* WALLET POINTS CARD */}
    <div className="bg-white border border-gray-200 p-8 rounded-[34px] shadow-sm flex items-center justify-between">
        <div>
            <p className="text-[10px] font-black uppercase tracking-[4px] text-gray-400">Vault Balance</p>
            <h3 className="text-3xl font-serif font-bold text-gray-900 mt-2">₹{dashData?.walletPoints || 0}</h3>
            <p className="text-[10px] text-green-600 font-bold mt-1">TOTAL EARNED: ₹{dashData?.totalEarned || 0}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <Wallet className="text-[#D4AF37]" size={32} />
        </div>
    </div>

    {/* REFERRAL CODE CARD */}
    <div className="bg-black text-white p-8 rounded-[34px] shadow-xl relative overflow-hidden group">
        <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[4px] text-[#D4AF37]">My Referral Code</p>
            <div className="flex items-center gap-4 mt-2">
                <h3 className="text-2xl font-mono font-bold tracking-widest uppercase">
                    {dashData?.myReferralCode || "GENERATING..."}
                </h3>
                <button 
                    onClick={() => copyToClipboard(dashData?.myReferralCode)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                    <Copy size={16} />
                </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-4">SHARE THIS CODE TO EARN ₹100 PER REFERRAL</p>
        </div>
        {/* Decorative Crown */}
        <Crown className="absolute -right-4 -bottom-4 text-white/5 rotate-12" size={120} />
    </div>

</div>

{/* LOYALTY TIER BADGE */}
<div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20">
    <ShieldCheck size={14} className="text-[#D4AF37]" />
    <span className="text-[10px] font-black uppercase tracking-[2px] text-[#D4AF37]">
        Tier: {dashData?.loyaltyTier || "Silver Vault"}
    </span>
</div>

                {/* Gifting Suite */}
                <section className={`${surfaceClass} rounded-[34px] p-8 md:p-10 shadow-sm`}>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Curated Gifting Suite</h2>
                    <p className={`mt-2 text-sm ${mutedText}`}>Bundle timepieces with a premium note for an elevated gifting experience.</p>
                    <div className="mt-8">
                        <CuratedGiftingSuite watches={giftingWatches} isLight={true} onToast={showToast} />
                    </div>
                </section>

                {/* Virtual Vault */}
                <section className={`${surfaceClass} rounded-[34px] p-8 md:p-10 shadow-sm`}>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Virtual Vault</h2>
                    <p className={`mt-2 text-sm ${mutedText}`}>Save pieces you admire — your vault remembers.</p>
                    <div className="mt-8">
                        <VirtualVault isLight={true} />
                    </div>
                </section>

                <div className={`text-center text-[10px] font-black uppercase tracking-[5px] ${subMutedText} pb-2`}>
                    Essential Rush • Private Member Area
                </div>
            </main>
        </div>
    );
}
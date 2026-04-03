"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ShieldCheck, Crown, Package, Clock } from "lucide-react";

export default function PremiumAccountDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [dashData, setDashData] = useState<any>(null);
    const [toastMsg, setToastMsg] = useState("");

    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const isLight = theme === "light";

    const CuratedGiftingSuite = useMemo(
        () => dynamic(() => import("@/components/CuratedGiftingSuite"), { ssr: false }),
        []
    );
    const VirtualVault = useMemo(
        () => dynamic(() => import("@/components/VirtualVault"), { ssr: false }),
        []
    );

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
                // API contract: { success: true, data: { orders: [] ... } }
                const data = json?.data ?? null;
                setDashData(data);
            })
            .catch(() => {
                setDashData(null);
            });
    }, [status]);

    useEffect(() => {
        console.log("Dashboard Data Received:", dashData);
    }, [dashData]);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        window.setTimeout(() => setToastMsg(""), 2600);
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center">
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[5px] animate-pulse">
                    Loading Account...
                </p>
        </div>
    );
    }

    if (status === "unauthenticated") return null;

    const email = session?.user?.email || "Unknown";
    const name = session?.user?.name || "Elite Member";

    // ABSOLUTE SAFETY: progress math can never NaN/Infinity.
    const spent = Number(dashData?.totalSpent || 0) || 0;
    const goal = 100000;
    const progress = Math.min(100, Math.max(0, (spent / goal) * 100)) || 0;

    const tier = dashData?.tier === "Gold" ? "Gold" : "Silver";
    const remaining = tier === "Gold" ? 0 : Math.max(0, goal - spent);

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

    const pageClass = isLight
        ? "min-h-screen bg-white text-black pb-20"
        : "min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.16),transparent_58%),#050505] text-white pb-20";
    const surfaceClass = isLight ? "bg-white/85 border border-black/10" : "bg-white/5 border border-white/10";
    const mutedText = isLight ? "text-black/60" : "text-white/60";
    const subMutedText = isLight ? "text-black/50" : "text-white/50";

    return (
        <div className={pageClass}>
            <AnimatePresence>
                {toastMsg ? (
                    <motion.div
                        initial={{ opacity: 0, y: 18, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className={`fixed bottom-8 left-1/2 z-[1000] px-6 py-4 rounded-[22px] backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.35)] ${
                            isLight ? "bg-white/95 border border-black/10" : "bg-black/80 border border-[#D4AF37]/35"
                        }`}
                    >
                        <p className={`text-sm font-serif italic ${isLight ? "text-black" : "text-white"}`}>{toastMsg}</p>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <header
                className={`sticky top-0 z-50 backdrop-blur-xl ${
                    isLight ? "bg-white/70 border-b border-black/10" : "bg-black/65 border-b border-white/10"
                } shadow-[0_18px_60px_rgba(0,0,0,0.35)]`}
            >
                <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-6 flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className={`text-[10px] font-black uppercase tracking-[4px] ${
                            isLight ? "text-black/70 hover:text-[#D4AF37]" : "text-white/70 hover:text-[#D4AF37]"
                        } transition-colors`}
                    >
                        Exit
                </Link>

                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-[4px] ${mutedText}`}>Theme</span>
                        <div
                            className={`flex rounded-full overflow-hidden border ${
                                isLight ? "border-black/10 bg-white/80" : "border-white/10 bg-black/30"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => setTheme("dark")}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[4px] transition-colors ${
                                    theme === "dark"
                                        ? "bg-[#D4AF37] text-black"
                                        : isLight
                                          ? "text-black/70 hover:text-black"
                                          : "text-white/70 hover:text-white"
                                }`}
                            >
                                Black
                            </button>
                            <button
                                type="button"
                                onClick={() => setTheme("light")}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[4px] transition-colors ${
                                    theme === "light"
                                        ? "bg-[#D4AF37] text-black"
                                        : isLight
                                          ? "text-black/70 hover:text-black"
                                          : "text-white/70 hover:text-white"
                                }`}
                            >
                                White
                    </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 md:px-10 pt-10 space-y-10">
                {/* Elite Vault Tier */}
                <section className={`${surfaceClass} rounded-[34px] p-8 md:p-10 shadow-[0_30px_120px_rgba(0,0,0,0.35)] relative overflow-hidden`}>
                    <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-2xl pointer-events-none" />
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[5px] ${subMutedText}`}>Account</p>
                            <h1 className={`text-3xl md:text-4xl font-serif font-bold ${isLight ? "text-black" : "text-white"}`}>
                                {name}
                            </h1>
                            <p className={`text-sm mt-2 ${mutedText}`}>
                                <span className="font-semibold">Email:</span> {email}
                            </p>
                        </div>
                        
                        <div className="min-w-[280px]">
                            <p className={`text-[10px] font-black uppercase tracking-[5px] ${subMutedText}`}>Elite Vault Tier</p>
                            <div className="mt-3 flex items-center justify-between gap-3">
                                <span className={`text-sm font-serif ${isLight ? "text-black" : "text-white"} flex items-center gap-2`}>
                                    {tier === "Gold" ? <Crown size={16} className="text-[#D4AF37]" /> : <ShieldCheck size={16} className="text-[#D4AF37]" />}
                                    {tier} Vault
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[4px] text-[#D4AF37]">
                                    ₹{spent.toLocaleString()}
                                </span>
                            </div>

                            <div className={`mt-3 h-2 rounded-full overflow-hidden ${isLight ? "bg-black/10" : "bg-white/10"}`}>
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
                <section className={`${surfaceClass} rounded-[34px] p-8 md:p-10`}>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className={`text-2xl md:text-3xl font-serif font-bold ${isLight ? "text-black" : "text-white"} flex items-center gap-2`}>
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
                                        className={`${isLight ? "bg-white" : "bg-black/30"} rounded-[26px] border ${
                                            isLight ? "border-black/10" : "border-white/10"
                                        } p-6 md:p-8`}
                                    >
                                        <div
                                            className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b ${
                                                isLight ? "border-black/10" : "border-white/10"
                                            }`}
                                        >
                                            <div>
                                                <p className={`text-[10px] font-black uppercase tracking-[5px] ${subMutedText}`}>
                                                    Acquisition #{orderId}
                                                </p>
                                                <p className={`mt-1 text-xl font-serif font-bold ${isLight ? "text-black" : "text-white"} flex items-center gap-2`}>
                                                    <Clock size={16} className="text-[#D4AF37]" />
                                                    ₹{Number.isFinite(total) ? total.toLocaleString() : "0"}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[4px] border ${
                                                    statusText === "CANCELLED"
                                                        ? "border-red-500/60 text-red-500 bg-red-500/10"
                                                        : "border-[#D4AF37]/60 text-[#D4AF37] bg-[#D4AF37]/10"
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
                                                            className={`rounded-[22px] p-5 border transition-colors ${
                                                                isLight
                                                                    ? "bg-white border-black/10 hover:border-[#D4AF37]/35"
                                                                    : "bg-white/5 border-white/10 hover:border-[#D4AF37]/35"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`w-full aspect-[4/3] rounded-[18px] overflow-hidden border ${
                                                                    isLight ? "border-black/10 bg-black/5" : "border-white/10 bg-black/30"
                                                                }`}
                                                            >
                                                                {img ? (
                                                                    <img src={img} alt={item?.name || "product"} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className={`w-full h-full flex items-center justify-center text-xs ${mutedText}`}>
                                                                        Awaiting image
                                                                    </div>
                                                            )}
                                                        </div>

                                                            <div className="mt-4">
                                                                <p className={`text-sm font-bold ${isLight ? "text-black" : "text-white"} line-clamp-1`}>
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
                                            <div
                                                className={`mt-6 rounded-[22px] p-6 border ${
                                                    isLight ? "border-black/10 bg-black/5" : "border-white/10 bg-white/5"
                                                }`}
                                            >
                                                <p className={`text-sm font-serif italic ${mutedText}`}>Awaiting item details for this order.</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                                    </div>
                    ) : (
                        <div className={`mt-8 rounded-[26px] p-10 border ${isLight ? "border-black/10 bg-black/5" : "border-white/10 bg-white/5"}`}>
                            <h3 className={`text-xl font-serif font-bold ${isLight ? "text-black" : "text-white"}`}>Awaiting your first acquisition</h3>
                            <p className={`mt-2 text-sm ${mutedText}`}>Your vault will populate instantly after your first successful order.</p>
                            <Link
                                href="/shop"
                                className="inline-block mt-6 px-10 py-4 bg-[#D4AF37] text-black text-[11px] font-black uppercase tracking-[5px] rounded-full hover:bg-white transition-colors border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(212,175,55,0.18)]"
                            >
                                Enter Shop
                            </Link>
                                </div>
                    )}
                </section>

                {/* Gifting Suite */}
                <section className={`${surfaceClass} rounded-[34px] p-8 md:p-10`}>
                    <h2 className={`text-2xl md:text-3xl font-serif font-bold ${isLight ? "text-black" : "text-white"}`}>Curated Gifting Suite</h2>
                    <p className={`mt-2 text-sm ${mutedText}`}>Bundle timepieces with a premium note for an elevated gifting experience.</p>
                    <div className="mt-8">
                        <CuratedGiftingSuite watches={giftingWatches} isLight={isLight} onToast={showToast} />
                                </div>
                </section>

                {/* Virtual Vault */}
                <section className={`${surfaceClass} rounded-[34px] p-8 md:p-10`}>
                    <h2 className={`text-2xl md:text-3xl font-serif font-bold ${isLight ? "text-black" : "text-white"}`}>Virtual Vault</h2>
                    <p className={`mt-2 text-sm ${mutedText}`}>Save pieces you admire — your vault remembers.</p>
                    <div className="mt-8">
                        <VirtualVault isLight={isLight} />
                                    </div>
                </section>

                <div className={`text-center text-[10px] font-black uppercase tracking-[5px] ${subMutedText} pb-2`}>
                    Essential Rush • Private Member Area
                </div>
            </main>
        </div>
    );
}
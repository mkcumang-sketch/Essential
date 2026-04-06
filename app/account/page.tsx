"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ShieldCheck, Crown, Package, Clock, LogOut, Wallet, Copy,
  Sparkles, ChevronRight, ShoppingBag, Search, X
} from "lucide-react";

// 🚨 FIX: DYNAMIC IMPORTS OUTSIDE COMPONENT
const CuratedGiftingSuite = dynamic(() => import("@/components/CuratedGiftingSuite"), { ssr: false });
const VirtualVault = dynamic(() => import("@/components/VirtualVault"), { ssr: false });

export default function PremiumAccountDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [dashData, setDashData] = useState<Record<string, unknown> | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  const [trackingId, setTrackingId] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [trackError, setTrackError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    setDashLoading(true);
    fetch(`/api/user/dashboard?t=${Date.now()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((json) => {
        setDashData(json?.data ?? null);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setDashData(null);
      })
      .finally(() => setDashLoading(false));
  }, [status]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(""), 2600);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Code copied to clipboard!");
    } catch {
      showToast("Failed to copy code");
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!trackingId.trim()) return;
      setIsTracking(true); 
      setTrackError(""); 
      setTrackedOrder(null);
      
      try {
          const res = await fetch('/api/track-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: trackingId.trim() })
          });
          const data = await res.json();
          if (data.success && data.order) {
              setTrackedOrder(data.order);
          } else {
              setTrackError("Order not found. Please check your Tracking ID.");
          }
      } catch {
          setTrackError("Failed to connect. Please try again.");
      } finally {
          setIsTracking(false);
      }
  };

  if (status === "loading") {
      return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      );
  }

  if (!session) {
    return null;
  }

  const su = session.user as any;
  const email = su?.email || "—";
  const name = su?.name || "Member";

  // 🚨 FIX: Explicitly setting numbers to avoid TypeScript issues
  const walletPoints = Number(dashData?.walletPoints ?? su?.walletPoints ?? 0);
  const totalEarned = Number(dashData?.totalEarned ?? 0);
  const spent = Number(dashData?.totalSpent ?? 0);
  const goal = 100000;
  
  const progress = Math.min(100, Math.max(0, (spent / goal) * 100)) || 0;
  const tier = (dashData?.tier as string) || (spent >= goal ? "Gold" : "Silver");
  const remaining = tier === "Gold" ? 0 : Math.max(0, goal - spent);
  
  const firstName = name.split(" ")[0] || "VIP";
  const fallbackRef = `REF-${firstName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}10`;
  const myReferralCode = (dashData?.myReferralCode as string) || fallbackRef;
  const loyaltyTier = (dashData?.loyaltyTier as string) || su?.loyaltyTier || "Silver Vault";

  const giftingWatches = useMemo(() => {
    const safeOrders = Array.isArray(dashData?.orders) ? dashData.orders : [];
    const rawItems = safeOrders.flatMap((o: any) => Array.isArray(o?.items) ? o.items : []);
    const seen = new Set<string>();
    return rawItems.map((it: any, idx: number) => ({
      id: String(it?._id || it?.id || it?.sku || it?.name || idx),
      name: (it?.name as string) || "Premium Timepiece",
      brand: (it?.brand as string) || "Essential",
      imageUrl: it?.imageUrl,
      image: it?.image,
      offerPrice: it?.offerPrice,
      price: it?.price,
    })).filter((w) => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    });
  }, [dashData]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black pb-24 selection:bg-black selection:text-white">
      
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 18, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed bottom-10 left-1/2 z-[1000] px-8 py-4 rounded-2xl backdrop-blur-xl shadow-2xl bg-white border border-gray-200 flex items-center gap-3"
          >
            <ShieldCheck className="text-green-600" size={20} />
            <p className="text-sm font-serif text-black font-bold">{toastMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between gap-4">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500 hover:text-black transition-colors flex items-center gap-2">
            <ChevronRight className="rotate-180 w-4 h-4" /> Essential Rush
          </Link>
          <div className="flex gap-4">
             <Link href="/shop" className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-[10px] font-black uppercase tracking-[0.25em] text-gray-600 hover:border-black hover:text-black hover:bg-white transition-all">
                <ShoppingBag size={14} /> Shop Now
             </Link>
             <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-black text-[10px] font-black uppercase tracking-[0.25em] text-white hover:bg-gray-800 transition-all">
                <LogOut size={14} /> Sign Out
             </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-10 md:pt-14 space-y-10">
        
        <section className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 overflow-hidden shadow-lg relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-3">Your account</p>
              <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-black font-bold">{name}</h1>
              <p className="mt-3 text-sm text-gray-500 font-serif italic">{email}</p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 shadow-sm">
                <Sparkles className="w-4 h-4 text-black" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">{dashLoading ? "..." : loyaltyTier}</span>
              </div>
            </div>

            <div className="w-full lg:max-w-sm bg-gray-50 p-6 rounded-3xl border border-gray-100 transition-opacity duration-300" style={{ opacity: dashLoading ? 0.6 : 1 }}>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500 mb-4">Loyalty progress</p>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-sm font-serif font-bold text-black flex items-center gap-2">
                  {tier === "Gold" ? <Crown size={18} className="text-[#D4AF37]" /> : <ShieldCheck size={18} className="text-gray-400" />} {tier} tier
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                  ₹{dashLoading ? "..." : spent.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden bg-gray-200 shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-black" />
              </div>
              <p className="mt-3 text-xs text-gray-500 font-serif italic">
                {tier === "Gold" ? "Gold unlocked — priority help enabled." : remaining > 0 ? `Spend ₹${remaining.toLocaleString("en-IN")} more for Gold.` : "Updating progress…"}
              </p>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6 transition-opacity duration-300" style={{ opacity: dashLoading ? 0.6 : 1 }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-gray-200 bg-white p-8 flex items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400">Wallet points</p>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-black mt-2 tabular-nums">{dashLoading ? "..." : walletPoints.toLocaleString("en-IN")}</h3>
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-wider bg-gray-50 inline-block px-3 py-1 rounded-md">Total earned · ₹{dashLoading ? "..." : totalEarned.toLocaleString("en-IN")}</p>
            </div>
            <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50"><Wallet className="text-black" size={32} /></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[2rem] border border-gray-200 bg-black p-8 relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400">Your Referral code</p>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <h3 className="text-2xl md:text-3xl font-mono font-bold tracking-[0.1em] text-white uppercase bg-white/10 px-4 py-2 rounded-xl">{dashLoading ? "..." : myReferralCode}</h3>
                <button type="button" onClick={() => copyToClipboard(String(myReferralCode))} disabled={dashLoading} className="p-3.5 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black transition-all disabled:opacity-40"><Copy size={20} /></button>
              </div>
              <p className="text-xs text-gray-400 mt-5 uppercase tracking-[0.15em] font-bold">Share this code — you earn when friends buy.</p>
            </div>
            <Crown className="absolute -right-6 -bottom-8 text-white/[0.05] rotate-12 pointer-events-none" size={160} />
          </motion.div>
        </div>

        {/* 🌟 REFERRAL & REWARDS HUB (ELITE TIER) 🌟 */}
        <section className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-bl-full -z-10"></div>
          <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-serif font-bold flex items-center gap-3 text-black mb-2">
                  <Sparkles size={24} className="text-[#D4AF37]" /> Referral & Rewards
              </h2>
              <p className="text-sm text-gray-500 font-serif italic mb-8">Share your elite status and earn credits for your next acquisition.</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Your Elite Code</p>
                      <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold font-mono tracking-tighter text-black">{dashLoading ? "..." : myReferralCode}</p>
                          <button 
                              onClick={() => copyToClipboard(String(myReferralCode))}
                              className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-black transition-all"
                          >
                              <Copy size={16} />
                          </button>
                      </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Vault Credits</p>
                      <p className="text-3xl font-bold font-serif text-[#D4AF37]">₹{dashLoading ? "..." : walletPoints.toLocaleString('en-IN')}</p>
                  </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                  <button className="flex-1 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl">
                      Invite a Collector
                  </button>
                  <Link href="/shop" className="flex-1 py-4 bg-white border border-gray-200 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-black transition-all text-center flex items-center justify-center">
                      Redeem Credits
                  </Link>
              </div>
          </div>
        </section>

        {/* 🌟 ORDER TRACKING 🌟 */}
        <section className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-serif font-bold flex items-center gap-3 text-black mb-2">
              <Package size={24} className="text-black" /> Track Your Order
          </h2>
          <p className="text-sm text-gray-500 font-serif italic mb-8">Enter the Order ID you received during checkout to see real-time updates.</p>
          
          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                      type="text" 
                      value={trackingId} 
                      onChange={(e) => setTrackingId(e.target.value)} 
                      placeholder="e.g. ORD-17385..." 
                      className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl text-sm outline-none focus:border-black font-mono uppercase transition-colors" 
                      required 
                  />
              </div>
              <button 
                  type="submit" 
                  disabled={isTracking || !trackingId.trim()} 
                  className="px-8 py-4 bg-black text-white font-black uppercase text-[10px] tracking-[2px] rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 shrink-0"
              >
                  {isTracking ? 'Searching...' : 'Track Order'}
              </button>
          </form>

          {trackError && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold flex items-center gap-2">
                  <X size={16}/> {trackError}
              </motion.div>
          )}

          {trackedOrder && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mt-8 border-t border-gray-100 pt-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Status</p>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm inline-block ${trackedOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                              {trackedOrder.status || "PROCESSING"}
                          </span>
                      </div>
                      <div className="md:text-right">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Total Value</p>
                          <p className="text-xl font-serif font-bold text-black flex items-center md:justify-end gap-1">₹{Number(trackedOrder.totalAmount || 0).toLocaleString('en-IN')}</p>
                      </div>
                  </div>

                  <h3 className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">Order Items</h3>
                  <div className="space-y-4">
                      {(trackedOrder.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-4 items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm cursor-pointer hover:border-black transition-colors" onClick={() => router.push(`/product/${item.id || item._id}`)}>
                              <div className="w-16 h-16 bg-gray-50 rounded-xl p-2 shrink-0 border border-gray-100">
                                  <img src={item.imageUrl || item.image || '/placeholder-watch.png'} className="w-full h-full object-contain mix-blend-multiply" alt={item.name} />
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-black line-clamp-1">{item.name}</p>
                                  <p className="text-xs text-gray-500 font-mono mt-1">Qty: {item.qty || 1} · ₹{Number(item.offerPrice || item.price || 0).toLocaleString('en-IN')}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </motion.div>
          )}
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm transition-opacity duration-300" style={{ opacity: dashLoading ? 0.6 : 1 }}>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-black border-b border-gray-100 pb-4">Curated Gifting Suite</h2>
          <p className="mt-4 text-sm text-gray-500 font-serif italic">Pair watches with a gift note for someone special.</p>
          <div className="mt-8"><CuratedGiftingSuite watches={dashLoading ? [] : giftingWatches} isLight={true} onToast={showToast} /></div>
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm transition-opacity duration-300" style={{ opacity: dashLoading ? 0.6 : 1 }}>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-black border-b border-gray-100 pb-4">Virtual Vault</h2>
          <p className="mt-4 text-sm text-gray-500 font-serif italic">Watches you save show up here.</p>
          <div className="mt-8"><VirtualVault isLight={true} /></div>
        </section>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 pb-8">
          Essential Rush · Your Premium Account
        </p>
      </main>
    </div>
  );
}
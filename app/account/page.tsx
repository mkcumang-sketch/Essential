"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ShieldCheck,
  Crown,
  Package,
  Clock,
  LogOut,
  Wallet,
  Copy,
  Sparkles,
  ChevronRight,
  ShoppingBag
} from "lucide-react";

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black">
      <div className="h-20 border-b border-gray-200 bg-white animate-pulse" />
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 space-y-8">
        <div className="h-48 rounded-[2rem] bg-gray-100 border border-gray-200 animate-pulse" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-40 rounded-[2rem] bg-gray-100 border border-gray-200 animate-pulse" />
          <div className="h-40 rounded-[2rem] bg-gray-100 border border-gray-200 animate-pulse" />
        </div>
        <div className="h-72 rounded-[2rem] bg-gray-100 border border-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

export default function PremiumAccountDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashData, setDashData] = useState<Record<string, unknown> | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

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

  const CuratedGiftingSuite = useMemo(
    () => dynamic(() => import("@/components/CuratedGiftingSuite"), { ssr: false }),
    []
  );

  const VirtualVault = useMemo(
    () => dynamic(() => import("@/components/VirtualVault"), { ssr: false }),
    []
  );

  const giftingWatches = useMemo(() => {
    const safeOrders: unknown[] = Array.isArray(dashData?.orders)
      ? (dashData.orders as unknown[])
      : [];
    const rawItems: unknown[] = safeOrders.flatMap((o) =>
      Array.isArray((o as { items?: unknown[] })?.items)
        ? ((o as { items: unknown[] }).items as unknown[])
        : []
    );
    const seen = new Set<string>();
    const normalized = rawItems.map((item: unknown, idx: number) => {
      const it = item as Record<string, unknown>;
      const id = String(it?._id || it?.id || it?.sku || it?.name || idx);
      return {
        id,
        name: (it?.name as string) || "Premium Timepiece",
        brand: (it?.brand as string) || "Essential",
        imageUrl: it?.imageUrl as string | undefined,
        image: it?.image as string | undefined,
        offerPrice: it?.offerPrice as number | undefined,
        price: it?.price as number | undefined,
      };
    });
    return normalized.filter((w) => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    });
  }, [dashData]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(""), 2600);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Referral code copied to clipboard!");
    } catch {
      showToast("Failed to copy code");
    }
  };

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (!session) {
    return null;
  }

  const su = session.user as {
    email?: string | null;
    name?: string | null;
    walletPoints?: number;
    loyaltyTier?: string;
  };

  const email = su?.email || "—";
  const name = su?.name || "Member";

  const walletPoints = Number(dashData?.walletPoints) || Number(su?.walletPoints) || 0;
  const totalEarned = Number(dashData?.totalEarned) || 0;
  
  // 🚨 SMART REFERRAL LOGIC
  const firstName = name.split(" ")[0] || "VIP";
  // Safe handling incase name is empty or unexpected characters exist
  const fallbackRef = `REF-${firstName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}10`;
  const myReferralCode = dashLoading ? "GENERATING…" : ((dashData?.myReferralCode as string) || fallbackRef);

  const loyaltyFromSession = su?.loyaltyTier || "";
  const loyaltyTier = (dashData?.loyaltyTier as string) || loyaltyFromSession || "Silver Vault";

  const spent = Number(dashData?.totalSpent) || 0;
  const goal = 100000; // Define total spend goal for Gold
  const progress = Math.min(100, Math.max(0, (spent / goal) * 100)) || 0;
  const tier = (dashData?.tier as string) || (spent >= goal ? "Gold" : "Silver");
  const remaining = tier === "Gold" ? 0 : Math.max(0, goal - spent);

  const orders = Array.isArray(dashData?.orders)
    ? (dashData.orders as Record<string, unknown>[])
    : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black pb-24 selection:bg-black selection:text-white">
      
      <AnimatePresence>
        {toastMsg ? (
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
        ) : null}
      </AnimatePresence>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500 hover:text-black transition-colors flex items-center gap-2"
          >
            <ChevronRight className="rotate-180 w-4 h-4" />
            Essential Rush
          </Link>
          <div className="flex gap-4">
             <Link href="/shop" className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-[10px] font-black uppercase tracking-[0.25em] text-gray-600 hover:border-black hover:text-black hover:bg-white transition-all">
                <ShoppingBag size={14} /> Shop Now
             </Link>
             <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-black text-[10px] font-black uppercase tracking-[0.25em] text-white hover:bg-gray-800 transition-all"
             >
                <LogOut size={14} />
                Sign Out
             </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-10 md:pt-14 space-y-10">
        
        {/* WELCOME SECTION */}
        <section className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 overflow-hidden shadow-lg relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none"></div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-3">
                Your account
              </p>
              <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-black font-bold">
                {name}
              </h1>
              <p className="mt-3 text-sm text-gray-500 font-serif italic">{email}</p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 shadow-sm">
                <Sparkles className="w-4 h-4 text-black" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  {loyaltyTier}
                </span>
              </div>
            </div>

            <div className="w-full lg:max-w-sm bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500 mb-4">
                Loyalty progress
              </p>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-sm font-serif font-bold text-black flex items-center gap-2">
                  {tier === "Gold" ? (
                    <Crown size={18} className="text-[#D4AF37]" />
                  ) : (
                    <ShieldCheck size={18} className="text-gray-400" />
                  )}
                  {tier} tier
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                  ₹{spent.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden bg-gray-200 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full bg-black"
                />
              </div>
              <p className="mt-3 text-xs text-gray-500 font-serif italic">
                {tier === "Gold"
                  ? "Gold unlocked — you get priority help."
                    : remaining > 0
                    ? `Spend ₹${remaining.toLocaleString("en-IN")} more to reach Gold.`
                    : "Updating your progress…"}
              </p>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-gray-200 bg-white p-8 flex items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400">
                Wallet points
              </p>
              {dashLoading ? (
                <div className="mt-3 h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
              ) : (
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-black mt-2 tabular-nums">
                  {walletPoints.toLocaleString("en-IN")}
                </h3>
              )}
              <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-wider bg-gray-50 inline-block px-3 py-1 rounded-md">
                Total earned · ₹{totalEarned.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50">
              <Wallet className="text-black" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[2rem] border border-gray-200 bg-black p-8 relative overflow-hidden shadow-lg"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400">
                Your Referral code
              </p>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <h3 className="text-2xl md:text-3xl font-mono font-bold tracking-[0.1em] text-white uppercase bg-white/10 px-4 py-2 rounded-xl">
                  {myReferralCode}
                </h3>
                <button
                  type="button"
                  onClick={() => copyToClipboard(String(myReferralCode))}
                  disabled={dashLoading || myReferralCode === "GENERATING…"}
                  className="p-3.5 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black transition-all disabled:opacity-40"
                >
                  <Copy size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-5 uppercase tracking-[0.15em] font-bold">
                Share this code — you earn when friends buy.
              </p>
            </div>
            <Crown
              className="absolute -right-6 -bottom-8 text-white/[0.05] rotate-12 pointer-events-none"
              size={160}
            />
          </motion.div>
        </div>

        {/* ORDER HISTORY SECTION */}
        <section className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
            <h2 className="text-2xl md:text-3xl font-serif font-bold flex items-center gap-3 text-black">
              <Package size={24} className="text-gray-400" />
              Order history
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-400 bg-gray-50 px-4 py-2 rounded-lg">
              {dashLoading ? "…" : `${orders.length} orders`}
            </p>
          </div>

          {dashLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-3xl bg-gray-50 border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : orders.length ? (
            <div className="space-y-8">
              {orders.map((order) => {
                const rawId = order._id;
                const orderId = (order.orderId as string) || (rawId != null ? String(rawId).slice(-8).toUpperCase() : "") || "—";
                const statusText = String(order?.status || "PROCESSING");
                const total = Number(order?.totalAmount ?? 0);
                const items = Array.isArray(order?.items) ? (order.items as Record<string, unknown>[]) : [];

                return (
                  <div
                    key={String(order._id || orderId)}
                    className="rounded-[2rem] border border-gray-200 bg-gray-50 p-6 md:p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-gray-200">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-gray-500">
                          Order #{orderId}
                        </p>
                        <p className="mt-2 text-2xl font-serif font-bold text-black flex items-center gap-2">
                          <Clock size={18} className="text-gray-400" />
                          ₹{Number.isFinite(total) ? total.toLocaleString("en-IN") : "0"}
                        </p>
                      </div>
                      <span
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] w-fit shadow-sm ${
                          statusText === "CANCELLED"
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                      >
                        {statusText}
                      </span>
                    </div>

                    {items.length ? (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item, idx) => {
                          const img = (item.imageUrl || item.image) as string | undefined;
                          const price = Number(item.offerPrice ?? item.price ?? 0);
                          
                          return (
                            <div
                              key={String(item._id || item.id || `${orderId}-${idx}`)}
                              className="rounded-2xl p-5 border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => router.push(`/product/${item.id || item._id}`)}
                            >
                              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 bg-gray-50 p-4">
                                {img ? (
                                  <img
                                    src={img}
                                    alt={(item.name as string) || "product"}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold uppercase">
                                    No image
                                  </div>
                                )}
                              </div>
                              <p className="mt-4 text-sm font-bold text-black line-clamp-1">
                                {(item.name as string) || "Timepiece"}
                              </p>
                              <p className="mt-2 text-xs font-black text-gray-500 uppercase tracking-wider bg-gray-50 inline-block px-2 py-1 rounded">
                                Qty: {Number(item.qty) || 1} · ₹{Number.isFinite(price) ? price.toLocaleString("en-IN") : "0"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-6 text-sm text-gray-500 font-serif italic">
                        Item details pending for this order.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border-2 border-dashed border-gray-200 p-16 text-center bg-gray-50">
              <Package size={48} className="mx-auto text-gray-300 mb-6" />
              <h3 className="text-3xl font-serif font-bold text-black">
                Your vault is empty
              </h3>
              <p className="mt-4 text-base text-gray-500 font-serif italic max-w-md mx-auto">
                After you buy something, your orders and progress show up here.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 mt-8 px-10 py-4 rounded-full bg-black text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-800 hover:shadow-lg transition-all"
              >
                Browse shop <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-black border-b border-gray-100 pb-4">
            Curated Gifting Suite
          </h2>
          <p className="mt-4 text-sm text-gray-500 font-serif italic">
            Pair watches with a gift note for someone special.
          </p>
          <div className="mt-8">
            <CuratedGiftingSuite
              watches={giftingWatches}
              isLight={true}
              onToast={showToast}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-black border-b border-gray-100 pb-4">
            Virtual Vault
          </h2>
          <p className="mt-4 text-sm text-gray-500 font-serif italic">
            Watches you save show up here.
          </p>
          <div className="mt-8">
            <VirtualVault isLight={true} />
          </div>
        </section>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 pb-8">
          Essential Rush · Your Premium Account
        </p>
      </main>
    </div>
  );
}
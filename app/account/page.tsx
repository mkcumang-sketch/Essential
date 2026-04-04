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
} from "lucide-react";

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="h-16 border-b border-white/10 bg-black/40 animate-pulse" />
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 space-y-8">
        <div className="h-48 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-40 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
          <div className="h-40 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
        </div>
        <div className="h-72 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
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
      .catch(() => setDashData(null))
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

  const walletPoints =
    Number(dashData?.walletPoints) ||
    Number(su?.walletPoints) ||
    0;
  const totalEarned = Number(dashData?.totalEarned) || 0;
  const myReferralCode =
    (dashData?.myReferralCode as string) || "GENERATING…";
  const loyaltyFromSession = su?.loyaltyTier || "";
  const loyaltyTier =
    (dashData?.loyaltyTier as string) || loyaltyFromSession || "Silver Vault";

  const spent = Number(dashData?.totalSpent) || 0;
  const goal = 100000;
  const progress = Math.min(100, Math.max(0, (spent / goal) * 100)) || 0;
  const tier = dashData?.tier === "Gold" ? "Gold" : "Silver";
  const remaining = tier === "Gold" ? 0 : Math.max(0, goal - spent);

  const orders = Array.isArray(dashData?.orders)
    ? (dashData.orders as Record<string, unknown>[])
    : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24 selection:bg-[#D4AF37]/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08),transparent_50%)]" />

      <AnimatePresence>
        {toastMsg ? (
          <motion.div
            initial={{ opacity: 0, y: 18, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 z-[1000] px-6 py-4 rounded-2xl backdrop-blur-xl shadow-2xl bg-black/90 border border-[#D4AF37]/30"
          >
            <p className="text-sm font-serif text-[#D4AF37]">{toastMsg}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-[10px] font-black uppercase tracking-[0.35em] text-white/50 hover:text-[#D4AF37] transition-colors flex items-center gap-2"
          >
            <ChevronRight className="rotate-180 w-4 h-4" />
            Essential Rush
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-[10px] font-black uppercase tracking-[0.25em] text-white/80 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-10 md:pt-14 space-y-10">
        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-8 md:p-10 overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.06)]">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]/80 mb-3">
                Your account
              </p>
              <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white">
                {name}
              </h1>
              <p className="mt-3 text-sm text-white/45">{email}</p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                  {loyaltyTier}
                </span>
              </div>
            </div>

            <div className="w-full lg:max-w-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40 mb-3">
                Loyalty progress
              </p>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-sm font-serif text-white flex items-center gap-2">
                  {tier === "Gold" ? (
                    <Crown size={18} className="text-[#D4AF37]" />
                  ) : (
                    <ShieldCheck size={18} className="text-[#D4AF37]" />
                  )}
                  {tier} tier
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                  ₹{spent.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#f5e6a8]"
                />
              </div>
              <p className="mt-3 text-xs text-white/45">
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
            className="rounded-[2rem] border border-white/10 bg-black/40 p-8 flex items-center justify-between gap-6"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40">
                Wallet points
              </p>
              {dashLoading ? (
                <div className="mt-3 h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
              ) : (
                <h3 className="text-3xl md:text-4xl font-serif text-white mt-2 tabular-nums">
                  {walletPoints.toLocaleString("en-IN")}
                </h3>
              )}
              <p className="text-[10px] text-[#D4AF37]/80 font-bold mt-2 uppercase tracking-wider">
                Total earned · ₹{totalEarned.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
              <Wallet className="text-[#D4AF37]" size={32} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[2rem] border border-[#D4AF37]/25 bg-gradient-to-br from-[#D4AF37]/15 to-black/60 p-8 relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#D4AF37]">
                Referral code
              </p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <h3 className="text-xl md:text-2xl font-mono tracking-[0.2em] text-white uppercase">
                  {dashLoading ? "······" : myReferralCode}
                </h3>
                <button
                  type="button"
                  onClick={() => copyToClipboard(String(myReferralCode))}
                  disabled={dashLoading || myReferralCode === "GENERATING…"}
                  className="p-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-40"
                >
                  <Copy size={16} />
                </button>
              </div>
              <p className="text-[10px] text-white/40 mt-4 uppercase tracking-[0.2em] leading-relaxed">
                Share your code — you earn when friends buy.
              </p>
            </div>
            <Crown
              className="absolute -right-6 -bottom-8 text-white/[0.04] rotate-12 pointer-events-none"
              size={140}
            />
          </motion.div>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-black/30 p-8 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-serif flex items-center gap-3 text-white">
              <Package size={22} className="text-[#D4AF37]" />
              Order history
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/35">
              {dashLoading ? "…" : `${orders.length} orders`}
            </p>
          </div>

          {dashLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : orders.length ? (
            <div className="space-y-8">
              {orders.map((order) => {
                const rawId = order._id;
                const orderId =
                  (order.orderId as string) ||
                  (rawId != null ? String(rawId).slice(-8) : "") ||
                  "—";
                const statusText = String(order?.status || "PROCESSING");
                const total = Number(order?.totalAmount ?? 0);
                const items = Array.isArray(order?.items)
                  ? (order.items as Record<string, unknown>[])
                  : [];

                return (
                  <div
                    key={String(order._id || orderId)}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-white/10">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/35">
                          Order #{orderId}
                        </p>
                        <p className="mt-2 text-xl font-serif text-white flex items-center gap-2">
                          <Clock size={16} className="text-[#D4AF37]" />₹
                          {Number.isFinite(total)
                            ? total.toLocaleString("en-IN")
                            : "0"}
                        </p>
                      </div>
                      <span
                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border w-fit ${
                          statusText === "CANCELLED"
                            ? "border-red-500/40 text-red-300 bg-red-500/10"
                            : "border-[#D4AF37]/35 text-[#D4AF37] bg-[#D4AF37]/10"
                        }`}
                      >
                        {statusText}
                      </span>
                    </div>

                    {items.length ? (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item, idx) => {
                          const img = (item.imageUrl || item.image) as
                            | string
                            | undefined;
                          const price = Number(
                            item.offerPrice ?? item.price ?? 0
                          );
                          return (
                            <div
                              key={String(item._id || item.id || `${orderId}-${idx}`)}
                              className="rounded-2xl p-5 border border-white/10 bg-black/40 hover:border-[#D4AF37]/30 transition-colors"
                            >
                              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-white/5">
                                {img ? (
                                  <img
                                    src={img}
                                    alt={(item.name as string) || "product"}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-white/35">
                                    No image
                                  </div>
                                )}
                              </div>
                              <p className="mt-4 text-sm text-white line-clamp-1">
                                {(item.name as string) || "Timepiece"}
                              </p>
                              <p className="mt-1 text-xs text-white/40">
                                Qty: {Number(item.qty) || 1} · ₹
                                {Number.isFinite(price)
                                  ? price.toLocaleString("en-IN")
                                  : "0"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-6 text-sm text-white/45 font-serif italic">
                        Item details pending for this order.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center bg-white/[0.02]">
              <h3 className="text-xl font-serif text-white">
                Your vault is ready
              </h3>
              <p className="mt-2 text-sm text-white/45 max-w-md mx-auto">
                After you buy something, your orders and progress show up here.
              </p>
              <Link
                href="/shop"
                className="inline-block mt-8 px-10 py-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-[0.35em] hover:bg-[#e8c85c] transition-colors"
              >
                Browse shop
              </Link>
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-black/25 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-serif text-white">
            Curated gifting suite
          </h2>
          <p className="mt-2 text-sm text-white/45">
            Pair watches with a gift note for someone special.
          </p>
          <div className="mt-8">
            <CuratedGiftingSuite
              watches={giftingWatches}
              isLight={false}
              onToast={showToast}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-black/25 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-serif text-white">
            Virtual vault
          </h2>
          <p className="mt-2 text-sm text-white/45">
            Watches you save show up here.
          </p>
          <div className="mt-8">
            <VirtualVault isLight={false} />
          </div>
        </section>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/25 pb-4">
          Essential Rush · Your account
        </p>
      </main>
    </div>
  );
}

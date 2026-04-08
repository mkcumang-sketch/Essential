"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LogOut, History, Sparkles, User, MapPin, Wallet, Heart, Percent, Lock, HelpCircle, Copy, RefreshCw, Plus, Trash2 } from "lucide-react";

const VirtualVault = dynamic(() => import("@/components/VirtualVault"), { ssr: false });

type TabType = "overview" | "profile" | "orders" | "addresses" | "wallet" | "wishlist" | "offers" | "security" | "support";

export default function AccountClient({ initialData, session }: { initialData: any; session: any }) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isPending, startTransition] = useTransition();

  const su = session.user as any;
  const name = su?.name || "Member";
  const email = su?.email || "";
  const walletPoints = Number(initialData?.walletPoints ?? 0);
  const loyaltyTier = initialData?.loyaltyTier || "Silver Vault";
  const orders = Array.isArray(initialData?.orders) ? initialData.orders : [];
  const lastThreeOrders = orders.slice(0, 3);

  const [profile, setProfile] = useState({ name, email, phone: "", dob: "" });
  const [profileErrors, setProfileErrors] = useState<any>({});
  const [profileSaving, setProfileSaving] = useState(false);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [addrForm, setAddrForm] = useState({ line1: "", city: "", state: "", zip: "", isDefault: false });

  const [wishlist, setWishlist] = useState<any[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadAddresses = async () => {
      try {
        const r = await fetch("/api/user/addresses", { cache: "no-store" });
        const j = await r.json();
        if (!mounted) return;
        if (j?.success && Array.isArray(j.data)) setAddresses(j.data);
      } finally {
        if (mounted) setAddrLoading(false);
      }
    };
    const loadWishlist = async () => {
      try {
        const r = await fetch("/api/user/wishlist", { cache: "no-store" });
        const j = await r.json();
        if (!mounted) return;
        if (j?.success && Array.isArray(j.items)) setWishlist(j.items);
      } finally {
        if (mounted) setWishlistLoading(false);
      }
    };
    loadAddresses();
    loadWishlist();
    return () => {
      mounted = false;
    };
  }, []);

  const validateProfile = () => {
    const errs: any = {};
    if (!profile.name || profile.name.length < 2) errs.name = "Enter a valid name";
    if (!profile.email || !/^[^@]+@[^@]+\.[^@]+$/.test(profile.email)) errs.email = "Enter a valid email";
    if (profile.phone && profile.phone.replace(/\D/g, "").length < 10) errs.phone = "Enter a valid phone";
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveProfile = () => {
    if (!validateProfile()) return;
    setProfileSaving(true);
    setTimeout(() => {
      setProfileSaving(false);
    }, 1200);
  };

  const addAddress = () => {
    startTransition(async () => {
      const optimistic = { ...addrForm, _id: Math.random().toString(36).slice(2), createdAt: new Date().toISOString() };
      setAddresses((a) => [optimistic, ...a]);
      try {
        await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addrForm),
        });
      } catch {
        setAddresses((a) => a.filter((x) => x._id !== optimistic._id));
      } finally {
        setAddrForm({ line1: "", city: "", state: "", zip: "", isDefault: false });
      }
    });
  };

  const removeAddress = (id: string) => {
    startTransition(async () => {
      const prev = addresses;
      setAddresses((a) => a.filter((x) => x._id !== id));
      try {
        await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
      } catch {
        setAddresses(prev);
      }
    });
  };

  const setDefaultAddress = (id: string) => {
    startTransition(async () => {
      const next = addresses.map((a) => ({ ...a, isDefault: a._id === id }));
      setAddresses(next);
      try {
        await fetch(`/api/user/addresses/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isDefault: true }) });
      } catch {}
    });
  };

  const moveToCart = (item: any) => {
    const current = JSON.parse(localStorage.getItem("luxury_cart") || "[]");
    const exists = current.find((x: any) => x._id === item._id);
    const next = exists ? current.map((x: any) => (x._id === item._id ? { ...x, qty: (x.qty || 1) + 1 } : x)) : [...current, { ...item, qty: 1 }];
    localStorage.setItem("luxury_cart", JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-gray-100 h-20 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-[#D4AF37] rounded-xl flex items-center justify-center font-black">♞</div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em]">Essential Rush</p>
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-3 bg-gray-50 text-gray-400 hover:bg-black hover:text-white rounded-xl transition-all">
          <LogOut size={18} />
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="hidden lg:block lg:col-span-3 space-y-2 sticky top-24 self-start">
          {[
            { key: "overview", label: "Overview", icon: Sparkles },
            { key: "profile", label: "Profile", icon: User },
            { key: "orders", label: "Orders", icon: History },
            { key: "addresses", label: "Addresses", icon: MapPin },
            { key: "wallet", label: "Wallet", icon: Wallet },
            { key: "wishlist", label: "Wishlist", icon: Heart },
            { key: "offers", label: "Offers", icon: Percent },
            { key: "security", label: "Security", icon: Lock },
            { key: "support", label: "Support", icon: HelpCircle },
          ].map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key as TabType)} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t.key ? "bg-black text-[#D4AF37]" : "text-gray-500 hover:bg-gray-50"}`}>
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tier</p>
                    <h3 className="text-3xl font-serif italic font-black">{loyaltyTier}</h3>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Wallet</p>
                    <h3 className="text-3xl font-serif italic font-black">₹{walletPoints.toLocaleString()}</h3>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Orders</p>
                    <h3 className="text-3xl font-serif italic font-black">{orders.length}</h3>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-serif font-black tracking-tight">Recent Orders</h4>
                    <button onClick={() => setActiveTab("orders")} className="text-[10px] font-black uppercase tracking-widest border-b border-black">View All</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {lastThreeOrders.map((o: any) => (
                      <div key={o._id} className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{o.orderId}</p>
                        <p className="font-serif font-black">{o.items?.[0]?.name || "Order"}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest mt-2">{o.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</label>
                      <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={`w-full mt-2 p-4 border rounded-xl outline-none ${profileErrors.name ? "border-red-300" : "border-gray-200"}`} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
                      <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={`w-full mt-2 p-4 border rounded-xl outline-none ${profileErrors.email ? "border-red-300" : "border-gray-200"}`} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</label>
                      <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={`w-full mt-2 p-4 border rounded-xl outline-none ${profileErrors.phone ? "border-red-300" : "border-gray-200"}`} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">DOB</label>
                      <input type="date" value={profile.dob} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} className="w-full mt-2 p-4 border rounded-xl outline-none border-gray-200" />
                    </div>
                  </div>
                  <button onClick={saveProfile} disabled={profileSaving} className="mt-6 px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                    {profileSaving ? <RefreshCw size={16} className="animate-spin" /> : null}
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {orders.map((order: any) => (
                  <div key={order._id} className="p-8 bg-white rounded-[2rem] border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{order.orderId}</p>
                      <p className="font-serif font-black">{order.items?.[0]?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full">{order.status}</span>
                      <button className="px-4 py-2 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest">Track</button>
                      <button className="px-4 py-2 rounded-xl border border-gray-200 text-[10px] font-black uppercase tracking-widest">Invoice</button>
                      <button className="px-4 py-2 rounded-xl bg-gray-100 text-[10px] font-black uppercase tracking-widest">Reorder</button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div key="addresses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input placeholder="Address Line" value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} className="p-4 border rounded-xl outline-none border-gray-200" />
                    <input placeholder="City" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="p-4 border rounded-xl outline-none border-gray-200" />
                    <input placeholder="State" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="p-4 border rounded-xl outline-none border-gray-200" />
                    <input placeholder="Pincode" value={addrForm.zip} onChange={(e) => setAddrForm({ ...addrForm, zip: e.target.value })} className="p-4 border rounded-xl outline-none border-gray-200" />
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })} />
                      Set as default
                    </label>
                    <button onClick={addAddress} disabled={isPending} className="px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                      {isPending ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                      Add
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addrLoading
                    ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse" />)
                    : addresses.map((a) => (
                        <div key={a._id} className="p-6 rounded-2xl border border-gray-100 bg-white flex items-center justify-between">
                          <div>
                            <p className="font-serif font-black">{a.line1 || a.address || "Address"}</p>
                            <p className="text-sm text-gray-500">{[a.city, a.state, a.zip].filter(Boolean).join(", ")}</p>
                            {a.isDefault ? <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Default</span> : null}
                          </div>
                          <div className="flex items-center gap-2">
                            {!a.isDefault && (
                              <button onClick={() => setDefaultAddress(a._id)} disabled={isPending} className="px-4 py-2 rounded-xl bg-gray-100 text-[10px] font-black uppercase tracking-widest">
                                Default
                              </button>
                            )}
                            <button onClick={() => removeAddress(a._id)} disabled={isPending} className="h-10 w-10 rounded-xl border border-gray-200 hover:bg-black hover:text-[#D4AF37] transition-colors flex items-center justify-center disabled:opacity-50">
                              {isPending ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                          </div>
                        </div>
                      ))}
                </div>
              </motion.div>
            )}

            {activeTab === "wallet" && (
              <motion.div key="wallet" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Balance</p>
                  <h3 className="text-4xl font-serif font-black italic tracking-tighter">₹{walletPoints.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
                  <p className="text-sm text-gray-500">No transactions yet.</p>
                </div>
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div key="wishlist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistLoading
                    ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse" />)
                    : wishlist.map((w: any) => (
                        <div key={w._id} className="p-6 rounded-2xl border border-gray-100 bg-white flex flex-col gap-4">
                          <div className="aspect-[4/3] bg-gray-50 rounded-xl flex items-center justify-center">
                            <img src={w.imageUrl || w.images?.[0]} className="max-h-full" alt="" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-serif font-black">{w.name || w.title}</p>
                              <p className="text-sm text-gray-500">₹{Number(w.offerPrice || w.price).toLocaleString()}</p>
                            </div>
                            <button onClick={() => moveToCart(w)} className="px-4 py-2 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest">Move to Cart</button>
                          </div>
                        </div>
                      ))}
                </div>
              </motion.div>
            )}

            {activeTab === "offers" && (
              <motion.div key="offers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["WELCOME10", "VAULT2500", "FREESHIP"].map((code) => (
                    <div key={code} className="p-6 rounded-2xl border border-gray-100 bg-white flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Promo</p>
                        <p className="text-xl font-serif font-black">{code}</p>
                      </div>
                      <button onClick={() => navigator.clipboard.writeText(code)} className="px-4 py-2 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Copy size={14} />
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="password" placeholder="Current Password" className="p-4 border rounded-xl outline-none border-gray-200" />
                    <input type="password" placeholder="New Password" className="p-4 border rounded-xl outline-none border-gray-200" />
                    <input type="password" placeholder="Confirm New Password" className="p-4 border rounded-xl outline-none border-gray-200" />
                  </div>
                  <button className="mt-6 px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Update Password</button>
                </div>
              </motion.div>
            )}

            {activeTab === "support" && (
              <motion.div key="support" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
                  <div className="space-y-3">
                    {[
                      { q: "When will my order arrive?", a: "Delivery typically takes 3-7 business days." },
                      { q: "How do I return an item?", a: "Contact support to initiate a return." },
                      { q: "Do you offer warranty?", a: "All timepieces include a standard warranty." },
                    ].map((f, i) => (
                      <details key={i} className="group border border-gray-100 rounded-xl p-4">
                        <summary className="cursor-pointer font-black text-sm">{f.q}</summary>
                        <p className="text-sm text-gray-600 mt-2">{f.a}</p>
                      </details>
                    ))}
                  </div>
                  <a href="https://wa.me/918700000000" target="_blank" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                    Contact Luxury Concierge
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 grid grid-cols-5 gap-2 md:hidden">
        {[
          { key: "overview", icon: Sparkles },
          { key: "orders", icon: History },
          { key: "wallet", icon: Wallet },
          { key: "wishlist", icon: Heart },
          { key: "profile", icon: User },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key as TabType)} className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-widest ${activeTab === t.key ? "text-black" : "text-gray-400"}`}>
            <t.icon size={18} />
            {t.key}
          </button>
        ))}
      </nav>
    </div>
  );
}

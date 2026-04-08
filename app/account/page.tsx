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
  LogOut, 
  Wallet, 
  Copy,
  Sparkles, 
  ChevronRight, 
  ShoppingBag, 
  Search, 
  X,
  LayoutDashboard,
  History,
  Award,
  MessageSquare,
  ExternalLink,
  Download,
  CreditCard,
  Gift
} from "lucide-react";

const CuratedGiftingSuite = dynamic(() => import("@/components/CuratedGiftingSuite"), { ssr: false });
const VirtualVault = dynamic(() => import("@/components/VirtualVault"), { ssr: false });

type TabType = 'overview' | 'orders' | 'certificates' | 'rewards' | 'concierge';

export default function PremiumAccountDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [dashData, setDashData] = useState<Record<string, any> | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);

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
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#D4AF37] rounded-full animate-spin"></div>
        </div>
      );
  }

  if (!session) return null;

  const su = session.user as any;
  const name = su?.name || "Member";
  const email = su?.email || "—";
  const walletPoints = Number(dashData?.walletPoints ?? su?.walletPoints ?? 0);
  const totalSpent = Number(dashData?.totalSpent ?? 0);
  const loyaltyTier = (dashData?.loyaltyTier as string) || su?.loyaltyTier || "Silver Vault";
  const myReferralCode = (dashData?.myReferralCode as string) || "VAULT-VIP";

  const orders = Array.isArray(dashData?.orders) ? dashData.orders : [];

  const giftingWatches = useMemo(() => {
    const rawItems = orders.flatMap((o: any) => Array.isArray(o?.items) ? o.items : []);
    const seen = new Set<string>();
    return rawItems.map((it: any, idx: number) => ({
      id: String(it?._id || it?.id || it?.sku || it?.name || idx),
      name: (it?.name as string) || "Premium Timepiece",
      brand: (it?.brand as string) || "Essential",
      imageUrl: it?.imageUrl || it?.image,
      price: it?.offerPrice || it?.price,
    })).filter((w) => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    });
  }, [dashData]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-black selection:bg-[#D4AF37] selection:text-black font-sans">
      
      <AnimatePresence>
        {selectedOrderDetails && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
             <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
                <button onClick={() => setSelectedOrderDetails(null)} className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-400 hover:text-black rounded-xl transition-all"><X size={20}/></button>
                <div className="p-12">
                   <h3 className="text-3xl font-serif font-black italic tracking-tighter mb-2">Order Details</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-10">{selectedOrderDetails.orderId}</p>
                   
                   <div className="grid grid-cols-2 gap-10 mb-10 pb-10 border-b border-gray-100">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-4">Shipping Protocol</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                           <p className="font-bold text-black">{selectedOrderDetails.shippingData?.name || selectedOrderDetails.customer?.name}</p>
                           <p>{selectedOrderDetails.shippingData?.phone || selectedOrderDetails.customer?.phone}</p>
                           <p>{selectedOrderDetails.shippingData?.email || selectedOrderDetails.customer?.email}</p>
                           <p className="mt-2">{selectedOrderDetails.shippingData?.address}</p>
                           <p>{selectedOrderDetails.shippingData?.city}, {selectedOrderDetails.shippingData?.pincode}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-4">Financial Status</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                           <p className="flex justify-between"><span>Amount</span> <span className="font-bold text-black">₹{selectedOrderDetails.totalAmount.toLocaleString()}</span></p>
                           <p className="flex justify-between"><span>Method</span> <span className="font-bold text-black uppercase">{selectedOrderDetails.paymentMethod || 'Razorpay'}</span></p>
                           <p className="flex justify-between"><span>Status</span> <span className="px-3 py-1 bg-black text-[#D4AF37] rounded-full text-[9px] font-black uppercase tracking-widest">{selectedOrderDetails.status}</span></p>
                        </div>
                      </div>
                   </div>

                   <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-6">Acquired Assets</h4>
                   <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                      {selectedOrderDetails.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-lg p-2 border border-gray-100 flex items-center justify-center">
                                 <img src={item.imageUrl || item.image} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-black">{item.name}</p>
                                 <p className="text-[9px] text-gray-400 uppercase font-black">QTY: {item.qty || item.quantity || 1}</p>
                              </div>
                           </div>
                           <p className="text-sm font-bold text-black font-mono">₹{((item.offerPrice || item.price) * (item.qty || item.quantity || 1)).toLocaleString()}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}

        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[9999] px-8 py-4 rounded-2xl bg-black text-[#D4AF37] border border-[#D4AF37]/20 shadow-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest"
          >
            <ShieldCheck size={18} /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LUXURY TOP NAV */}
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black text-[#D4AF37] rounded-xl flex items-center justify-center font-black transition-transform group-hover:scale-110">♞</div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Essential Rush</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest italic">The Client Vault</p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
              <ShoppingBag size={14} /> Acquisition
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-3 bg-gray-50 text-gray-400 hover:bg-black hover:text-white rounded-xl transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* MOBILE TAB NAVIGATION (Horizontal Scroll) */}
        <div className="lg:hidden mb-12 -mx-6 px-6 overflow-x-auto no-scrollbar flex gap-4 border-b border-gray-100 pb-4">
          <MobileTab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
          <MobileTab active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Orders" />
          <MobileTab active={activeTab === 'certificates'} onClick={() => setActiveTab('certificates')} label="Certificates" />
          <MobileTab active={activeTab === 'rewards'} onClick={() => setActiveTab('rewards')} label="Rewards" />
          <MobileTab active={activeTab === 'concierge'} onClick={() => setActiveTab('concierge')} label="Concierge" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR TABS (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] mx-auto mb-4 flex items-center justify-center border border-gray-100 relative overflow-hidden">
                  <span className="text-3xl font-serif font-black italic">{name.charAt(0)}</span>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-black text-[#D4AF37] flex items-center justify-center rounded-tl-lg">
                    <ShieldCheck size={12} />
                  </div>
                </div>
                <h2 className="text-xl font-serif font-black italic tracking-tighter">{name}</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{loyaltyTier}</p>
              </div>

              <nav className="space-y-2">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18}/>} label="Overview" />
                <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<History size={18}/>} label="My Timepieces" />
                <TabButton active={activeTab === 'certificates'} onClick={() => setActiveTab('certificates')} icon={<Award size={18}/>} label="Certificates" />
                <TabButton active={activeTab === 'rewards'} onClick={() => setActiveTab('rewards')} icon={<Sparkles size={18}/>} label="Rewards" />
                <TabButton active={activeTab === 'concierge'} onClick={() => setActiveTab('concierge')} icon={<MessageSquare size={18}/>} label="Concierge" />
              </nav>
            </div>

            <div className="bg-black text-[#D4AF37] rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors" />
              <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-60">Vault Credit</p>
              <h3 className="text-3xl font-serif font-black italic tracking-tighter mb-6">₹{walletPoints.toLocaleString('en-IN')}</h3>
              <Link href="/shop" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[4px] border-b border-[#D4AF37] pb-1 hover:gap-4 transition-all">
                Acquire <ChevronRight size={12}/>
              </Link>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 text-gray-50"><CreditCard size={120} /></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tier Status</p>
                      <h3 className="text-4xl font-serif font-black italic tracking-tighter mb-4">{loyaltyTier}</h3>
                      <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden mt-8">
                        <div className="h-full bg-black rounded-full" style={{width: '65%'}} />
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 mt-4 uppercase tracking-widest">₹{(100000 - totalSpent).toLocaleString()} to next tier upgrade</p>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Referral Code</p>
                      <h3 className="text-3xl font-mono font-black tracking-tighter mb-8 uppercase">{myReferralCode}</h3>
                      <button 
                        onClick={() => copyToClipboard(myReferralCode)}
                        className="flex items-center gap-3 px-6 py-3 bg-black text-[#D4AF37] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg"
                      >
                        Copy Access Code <Copy size={14}/>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-serif font-black italic tracking-tighter mb-8">Virtual Vault</h3>
                    <VirtualVault isLight={true} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-8">
                  <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-serif font-black italic tracking-tighter mb-8 flex items-center gap-4">
                      <History className="text-[#D4AF37]" /> Acquisition History
                    </h3>
                    
                    {orders.length > 0 ? (
                      <div className="space-y-6">
                        {orders.map((order: any) => (
                          <div key={order._id} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-black transition-all">
                            <div className="flex items-center gap-6">
                              <div className="w-20 h-20 bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-center shrink-0">
                                <img src={order.items?.[0]?.imageUrl || order.items?.[0]?.image} className="w-full h-full object-contain mix-blend-multiply" alt="Watch" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{order.orderId}</p>
                                <h4 className="text-lg font-serif font-black italic tracking-tighter">{order.items?.[0]?.name}</h4>
                                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">{order.status}</span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setSelectedOrderDetails(order)} className="p-4 bg-white rounded-2xl hover:bg-black hover:text-[#D4AF37] transition-all shadow-sm">
                                  <ExternalLink size={18} />
                                </button>
                                <button onClick={() => {setTrackingId(order.orderId); handleTrackOrder({preventDefault:()=>null} as any);}} className="p-4 bg-white rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm">
                                  <Search size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                        <p className="text-gray-400 font-serif italic text-lg">No timepieces acquired yet.</p>
                        <Link href="/shop" className="inline-block mt-6 px-10 py-4 bg-black text-[#D4AF37] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl">Start Acquisition</Link>
                      </div>
                    )}
                  </div>

                  {/* TRACKING TOOL */}
                  <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-serif font-black italic tracking-tighter mb-4">Track Real-Time</h3>
                    <p className="text-sm text-gray-400 mb-8">Enter your Order ID to verify the logistics status of your asset.</p>
                    <form onSubmit={handleTrackOrder} className="flex gap-4">
                      <input 
                        type="text" 
                        value={trackingId} 
                        onChange={(e)=>setTrackingId(e.target.value)}
                        placeholder="ORD-XXXX-XXXX"
                        className="flex-1 bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none focus:border-black font-mono text-sm transition-all"
                      />
                      <button type="submit" disabled={isTracking} className="px-10 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg disabled:opacity-50">
                        {isTracking ? "Locating..." : "Track"}
                      </button>
                    </form>
                    {trackedOrder && (
                      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="mt-10 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                         <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Status</span>
                            <span className="px-4 py-1.5 bg-black text-[#D4AF37] rounded-full text-[10px] font-black uppercase tracking-widest">{trackedOrder.status}</span>
                         </div>
                         <div className="space-y-4">
                            {trackedOrder.items.map((it:any, i:number)=>(
                              <div key={i} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg p-2 border border-gray-100">
                                  <img src={it.imageUrl || it.image} className="w-full h-full object-contain" alt="" />
                                </div>
                                <p className="text-sm font-bold">{it.name}</p>
                              </div>
                            ))}
                         </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'certificates' && (
                <motion.div key="certificates" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-8">
                  <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-serif font-black italic tracking-tighter mb-8 flex items-center gap-4">
                      <Award className="text-[#D4AF37]" /> Authenticity Certificates
                    </h3>
                    
                    {orders.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {orders.map((order: any) => (
                          <div key={order._id} className="p-8 border border-gray-100 rounded-[2.5rem] bg-gray-50 hover:border-[#D4AF37] transition-all group">
                             <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 bg-white text-[#D4AF37] rounded-xl flex items-center justify-center shadow-sm">
                                  <ShieldCheck size={24} />
                                </div>
                                <button className="p-3 bg-white text-black hover:bg-black hover:text-[#D4AF37] rounded-xl transition-all shadow-sm">
                                  <Download size={18} />
                                </button>
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{order.orderId}</p>
                             <h4 className="text-xl font-serif font-black italic tracking-tighter mb-4 line-clamp-1">{order.items?.[0]?.name}</h4>
                             <p className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[5px] border-t border-gray-200 pt-4 group-hover:tracking-[8px] transition-all">Verified Masterpiece</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center">
                        <p className="text-gray-400 font-serif italic text-lg">Acquire a timepiece to receive digital authenticity proof.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'rewards' && (
                <motion.div key="rewards" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-8">
                  <div className="bg-black text-[#D4AF37] p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                    <Crown className="absolute -right-10 -bottom-10 text-white/5 rotate-12" size={300} />
                    <div className="relative z-10">
                      <h3 className="text-4xl md:text-6xl font-serif font-black italic tracking-tighter mb-8">Refer & Acquire.</h3>
                      <p className="max-w-md text-[#D4AF37]/60 text-sm leading-relaxed mb-10">
                        Invite fellow collectors to the Essential Rush vault. When they make their first acquisition, you earn ₹2,500 in vault credits.
                      </p>
                      
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 flex-1">
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Your Invite Code</p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-mono font-black text-white">{myReferralCode}</span>
                            <button onClick={()=>copyToClipboard(myReferralCode)} className="p-3 bg-white text-black rounded-xl hover:bg-[#D4AF37] transition-all">
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 flex-1">
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Total Referrals</p>
                          <span className="text-3xl font-serif font-black italic text-white">0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h3 className="text-2xl font-serif font-black italic tracking-tighter mb-8 flex items-center gap-4">
                      <Gift className="text-[#D4AF37]" /> Curated Gifting Suite
                    </h3>
                    <CuratedGiftingSuite watches={dashLoading ? [] : giftingWatches} isLight={true} onToast={showToast} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'concierge' && (
                <motion.div key="concierge" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-8">
                  <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm text-center py-20">
                    <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center shadow-sm">
                      <MessageSquare size={40} />
                    </div>
                    <h3 className="text-4xl font-serif font-black italic tracking-tighter mb-4">Vault Concierge</h3>
                    <p className="max-w-md mx-auto text-gray-400 text-sm leading-relaxed mb-12">
                      Need assistance with an acquisition, tracking, or a technical inquiry? Our elite concierge team is available 24/7 via WhatsApp.
                    </p>
                    <a 
                      href="https://wa.me/918700000000" 
                      target="_blank" 
                      className="inline-flex items-center gap-3 px-12 py-6 bg-black text-white rounded-[2rem] font-black uppercase tracking-[5px] text-xs hover:bg-[#25D366] transition-all shadow-2xl group"
                    >
                      Connect to Concierge <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-[10px] font-black uppercase tracking-[8px] text-gray-300">Essential Rush · Pure Horology Vault</p>
      </footer>
    </div>
  );
}

function MobileTab({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`shrink-0 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
        active ? 'bg-black text-[#D4AF37]' : 'text-gray-400 border border-gray-100'
      }`}
    >
      {label}
    </button>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
        active 
          ? 'bg-black text-[#D4AF37] shadow-xl translate-x-2' 
          : 'text-gray-400 hover:bg-gray-50 hover:text-black'
      }`}
    >
      <div className={`${active ? 'text-[#D4AF37]' : 'text-gray-300'} transition-colors`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      {active && <ChevronRight size={14} className="ml-auto" />}
    </button>
  );
}

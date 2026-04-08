"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LogOut, ChevronRight, CreditCard, History, Award, Sparkles, MessageSquare } from "lucide-react";

const VirtualVault = dynamic(() => import("@/components/VirtualVault"), { ssr: false });

type TabType = 'overview' | 'orders' | 'certificates' | 'rewards' | 'concierge';

export default function AccountClient({ initialData, session }: { initialData: any, session: any }) {
      const [activeTab, setActiveTab] = useState<TabType>('overview');
      const su = session.user as any;
      const name = su?.name || "Member";
      const walletPoints = Number(initialData?.walletPoints ?? 0);
      const loyaltyTier = initialData?.loyaltyTier || "Silver Vault";
      const orders = initialData?.orders || [];

      return (
            <div className="min-h-screen bg-[#F9FAFB] text-black font-sans">
                  <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-gray-100 h-20 px-6 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-black text-[#D4AF37] rounded-xl flex items-center justify-center font-black">♞</div>
                              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Essential Rush</p>
                        </Link>
                        <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-3 bg-gray-50 text-gray-400 hover:bg-black hover:text-white rounded-xl transition-all">
                              <LogOut size={18} />
                        </button>
                  </header>

                  <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <aside className="hidden lg:block lg:col-span-3 space-y-2">
                              {['overview', 'orders', 'certificates', 'rewards', 'concierge'].map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab as TabType)} className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-black text-[#D4AF37]' : 'text-gray-400 hover:bg-gray-50'}`}>
                                          {tab}
                                    </button>
                              ))}
                        </aside>

                        <main className="lg:col-span-9">
                              <AnimatePresence mode="wait">
                                    {activeTab === 'overview' && (
                                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Vault Credit</p>
                                                      <h3 className="text-4xl font-serif font-black italic tracking-tighter">₹{walletPoints.toLocaleString()}</h3>
                                                </div>
                                                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                                                      <h3 className="text-2xl font-serif font-black italic tracking-tighter mb-8">Virtual Vault</h3>
                                                      <VirtualVault isLight={true} />
                                                </div>
                                          </motion.div>
                                    )}
                                    {activeTab === 'orders' && (
                                          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                                {orders.map((order: any) => (
                                                      <div key={order._id} className="p-8 bg-white rounded-[2.5rem] border border-gray-100 flex justify-between items-center">
                                                            <div>
                                                                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{order.orderId}</p>
                                                                  <h4 className="font-serif font-black italic">{order.items?.[0]?.name}</h4>
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full">{order.status}</span>
                                                      </div>
                                                ))}
                                          </motion.div>
                                    )}
                              </AnimatePresence>
                        </main>
                  </div>
            </div>
      );
}
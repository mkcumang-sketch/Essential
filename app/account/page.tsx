"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  Package, Wallet, Gift, LayoutDashboard, LogOut, ArrowLeft, ExternalLink, 
  Copy, CheckCircle, ShieldCheck, MapPin, Shield // 🌟 SHIELD ADD KAR DIYA YAHAN
} from 'lucide-react';
import Link from 'next/link';

export default function VIPClientDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/user/dashboard?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setUserData(data.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [session]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🌟 LUXURY LOADING STATE 🌟
  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return <div className="h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // 🌟 LOGIN PROMPT IF NOT LOGGED IN 🌟
  if (status === "unauthenticated") {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37] blur-[150px] opacity-10 rounded-full pointer-events-none"></div>
         <ShieldCheck size={60} className="text-[#D4AF37] mb-8" />
         <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-4 tracking-tighter">Client Protocol</h1>
         <p className="text-gray-400 text-sm md:text-base mb-10 max-w-md font-serif italic">Authenticate to access your private vault, track global shipments, and manage your empire wallet.</p>
         <button onClick={() => signIn("google")} className="px-10 py-5 bg-[#D4AF37] text-black font-black uppercase tracking-[5px] text-[10px] rounded-full shadow-[0_10px_40px_rgba(212,175,55,0.3)] hover:bg-white transition-all">
            Authenticate via Google
         </button>
         <Link href="/" className="mt-10 text-[10px] text-gray-500 uppercase tracking-widest hover:text-white transition-colors border-b border-gray-800 pb-1">Return to Base</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black flex flex-col md:flex-row">
      
      {/* 🌟 SIDEBAR 🌟 */}
      <aside className="w-full md:w-[320px] bg-[#0A0A0A] border-r border-white/5 flex flex-col shrink-0">
         <div className="p-8 border-b border-white/5">
            <Link href="/" className="flex items-center gap-3 text-[9px] text-gray-500 font-black uppercase tracking-widest hover:text-[#D4AF37] transition-colors mb-10 w-max"><ArrowLeft size={14}/> Exit Vault</Link>
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gray-800 to-black border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] text-xl font-serif mb-4 overflow-hidden">
               {session?.user?.image ? <img src={session.user.image} className="w-full h-full object-cover" /> : session?.user?.name?.charAt(0) || 'V'}
            </div>
            <h2 className="text-xl font-serif italic text-white truncate">{session?.user?.name}</h2>
            <p className="text-[10px] text-gray-500 font-mono mt-1 truncate">{session?.user?.email}</p>
         </div>
         <nav className="flex-1 p-6 space-y-2">
            {[
              { id: 'OVERVIEW', icon: LayoutDashboard, label: 'Vault Overview' },
              { id: 'ORDERS', icon: Package, label: 'Requisitions (Orders)' },
              { id: 'WALLET', icon: Wallet, label: 'Empire Wallet' },
              { id: 'REFERRAL', icon: Gift, label: 'Invite Protocol' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                 <tab.icon size={16} /> {tab.label}
              </button>
            ))}
         </nav>
         <div className="p-6 border-t border-white/5">
            <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest"><LogOut size={14}/> Disconnect</button>
         </div>
      </aside>

      {/* 🌟 MAIN CONTENT 🌟 */}
      <main className="flex-1 p-6 md:p-16 overflow-y-auto custom-scrollbar relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37] blur-[150px] opacity-[0.03] rounded-full pointer-events-none"></div>

         <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'OVERVIEW' && (
               <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key="overview" className="space-y-10 relative z-10">
                  <h3 className="text-4xl font-serif italic text-white mb-8">Welcome to your <span className="text-[#D4AF37]">Private Vault.</span></h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                     {/* Wallet Card */}
                     <div className="bg-gradient-to-br from-[#111] to-black border border-[#D4AF37]/30 p-8 rounded-[30px] flex flex-col justify-between shadow-xl cursor-pointer hover:border-[#D4AF37] transition-all" onClick={()=>setActiveTab('WALLET')}>
                        <div className="flex justify-between items-start mb-6">
                           <div className="p-3 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37]"><Wallet size={20}/></div>
                           <span className="text-[9px] uppercase font-black tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full">Active</span>
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Available Balance</p>
                           <h2 className="text-4xl font-serif text-white font-black">₹{userData?.walletBalance?.toLocaleString('en-IN') || 0}</h2>
                        </div>
                     </div>

                     {/* Orders Card */}
                     <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[30px] flex flex-col justify-between cursor-pointer hover:border-white/20 transition-all" onClick={()=>setActiveTab('ORDERS')}>
                        <div className="flex justify-between items-start mb-6">
                           <div className="p-3 bg-white/5 rounded-xl text-gray-400"><Package size={20}/></div>
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Total Requisitions</p>
                           <h2 className="text-4xl font-serif text-white font-black">{userData?.orders?.length || 0} Assets</h2>
                        </div>
                     </div>

                     {/* Referral Card */}
                     <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[30px] flex flex-col justify-between cursor-pointer hover:border-white/20 transition-all" onClick={()=>setActiveTab('REFERRAL')}>
                        <div className="flex justify-between items-start mb-6">
                           <div className="p-3 bg-white/5 rounded-xl text-gray-400"><Gift size={20}/></div>
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Network Invites</p>
                           <h2 className="text-4xl font-serif text-white font-black">{userData?.referralStats?.sales || 0} Conversions</h2>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'ORDERS' && (
               <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key="orders" className="space-y-8 relative z-10">
                  <div className="border-b border-white/10 pb-6 mb-6">
                     <h3 className="text-3xl font-serif italic text-white">Your Requisitions</h3>
                     <p className="text-[10px] uppercase font-black text-gray-500 tracking-[3px] mt-2">Track your global luxury shipments</p>
                  </div>

                  <div className="space-y-6">
                     {!userData?.orders || userData.orders.length === 0 ? (
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-[30px] p-16 text-center">
                           <Package size={40} className="mx-auto text-gray-600 mb-4 opacity-50"/>
                           <p className="font-serif italic text-xl text-gray-500">Your vault is currently empty.</p>
                           <Link href="/#vault" className="inline-block mt-6 px-8 py-3 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#D4AF37] hover:text-black transition-all">Acquire Assets</Link>
                        </div>
                     ) : userData.orders.map((order:any, i:number) => (
                        <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[30px] flex flex-col lg:flex-row justify-between gap-6 hover:border-[#D4AF37]/30 transition-colors group">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-black rounded-2xl border border-white/10 flex items-center justify-center font-mono text-xs font-black text-gray-400 group-hover:text-[#D4AF37] transition-colors">
                                 #{order.orderId?.slice(-4) || 'ORD'}
                              </div>
                              <div>
                                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                 <h4 className="text-xl font-serif text-white">{order.items?.length || 1} Asset(s) Secured</h4>
                                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-2 flex items-center gap-2"><MapPin size={12}/> Dispatch to: {order.customer?.city || 'Registered Vault'}</p>
                              </div>
                           </div>
                           <div className="flex items-center justify-between lg:justify-end gap-10">
                              <div className="text-left lg:text-right">
                                 <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Valuation</p>
                                 <p className="text-2xl font-serif font-black text-white">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2 w-32">
                                 <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : order.status === 'TRANSIT' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20'}`}>
                                    {order.status || 'PROCESSING'}
                                 </span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}

            {/* WALLET TAB */}
            {activeTab === 'WALLET' && (
               <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key="wallet" className="space-y-8 relative z-10">
                  <div className="border-b border-white/10 pb-6 mb-6">
                     <h3 className="text-3xl font-serif italic text-white">Empire Wallet</h3>
                     <p className="text-[10px] uppercase font-black text-gray-500 tracking-[3px] mt-2">Manage your liquidity and cashbacks</p>
                  </div>

                  <div className="bg-gradient-to-tr from-[#1A1A1A] to-black border border-[#D4AF37]/50 rounded-[40px] p-10 md:p-16 relative overflow-hidden shadow-[0_20px_60px_rgba(212,175,55,0.1)] flex flex-col md:flex-row justify-between items-center gap-10">
                     <Shield size={250} className="absolute -left-10 -bottom-10 text-[#D4AF37] opacity-5 pointer-events-none"/>
                     <div className="relative z-10 text-center md:text-left">
                        <p className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[5px] mb-2">Available Liquidity</p>
                        <h2 className="text-6xl md:text-8xl font-serif font-black text-white tracking-tighter">₹{userData?.walletBalance?.toLocaleString('en-IN') || 0}</h2>
                        <p className="text-sm font-serif italic text-gray-400 mt-4 max-w-sm">Funds can be automatically applied to your next asset acquisition during checkout.</p>
                     </div>
                     <div className="relative z-10 w-full md:w-auto">
                        <Link href="/#vault" className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-[#D4AF37] text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white transition-colors">
                           Spend Balance <ExternalLink size={14}/>
                        </Link>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* REFERRAL TAB */}
            {activeTab === 'REFERRAL' && (
               <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key="referral" className="space-y-8 relative z-10">
                  <div className="border-b border-white/10 pb-6 mb-6">
                     <h3 className="text-3xl font-serif italic text-white">Invite Protocol</h3>
                     <p className="text-[10px] uppercase font-black text-gray-500 tracking-[3px] mt-2">Share your network code & earn wallet funds</p>
                  </div>

                  <div className="bg-[#0A0A0A] border border-white/10 rounded-[40px] p-10 md:p-16 text-center">
                     <h4 className="text-2xl font-serif italic text-white mb-4">Your Unique VIP Code</h4>
                     <p className="text-sm text-gray-400 mb-10 max-w-lg mx-auto">Share this tracking link with your network. When they acquire an asset, you receive a 5% commission directly into your Empire Wallet.</p>
                     
                     <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
                        <div className="w-full bg-black border border-white/20 p-5 rounded-2xl font-mono text-[#D4AF37] text-sm truncate">
                           https://yourwebsite.com/?ref={userData?.referralCode || 'VIP'}
                        </div>
                        <button onClick={()=>copyToClipboard(`https://yourwebsite.com/?ref=${userData?.referralCode || 'VIP'}`)} className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-8 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#D4AF37] transition-colors">
                           {copied ? <CheckCircle size={16}/> : <Copy size={16}/>} {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                     </div>

                     <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto mt-12 border-t border-white/10 pt-12">
                        <div>
                           <p className="text-[10px] font-black uppercase text-gray-500 tracking-[3px] mb-2">Total Link Clicks</p>
                           <p className="text-4xl font-serif text-white">{userData?.referralStats?.clicks || 0}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase text-green-500 tracking-[3px] mb-2">Successful Invites</p>
                           <p className="text-4xl font-serif text-white">{userData?.referralStats?.sales || 0}</p>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

         </AnimatePresence>
      </main>
    </div>
  );
}
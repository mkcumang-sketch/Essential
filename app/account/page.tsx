"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Heart, Wallet, ShieldCheck, 
  LogOut, ArrowLeft, ChevronRight, Gift, Clock 
} from 'lucide-react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  if (status === "loading") return <div className="h-screen flex items-center justify-center font-black tracking-widest text-[10px] uppercase">Authenticating...</div>;
  if (!session) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#050505] font-sans pb-20">
      
      {/* ♞ NAV ♞ */}
      <nav className="py-6 px-8 md:px-16 flex items-center justify-between bg-white border-b border-gray-100">
        <button onClick={() => router.push('/catalogue')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[4px] text-gray-400 hover:text-black transition-colors"><ArrowLeft size={16}/> Store</button>
        <div className="text-2xl text-[#050505]">♞</div>
        <button onClick={() => signOut()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[4px] text-red-500 hover:text-red-700 transition-colors">Logout <LogOut size={14}/></button>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 md:px-16 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* LEFT SIDEBAR */}
         <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm text-center">
               <img src={session.user?.image || ""} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[#D4AF37] p-1"/>
               <h2 className="text-xl font-serif italic font-black mb-1">{session.user?.name}</h2>
               <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 mb-4">{session.user?.email}</p>
               <div className="inline-flex items-center gap-2 bg-[#FAFAFA] border border-[#D4AF37]/30 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">
                 <ShieldCheck size={12}/> Elite Member
               </div>
            </div>

            <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden p-4 space-y-2">
               {[
                 { id: 'overview', icon: User, label: 'Portfolio Overview' },
                 { id: 'orders', icon: Package, label: 'Order History' },
                 { id: 'wallet', icon: Wallet, label: 'Imperial Wallet & Rewards' },
                 { id: 'wishlist', icon: Heart, label: 'Saved Assets' }
               ].map((tab) => (
                 <button 
                   key={tab.id} 
                   onClick={() => setActiveTab(tab.id)}
                   className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#050505] text-white' : 'text-gray-500 hover:bg-[#FAFAFA] hover:text-black'}`}
                 >
                   <tab.icon size={16}/> {tab.label}
                 </button>
               ))}
            </div>
         </aside>

         {/* RIGHT CONTENT AREA */}
         <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
               
               {/* OVERVIEW TAB */}
               {activeTab === 'overview' && (
                 <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-8">
                    <h1 className="text-4xl font-serif italic mb-8">Welcome back, {session.user?.name?.split(' ')[0]}.</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-[#050505] text-white p-8 rounded-[30px] shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={100}/></div>
                          <p className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 mb-2">Wallet Balance</p>
                          <h3 className="text-4xl font-black mb-6">₹0.00</h3>
                          <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all">Add Funds</button>
                       </div>

                       <div className="bg-white border border-gray-200 p-8 rounded-[30px] shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-5 text-[#D4AF37]"><Gift size={100}/></div>
                          <p className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 mb-2">Reward Points</p>
                          <h3 className="text-4xl font-black mb-6 text-[#D4AF37]">2,450 <span className="text-sm text-gray-400 font-serif italic">pts</span></h3>
                          <p className="text-xs text-gray-500 font-medium">Equals ₹245 discount on your next requisition.</p>
                       </div>
                    </div>

                    <div className="bg-white border border-gray-100 p-8 rounded-[30px] shadow-sm">
                       <h3 className="font-serif italic text-xl mb-6 flex items-center gap-3"><Clock size={18} className="text-[#D4AF37]"/> Recent Activity</h3>
                       <div className="text-center py-12 text-gray-400">
                          <Package size={32} className="mx-auto mb-4 opacity-50"/>
                          <p className="text-[10px] font-black uppercase tracking-widest">No recent requisitions found.</p>
                       </div>
                    </div>
                 </motion.div>
               )}

               {/* ORDERS TAB */}
               {activeTab === 'orders' && (
                 <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
                    <h2 className="text-3xl font-serif italic mb-8">Your Requisitions</h2>
                    <div className="bg-white border border-gray-100 rounded-[30px] p-12 text-center shadow-sm">
                       <p className="text-gray-500 font-serif italic mb-4">You haven't secured any assets yet.</p>
                       <Link href="/catalogue" className="inline-block bg-[#050505] text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[4px] hover:bg-[#D4AF37] hover:text-black transition-colors">Explore Vault</Link>
                    </div>
                 </motion.div>
               )}

               {/* WISHLIST TAB */}
               {activeTab === 'wishlist' && (
                 <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
                    <h2 className="text-3xl font-serif italic mb-8">Saved Assets</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {/* Placeholder for Wishlist Items */}
                       <div className="bg-white border border-gray-100 border-dashed rounded-[30px] p-12 text-center flex flex-col items-center justify-center">
                          <Heart size={32} className="text-gray-300 mb-4"/>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No items saved.</p>
                       </div>
                    </div>
                 </motion.div>
               )}

            </AnimatePresence>
         </div>
      </main>
    </div>
  );
}
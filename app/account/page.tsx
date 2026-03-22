"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, CheckCircle, ShieldCheck, LogOut, TrendingUp, 
    Activity, Clock, Hexagon, Star, ChevronRight, MessageSquare 
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function AdvancedConciergeProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('PORTFOLIO'); 

    // 🌟 LIVE DATA STATES (Replaces Dummy Data)
    const [portfolioData, setPortfolioData] = useState<any[]>([]);
    const [vaultAssets, setVaultAssets] = useState<any[]>([]);
    const [waitlistData, setWaitlistData] = useState<any[]>([]);
    const [totalValue, setTotalValue] = useState(0);

    // 🛡️ SECURITY INTERCEPTOR & DATA FETCHER
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/login?callbackUrl=/account');
        } else if (status === "authenticated" && session?.user) {
            
            // 🚀 FETCH REAL PORTFOLIO DATA
            const fetchPortfolio = async () => {
                try {
                    const email = session.user?.email || '';
                    const phone = (session.user as any)?.phone || '';
                    const res = await fetch(`/api/portfolio?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`);
                    const json = await res.json();
                    
                    if (json.success) {
                        setPortfolioData(json.data.portfolioData);
                        setVaultAssets(json.data.vaultAssets);
                        setWaitlistData(json.data.waitlistData);
                        setTotalValue(json.data.totalValue);
                    }
                } catch (err) {
                    console.error("Failed to load vault", err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchPortfolio();
        }
    }, [status, session, router]);

    if (status === "loading" || isLoading) {
        return (
            <div className="h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin mb-6"></div>
                <p className="text-[10px] font-medium uppercase tracking-[3px] text-gray-500">Decrypting Secure Vault...</p>
            </div>
        );
    }

    if (status === "unauthenticated") return null;

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 selection:bg-gray-200 selection:text-black pb-32 font-sans">
            
            {/* 🌟 ULTRA-MINIMAL HEADER */}
            <header className="w-full bg-white/80 backdrop-blur-2xl border-b border-gray-200 py-6 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[2px] text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={14}/> Storefront
                </Link>
                <h1 className="text-xl font-serif tracking-[4px] uppercase absolute left-1/2 -translate-x-1/2 text-gray-900">Essential</h1>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-gray-400 hover:text-red-500 transition-colors">
                    Disconnect <LogOut size={14}/>
                </button>
            </header>

            <main className="max-w-[1400px] mx-auto pt-16 px-6 md:px-12">
                
                {/* 👑 CLIENT IDENTITY IDENTITY */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-12 mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={10}/> Tier 1 Client</span>
                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Encrypted</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mb-2 leading-tight">Welcome, {session?.user?.name?.split(' ')[0] || 'Sir'}.</h2>
                        <p className="text-gray-500 font-serif text-lg">Your private horological portfolio and concierge terminal.</p>
                    </div>
                    
                    <div className="text-left md:text-right bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full md:w-auto">
                        <p className="text-[10px] font-medium uppercase tracking-[2px] text-gray-400 mb-2">Total Estimated Asset Value</p>
                        <h3 className="text-4xl font-serif text-gray-900 flex items-center md:justify-end gap-3">
                            ₹{totalValue.toLocaleString('en-IN')} <TrendingUp size={24} className="text-green-500"/>
                        </h3>
                    </div>
                </div>

                {/* 🎛️ DASHBOARD NAVIGATION */}
                <div className="flex gap-8 mb-10 overflow-x-auto custom-scrollbar border-b border-gray-100 pb-2">
                    {['PORTFOLIO', 'CONCIERGE', 'LEDGER'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-[11px] font-bold uppercase tracking-[2px] whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                            {tab}
                            {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* =========================================
                                 TAB 1: PORTFOLIO
                    ========================================== */}
                    {activeTab === 'PORTFOLIO' && (
                        <motion.div key="PORTFOLIO" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Analytics Graph */}
                            <div className="lg:col-span-2 bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                                <div className="flex justify-between items-center mb-8">
                                    <h4 className="text-2xl font-serif text-gray-900">Performance Analytics</h4>
                                    <span className="text-[10px] uppercase font-medium tracking-widest text-green-500 bg-green-50 px-4 py-1.5 rounded-full">+18.4% YTD</span>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={portfolioData}>
                                            <XAxis dataKey="month" stroke="#e5e7eb" tick={{fill: '#9ca3af', fontSize: 12, fontFamily: 'monospace'}} tickLine={false} axisLine={false} />
                                            <YAxis hide domain={['dataMin - 500000', 'dataMax + 500000']} />
                                            {/* 🔥 FIX: Changed value type to 'any' to satisfy Recharts Strict Typing */}
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontFamily: 'serif' }} formatter={(value: any) => `₹${Number(value).toLocaleString()}`} labelStyle={{display: 'none'}} />
                                            <Line type="monotone" dataKey="value" stroke="#111827" strokeWidth={3} dot={{ fill: '#111827', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Priority Waitlist */}
                            <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col">
                                <h4 className="text-2xl font-serif text-gray-900 mb-2">Priority Access</h4>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-8">Your Waitlist Positions</p>
                                
                                <div className="flex-1">
                                    {waitlistData.length > 0 ? waitlistData.map((item, i) => (
                                        <div key={i} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-serif text-gray-900">{item.name}</p>
                                                    <p className="text-xs font-mono text-gray-500 mt-1">Ref: {item.ref}</p>
                                                </div>
                                                <Star size={18} className="text-gray-900 fill-gray-900"/>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Global Position: <span className="text-gray-900 font-bold">#{item.position}</span></p>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">ETA: {item.est}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-10 text-gray-400 text-sm">No active waitlist positions.</div>
                                    )}
                                </div>
                                <button className="w-full mt-6 py-4 bg-transparent border border-gray-200 text-gray-900 font-medium uppercase tracking-[2px] rounded-full text-[10px] hover:border-gray-900 transition-all">Explore New Allocations</button>
                            </div>

                        </motion.div>
                    )}

                    {/* =========================================
                                 TAB 2: LEDGER (Assets)
                    ========================================== */}
                    {activeTab === 'LEDGER' && (
                        <motion.div key="LEDGER" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-2xl font-serif text-gray-900">Encrypted Asset Ledger</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500"><Hexagon size={14} className="text-green-500"/> Verified on Blockchain</div>
                            </div>
                            
                            {vaultAssets.length > 0 ? vaultAssets.map((asset, i) => (
                                <div key={i} className="bg-white rounded-[30px] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6 group hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200 shrink-0">
                                            <ShieldCheck size={24} className="text-gray-900"/>
                                        </div>
                                        <div>
                                            <h5 className="font-serif text-xl text-gray-900 mb-1">{asset.name}</h5>
                                            <p className="text-xs font-mono text-gray-500">Ref: {asset.ref}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Acquisition Date</p>
                                            <p className="text-sm font-medium text-gray-900">{asset.date}</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Current Value</p>
                                            <p className="text-sm font-medium text-gray-900">{asset.value}</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">NFT Token</p>
                                            <p className="text-xs font-mono text-green-600 bg-green-50 px-3 py-1 rounded-md">{asset.nft}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-white rounded-[30px] border border-gray-100">
                                    <p className="text-gray-500 font-serif text-lg">Your vault ledger is currently empty.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* =========================================
                                 TAB 3: CONCIERGE
                    ========================================== */}
                    {activeTab === 'CONCIERGE' && (
                        <motion.div key="CONCIERGE" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            <div className="bg-gray-900 rounded-[40px] p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                                <h4 className="text-3xl font-serif mb-4 relative z-10">Bespoke Services</h4>
                                <p className="text-gray-400 font-serif text-lg mb-10 relative z-10 max-w-md">Request maintenance, polishing, or a private viewing of unlisted assets.</p>
                                
                                <div className="space-y-4 relative z-10">
                                    <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-5 rounded-2xl flex justify-between items-center transition-colors">
                                        <span className="font-medium text-sm tracking-wide">Schedule Maintenance</span>
                                        <ChevronRight size={18}/>
                                    </button>
                                    <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-5 rounded-2xl flex justify-between items-center transition-colors">
                                        <span className="font-medium text-sm tracking-wide">Request Valuation</span>
                                        <ChevronRight size={18}/>
                                    </button>
                                    <button className="w-full bg-white text-gray-900 p-5 rounded-2xl flex justify-between items-center font-bold text-sm tracking-wide hover:bg-gray-200 transition-colors mt-4">
                                        Speak to Concierge <MessageSquare size={16}/>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Activity size={30} className="text-gray-400"/>
                                </div>
                                <h4 className="text-2xl font-serif text-gray-900 mb-3">No Active Service Requests</h4>
                                <p className="text-gray-500 text-sm max-w-sm">All your assets are currently operating at peak horological standards.</p>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}

export default dynamic(() => Promise.resolve(AdvancedConciergeProfile), { ssr: false });
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Package, BrainCircuit, Landmark, Users, RefreshCcw, Trash2, Layout, Video, 
  AlignCenter, AlignLeft, AlignRight, PlusCircle, Link as LinkIcon, ShieldCheck, Eye, Save, 
  Image as ImageIcon, Box, Zap, AlertTriangle, Truck, MapPin, BellRing, Edit3, Plus, X, 
  CheckCircle, Bot, Star, TrendingUp, Wallet, Activity, ShieldAlert, Download, MessageSquare, 
  FileText, Search, ChevronRight, Gift, Shield, Globe, Lock
} from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import dynamic from 'next/dynamic';

const MODULES = [
  { id: 'FULL_DASHBOARD', icon: BarChart3, label: 'Empire Analytics' },
  { id: 'CRM', icon: Users, label: 'Customer CRM & VIP' },
  { id: 'MARKETING', icon: Gift, label: 'Marketing & Campaigns' },
  { id: 'INVENTORY', icon: Package, label: 'Product Intelligence' },
  { id: 'ORDER_TRACKER', icon: Truck, label: 'Global Logistics' },
  { id: 'PAGE_BUILDER', icon: Layout, label: 'UI Theme Builder' },
  { id: 'REVIEWS', icon: Star, label: 'Sentiment Center' },
  { id: 'SALES_FORCE', icon: LinkIcon, label: 'Sales Empire' },
  { id: 'AI_ENGINE', icon: Bot, label: 'AI Neural Core' }
];

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1587836374828-cb4387df3c56?q=80&w=1000",
  "https://images.unsplash.com/photo-1508685096489-77a46807e604?q=80&w=1000",
  "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000",
  "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000",
  "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1000"
];

function ImperialGodmodeOS() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('FULL_DASHBOARD');
  const [isSyncing, setIsSyncing] = useState(false);

  // --- DATA STATES ---
  const [leads, setLeads] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [liveWatches, setLiveWatches] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  
  // --- ANALYTICS STATES ---
  const [fullAnalytics, setFullAnalytics] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [forecast, setForecast] = useState<any>(null);

  // --- CMS STATES ---
  const [heroSlides, setHeroSlides] = useState([{ id: 1, type: 'video', url: '', heading: 'Time is Gold' }]);
  const [aboutConfig, setAboutConfig] = useState({ content: '', alignment: 'center', style: 'luxury', boldWords: '' });
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_GALLERY); 
  const [uiConfig, setUiConfig] = useState({ primaryColor: '#D4AF37', bgColor: '#050505', fontFamily: 'serif', buttonRadius: 'full' });
  
  // --- FORM STATES ---
  const [watchForm, setWatchForm] = useState({ 
      name: '', brand: '', category: 'Investment Grade', price: '', offerPrice: '', stock: '', 
      images: '', videoUrl: '', model3DUrl: '', description: '', specifications: '', seoTags: '', variants: '' 
  });
  const [couponForm, setCouponForm] = useState({ code: '', discountValue: '', minOrder: '', validUntil: '' });
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentForm, setAgentForm] = useState({ name: '', email: '', code: '', tier: 'Imperial Agent', commissionRate: 5 });

  // --- AI STATES ---
  const [pricingRules, setPricingRules] = useState({ isAiPricingActive: true, maxMarkupPercent: 15, maxDiscountPercent: 10, lowStockThreshold: 3, trendingThreshold: 10 });

  // --- MASTER FETCH FUNCTION ---
  const fetchSystemIntelligence = async () => {
    setIsSyncing(true);
    try {
      const ts = new Date().getTime();
      const [resLeads, resCms, resProducts, resAgents, resOrders, resRules, resAnalytics, resInsights, resReviews, resMarketing, resIntel, resCust] = await Promise.all([
        fetch(`/api/admin/analytics?t=${ts}`).then(r => r.ok ? r.json() : {leads: []}),
        fetch(`/api/cms?t=${ts}`).then(r => r.ok ? r.json() : {data: null}),
        fetch(`/api/products?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/agents?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/orders?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/ai/rules?t=${ts}`).then(r => r.ok ? r.json() : {data: null}),
        fetch(`/api/dashboard/full-analytics?t=${ts}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/ai/admin-insights?t=${ts}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/reviews?admin=true&t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/admin/marketing?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/admin/intelligence?t=${ts}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/admin/users?t=${ts}`).then(r => r.ok ? r.json() : {data: []}).catch(()=>({data:[]}))
      ]);
      
      if (resLeads.leads) setLeads(resLeads.leads);
      if (resProducts.data) setLiveWatches(resProducts.data.filter((w:any)=>w&&w._id));
      if (resAgents.data) setAgents(resAgents.data);
      if (resOrders.data) setOrders(resOrders.data);
      if (resRules.data) setPricingRules(resRules.data);
      if (resAnalytics && resAnalytics.success) setFullAnalytics(resAnalytics);
      if (resInsights && resInsights.success) setAiInsights(resInsights.insights);
      if (resReviews.data) setAllReviews(resReviews.data);
      if (resMarketing.data) setCoupons(resMarketing.data);
      if (resIntel && resIntel.success) setForecast(resIntel.forecasting);
      if (resCust.data) setCustomers(resCust.data);
      
      if (resCms.data) {
        if(resCms.data.heroSlides) setHeroSlides(resCms.data.heroSlides);
        if(resCms.data.aboutConfig) setAboutConfig(resCms.data.aboutConfig);
        if(resCms.data.galleryImages && resCms.data.galleryImages.length === 6) setGalleryImages(resCms.data.galleryImages);
        if(resCms.data.uiConfig) setUiConfig(resCms.data.uiConfig);
      }
    } catch (e) { console.error(e); }
    finally { setIsSyncing(false); }
  };

  useEffect(() => { if (session?.user?.role === 'SUPER_ADMIN') fetchSystemIntelligence(); }, [session]);

  // --- ACTIONS ---
  const handleAddHeroSlide = () => setHeroSlides([...heroSlides, { id: Date.now(), type: 'image', url: '', heading: 'New Slide' }]);
  const handleRemoveHeroSlide = (id: number) => setHeroSlides(heroSlides.filter(s => s.id !== id));

  const handleDeployCMS = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ heroSlides, aboutConfig, galleryImages, uiConfig }) });
      alert("Empire UI & Theme Updated Globally!");
    } catch (e) { alert("CMS Deployment Failed"); }
    finally { setIsSyncing(false); }
  };

  const handleSaveAIRules = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/ai/rules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pricingRules) });
      alert("AI Pricing Logic Retrained & Updated!");
    } catch (e) { alert("Failed to save AI rules."); }
    finally { setIsSyncing(false); }
  };

  const handlePublishAsset = async () => {
    if (!watchForm.name || !watchForm.price || !watchForm.description || !watchForm.images) return alert("Required fields (Name, Price, Description, Images) are missing.");
    setIsSyncing(true);
    try {
      const imageArray = watchForm.images.split(',').map(s=>s.trim()).filter(s=>s);
      const specObj:any = {};
      watchForm.specifications.split(',').forEach(pair => {
         const [k, v] = pair.split(':');
         if(k && v) specObj[k.trim()] = v.trim();
      });
      const tagsArray = watchForm.seoTags.split(',').map(s=>s.trim()).filter(s=>s);

      const finalProduct = {
          ...watchForm,
          images: imageArray,
          imageUrl: imageArray[0],
          specifications: specObj,
          tags: tagsArray
      };

      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(finalProduct) });
      if (res.ok) { 
          alert("Asset Injected to Global Vault!"); 
          setWatchForm({ name: '', brand: '', category: 'Investment Grade', price: '', offerPrice: '', stock: '', images: '', videoUrl: '', model3DUrl: '', description: '', specifications: '', seoTags: '', variants: '' }); 
          fetchSystemIntelligence(); 
      }
    } catch (e) { alert("Injection Failed"); } finally { setIsSyncing(false); }
  };

  const handleDeleteAsset = async (id: string) => {
    if(!confirm("Purge asset from global vault permanently?")) return;
    setLiveWatches(prev => prev.filter(w => w._id !== id));
    try { await fetch(`/api/products`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) }); } catch(e) {}
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    setIsSyncing(true);
    try {
        const res = await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
        if(res.ok) fetchSystemIntelligence();
    } catch(e) { alert("Status Update Failed"); }
    finally { setIsSyncing(false); }
  };

  const handleReviewAction = async (reviewId: string, visibility: string) => {
      setIsSyncing(true);
      try {
          await fetch('/api/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reviewId, visibility }) });
          fetchSystemIntelligence();
      } catch (e) { alert("Review Update Failed"); } finally { setIsSyncing(false); }
  };

  const handleRecruitAgent = async () => {
    if (!agentForm.name || !agentForm.email) return alert("Name and Email are required.");
    setIsSyncing(true);
    try {
      const res = await fetch('/api/agents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(agentForm) });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Agent Recruited! Tracking link generated.`);
        setAgentForm({ name: '', email: '', code: '', tier: 'Imperial Agent', commissionRate: 5 });
        setIsAgentModalOpen(false);
        fetchSystemIntelligence();
      }
    } catch (error) { alert("Network Error."); }
    finally { setIsSyncing(false); }
  };

  const handleCreateCoupon = async () => {
      if(!couponForm.code || !couponForm.discountValue) return alert("Code and Discount Value required.");
      setIsSyncing(true);
      try {
          await fetch('/api/admin/marketing', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(couponForm)});
          setCouponForm({code: '', discountValue: '', minOrder: '', validUntil: ''});
          fetchSystemIntelligence();
      } catch (e) { alert("Failed to generate coupon"); }
      finally { setIsSyncing(false); }
  };

  if (status === "loading") return <div className="h-screen bg-black flex items-center justify-center text-[#D4AF37] animate-pulse italic tracking-[10px] font-black">♞ BOOTING IMPERIAL OS...</div>;
  if (!session || session.user?.role !== 'SUPER_ADMIN') return <div className="h-screen bg-[#050505] flex items-center justify-center"><button onClick={() => signIn("google")} className="bg-[#D4AF37] text-black px-10 py-4 rounded-full font-black tracking-widest uppercase shadow-[0_0_40px_rgba(212,175,55,0.4)]">ADMIN ACCESS REQUIRED</button></div>;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* ================= RECRUITMENT MODAL ================= */}
      <AnimatePresence>
        {isAgentModalOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} exit={{scale:0.9, y:20}} className="bg-[#0A0A0A] border border-[#D4AF37]/30 p-12 rounded-[50px] w-full max-w-xl relative shadow-2xl">
               <button onClick={() => setIsAgentModalOpen(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
               <h3 className="text-4xl font-serif italic mb-3 text-[#D4AF37]">Recruit Imperial Agent</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-10">Deploy a new affiliate tracker node</p>
               <div className="space-y-6">
                 <input value={agentForm.name} onChange={(e) => setAgentForm({...agentForm, name: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37]" placeholder="Agent Full Name"/>
                 <input value={agentForm.email} onChange={(e) => setAgentForm({...agentForm, email: e.target.value})} type="email" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37]" placeholder="Agent Email Address"/>
                 <div className="grid grid-cols-2 gap-4">
                   <input value={agentForm.code} onChange={(e) => setAgentForm({...agentForm, code: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] uppercase font-mono" placeholder="Custom Code (Opt)"/>
                   <input value={agentForm.commissionRate} onChange={(e) => setAgentForm({...agentForm, commissionRate: Number(e.target.value)})} type="number" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37]" placeholder="Commission %"/>
                 </div>
                 <select value={agentForm.tier} onChange={(e) => setAgentForm({...agentForm, tier: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 outline-none focus:border-[#D4AF37]">
                    <option>Imperial Agent</option><option>Elite Partner</option><option>Ambassador</option>
                 </select>
                 <button onClick={handleRecruitAgent} className="w-full py-6 bg-[#D4AF37] text-black font-black uppercase rounded-3xl text-[11px] tracking-[4px] hover:bg-white transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)] mt-6">Initiate Recruitment Process</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[340px] bg-[#0A0A0A] border-r border-white/5 flex flex-col shadow-2xl z-50">
        <div className="p-8 border-b border-white/5 flex items-center gap-5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="w-14 h-14 rounded-[20px] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-black text-xs shadow-[0_0_20px_rgba(212,175,55,0.2)]">CEO</div>
          <div className="overflow-hidden">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Master Admin</p>
             <h1 className="text-sm font-serif italic text-white truncate">{session.user?.name}</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
          {MODULES.map(m => (
            <button key={m.id} onClick={() => setActiveTab(m.id)} className={`w-full flex items-center justify-between px-6 py-5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all group ${activeTab === m.id ? 'bg-[#D4AF37] text-black shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <div className="flex items-center gap-5">
                 <m.icon size={20} className={activeTab === m.id ? 'text-black' : 'group-hover:text-[#D4AF37] transition-colors'}/> 
                 {m.label}
              </div>
              {activeTab === m.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl mb-6 flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-[9px] font-black uppercase text-green-500 tracking-widest">Global Node: 100%</span>
            </div>
            <button onClick={() => signOut()} className="w-full py-5 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 rounded-2xl hover:bg-red-500 transition-all hover:text-white flex justify-center items-center gap-3"><ShieldAlert size={16}/> Disconnect Protocol</button>
        </div>
      </aside>

      {/* ================= CONTENT ENGINE ================= */}
      <main className="flex-1 overflow-y-auto p-12 bg-[#050505] relative custom-scrollbar">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/[0.03] blur-[150px] pointer-events-none rounded-full"></div>

        <header className="flex justify-between items-end mb-16 border-b border-white/5 pb-10 relative z-10">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <span className="bg-white/5 border border-white/10 text-gray-400 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest">v3.0 Enterprise</span>
                <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest">Real-time Data Active</span>
             </div>
             <h2 className="text-6xl md:text-8xl font-serif italic font-black tracking-tighter leading-none">{activeTab.replace('_', ' ')}</h2>
          </div>
          <div className="flex gap-4">
             <div className="relative">
                <button className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5"><BellRing size={22}/></button>
                {leads.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-black">{leads.length}</span>}
             </div>
             <button onClick={fetchSystemIntelligence} className="p-6 bg-[#D4AF37] rounded-2xl hover:bg-white text-black transition-all border border-white/10 shadow-[0_10px_30px_rgba(212,175,55,0.2)]"><RefreshCcw size={22} className={isSyncing ? "animate-spin" : ""}/></button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          
          {/* ================= 1. EMPIRE ANALYTICS ================= */}
          {activeTab === 'FULL_DASHBOARD' && fullAnalytics && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key="dash" className="space-y-12">
              
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-10 rounded-[40px] flex items-start gap-8 shadow-2xl relative overflow-hidden">
                 <BrainCircuit className="text-blue-400 mt-2 flex-shrink-0" size={40}/>
                 <div className="relative z-10">
                   <h4 className="text-blue-400 font-black uppercase tracking-[5px] text-xs mb-5">AI Executive Summary</h4>
                   <ul className="space-y-4">
                     {aiInsights.length > 0 ? aiInsights.map((insight, i) => (
                        <li key={i} className="text-sm font-serif italic text-blue-100 flex items-start gap-3"><Zap size={16} className="text-[#D4AF37] mt-1 shrink-0"/> {insight}</li>
                     )) : <li className="text-sm font-serif italic text-gray-500">Neural network is aggregating data...</li>}
                   </ul>
                 </div>
                 <Bot size={200} className="absolute right-0 top-0 opacity-5 pointer-events-none"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   { label: 'Gross Revenue', val: `₹${(fullAnalytics.metrics?.totalRevenue || 0).toLocaleString()}`, icon: Wallet, color: '#D4AF37' },
                   { label: 'Total Conversions', val: fullAnalytics.metrics?.totalOrders || 0, icon: Package, color: '#3B82F6' },
                   { label: 'Abandoned Leads', val: leads.length, icon: ShieldAlert, color: '#EF4444' },
                   { label: 'Active Sessions', val: '1,420', icon: Activity, color: '#10B981' }
                 ].map((stat, i) => (
                   <div key={i} className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 hover:border-white/20 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors"><stat.icon size={24} color={stat.color}/></div>
                        <span className="text-green-500 text-[10px] font-bold bg-green-500/10 px-3 py-1 rounded-full">+14%</span>
                      </div>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">{stat.label}</p>
                      <h3 className="text-5xl font-black text-white font-serif tracking-tighter">{stat.val}</h3>
                   </div>
                 ))}
              </div>

              {forecast && (
                 <div className="bg-gradient-to-tr from-[#002B19] to-[#0A0A0A] p-12 rounded-[50px] border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(212,175,55,0.1)] mt-12 flex justify-between items-center">
                    <div>
                        <h4 className="text-[#D4AF37] font-black uppercase tracking-[5px] text-sm mb-4 flex items-center gap-3"><TrendingUp size={20}/> 30-Day AI Revenue Forecast</h4>
                        <p className="text-gray-400 text-sm font-serif italic mb-2">Projected revenue based on current linear velocity and historical trends:</p>
                    </div>
                    <p className="text-7xl font-black font-serif text-white tracking-tighter">₹{Math.round(forecast.projectedNext30Days || 0).toLocaleString('en-IN')}</p>
                 </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-white/5">
                    <h4 className="text-[#D4AF37] font-black uppercase tracking-[5px] text-sm mb-10 flex items-center gap-3"><Globe size={20}/> Regional Heatmap</h4>
                    <div className="space-y-8">
                      {fullAnalytics.countrySales.length === 0 ? <p className="text-gray-500 italic">No region data yet.</p> : fullAnalytics.countrySales.map((c:any, i:number) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-3 text-gray-300"><span className="uppercase font-bold tracking-widest">{c._id || 'India'}</span><span className="font-bold text-white text-sm">₹{c.revenue.toLocaleString('en-IN')}</span></div>
                          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${Math.min((c.revenue/(fullAnalytics.metrics?.totalRevenue||1))*100, 100)}%`}} transition={{duration: 1.5}} className="h-full bg-[#D4AF37]"/></div>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-white/5">
                    <h4 className="text-[#D4AF37] font-black uppercase tracking-[5px] text-sm mb-10 flex items-center gap-3"><Users size={20}/> Traffic Origins</h4>
                    <div className="grid grid-cols-2 gap-6">
                       {fullAnalytics.trafficSources.length === 0 ? <p className="text-gray-500 italic">No traffic data yet.</p> : fullAnalytics.trafficSources.map((t:any, i:number) => (
                         <div key={i} className="bg-white/5 p-8 rounded-[30px] text-center border border-white/5 hover:border-white/10 transition-all">
                           <p className="text-5xl font-black text-white mb-3 font-serif">{t.count}</p>
                           <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t._id || 'Direct / Unknown'}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {/* ================= 2. CUSTOMER CRM & VIP ================= */}
          {activeTab === 'CRM' && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} key="crm" className="space-y-10">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 text-center">
                     <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-4">Total Registered Clients</p>
                     <h2 className="text-6xl font-black font-serif text-white">{customers?.length || '1,240'}</h2>
                  </div>
                  <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 text-center">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">VIP Tier Nodes</p>
                     <h2 className="text-6xl font-black font-serif text-white">48</h2>
                  </div>
                  <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 text-center">
                     <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-4">Avg. Lifetime Value</p>
                     <h2 className="text-6xl font-black font-serif text-white">₹8.4L</h2>
                  </div>
                </div>

                <div className="bg-[#0A0A0A] rounded-[50px] border border-white/5 overflow-hidden">
                   <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                      <h3 className="text-2xl font-serif italic text-white">Client Intelligence Database</h3>
                      <div className="flex bg-black border border-white/10 rounded-full px-5 py-3 items-center gap-3 w-96">
                         <Search size={16} className="text-gray-500"/>
                         <input className="bg-transparent border-none outline-none text-xs w-full text-white" placeholder="Search by name, email, or phone..." />
                      </div>
                   </div>
                   <table className="w-full text-left">
                     <thead className="bg-black/50 text-[9px] font-black uppercase tracking-[5px] text-gray-500 border-b border-white/5">
                        <tr>
                          <th className="p-8 pl-10">Client Identity</th>
                          <th className="p-8">Engagement Segment</th>
                          <th className="p-8 text-center">Loyalty Points</th>
                          <th className="p-8 text-right pr-10">Total Portfolio Value</th>
                        </tr>
                     </thead>
                     <tbody>
                        {leads.length === 0 ? <tr><td colSpan={4} className="p-20 text-center text-gray-500 font-serif italic">No client data found in current parameters.</td></tr> : leads.slice(0,10).map((c:any, i:number) => (
                           <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                              <td className="p-8 pl-10">
                                 <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-800 to-black border border-white/10 flex items-center justify-center font-bold text-xs uppercase text-white shadow-lg">{c.phone?.slice(-2) || 'UK'}</div>
                                    <div>
                                       <p className="font-bold text-lg text-white mb-1">{c.phone || 'Anonymous Client'}</p>
                                       <p className="text-[10px] text-gray-500 font-mono tracking-widest">UID: {c._id?.slice(-8)}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-8">
                                 <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-black uppercase tracking-widest">High Affinity</span>
                              </td>
                              <td className="p-8 text-center font-mono text-[#D4AF37] font-bold">1,240 pts</td>
                              <td className="p-8 text-right pr-10">
                                 <p className="font-black font-serif text-2xl text-white">₹{(c.cartTotal || 0).toLocaleString()}</p>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
             </motion.div>
          )}

          {/* ================= 3. MARKETING & COUPONS ================= */}
          {activeTab === 'MARKETING' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="marketing" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               
               <div className="lg:col-span-5 space-y-10">
                  <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(212,175,55,0.1)]">
                     <h3 className="text-3xl font-serif italic text-white mb-4">Campaign Engine</h3>
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-10">Generate Universal Requisition Codes</p>
                     
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Coupon Identity Code</label>
                           <input value={couponForm.code} onChange={e=>setCouponForm({...couponForm, code: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm uppercase font-mono outline-none focus:border-[#D4AF37] text-white" placeholder="e.g. VIP2026"/>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Discount (%)</label>
                              <input value={couponForm.discountValue} onChange={e=>setCouponForm({...couponForm, discountValue: e.target.value})} type="number" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="15"/>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Min. Order (₹)</label>
                              <input value={couponForm.minOrder} onChange={e=>setCouponForm({...couponForm, minOrder: e.target.value})} type="number" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="50000"/>
                           </div>
                        </div>
                        <button onClick={handleCreateCoupon} className="w-full py-6 bg-[#D4AF37] text-black font-black uppercase rounded-3xl text-[11px] tracking-[5px] hover:bg-white transition-all shadow-xl mt-4">Deploy Campaign</button>
                     </div>
                  </div>

                  <div className="bg-[#0A0A0A] p-10 rounded-[50px] border border-white/5">
                     <h4 className="text-gray-400 font-black uppercase tracking-[5px] text-xs mb-8 flex items-center gap-3"><MessageSquare size={16}/> Global Broadcast Protocol</h4>
                     <textarea className="w-full bg-black border border-white/10 p-6 rounded-3xl text-sm font-serif italic outline-none h-32 text-white focus:border-[#D4AF37]" placeholder="Draft push notification to all 12,000+ active user devices..."></textarea>
                     <button className="w-full py-5 bg-white/5 border border-white/10 hover:bg-white text-gray-400 hover:text-black transition-all rounded-2xl font-black uppercase text-[10px] tracking-widest mt-6">Initialize Broadcast</button>
                  </div>
               </div>

               <div className="lg:col-span-7 bg-[#0A0A0A] p-12 rounded-[50px] border border-white/5">
                  <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
                     <div>
                        <h4 className="text-[#D4AF37] font-black uppercase tracking-[5px] text-sm">Active Promotion Nodes</h4>
                        <p className="text-xs text-gray-500 font-serif italic mt-2">Currently running discount protocols across the empire.</p>
                     </div>
                  </div>
                  
                  <div className="space-y-6">
                     {coupons.length === 0 ? <p className="text-center py-20 text-gray-600 font-serif italic text-xl">No active campaigns running.</p> : coupons.map((c, i) => (
                        <div key={i} className="p-8 bg-black border border-white/5 rounded-[35px] flex justify-between items-center group hover:border-[#D4AF37]/50 transition-all shadow-lg">
                           <div className="flex items-center gap-8">
                              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] font-black text-lg font-mono border border-[#D4AF37]/20 shadow-inner">{c.discountValue}%</div>
                              <div>
                                 <p className="font-mono font-black text-3xl text-white mb-2">{c.code}</p>
                                 <div className="flex gap-4">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Uses: {c.usedCount || 0}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Min: ₹{c.minOrderValue?.toLocaleString() || 0}</p>
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-col items-end gap-3">
                              <span className="bg-green-500/10 border border-green-500/20 text-green-500 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
                              <button className="text-[10px] text-red-500 uppercase font-bold tracking-widest hover:underline">Deactivate</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 4. ADVANCED INVENTORY (PRODUCT INTELLIGENCE) ================= */}
          {activeTab === 'INVENTORY' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="inv" className="grid grid-cols-1 xl:grid-cols-12 gap-12">
               
               <div className="xl:col-span-5 space-y-8 h-max sticky top-0">
                  <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(212,175,55,0.15)] relative overflow-hidden">
                     <Package size={200} className="absolute -right-10 -top-10 text-[#D4AF37] opacity-5 pointer-events-none"/>
                     
                     <div className="flex justify-between items-center mb-10 relative z-10">
                        <div>
                           <h3 className="text-[#D4AF37] text-sm font-black uppercase tracking-[5px]">Asset Injection Hub</h3>
                           <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-2">Deploy directly to Global Vault</p>
                        </div>
                        <button className="text-[9px] font-black text-blue-400 border border-blue-400/30 px-4 py-2 rounded-full hover:bg-blue-400 hover:text-black transition-all flex items-center gap-2"><Download size={12}/> CSV Import</button>
                     </div>
                     
                     <div className="space-y-6 relative z-10">
                        {/* Basic Info */}
                        <div className="space-y-4">
                           <input value={watchForm.name} onChange={(e) => setWatchForm({...watchForm, name: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="Full Asset Title (e.g. Royal Oak Offshore)"/>
                           <div className="grid grid-cols-2 gap-4">
                             <input value={watchForm.brand} onChange={(e) => setWatchForm({...watchForm, brand: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="Brand Authority"/>
                             <select value={watchForm.category} onChange={(e) => setWatchForm({...watchForm, category: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 outline-none focus:border-[#D4AF37]">
                                <option>Investment Grade</option><option>Rare Vintage</option><option>Modern Complications</option><option>Grand Complications</option>
                             </select>
                           </div>
                        </div>

                        {/* Media & Story */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                           <textarea value={watchForm.images} onChange={(e) => setWatchForm({...watchForm, images: e.target.value})} rows={2} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] text-white custom-scrollbar" placeholder="Digital Media URLs (Comma separated, high-res links only)"/>
                           <textarea value={watchForm.description} onChange={(e) => setWatchForm({...watchForm, description: e.target.value})} rows={3} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm font-serif italic outline-none focus:border-[#D4AF37] text-white custom-scrollbar" placeholder="Curated Luxury Narrative / Heritage Story..."/>
                        </div>

                        {/* Technical Specs & AI SEO */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                           <textarea value={watchForm.specifications} onChange={(e) => setWatchForm({...watchForm, specifications: e.target.value})} rows={2} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm font-mono outline-none focus:border-[#D4AF37] text-gray-300 custom-scrollbar" placeholder="Specs (Format -> Movement:Automatic, Case:18k Gold)"/>
                           <div className="bg-blue-500/5 border border-blue-500/20 p-5 rounded-2xl space-y-3">
                              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2"><BrainCircuit size={12}/> AI SEO Matrix & Tags</p>
                              <input value={watchForm.seoTags} onChange={(e) => setWatchForm({...watchForm, seoTags: e.target.value})} className="w-full bg-transparent border-b border-blue-500/30 p-2 text-xs outline-none text-white placeholder-gray-600" placeholder="Tags (e.g. limited edition, diver, rose gold)..." />
                           </div>
                        </div>

                        {/* Financials */}
                        <div className="pt-4 border-t border-white/5">
                           <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2"><label className="text-[8px] uppercase font-black text-gray-500 tracking-widest">Base MRP (₹)</label><input value={watchForm.price} onChange={(e) => setWatchForm({...watchForm, price: e.target.value})} type="number" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-black outline-none focus:border-[#D4AF37] text-white" /></div>
                              <div className="space-y-2"><label className="text-[8px] uppercase font-black text-[#D4AF37] tracking-widest">Offer Price (₹)</label><input value={watchForm.offerPrice} onChange={(e) => setWatchForm({...watchForm, offerPrice: e.target.value})} type="number" className="w-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-4 rounded-xl text-sm font-black outline-none focus:border-[#D4AF37] text-[#D4AF37]" /></div>
                              <div className="space-y-2"><label className="text-[8px] uppercase font-black text-gray-500 tracking-widest">Stock Units</label><input value={watchForm.stock} onChange={(e) => setWatchForm({...watchForm, stock: e.target.value})} type="number" className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-black outline-none focus:border-[#D4AF37] text-white" /></div>
                           </div>
                        </div>

                        <button onClick={handlePublishAsset} className="w-full py-7 bg-[#D4AF37] text-black font-black uppercase rounded-3xl text-[11px] tracking-[6px] hover:bg-white transition-all shadow-[0_10px_40px_rgba(212,175,55,0.4)] mt-6">Inject Asset to Global Nodes</button>
                     </div>
                  </div>
               </div>

               <div className="xl:col-span-7">
                  <div className="flex justify-between items-center mb-10 pl-4">
                     <h3 className="text-2xl font-serif italic text-white">Live Vault Matrix</h3>
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-4 py-2 rounded-full">{liveWatches.length} Assets Active</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
                     {liveWatches.map((watch, idx) => (
                       <div key={watch._id || idx} className="bg-[#0A0A0A] p-8 rounded-[45px] border border-white/5 flex flex-col justify-between group hover:border-[#D4AF37]/40 transition-all duration-700 shadow-2xl relative overflow-hidden">
                          
                          <div className="absolute top-6 right-6 flex flex-col items-end gap-2 z-20">
                             {watch.seoScore > 0 && <span className="bg-green-500/10 border border-green-500/20 text-green-500 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">SEO: {watch.seoScore}%</span>}
                             {watch.stock < 3 && <span className="bg-red-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg animate-pulse">Low Stock: {watch.stock}</span>}
                          </div>

                          <div className="h-56 bg-black/50 rounded-3xl flex items-center justify-center p-6 relative overflow-hidden mb-8 border border-white/5">
                             <img src={watch.imageUrl || (watch.images && watch.images[0])} className="h-full object-contain mix-blend-screen transition-transform group-hover:scale-110 duration-1000 relative z-10 drop-shadow-2xl" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0"></div>
                          </div>
                          
                          <div className="flex-1 flex flex-col">
                             <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[4px] mb-2">{watch.brand}</p>
                             <h4 className="text-2xl font-serif text-white leading-tight mb-6 line-clamp-2">{watch.name || watch.title}</h4>
                             
                             <div className="flex justify-between items-end border-t border-white/5 pt-6 mt-auto">
                                <div>
                                   <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Valuation</p>
                                   <p className="text-xl font-black font-serif text-white">₹{Number(watch.offerPrice || watch.price || watch.basePrice).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="flex gap-3">
                                   <button className="p-3.5 bg-white/5 rounded-2xl hover:bg-blue-500 hover:text-white transition-colors text-gray-400"><Edit3 size={16}/></button>
                                   <button onClick={() => handleDeleteAsset(watch._id)} className="p-3.5 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                                </div>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 5. GLOBAL LOGISTICS & ORDERS ================= */}
          {activeTab === 'ORDER_TRACKER' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="orders" className="grid grid-cols-1 xl:grid-cols-12 gap-10">
               
               <div className="xl:col-span-8 space-y-8">
                  <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-white/5 flex justify-between items-center shadow-xl">
                     <div className="flex items-center gap-8">
                        <div className="p-6 rounded-[25px] bg-blue-500/10 text-blue-500 border border-blue-500/20"><Truck size={36}/></div>
                        <div>
                           <h3 className="text-4xl font-serif italic text-white mb-2">Fleet Command</h3>
                           <p className="text-[10px] text-gray-500 font-black uppercase tracking-[5px]">Global Asset Dispatch Tracking</p>
                        </div>
                     </div>
                     <div className="flex gap-6 hidden md:flex">
                        <div className="text-center px-8 border-r border-white/10"><p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">In Transit</p><p className="text-3xl font-black text-white font-serif">{orders.filter(o=>o.status==='TRANSIT').length || 0}</p></div>
                        <div className="text-center px-8"><p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Delivered</p><p className="text-3xl font-black text-green-500 font-serif">{orders.filter(o=>o.status==='DELIVERED').length || 0}</p></div>
                     </div>
                  </div>

                  <div className="space-y-6">
                    {orders.length === 0 ? <p className="text-center py-32 text-gray-600 font-serif italic text-2xl">No active requisitions in pipeline.</p> : orders.map((o: any, i: number) => (
                       <div key={i} className="p-10 bg-[#0A0A0A] border border-white/5 rounded-[40px] flex flex-col lg:flex-row items-center justify-between group hover:border-blue-500/30 transition-all shadow-lg">
                          <div className="flex items-center gap-8 w-full lg:w-auto mb-8 lg:mb-0">
                             <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center text-blue-500 font-mono text-xs font-black shadow-inner">#{o.orderId?.slice(-4) || 'UKN'}</div>
                             <div>
                                <h4 className="font-bold text-2xl text-white mb-2">{o.customer?.name || 'Anonymous Client'}</h4>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[4px] flex items-center gap-2"><MapPin size={12}/> {o.customer?.city || 'Unknown'}, {o.customer?.country || 'IN'} <span className="mx-2">|</span> {o.items?.length || 1} ASSET(S)</p>
                             </div>
                          </div>
                          <div className="flex flex-wrap lg:flex-nowrap items-center gap-12 w-full lg:w-auto justify-between lg:justify-end">
                             <div className="text-left lg:text-right">
                               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">Net Valuation</p>
                               <p className="font-black text-white text-2xl font-serif">₹{(o.totalAmount || 0).toLocaleString()}</p>
                             </div>
                             <div className="h-16 w-px bg-white/10 hidden lg:block"></div>
                             <div className="flex flex-col gap-3 min-w-[160px]">
                               <select value={o.status} onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)} className="w-full bg-white/5 border border-white/10 text-blue-400 font-black uppercase text-[10px] tracking-widest outline-none rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors">
                                 <option className="bg-black" value="PENDING">PENDING</option><option className="bg-black" value="PROCESSING">PROCESSING</option>
                                 <option className="bg-black" value="DISPATCHED">DISPATCHED</option><option className="bg-black" value="TRANSIT">IN TRANSIT</option>
                                 <option className="bg-black" value="DELIVERED">DELIVERED</option><option className="bg-black text-red-500" value="CANCELLED">CANCELLED</option>
                               </select>
                               <button className="flex items-center justify-center gap-3 w-full py-3 bg-transparent border border-white/10 hover:bg-white hover:text-black transition-all rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400"><FileText size={14}/> Invoice</button>
                             </div>
                          </div>
                       </div>
                    ))}
                  </div>
               </div>

               <div className="xl:col-span-4 space-y-8">
                  <div className="bg-[#0A0A0A] p-10 rounded-[50px] border border-white/5 h-full flex flex-col shadow-2xl">
                     <h3 className="text-sm font-black uppercase tracking-[5px] text-[#D4AF37] mb-10 flex items-center gap-4"><BrainCircuit size={22}/> AI Concierge Logs</h3>
                     <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
                        {[
                          { msg: "Location update detected for active dispatches. Route optimization protocol engaged.", type: 'info' },
                          { msg: "High-value asset (₹24L) flagged for manual verification before dispatch.", type: 'alert' },
                          { msg: "Weather anomaly detected in transit zone. ETA adjusted automatically.", type: 'warning' }
                        ].map((log, i) => (
                          <div key={i} className={`p-6 rounded-3xl text-xs font-serif italic border-l-4 ${log.type==='alert' ? 'bg-red-500/5 border-red-500 text-red-200' : log.type==='warning' ? 'bg-orange-500/5 border-orange-500 text-orange-200' : 'bg-blue-500/5 border-blue-500 text-blue-200'}`}>
                             "{log.msg}"
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

            </motion.div>
          )}

          {/* ================= 6. THEME & UI BUILDER ================= */}
          {activeTab === 'PAGE_BUILDER' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="builder" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               
               <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-white/5 space-y-12 shadow-2xl">
                  <div className="flex justify-between items-center border-b border-white/5 pb-8">
                     <h3 className="text-[#D4AF37] text-sm font-black uppercase tracking-[5px] flex items-center gap-4"><Layout size={24}/> Experience Configuration</h3>
                  </div>
                  
                  {/* Color Engine */}
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-[4px]">Primary Identity (HEX)</label>
                       <div className="flex gap-4">
                          <input type="color" value={uiConfig.primaryColor} onChange={(e)=>setUiConfig({...uiConfig, primaryColor: e.target.value})} className="w-16 h-16 rounded-2xl bg-black border border-white/10 p-1 cursor-pointer"/>
                          <input value={uiConfig.primaryColor} onChange={(e)=>setUiConfig({...uiConfig, primaryColor: e.target.value})} className="flex-1 bg-black border border-white/10 rounded-2xl p-5 text-sm font-mono text-white outline-none focus:border-[#D4AF37]"/>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase text-gray-500 tracking-[4px]">Backdrop Protocol (HEX)</label>
                       <div className="flex gap-4">
                          <input type="color" value={uiConfig.bgColor} onChange={(e)=>setUiConfig({...uiConfig, bgColor: e.target.value})} className="w-16 h-16 rounded-2xl bg-black border border-white/10 p-1 cursor-pointer"/>
                          <input value={uiConfig.bgColor} onChange={(e)=>setUiConfig({...uiConfig, bgColor: e.target.value})} className="flex-1 bg-black border border-white/10 rounded-2xl p-5 text-sm font-mono text-white outline-none focus:border-[#D4AF37]"/>
                       </div>
                    </div>
                  </div>

                  {/* Font Engine */}
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[4px]">Global Typography Engine</label>
                    <div className="flex gap-4">
                       {['serif', 'sans', 'mono'].map(f => (
                         <button key={f} onClick={() => setUiConfig({...uiConfig, fontFamily: f})} className={`flex-1 py-5 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all ${uiConfig.fontFamily === f ? 'bg-white text-black border-white shadow-xl' : 'bg-black border-white/10 text-gray-500 hover:border-white/30'}`}>Font: {f}</button>
                       ))}
                    </div>
                  </div>

                  {/* Story Designer */}
                  <div className="space-y-6 pt-8 border-t border-white/5">
                     <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-[4px]">Heritage Story Alignment</label>
                        <div className="flex gap-2">
                           {['left', 'center', 'right'].map(a => (
                             <button key={a} onClick={() => setAboutConfig({...aboutConfig, alignment: a})} className={`px-4 py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${aboutConfig.alignment === a ? 'bg-white text-black border-white' : 'bg-black border-white/10 text-gray-500 hover:text-white'}`}>{a}</button>
                           ))}
                        </div>
                     </div>
                     <textarea value={aboutConfig.content} onChange={(e) => setAboutConfig({...aboutConfig, content: e.target.value})} rows={5} className="w-full bg-black border border-white/10 p-8 rounded-[30px] text-lg font-serif italic leading-relaxed outline-none focus:border-[#D4AF37] text-white custom-scrollbar" placeholder="Draft your luxury brand genesis here..."/>
                     <input value={aboutConfig.boldWords} onChange={(e) => setAboutConfig({...aboutConfig, boldWords: e.target.value})} className="w-full bg-black border border-white/10 p-6 rounded-2xl text-xs outline-none focus:border-[#D4AF37] text-white" placeholder="Keywords to emphasize (Comma separated, e.g. Legacy, Precision)"/>
                  </div>

                  {/* Media Engine (Hero Slides) */}
                  <div className="space-y-6 pt-8 border-t border-white/5">
                     <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[4px] flex items-center gap-2"><Video size={16}/> Cinematic Sequences</label>
                        <button onClick={handleAddHeroSlide} className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors bg-[#D4AF37]/10 px-4 py-2 rounded-full">+ Add Sequence</button>
                     </div>
                     <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                        {heroSlides.map((slide, i) => (
                           <div key={slide.id || i} className="p-6 bg-black border border-white/10 rounded-3xl space-y-4 relative group hover:border-[#D4AF37]/30 transition-all">
                              <div className="flex justify-between items-center">
                                 <span className="bg-white/10 px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest text-gray-400">Node #{i+1}</span>
                                 <button onClick={() => handleRemoveHeroSlide(slide.id)} className="text-red-500 hover:bg-red-500/20 p-2 rounded-lg transition-colors"><Trash2 size={14}/></button>
                              </div>
                              <select value={slide.type} onChange={(e) => { const n = [...heroSlides]; n[i].type = e.target.value; setHeroSlides(n); }} className="w-full bg-transparent border-b border-white/10 pb-2 text-[10px] font-black uppercase tracking-widest text-gray-400 outline-none focus:border-[#D4AF37]">
                                 <option className="bg-black text-white" value="video">Cinematic Video Loop</option><option className="bg-black text-white" value="image">Static High-Res Image</option>
                              </select>
                              <input value={slide.url} onChange={(e) => { const n = [...heroSlides]; n[i].url = e.target.value; setHeroSlides(n); }} className="w-full bg-transparent border-b border-white/10 pb-2 text-xs outline-none focus:border-[#D4AF37] text-white" placeholder="Media URL (CDN Link)"/>
                              <input value={slide.heading} onChange={(e) => { const n = [...heroSlides]; n[i].heading = e.target.value; setHeroSlides(n); }} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-serif italic outline-none focus:border-[#D4AF37] text-white" placeholder="Hero Headline"/>
                           </div>
                        ))}
                     </div>
                  </div>

                  <button onClick={handleDeployCMS} className="w-full py-7 bg-[#D4AF37] text-black font-black uppercase rounded-[30px] text-[11px] tracking-[6px] hover:bg-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)] mt-8">Deploy Architecture Globally</button>
               </div>

               {/* LIVE PREVIEW PANE */}
               <div className="bg-[#111] rounded-[60px] p-2 border border-white/10 shadow-2xl relative h-full min-h-[800px] flex flex-col">
                  <div className="absolute top-8 left-8 flex items-center gap-3 z-20 opacity-50"><Eye size={20} className="text-white"/> <span className="text-[9px] font-black uppercase tracking-[5px] text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">Live Preview Node</span></div>
                  
                  {/* Fake Mobile/Tablet Screen */}
                  <div className="flex-1 rounded-[55px] overflow-hidden flex flex-col relative" style={{ backgroundColor: uiConfig.bgColor }}>
                     {/* Preview Hero */}
                     <div className="h-[60%] relative flex items-center justify-center p-12 text-center">
                        <div className="absolute inset-0 bg-black/60 z-0"></div>
                        {heroSlides[0]?.url && <img src={heroSlides[0].url} className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 z-0" />}
                        <div className="relative z-10 w-full">
                           <h2 className={`text-6xl italic font-black tracking-tighter leading-none mb-6`} style={{color: uiConfig.primaryColor, fontFamily: uiConfig.fontFamily}}>{heroSlides[0]?.heading || 'Luxury'}</h2>
                           <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        </div>
                     </div>
                     {/* Preview Content */}
                     <div className="flex-1 p-12 flex flex-col justify-center bg-gradient-to-t from-black to-transparent relative z-10">
                        <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-8 mx-auto shadow-2xl" style={{borderColor: uiConfig.primaryColor}}>
                           <Landmark size={24} style={{color: uiConfig.primaryColor}}/>
                        </div>
                        <p className={`text-gray-300 text-lg italic leading-relaxed ${aboutConfig.alignment === 'center' ? 'text-center mx-auto' : aboutConfig.alignment === 'right' ? 'text-right ml-auto' : 'text-left mr-auto'}`} style={{fontFamily: uiConfig.fontFamily, maxWidth: '80%'}}>
                           {aboutConfig.content || "Your brand narrative will be injected here."}
                        </p>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 7. SENTIMENT CENTER (REVIEWS) ================= */}
          {activeTab === 'REVIEWS' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="rev" className="space-y-10">
               <div className="bg-gradient-to-r from-[#0A0A0A] to-[#1A1500] p-12 rounded-[50px] border border-[#D4AF37]/20 flex justify-between items-center shadow-2xl">
                  <div>
                    <h3 className="text-4xl font-serif italic text-white mb-3">Reputation Protocols</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-[6px] flex items-center gap-3"><ShieldCheck size={14}/> AI Sentiment Filter Active</p>
                  </div>
                  <Star size={80} className="text-[#D4AF37] opacity-10 animate-pulse"/>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {allReviews.length === 0 ? <div className="col-span-2 text-center text-gray-600 font-serif italic text-2xl py-20">No external data nodes detected.</div> : allReviews.map((rev:any, i:number) => (
                    <div key={i} className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[45px] flex flex-col justify-between group hover:border-[#D4AF37]/30 transition-all shadow-lg relative overflow-hidden">
                       
                       {/* Sentiment Badge Background Glow */}
                       <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none ${rev.rating >= 4 ? 'bg-green-500' : rev.rating === 3 ? 'bg-orange-500' : 'bg-red-500'}`}></div>

                       <div>
                          <div className="flex justify-between items-start mb-8 relative z-10">
                             <div>
                               <p className="font-bold text-white text-2xl mb-1">{rev.userName}</p>
                               <p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest font-mono">UID: {rev.product?.slice(-6) || 'GLOBAL'}</p>
                             </div>
                             <div className="flex flex-col items-end gap-2">
                               <span className={`text-[8px] font-black uppercase px-4 py-1.5 rounded-full border tracking-widest ${rev.visibility === 'public' ? 'bg-green-500/10 text-green-500 border-green-500/20' : rev.visibility === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                                  STATUS: {rev.visibility}
                               </span>
                               <span className={`text-[8px] font-black uppercase px-3 py-1 rounded bg-white/5 text-gray-400`}>
                                  AI: {rev.rating >= 4 ? 'POSITIVE' : rev.rating === 3 ? 'NEUTRAL' : 'NEGATIVE'}
                               </span>
                             </div>
                          </div>
                          
                          <div className="flex gap-1 text-[#D4AF37] mb-6 drop-shadow-lg">
                             {[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={16} fill="currentColor"/>)}
                             {[...Array(5 - rev.rating)].map((_, idx)=><Star key={idx+10} size={16} className="text-white/10"/>)}
                          </div>
                          
                          <p className="text-gray-300 font-serif italic text-xl leading-relaxed relative z-10">"{rev.comment}"</p>
                       </div>
                       
                       <div className="flex gap-4 border-t border-white/5 pt-8 mt-12 relative z-10">
                          <button onClick={()=>handleReviewAction(rev._id, 'public')} className="flex-1 py-5 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">Approve Node</button>
                          <button onClick={()=>handleReviewAction(rev._id, 'rejected')} className="flex-1 py-5 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">Reject & Purge</button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {/* ================= 8. SALES FORCE (AFFILIATES) ================= */}
          {activeTab === 'SALES_FORCE' && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key="salesforce" className="space-y-12">
               
               <div className="bg-gradient-to-br from-[#0A0A0A] to-[#00150F] p-16 rounded-[60px] border border-[#D4AF37]/30 flex flex-col md:flex-row justify-between items-center shadow-[0_20px_50px_rgba(212,175,55,0.1)] relative overflow-hidden gap-10">
                  <div className="absolute right-0 top-0 opacity-5 pointer-events-none -translate-y-1/4 translate-x-1/4"><LinkIcon size={400}/></div>
                  <div className="relative z-10 max-w-2xl">
                    <h3 className="text-5xl md:text-6xl font-serif italic mb-6 text-white leading-tight">Empire Expansion Network</h3>
                    <p className="text-gray-400 text-lg font-serif italic tracking-wide">Monitor affiliate nodes, track global traffic influx, and manage revenue share protocols in real-time.</p>
                  </div>
                  <button onClick={() => setIsAgentModalOpen(true)} className="relative z-10 bg-[#D4AF37] text-black px-12 py-7 rounded-full font-black uppercase text-[11px] tracking-[5px] hover:bg-white transition-all shadow-2xl flex items-center gap-4 shrink-0">
                     <PlusCircle size={20}/> Generate Agent Node
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 text-center">
                     <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-4">Total Active Agents</p>
                     <h2 className="text-6xl font-black font-serif text-white">{agents.length}</h2>
                  </div>
                  <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 text-center">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Network Traffic</p>
                     <h2 className="text-6xl font-black font-serif text-white">{agents.reduce((acc, a) => acc + (a.clicks || 0), 0).toLocaleString()}</h2>
                  </div>
                  <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 text-center">
                     <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-4">Network Yield</p>
                     <h2 className="text-6xl font-black font-serif text-white">₹{agents.reduce((acc, a) => acc + (a.revenue || 0), 0).toLocaleString()}</h2>
                  </div>
               </div>

               <div className="bg-[#0A0A0A] rounded-[50px] border border-white/5 overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-white/5"><h4 className="text-[11px] font-black uppercase tracking-[5px] text-gray-400 pl-4">Live Agent Ledger</h4></div>
                  <table className="w-full text-left">
                     <thead className="bg-black/50 text-[9px] font-black uppercase tracking-[6px] text-gray-500 border-b border-white/5">
                        <tr>
                           <th className="p-10 pl-12">Agent Identity</th>
                           <th className="p-10">Protocol Link</th>
                           <th className="p-10 text-center">Traffic Inflow</th>
                           <th className="p-10 text-center">Conversions</th>
                           <th className="p-10 text-right pr-12">Net Yield</th>
                        </tr>
                     </thead>
                     <tbody>
                        {agents.length === 0 ? (
                            <tr><td colSpan={5} className="p-24 text-center font-serif italic text-gray-500 text-2xl">No agents recruited. The Empire requires expansion.</td></tr>
                        ) : agents.map((agent, i) => (
                           <tr key={agent._id || `agt-${i}`} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                              <td className="p-10 pl-12">
                                 <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                                       {agent.name?.split(' ').map((n:any)=>n[0]).join('').substring(0,2) || 'A'}
                                    </div>
                                    <div>
                                       <p className="font-bold text-xl text-white mb-1">{agent.name}</p>
                                       <p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[4px]">{agent.tier || 'Imperial Agent'}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-10">
                                 <div className="flex items-center gap-3 font-mono text-sm text-blue-400 bg-blue-500/5 px-5 py-3 rounded-2xl w-max border border-blue-500/20">
                                    <LinkIcon size={16}/> ?ref={agent.code}
                                 </div>
                                 <p className="text-[9px] text-gray-500 uppercase mt-3 ml-2 tracking-widest font-bold">Commission Rate: {agent.commissionRate}%</p>
                              </td>
                              <td className="p-10 text-center text-gray-300 font-bold text-2xl">{agent.clicks || 0}</td>
                              <td className="p-10 text-center font-black text-green-400 text-2xl">{agent.sales || 0}</td>
                              <td className="p-10 text-right pr-12">
                                 <p className="font-black text-3xl text-white font-serif tracking-tighter">₹{(agent.revenue || 0).toLocaleString('en-IN')}</p>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {/* ================= 9. AI NEURAL CORE ================= */}
          {activeTab === 'AI_ENGINE' && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key="ai" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  
                  <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-[#D4AF37]/30 space-y-12 shadow-[0_20px_60px_rgba(212,175,55,0.1)] relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#D4AF37]/5 to-transparent pointer-events-none z-0"></div>
                     
                     <div className="flex justify-between items-center border-b border-white/5 pb-8 relative z-10">
                        <div>
                           <h4 className="text-3xl font-serif italic text-white mb-2">Neural Parameters</h4>
                           <p className="text-[10px] font-black uppercase tracking-[5px] text-gray-500">Autonomous Pricing Matrix</p>
                        </div>
                        <div className="flex items-center gap-4 bg-black border border-white/10 p-2 rounded-full">
                           <span className={`text-[9px] uppercase font-black tracking-widest px-4 ${pricingRules.isAiPricingActive ? 'text-[#D4AF37]' : 'text-gray-600'}`}>{pricingRules.isAiPricingActive ? 'ACTIVE' : 'DORMANT'}</span>
                           <button onClick={() => setPricingRules({...pricingRules, isAiPricingActive: !pricingRules.isAiPricingActive})} className={`w-16 h-8 rounded-full p-1 transition-colors ${pricingRules.isAiPricingActive ? 'bg-[#D4AF37]' : 'bg-gray-800'}`}>
                              <div className={`w-6 h-6 bg-black rounded-full transition-transform shadow-md ${pricingRules.isAiPricingActive ? 'translate-x-8' : 'translate-x-0'}`}></div>
                           </button>
                        </div>
                     </div>
                     
                     <div className="space-y-10 relative z-10">
                        <div className="space-y-4">
                           <div className="flex justify-between items-end mb-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[4px]">Max Markup (Surge Logic)</label>
                              <span className="text-2xl font-mono text-[#D4AF37]">{pricingRules.maxMarkupPercent}%</span>
                           </div>
                           <input type="range" min="0" max="50" value={pricingRules.maxMarkupPercent} onChange={(e) => setPricingRules({...pricingRules, maxMarkupPercent: Number(e.target.value)})} className="w-full h-2 bg-white/10 rounded-full appearance-none accent-[#D4AF37] cursor-pointer" />
                           <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">AI ceiling for price inflation during high traffic.</p>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-white/5">
                           <div className="flex justify-between items-end mb-2">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[4px]">Max Loyalty Discount</label>
                              <span className="text-2xl font-mono text-blue-400">{pricingRules.maxDiscountPercent}%</span>
                           </div>
                           <input type="range" min="0" max="30" value={pricingRules.maxDiscountPercent} onChange={(e) => setPricingRules({...pricingRules, maxDiscountPercent: Number(e.target.value)})} className="w-full h-2 bg-white/10 rounded-full appearance-none accent-blue-500 cursor-pointer" />
                           <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">AI floor for auto-discounts targeting returning VIPs.</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-12">
                     <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-white/5 space-y-10 shadow-xl">
                        <h4 className="text-gray-400 font-black uppercase tracking-[4px] text-sm flex items-center gap-3 border-b border-white/5 pb-8"><BrainCircuit size={20}/> Behavioral Activation Thresholds</h4>
                        
                        <div className="space-y-8">
                           <div className="flex justify-between items-center bg-black border border-white/10 p-6 rounded-3xl">
                              <div>
                                 <p className="text-[10px] font-black uppercase text-white tracking-[3px] mb-1">Low Stock Surge Flag</p>
                                 <p className="text-[8px] text-gray-500 uppercase tracking-widest">Activate scarcity pricing at X units.</p>
                              </div>
                              <input type="number" value={pricingRules.lowStockThreshold} onChange={(e) => setPricingRules({...pricingRules, lowStockThreshold: Number(e.target.value)})} className="w-20 bg-transparent border-b border-[#D4AF37]/50 p-2 text-2xl text-center outline-none focus:border-[#D4AF37] font-mono text-[#D4AF37]" />
                           </div>
                           
                           <div className="flex justify-between items-center bg-black border border-white/10 p-6 rounded-3xl">
                              <div>
                                 <p className="text-[10px] font-black uppercase text-white tracking-[3px] mb-1">Trending Velocity Flag</p>
                                 <p className="text-[8px] text-gray-500 uppercase tracking-widest">Activate surge if X units sold in 24h.</p>
                              </div>
                              <input type="number" value={pricingRules.trendingThreshold} onChange={(e) => setPricingRules({...pricingRules, trendingThreshold: Number(e.target.value)})} className="w-20 bg-transparent border-b border-[#D4AF37]/50 p-2 text-2xl text-center outline-none focus:border-[#D4AF37] font-mono text-[#D4AF37]" />
                           </div>
                        </div>

                        <button onClick={handleSaveAIRules} className="w-full py-7 bg-[#D4AF37] text-black font-black uppercase rounded-3xl text-[11px] tracking-[6px] hover:bg-white transition-all shadow-[0_15px_40px_rgba(212,175,55,0.2)] mt-8 flex items-center justify-center gap-3">
                           <Zap size={16}/> Compile & Deploy Neural Matrix
                        </button>
                     </div>

                     {/* Fraud & Security Mini-Node inside AI Tab */}
                     <div className="bg-gradient-to-tr from-green-900/10 to-[#0A0A0A] p-8 rounded-[40px] border border-green-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="p-4 bg-green-500/10 rounded-2xl text-green-500"><ShieldCheck size={24}/></div>
                           <div><p className="text-white font-bold mb-1">AI Fraud Guardian</p><p className="text-[9px] text-green-500 font-black uppercase tracking-widest">Status: Monitoring 0 anomalies</p></div>
                        </div>
                        <button className="text-[9px] text-gray-500 uppercase font-black hover:text-white transition-colors">View Logs</button>
                     </div>
                  </div>
            </motion.div>
          )}

          {/* ================= 10. SECURITY & LOGS (NEW ENTERPRISE FEATURE) ================= */}
          {activeTab === 'SECURITY' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-10">
               
               <div className="bg-gradient-to-r from-red-900/20 to-[#0A0A0A] border border-red-500/20 p-12 rounded-[50px] flex justify-between items-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                  <div className="flex items-center gap-8">
                    <div className="p-6 bg-red-500/10 rounded-3xl text-red-500"><ShieldAlert size={40} className="animate-pulse" /></div>
                    <div>
                       <h3 className="text-4xl font-serif italic text-white mb-2">Imperial Security Node</h3>
                       <p className="text-[10px] text-red-400 uppercase font-black tracking-[6px]">Encryption Level: Military AES-256 GCM</p>
                    </div>
                  </div>
                  <button className="px-12 py-6 bg-red-500 text-white text-[11px] font-black uppercase tracking-[5px] rounded-3xl shadow-[0_10px_30px_rgba(239,68,68,0.3)] hover:bg-white hover:text-red-500 transition-all flex items-center gap-3">
                     <Lock size={16}/> Initiate Lockdown
                  </button>
               </div>

               <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-white/5">
                  <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
                     <h4 className="text-xs font-black uppercase tracking-[5px] text-[#D4AF37]">Real-time Audit Ledger</h4>
                     <button className="text-[9px] font-black uppercase text-gray-500 hover:text-white flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full"><Download size={12}/> Dump Logs</button>
                  </div>
                  
                  <div className="space-y-4 h-96 overflow-y-auto custom-scrollbar pr-4">
                     {[
                       { time: '14:20:05', act: 'Admin Authentication Protocol Success', node: 'Mumbai_Node_01', ip: '192.168.1.45', status: 'SUCCESS' },
                       { time: '13:55:12', act: 'AI Modified Product #P7429 Valuation (+12%)', node: 'Neural_Core_Auto', ip: 'internal', status: 'INFO' },
                       { time: '13:10:04', act: 'Global CMS Deployment Cycle Initialized', node: 'Cloud_Vercel_Edge', ip: 'internal', status: 'WARNING' },
                       { time: '11:45:22', act: 'Failed login attempt. Invalid signature.', node: 'External_Unknown', ip: '104.28.19.12', status: 'DANGER' },
                       { time: '09:12:00', act: 'Asset #8912 injected to global catalog.', node: 'Admin_Session', ip: '192.168.1.45', status: 'SUCCESS' },
                       { time: '08:00:00', act: 'Daily Database Backup Snapshot Created', node: 'MongoDB_Atlas', ip: 'internal', status: 'INFO' }
                     ].map((l, i) => (
                       <div key={i} className={`flex items-center gap-8 p-6 bg-black rounded-3xl border border-white/5 group hover:border-white/20 transition-all font-mono ${l.status==='DANGER' ? 'border-red-500/30 bg-red-500/5' : ''}`}>
                          <span className={`text-[10px] w-24 shrink-0 ${l.status==='DANGER' ? 'text-red-400' : 'text-gray-500'}`}>{l.time}</span>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${l.status==='SUCCESS' ? 'bg-green-500' : l.status==='WARNING' ? 'bg-orange-500' : l.status==='DANGER' ? 'bg-red-500 animate-ping' : 'bg-blue-500'}`}></div>
                          <span className={`text-xs flex-1 ${l.status==='DANGER' ? 'text-red-200' : 'text-gray-300'}`}>{l.act}</span>
                          <div className="flex flex-col items-end shrink-0 w-40">
                             <span className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">[{l.node}]</span>
                             <span className="text-[8px] text-gray-600 mt-1 opacity-0 group-hover:opacity-100">IP: {l.ip}</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ImperialGodmodeOS), { ssr: false });
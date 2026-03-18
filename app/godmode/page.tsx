"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Package, BrainCircuit, Landmark, Users, RefreshCcw, Trash2, Layout, Video, 
  AlignCenter, AlignLeft, AlignRight, PlusCircle, Link as LinkIcon, ShieldCheck, Eye, Save, 
  Image as ImageIcon, Box, Zap, AlertTriangle, Truck, MapPin, BellRing, Edit3, Plus, X, CheckCircle, Bot, Star, TrendingUp
} from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import dynamic from 'next/dynamic';

const MODULES = [
  { id: 'FULL_DASHBOARD', icon: BarChart3, label: 'Empire Analytics' },
  { id: 'CRM', icon: Users, label: 'Customer CRM & VIP' },
  { id: 'MARKETING', icon: Zap, label: 'Marketing & Coupons' },
  { id: 'INVENTORY', icon: Package, label: 'Advanced Catalog' },
  { id: 'ORDER_TRACKER', icon: Truck, label: 'Dispatch & Orders' },
  { id: 'PAGE_BUILDER', icon: Layout, label: 'UI Theme Builder' },
  { id: 'REVIEWS', icon: Star, label: 'Review Control Center' },
  { id: 'SALES_FORCE', icon: LinkIcon, label: 'Sales Empire' },
  { id: 'AI_ENGINE', icon: Bot, label: 'AI & Pricing Engine' }
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

  const [leads, setLeads] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [liveWatches, setLiveWatches] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  
  const [fullAnalytics, setFullAnalytics] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [forecast, setForecast] = useState<any>(null);

  const [heroSlides, setHeroSlides] = useState([{ id: 1, type: 'video', url: '', heading: 'Time is Gold' }]);
  const [aboutConfig, setAboutConfig] = useState({ content: '', alignment: 'center', style: 'luxury', boldWords: '' });
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_GALLERY); 
  const [uiConfig, setUiConfig] = useState({ primaryColor: '#D4AF37', bgColor: '#050505', fontFamily: 'serif' });
  
  const [watchForm, setWatchForm] = useState({ name: '', brand: '', category: 'Investment Grade', price: '', offerPrice: '', stock: '', images: '', videoUrl: '', model3DUrl: '', description: '', specifications: '' });
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentForm, setAgentForm] = useState({ name: '', email: '', code: '', tier: 'Imperial Agent', commissionRate: 5 });

  const [pricingRules, setPricingRules] = useState({ isAiPricingActive: true, maxMarkupPercent: 15, maxDiscountPercent: 10, lowStockThreshold: 3, trendingThreshold: 10 });

  const fetchSystemIntelligence = async () => {
    setIsSyncing(true);
    try {
      const ts = new Date().getTime();
      const [resLeads, resCms, resProducts, resAgents, resOrders, resRules, resAnalytics, resInsights, resReviews, resMarketing, resIntel] = await Promise.all([
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
        fetch(`/api/admin/intelligence?t=${ts}`).then(r => r.ok ? r.json() : null)
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

  const handleAddHeroSlide = () => setHeroSlides([...heroSlides, { id: Date.now(), type: 'image', url: '', heading: 'New Slide' }]);
  const handleRemoveHeroSlide = (id: number) => setHeroSlides(heroSlides.filter(s => s.id !== id));

  const handleDeployCMS = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ heroSlides, aboutConfig, galleryImages, uiConfig }) });
      alert("Empire UI & Theme Updated Successfully!");
    } catch (e) { alert("CMS Deployment Failed"); }
    finally { setIsSyncing(false); }
  };

  const handleSaveAIRules = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/ai/rules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pricingRules) });
      alert("AI Pricing Logic Updated!");
    } catch (e) { alert("Failed to save rules."); }
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

      const finalProduct = {
          ...watchForm,
          images: imageArray,
          imageUrl: imageArray[0],
          specifications: specObj
      };

      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(finalProduct) });
      if (res.ok) { 
          alert("Asset Injected to Global Vault!"); 
          setWatchForm({ name: '', brand: '', category: 'Investment Grade', price: '', offerPrice: '', stock: '', images: '', videoUrl: '', model3DUrl: '', description: '', specifications: '' }); 
          fetchSystemIntelligence(); 
      }
    } catch (e) { alert("Injection Failed"); } finally { setIsSyncing(false); }
  };

  const handleDeleteAsset = async (id: string) => {
    if(!confirm("Purge asset from global vault?")) return;
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

  if (status === "loading") return <div className="h-screen bg-black flex items-center justify-center text-[#D4AF37] animate-pulse italic tracking-[10px] font-black">♞ BOOTING IMPERIAL OS...</div>;
  if (!session || session.user?.role !== 'SUPER_ADMIN') return <div className="h-screen bg-[#050505] flex items-center justify-center"><button onClick={() => signIn("google")} className="bg-[#D4AF37] text-black px-10 py-4 rounded-full font-black tracking-widest uppercase">ADMIN ACCESS REQUIRED</button></div>;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* RECRUITMENT MODAL */}
      <AnimatePresence>
        {isAgentModalOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} exit={{scale:0.9, y:20}} className="bg-[#0A0A0A] border border-[#D4AF37]/30 p-10 rounded-[40px] w-full max-w-lg relative shadow-2xl">
               <button onClick={() => setIsAgentModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
               <h3 className="text-3xl font-serif italic mb-2 text-[#D4AF37]">Recruit Imperial Agent</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">Deploy a new affiliate tracker</p>
               <div className="space-y-5">
                 <input value={agentForm.name} onChange={(e) => setAgentForm({...agentForm, name: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs outline-none focus:border-[#D4AF37]" placeholder="Agent Full Name"/>
                 <input value={agentForm.email} onChange={(e) => setAgentForm({...agentForm, email: e.target.value})} type="email" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs outline-none focus:border-[#D4AF37]" placeholder="Agent Email Address"/>
                 <div className="grid grid-cols-2 gap-4">
                   <input value={agentForm.code} onChange={(e) => setAgentForm({...agentForm, code: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs outline-none focus:border-[#D4AF37] uppercase font-mono" placeholder="Custom Code (Optional)"/>
                   <input value={agentForm.commissionRate} onChange={(e) => setAgentForm({...agentForm, commissionRate: Number(e.target.value)})} type="number" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs outline-none focus:border-[#D4AF37]" placeholder="Commission %"/>
                 </div>
                 <select value={agentForm.tier} onChange={(e) => setAgentForm({...agentForm, tier: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 outline-none focus:border-[#D4AF37]">
                    <option>Imperial Agent</option><option>Elite Partner</option><option>Ambassador</option>
                 </select>
                 <button onClick={handleRecruitAgent} className="w-full py-6 bg-[#D4AF37] text-black font-black uppercase rounded-3xl text-[11px] tracking-[4px] hover:bg-white transition-all shadow-xl mt-4">Initiate Recruitment</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className="w-[320px] bg-[#0A0A0A] border-r border-white/5 flex flex-col shadow-2xl z-50">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-black text-xs">CEO</div>
          <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Master Admin</p><h1 className="text-sm font-serif italic text-white truncate">{session.user?.name}</h1></div>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {MODULES.map(m => (
            <button key={m.id} onClick={() => setActiveTab(m.id)} className={`w-full flex items-center gap-5 px-6 py-5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === m.id ? 'bg-[#D4AF37] text-black shadow-xl scale-[1.02]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <m.icon size={20}/> {m.label}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5"><button onClick={() => signOut()} className="w-full py-5 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 rounded-2xl hover:bg-red-500 transition-all hover:text-white">Disconnect System</button></div>
      </aside>

      {/* CONTENT ENGINE */}
      <main className="flex-1 overflow-y-auto p-12 bg-[#050505] relative custom-scrollbar">
        <header className="flex justify-between items-end mb-12 border-b border-white/5 pb-10">
          <div className="space-y-3">
             <h2 className="text-5xl md:text-7xl font-serif italic font-black tracking-tighter leading-none">{activeTab.replace('_', ' ')}</h2>
             <p className="text-[10px] font-black uppercase tracking-[6px] text-[#D4AF37] flex items-center gap-3"><ShieldCheck size={14}/> Imperial Node Status: Active</p>
          </div>
          <button onClick={fetchSystemIntelligence} className="p-6 bg-white/5 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all border border-white/10 shadow-inner"><RefreshCcw size={24} className={isSyncing ? "animate-spin" : ""}/></button>
        </header>

        <AnimatePresence mode="wait">
          
          {/* ================= 1. FULL DASHBOARD ================= */}
          {activeTab === 'FULL_DASHBOARD' && fullAnalytics && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="dash" className="space-y-10">
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 p-8 rounded-[40px] flex items-start gap-6 shadow-2xl">
                 <BrainCircuit className="text-blue-400 mt-2" size={32}/>
                 <div>
                   <h4 className="text-blue-400 font-black uppercase tracking-widest text-xs mb-4">AI Neural Insights</h4>
                   <ul className="space-y-3">
                     {aiInsights.length > 0 ? aiInsights.map((insight, i) => <li key={i} className="text-sm font-serif italic text-blue-100">{insight}</li>) : <li className="text-sm font-serif italic text-gray-500">System learning... collecting data.</li>}
                   </ul>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-[40px]">
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Gross Revenue</p>
                   <p className="text-5xl font-black text-white font-serif">₹{(fullAnalytics.metrics?.totalRevenue || 0).toLocaleString('en-IN')}</p>
                 </div>
                 <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-[40px]">
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Total Conversions</p>
                   <p className="text-5xl font-black text-[#D4AF37] font-serif">{fullAnalytics.metrics?.totalOrders || 0}</p>
                 </div>
                 <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-[40px]">
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Abandoned Leads</p>
                   <p className="text-5xl font-black text-red-500 font-serif">{leads.length}</p>
                 </div>
              </div>

              {forecast && (
                 <div className="bg-gradient-to-tr from-[#002B19] to-[#0A0A0A] p-10 rounded-[40px] border border-[#D4AF37]/20 shadow-2xl mt-10">
                    <h4 className="text-[#D4AF37] font-black uppercase tracking-[4px] text-sm mb-4 flex items-center gap-3"><TrendingUp size={20}/> AI Revenue Forecast</h4>
                    <p className="text-gray-400 text-sm mb-2">Projected revenue for the next 30 days based on current momentum:</p>
                    <p className="text-5xl font-black font-serif text-white">₹{Math.round(forecast.projectedNext30Days || 0).toLocaleString('en-IN')}</p>
                 </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5">
                    <h4 className="text-[#D4AF37] font-black uppercase tracking-[4px] text-sm mb-8">Regional Heatmap</h4>
                    <div className="space-y-6">
                      {fullAnalytics.countrySales.length === 0 ? <p className="text-gray-500 italic">No region data yet.</p> : fullAnalytics.countrySales.map((c:any, i:number) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-2 text-gray-300"><span className="uppercase font-bold">{c._id || 'India'}</span><span className="font-bold text-white">₹{c.revenue.toLocaleString('en-IN')}</span></div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${Math.min((c.revenue/(fullAnalytics.metrics?.totalRevenue||1))*100, 100)}%`}} className="h-full bg-[#D4AF37]"/></div>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5">
                    <h4 className="text-[#D4AF37] font-black uppercase tracking-[4px] text-sm mb-8">Traffic Origins</h4>
                    <div className="flex flex-wrap gap-4">
                       {fullAnalytics.trafficSources.length === 0 ? <p className="text-gray-500 italic">No traffic data yet.</p> : fullAnalytics.trafficSources.map((t:any, i:number) => (
                         <div key={i} className="flex-1 min-w-[120px] bg-white/5 p-6 rounded-3xl text-center border border-white/10">
                           <p className="text-4xl font-black text-white mb-2">{t.count}</p>
                           <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">{t._id || 'Direct'}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {/* ================= 2. CRM SYSTEM ================= */}
          {activeTab === 'CRM' && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} key="crm" className="space-y-10">
                <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/10">
                   <h3 className="text-2xl font-serif italic text-white mb-6">VIP Client Management</h3>
                   <p className="text-gray-500 text-sm mb-8">Manage wallet balances, loyalty points, and assign VIP concierge status.</p>
                   <div className="bg-white/5 p-8 rounded-3xl text-center border border-white/10 border-dashed">
                      <Users size={40} className="mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400 font-serif italic">CRM Database linked. Gathering historical purchase nodes...</p>
                   </div>
                </div>
             </motion.div>
          )}

          {/* ================= 3. MARKETING SYSTEM ================= */}
          {activeTab === 'MARKETING' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="marketing" className="space-y-10">
               <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-[#D4AF37]/30 shadow-2xl">
                  <h3 className="text-2xl font-serif italic text-white mb-6">Coupon & Campaign Engine</h3>
                  <div className="grid grid-cols-4 gap-4 mb-8">
                     <input id="c_code" className="bg-black border border-white/10 p-4 rounded-xl text-xs uppercase" placeholder="COUPON CODE (e.g. VIP20)"/>
                     <input id="c_val" type="number" className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Discount %"/>
                     <input id="c_min" type="number" className="bg-black border border-white/10 p-4 rounded-xl text-xs" placeholder="Min Order Value"/>
                     <button onClick={() => {
                        const data = { 
                          code: (document.getElementById('c_code') as HTMLInputElement).value,
                          discountValue: Number((document.getElementById('c_val') as HTMLInputElement).value),
                          minOrderValue: Number((document.getElementById('c_min') as HTMLInputElement).value)
                        };
                        fetch('/api/admin/marketing', { method:'POST', body: JSON.stringify(data)}).then(()=>fetchSystemIntelligence());
                     }} className="bg-[#D4AF37] text-black font-black uppercase text-xs rounded-xl">Generate Code</button>
                  </div>

                  <table className="w-full text-left text-xs">
                     <thead className="text-gray-500 uppercase tracking-widest border-b border-white/10"><tr><th className="pb-4">Code</th><th className="pb-4">Value</th><th className="pb-4">Used</th><th className="pb-4">Status</th></tr></thead>
                     <tbody>
                        {coupons.map((c, i) => (
                           <tr key={i} className="border-b border-white/5">
                             <td className="py-4 font-mono font-bold text-[#D4AF37]">{c.code}</td>
                             <td className="py-4">{c.discountValue}%</td>
                             <td className="py-4">{c.usedCount} times</td>
                             <td className="py-4"><span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full uppercase tracking-widest text-[9px]">Active</span></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {/* ================= 4. ADVANCED INVENTORY ================= */}
          {activeTab === 'INVENTORY' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="inv" className="grid grid-cols-1 xl:grid-cols-12 gap-10">
               <div className="xl:col-span-5 space-y-6 h-max sticky top-0">
                  <div className="bg-[#0A0A0A] p-8 rounded-[40px] border border-[#D4AF37]/20 shadow-2xl">
                     <h3 className="text-[#D4AF37] text-xs font-black uppercase tracking-[4px] mb-6 flex items-center gap-2"><Package size={16}/> Essential Info</h3>
                     <div className="space-y-4">
                       <input value={watchForm.name} onChange={(e) => setWatchForm({...watchForm, name: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37]" placeholder="Asset Name"/>
                       <div className="grid grid-cols-2 gap-4">
                         <input value={watchForm.brand} onChange={(e) => setWatchForm({...watchForm, brand: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37]" placeholder="Brand Name"/>
                         <select value={watchForm.category} onChange={(e) => setWatchForm({...watchForm, category: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 outline-none focus:border-[#D4AF37]">
                            <option>Investment Grade</option><option>Rare Vintage</option><option>Modern Complications</option>
                         </select>
                       </div>
                       <textarea value={watchForm.description} onChange={(e) => setWatchForm({...watchForm, description: e.target.value})} rows={3} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-serif italic outline-none focus:border-[#D4AF37]" placeholder="Detailed Description"/>
                     </div>
                  </div>

                  <div className="bg-[#0A0A0A] p-8 rounded-[40px] border border-white/5">
                     <h3 className="text-gray-400 text-xs font-black uppercase tracking-[4px] mb-6 flex items-center gap-2"><ImageIcon size={16}/> Advanced Media & Specs</h3>
                     <div className="space-y-4">
                       <textarea value={watchForm.images} onChange={(e) => setWatchForm({...watchForm, images: e.target.value})} rows={2} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37]" placeholder="Image URLs (Comma separated)"/>
                       <textarea value={watchForm.specifications} onChange={(e) => setWatchForm({...watchForm, specifications: e.target.value})} rows={2} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37]" placeholder="Specs (e.g. Movement: Automatic, Case: Gold)"/>
                     </div>
                  </div>

                  <div className="bg-[#0A0A0A] p-8 rounded-[40px] border border-white/5">
                     <h3 className="text-gray-400 text-xs font-black uppercase tracking-[4px] mb-6 flex items-center gap-2"><Landmark size={16}/> Financials</h3>
                     <div className="grid grid-cols-3 gap-4">
                        <input value={watchForm.price} onChange={(e) => setWatchForm({...watchForm, price: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37]" placeholder="MRP (₹)"/>
                        <input value={watchForm.offerPrice} onChange={(e) => setWatchForm({...watchForm, offerPrice: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37]" placeholder="Offer (₹)"/>
                        <input value={watchForm.stock} onChange={(e) => setWatchForm({...watchForm, stock: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37]" placeholder="Stock Qty"/>
                     </div>
                  </div>

                  <button onClick={handlePublishAsset} className="w-full py-6 bg-[#D4AF37] text-black font-black uppercase rounded-3xl text-[11px] tracking-[4px] hover:bg-white transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)]">Inject to Catalogue</button>
               </div>

               <div className="xl:col-span-7 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                     {liveWatches.map((watch, idx) => (
                        <div key={watch._id || idx} className="bg-[#0A0A0A] p-8 rounded-[40px] border border-white/5 flex flex-col gap-6 hover:border-[#D4AF37]/30 transition-all group">
                           <div className="h-48 bg-black rounded-3xl flex items-center justify-center relative overflow-hidden group-hover:bg-white/5 transition-colors">
                              <span className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">STOCK: {watch.stock || 0}</span>
                              <img src={watch.imageUrl || (watch.images && watch.images[0])} className="h-full object-contain p-4 mix-blend-screen" />
                           </div>
                           <div className="flex justify-between items-end">
                             <div>
                               <p className="text-[9px] font-black text-[#D4AF37] uppercase mb-1 tracking-widest">{watch.category || 'Luxury'}</p>
                               <h4 className="text-xl font-serif italic text-white truncate max-w-[150px]">{watch.name || watch.title}</h4>
                               <p className="text-sm font-black mt-2">₹{Number(watch.offerPrice || watch.price || watch.basePrice).toLocaleString('en-IN')}</p>
                             </div>
                             <button onClick={() => handleDeleteAsset(watch._id)} className="p-4 bg-white/5 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 5. ORDER TRACKER ================= */}
          {activeTab === 'ORDER_TRACKER' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="orders" className="grid grid-cols-1 xl:grid-cols-3 gap-10">
               <div className="xl:col-span-2 bg-[#0A0A0A] p-12 rounded-[50px] border border-white/5 space-y-8">
                  <h3 className="text-sm font-black uppercase tracking-[5px] text-[#D4AF37] flex items-center gap-3"><MapPin size={20}/> Global Asset Dispatch</h3>
                  <div className="space-y-6">
                     {orders.length > 0 ? orders.map((order: any, i: number) => (
                        <div key={order._id || `ord-${i}`} className="p-8 bg-black border border-white/5 rounded-[30px] flex items-center justify-between group hover:border-white/10 transition-colors">
                           <div className="flex items-center gap-6">
                             <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37]"><Truck size={24}/></div>
                             <div>
                               <h4 className="font-bold text-xl">{order.orderId || 'PENDING'} • {order.items?.[0]?.name || 'Asset'}</h4>
                               <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">{order.customer?.name} | {order.customer?.city}, {order.customer?.country || 'India'}</p>
                             </div>
                           </div>
                           <div className="text-right flex flex-col items-end gap-3">
                              <select value={order.status} onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)} className="bg-transparent border border-white/20 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest rounded-xl p-2 outline-none cursor-pointer">
                                 <option className="bg-black" value="PENDING">Pending</option><option className="bg-black" value="PROCESSING">Processing</option>
                                 <option className="bg-black" value="DISPATCHED">Dispatched</option><option className="bg-black" value="TRANSIT">In Transit</option>
                                 <option className="bg-black" value="DELIVERED">Delivered</option><option className="bg-black text-red-500" value="CANCELLED">Cancelled</option>
                              </select>
                              <p className="text-xs font-black text-white uppercase tracking-widest">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                           </div>
                        </div>
                     )) : <div className="text-center py-20 text-gray-600 font-serif italic text-xl">No active requisitions in transit.</div>}
                  </div>
               </div>
               <div className="bg-[#0A0A0A] p-10 rounded-[50px] border border-white/5 flex flex-col">
                  <h3 className="text-sm font-black uppercase tracking-[5px] text-[#D4AF37] mb-8 flex items-center gap-3"><BrainCircuit size={20}/> AI Concierge Logs</h3>
                  <div className="flex-1 space-y-5 overflow-y-auto pr-4 custom-scrollbar">
                     <div className="p-5 bg-white/5 rounded-2xl text-xs font-serif italic text-gray-400 border-l-2 border-[#D4AF37]">"AI detected location update for Orders. Routes Optimized."</div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 6. PAGE BUILDER ================= */}
          {activeTab === 'PAGE_BUILDER' && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key="builder" className="grid grid-cols-1 xl:grid-cols-2 gap-10">
               <div className="bg-[#0A0A0A] p-10 rounded-[50px] border border-white/5 space-y-8">
                  <div className="flex justify-between items-center"><h3 className="text-[#D4AF37] text-sm font-black uppercase tracking-[5px] flex items-center gap-3"><Video size={20}/> Cinematic Slides</h3><button onClick={handleAddHeroSlide} className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-2 hover:text-white transition-colors"><Plus size={14}/> Add New Slide</button></div>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                     {heroSlides.map((slide, i) => (
                        <div key={slide.id || `slide-${i}`} className="p-8 bg-black border border-white/5 rounded-[30px] space-y-5 relative">
                           <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Sequence #{i+1}</span><button onClick={() => handleRemoveHeroSlide(slide.id)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 size={16}/></button></div>
                           <select value={slide.type} onChange={(e) => { const n = [...heroSlides]; n[i].type = e.target.value; setHeroSlides(n); }} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-gray-400 font-black uppercase tracking-widest outline-none">
                              <option value="video">Cinematic Video (Auto-play)</option><option value="image">High-Res Image (5s delay)</option>
                           </select>
                           <input value={slide.url} onChange={(e) => { const n = [...heroSlides]; n[i].url = e.target.value; setHeroSlides(n); }} className="w-full bg-transparent border-b border-white/10 p-3 text-xs outline-none focus:border-[#D4AF37]" placeholder="Asset Media URL (CDN Link)"/>
                           <input value={slide.heading} onChange={(e) => { const n = [...heroSlides]; n[i].heading = e.target.value; setHeroSlides(n); }} className="w-full bg-transparent border-b border-white/10 p-3 text-sm font-serif italic outline-none focus:border-[#D4AF37]" placeholder="Main Headline"/>
                        </div>
                     ))}
                  </div>
                  
                  <h3 className="text-[#D4AF37] text-sm font-black uppercase tracking-[5px] flex items-center gap-3 mt-10"><ImageIcon size={20}/> Dynamic Gallery (6 Images)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {galleryImages.map((imgUrl, i) => (
                        <input key={i} value={imgUrl} onChange={(e) => { const n = [...galleryImages]; n[i] = e.target.value; setGalleryImages(n); }} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37]" placeholder={`Image ${i+1} URL`}/>
                    ))}
                  </div>

                  <h3 className="text-[#D4AF37] text-sm font-black uppercase tracking-[5px] flex items-center gap-3 mt-10"><Layout size={20}/> Global UI Theme</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div><p className="text-[9px] uppercase text-gray-500 mb-2">Primary Color</p><input value={uiConfig.primaryColor} onChange={(e) => setUiConfig({...uiConfig, primaryColor: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37]"/></div>
                     <div><p className="text-[9px] uppercase text-gray-500 mb-2">Background Color</p><input value={uiConfig.bgColor} onChange={(e) => setUiConfig({...uiConfig, bgColor: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37]"/></div>
                  </div>

                  <button onClick={handleDeployCMS} className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase rounded-2xl text-[10px] tracking-widest hover:bg-white transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)]">Deploy CMS & Theme Changes</button>
               </div>

               <div className="bg-[#0A0A0A] p-10 rounded-[50px] border border-white/5 space-y-8">
                  <h3 className="text-[#D4AF37] text-sm font-black uppercase tracking-[5px] flex items-center gap-3"><AlignCenter size={20}/> Story Designer</h3>
                  <div className="flex gap-4">
                     {['left', 'center', 'right'].map(align => (
                       <button key={align} onClick={() => setAboutConfig({...aboutConfig, alignment: align})} className={`flex-1 py-4 rounded-2xl border flex justify-center items-center transition-colors ${aboutConfig.alignment === align ? 'bg-white text-black' : 'border-white/10 text-gray-500 hover:bg-white/5'}`}>
                         {align === 'left' ? <AlignLeft size={18}/> : align === 'center' ? <AlignCenter size={18}/> : <AlignRight size={18}/>}
                       </button>
                     ))}
                  </div>
                  <textarea value={aboutConfig.content} onChange={(e) => setAboutConfig({...aboutConfig, content: e.target.value})} rows={4} className="w-full bg-black border border-white/10 p-6 rounded-[20px] text-sm font-serif italic leading-relaxed outline-none focus:border-[#D4AF37]" placeholder="Luxury brand story..."/>
                  <input value={aboutConfig.boldWords} onChange={(e) => setAboutConfig({...aboutConfig, boldWords: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs outline-none focus:border-[#D4AF37]" placeholder="Comma separated words to make BOLD (e.g. Legacy, Excellence)"/>
               </div>
            </motion.div>
          )}

          {/* ================= 7. REVIEWS CONTROL ================= */}
          {activeTab === 'REVIEWS' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="rev" className="space-y-6">
               <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-[#D4AF37]/20 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-serif italic text-white mb-2">Reputation Control</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Approve client experiences to display on frontend</p>
                  </div>
                  <Star size={50} className="text-[#D4AF37] opacity-20"/>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allReviews.length === 0 ? <div className="col-span-2 text-center text-gray-500 italic py-10">No reviews submitted yet.</div> : allReviews.map((rev:any, i:number) => (
                    <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[30px] flex flex-col justify-between">
                       <div className="mb-6">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                               <p className="font-bold text-white text-lg">{rev.userName}</p>
                               <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest">Asset ID: {rev.product}</p>
                             </div>
                             <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${rev.visibility === 'public' ? 'bg-green-500/20 text-green-500' : rev.visibility === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                {rev.visibility}
                             </span>
                          </div>
                          <div className="flex text-[#D4AF37] mb-3">{[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={12} fill="currentColor"/>)}</div>
                          <p className="text-gray-400 font-serif italic text-sm">"{rev.comment}"</p>
                       </div>
                       
                       <div className="flex gap-3 border-t border-white/5 pt-6 mt-auto">
                          <button onClick={()=>handleReviewAction(rev._id, 'public')} className="flex-1 py-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Approve</button>
                          <button onClick={()=>handleReviewAction(rev._id, 'rejected')} className="flex-1 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Reject</button>
                          <button onClick={()=>handleReviewAction(rev._id, 'private')} className="flex-1 py-3 bg-white/5 text-gray-400 hover:bg-white hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Private</button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {/* ================= 8. SALES FORCE ================= */}
          {activeTab === 'SALES_FORCE' && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key="salesforce" className="space-y-10">
               <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-[#D4AF37]/30 flex justify-between items-center shadow-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 pointer-events-none"><Users size={250}/></div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-serif italic mb-3 text-white">Empire Sales Force</h3>
                    <p className="text-gray-400 text-sm font-medium tracking-wide">Manage global agents and track requisition revenue in real-time.</p>
                  </div>
                  <button onClick={() => setIsAgentModalOpen(true)} className="relative z-10 bg-[#D4AF37] text-black px-12 py-6 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-xl flex items-center gap-3">
                     <PlusCircle size={16}/> Recruit Agent
                  </button>
               </div>

               <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[5px] text-gray-500 border-b border-white/5">
                        <tr>
                           <th className="p-8">Agent Identity</th>
                           <th className="p-8">Tracking Link</th>
                           <th className="p-8 text-center">Traffic Inflow</th>
                           <th className="p-8 text-center">Sales</th>
                           <th className="p-8 text-right">Net Revenue</th>
                        </tr>
                     </thead>
                     <tbody>
                        {agents.length === 0 ? (
                            <tr><td colSpan={5} className="p-10 text-center font-serif italic text-gray-500">No agents recruited yet. The Empire needs soldiers.</td></tr>
                        ) : agents.map((agent, i) => (
                           <tr key={agent._id || `agt-${i}`} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                              <td className="p-8">
                                 <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center font-bold text-sm border border-[#D4AF37]/20">
                                       {agent.name?.split(' ').map((n:any)=>n[0]).join('') || 'A'}
                                    </div>
                                    <div>
                                       <p className="font-bold text-lg">{agent.name}</p>
                                       <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mt-1">{agent.tier || 'Imperial Agent'}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-8">
                                 <div className="flex items-center gap-3 font-mono text-xs text-blue-400 bg-blue-500/10 px-4 py-2 rounded-xl w-max border border-blue-500/20">
                                    <LinkIcon size={14}/> ?ref={agent.code}
                                 </div>
                                 <p className="text-[9px] text-gray-500 uppercase mt-2 ml-2 tracking-widest">Comm: {agent.commissionRate}%</p>
                              </td>
                              <td className="p-8 text-center text-gray-400 font-bold text-lg">{agent.clicks || 0}</td>
                              <td className="p-8 text-center font-black text-green-500 text-lg">{agent.sales || 0}</td>
                              <td className="p-8 text-right font-black text-xl text-white">₹{(agent.revenue || 0).toLocaleString('en-IN')}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {/* ================= 9. AI PRICING ENGINE ================= */}
          {activeTab === 'AI_ENGINE' && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key="ai" className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-[#D4AF37]/30 space-y-8 shadow-2xl">
                     <div className="flex justify-between items-center pb-6 border-b border-white/5">
                        <h4 className="text-[#D4AF37] font-black uppercase tracking-[4px] text-sm flex items-center gap-3"><Zap size={20}/> Core Operations</h4>
                        <div className="flex items-center gap-3">
                           <span className="text-xs uppercase font-bold text-gray-500">Autonomous Pricing</span>
                           <button onClick={() => setPricingRules({...pricingRules, isAiPricingActive: !pricingRules.isAiPricingActive})} className={`w-14 h-7 rounded-full p-1 transition-colors ${pricingRules.isAiPricingActive ? 'bg-[#D4AF37]' : 'bg-gray-700'}`}>
                              <div className={`w-5 h-5 bg-black rounded-full transition-transform ${pricingRules.isAiPricingActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                           </button>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Max Allowed Markup (Surge) %</p>
                        <input type="number" value={pricingRules.maxMarkupPercent} onChange={(e) => setPricingRules({...pricingRules, maxMarkupPercent: Number(e.target.value)})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] font-mono text-white" />
                     </div>
                     <div className="space-y-4">
                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Max Loyalty Discount %</p>
                        <input type="number" value={pricingRules.maxDiscountPercent} onChange={(e) => setPricingRules({...pricingRules, maxDiscountPercent: Number(e.target.value)})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] font-mono text-white" />
                     </div>
                  </div>
                  
                  <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-xl flex flex-col justify-between">
                     <div>
                        <h4 className="text-gray-400 font-black uppercase tracking-[4px] text-sm flex items-center gap-3 mb-8"><BrainCircuit size={20}/> Behavioral Triggers</h4>
                        <div className="space-y-4 mb-8">
                           <p className="text-xs font-black uppercase text-white tracking-widest">Low Stock Surge Threshold</p>
                           <input type="number" value={pricingRules.lowStockThreshold} onChange={(e) => setPricingRules({...pricingRules, lowStockThreshold: Number(e.target.value)})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] font-mono text-white" />
                        </div>
                        <div className="space-y-4">
                           <p className="text-xs font-black uppercase text-white tracking-widest">Trending Activation Threshold</p>
                           <input type="number" value={pricingRules.trendingThreshold} onChange={(e) => setPricingRules({...pricingRules, trendingThreshold: Number(e.target.value)})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] font-mono text-white" />
                        </div>
                     </div>
                     <button onClick={handleSaveAIRules} className="w-full py-6 bg-[#D4AF37] text-black font-black uppercase rounded-3xl text-[11px] tracking-[4px] hover:bg-white transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)] mt-8">Compile & Activate Neural Rules</button>
                  </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ImperialGodmodeOS), { ssr: false });
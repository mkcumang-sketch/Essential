"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Package, BrainCircuit, Landmark, Users, RefreshCcw, Trash2, Layout, Video, 
  AlignCenter, AlignLeft, AlignRight, PlusCircle, Link as LinkIcon, ShieldCheck, Eye, Save, 
  Image as ImageIcon, Box, Zap, AlertTriangle, Truck, MapPin, BellRing, Edit3, Plus, X, 
  CheckCircle, Bot, Star, TrendingUp, Wallet, Activity, ShieldAlert, Download, MessageSquare, 
  FileText, Search, ChevronRight, Gift, Shield, Globe, Lock, ChevronUp, ChevronDown, Award, UploadCloud,
  Instagram, Facebook, Twitter, Youtube, Phone, Mail, Linkedin, AlignJustify,
  Terminal, Radar, Fingerprint, Cpu, Network
} from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import dynamic from 'next/dynamic';

const MODULES = [
  { id: 'FULL_DASHBOARD', icon: Radar, label: 'Command Center' },
  { id: 'INVENTORY', icon: Box, label: 'Asset Vault' },
  { id: 'ORDER_TRACKER', icon: Network, label: 'Global Logistics' },
  { id: 'CRM', icon: Fingerprint, label: 'Client Identity' },
  { id: 'MARKETING', icon: Zap, label: 'Growth & Campaigns' },
  { id: 'PAGE_BUILDER', icon: Layout, label: 'UI Architecture' },
  { id: 'LEGAL_PAGES', icon: FileText, label: 'Legal Protocols' },
  { id: 'REVIEWS', icon: Star, label: 'Sentiment Analysis' },
  { id: 'SALES_FORCE', icon: LinkIcon, label: 'Affiliate Nodes' },
  { id: 'AI_ENGINE', icon: Cpu, label: 'Neural Pricing Engine' },
  { id: 'SECURITY', icon: ShieldAlert, label: 'System Security' }
];

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1587836374828-cb4387df3c56?q=80&w=1000",
  "https://images.unsplash.com/photo-1508685096489-77a46807e604?q=80&w=1000",
  "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000",
  "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000",
  "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1000"
];

const PremiumUploadNode = ({ onUploadSuccess, placeholder="Image" }: any) => {
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState("");
    const [inputId] = useState(`up-${Math.random().toString(36).substr(2, 9)}`);

    const handleUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success && data.url) {
                setPreview(data.url);
                onUploadSuccess(data.url);
            } else { alert(`Upload failed: ${data.error || 'Check Cloudinary Keys'}`); }
        } catch(e) { alert("Upload failed. Is your server running?"); } 
        finally { setUploading(false); }
    };

    return (
        <div 
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]); }}
            className={`w-28 h-28 shrink-0 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center p-3 cursor-pointer group hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/5 ${dragging ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/20 bg-black/40 backdrop-blur-md'}`}>
            <input type="file" accept="image/*,video/*" onChange={(e)=>e.target.files?.[0] && handleUpload(e.target.files[0])} className="hidden" id={inputId} />
            <label htmlFor={inputId} className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                {uploading ? <RefreshCcw size={16} className="text-[#D4AF37] animate-spin"/> :
                 preview ? (preview.match(/\.(mp4|webm|mov)$/i) ? <video src={preview} className="w-full h-full object-cover rounded-xl shadow-lg"/> : <img src={preview} className="w-full h-full object-cover rounded-xl shadow-lg" />) :
                 <>
                    <UploadCloud size={16} className="text-gray-500 group-hover:text-[#D4AF37] mb-1.5 transition-colors"/>
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-tight group-hover:text-[#D4AF37] transition-colors">{dragging ? "Drop Media" : `Add ${placeholder}`}</span>
                 </>
                }
            </label>
        </div>
    );
};

function ImperialGodmodeOS() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('FULL_DASHBOARD');
  const [dashboardView, setDashboardView] = useState<'orders' | 'abandoned'>('orders');
  const [isSyncing, setIsSyncing] = useState(false);

  const [systemLogs, setSystemLogs] = useState<string[]>(["[SYS] OS Boot sequence initiated...", "[NET] Connected to secure global nodes."]);

  const [leads, setLeads] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [liveWatches, setLiveWatches] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [fullAnalytics, setFullAnalytics] = useState<any>(null);

  const [heroSlides, setHeroSlides] = useState([{ id: 1, type: 'video', url: '', heading: 'Time is Gold' }]);
  const [aboutConfig, setAboutConfig] = useState({ content: '', alignment: 'center', style: 'luxury', boldWords: '' });
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_GALLERY); 
  const [uiConfig, setUiConfig] = useState({ primaryColor: '#D4AF37', bgColor: '#050505', fontFamily: 'serif', buttonRadius: 'full' });
  const [categories, setCategories] = useState(["Investment Grade", "Rare Vintage", "Modern Complications"]);
  const [newCategory, setNewCategory] = useState("");
  const [faqs, setFaqs] = useState([{ q: 'Are these authentic?', a: 'Yes, 100% verified.' }]);
  const [visionaries, setVisionaries] = useState([{ name: 'Shahrukh Khan', watch: 'Rolex Daytona', img: '' }]);
  
  const [fakeReview, setFakeReview] = useState<{userName: string, comment: string, rating: number, product: string, visibility: string, isAdminGenerated: boolean, media: string[]}>({ userName: '', comment: '', rating: 5, product: 'GLOBAL', visibility: 'public', isAdminGenerated: true, media: [] });
  
  const [socialLinks, setSocialLinks] = useState({ instagram: '', facebook: '', twitter: '', youtube: '', linkedin: '' });
  const [corporateInfo, setCorporateInfo] = useState({ companyName: 'Essential Rush Pvt Ltd', address: 'Ground Floor, Corporate Drive, Mumbai - 400001', phone1: '+91 98765 43210', phone2: '+91 98765 12345', email: 'support@essentialrush.com' });
  const [legalPages, setLegalPages] = useState([{ id: '1', title: 'Privacy Policy', slug: 'privacy-policy', content: 'Our privacy policy details...' }]);
  const [activeLegalPageId, setActiveLegalPageId] = useState('1');

  const [watchForm, setWatchForm] = useState({ 
      name: '', brand: '', category: categories[0] || 'Investment Grade', price: '', offerPrice: '', stock: '', 
      imageUrl: '', images: ['', '', '', '', '', '', ''], videoUrl: '', model3DUrl: '', 
      description: '', seoTags: '', specifications: '', priority: 0, badge: 'New Arrival', 
      amazonDetails: [{ key: 'Dial Color', value: 'Black' }] 
  });

  const [couponForm, setCouponForm] = useState({ code: '', discountValue: '', minOrder: '', validUntil: '' });
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentForm, setAgentForm] = useState({ name: '', email: '', code: '', tier: 'Imperial Agent', commissionRate: 5 });
  const [pricingRules, setPricingRules] = useState({ isAiPricingActive: true, maxMarkupPercent: 15, maxDiscountPercent: 10, lowStockThreshold: 3, trendingThreshold: 10 });

  const addLog = (msg: string) => {
      setSystemLogs(prev => [msg, ...prev].slice(0, 8)); 
  };

  const fetchSystemIntelligence = async (silent = false) => {
    if (!silent) {
        setIsSyncing(true);
        addLog("[API] Requesting global data sync...");
    }
    try {
      const ts = new Date().getTime();
      const [resLeads, resCms, resProducts, resAgents, resOrders, resRules, resAnalytics, resReviews, resMarketing, resCust] = await Promise.all([
        fetch(`/api/admin/analytics?t=${ts}`).then(r => r.ok ? r.json() : {leads: []}),
        fetch(`/api/cms?t=${ts}`).then(r => r.ok ? r.json() : {data: null}),
        fetch(`/api/products?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/agents?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/orders?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/ai/rules?t=${ts}`).then(r => r.ok ? r.json() : {data: null}),
        fetch(`/api/dashboard/full-analytics?t=${ts}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/reviews?admin=true&t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/admin/marketing?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/admin/users?t=${ts}`).then(r => r.ok ? r.json() : {data: []}).catch(()=>({data:[]}))
      ]);
      
      if (resLeads.leads) setLeads(resLeads.leads);
      if (resProducts.data) setLiveWatches(resProducts.data.filter((w:any)=>w&&w._id).sort((a:any, b:any) => (b.priority || 0) - (a.priority || 0)));
      if (resAgents.data) setAgents(resAgents.data);
      if (resOrders.data) setOrders(resOrders.data);
      if (resRules.data) setPricingRules(resRules.data);
      if (resAnalytics && resAnalytics.success) setFullAnalytics(resAnalytics);
      
      // 🌟 NEW: Sort reviews so PENDING is always at the top! 🌟
      if (resReviews.data) {
          const sortedRevs = resReviews.data.sort((a:any, b:any) => {
              if (a.visibility === 'pending' && b.visibility !== 'pending') return -1;
              if (b.visibility === 'pending' && a.visibility !== 'pending') return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setAllReviews(sortedRevs);
      }

      if (resMarketing.data) setCoupons(resMarketing.data);
      if (resCust.data) setCustomers(resCust.data);
      
      if (resCms.data && !silent) {
        if(resCms.data.heroSlides) setHeroSlides(resCms.data.heroSlides);
        if(resCms.data.aboutConfig) setAboutConfig(resCms.data.aboutConfig);
        if(resCms.data.galleryImages) setGalleryImages(resCms.data.galleryImages);
        if(resCms.data.uiConfig) setUiConfig(resCms.data.uiConfig);
        if(resCms.data.categories) setCategories(resCms.data.categories);
        if(resCms.data.faqs) setFaqs(resCms.data.faqs);
        if(resCms.data.visionaries) setVisionaries(resCms.data.visionaries);
        if(resCms.data.socialLinks) setSocialLinks(resCms.data.socialLinks);
        if(resCms.data.corporateInfo) setCorporateInfo(resCms.data.corporateInfo); 
        if(resCms.data.legalPages) setLegalPages(resCms.data.legalPages); 
      }
      if (!silent) addLog("[API] Sync complete. 100% Data Integrity.");
    } catch (e) { 
        if (!silent) addLog("[ERR] Sync failed. Network disruption detected."); 
    } finally { 
        if (!silent) setIsSyncing(false); 
    }
  };

  useEffect(() => { 
      if (session?.user?.role === 'SUPER_ADMIN') fetchSystemIntelligence(); 
  }, [session]);

  // 🌟 NEW: SILENT AUTO-SYNC BACKGROUND RADAR (Every 15 Seconds) 🌟
  useEffect(() => {
      if (session?.user?.role !== 'SUPER_ADMIN') return;
      const interval = setInterval(() => {
          fetchSystemIntelligence(true); // Silent sync (no loader spins)
      }, 15000);
      return () => clearInterval(interval);
  }, [session]);

  // Fake logs generator for tech vibe
  useEffect(() => {
      const interval = setInterval(() => {
          const fakeEvents = [
              "[SEC] Neural firewall actively monitoring traffic.",
              "[NET] Pinging European delivery nodes... OK.",
              "[SYS] Encrypted backup snapshot taken.",
              "[AI] Adjusting predictive pricing models..."
          ];
          addLog(fakeEvents[Math.floor(Math.random() * fakeEvents.length)]);
      }, 20000);
      return () => clearInterval(interval);
  }, []);

  const moveItem = (array: any[], index: number, direction: number, setter: any) => {
    const newArr = [...array];
    if (index + direction >= 0 && index + direction < newArr.length) {
      const temp = newArr[index];
      newArr[index] = newArr[index + direction];
      newArr[index + direction] = temp;
      setter(newArr);
    }
  };

  const handleAddHeroSlide = () => setHeroSlides([...heroSlides, { id: Date.now(), type: 'video', url: '', heading: 'New Slide' }]);
  const handleRemoveHeroSlide = (id: number) => setHeroSlides(heroSlides.filter(s => s.id !== id));

  const handleDeployCMS = async () => {
    setIsSyncing(true); addLog("[SYS] Deploying UI configurations globally...");
    try {
      await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ heroSlides, aboutConfig, galleryImages, uiConfig, categories, faqs, visionaries, socialLinks, corporateInfo, legalPages }) });
      alert("Website Settings Saved Successfully!"); addLog("[SYS] Global deployment successful.");
    } catch (e) { alert("Failed to save settings."); } finally { setIsSyncing(false); }
  };

  const handleSaveAIRules = async () => {
    setIsSyncing(true); addLog("[AI] Compiling new neural pricing rules...");
    try {
      await fetch('/api/ai/rules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pricingRules) });
      alert("Pricing Rules Updated Successfully!"); addLog("[AI] Matrix updated.");
    } catch (e) { alert("Failed to save pricing rules."); } finally { setIsSyncing(false); }
  };

  const handleInjectFakeReview = async () => {
    if (!fakeReview.userName || !fakeReview.comment) return alert("Please fill name and review content.");
    setIsSyncing(true); addLog(`[REV] Injecting verified testimonial for ${fakeReview.userName}...`);
    try {
      await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fakeReview) });
      setFakeReview({ userName: '', comment: '', rating: 5, product: 'GLOBAL', visibility: 'public', isAdminGenerated: true, media: [] });
      fetchSystemIntelligence();
      alert("Custom Review Added Successfully!");
    } catch (e) { alert("Failed to add review."); } finally { setIsSyncing(false); }
  };

  const handlePublishAsset = async () => {
    if (!watchForm.name.trim() || !watchForm.price.toString().trim() || !watchForm.imageUrl.trim()) {
        alert("⚠️ Missing Fields! Designation (Name), Base Price, and Main Asset URL are mandatory.");
        return;
    }

    setIsSyncing(true); addLog("[VAULT] Processing new asset injection...");
    
    try {
      const validAmazonDetails = watchForm.amazonDetails.filter(d => d.key.trim() !== '' && d.value.trim() !== '');
      const tagsArray = watchForm.seoTags.split(',').map(s=>s.trim()).filter(s=>s);
      const additionalImages = watchForm.images.filter(img => typeof img === 'string' && img.trim() !== "");

      const generatedSlug = watchForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
      const generatedSku = `ASSET-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      const finalProduct = { 
          name: watchForm.name,
          slug: generatedSlug,
          sku: generatedSku,
          brand: watchForm.brand,
          category: watchForm.category,
          price: Number(watchForm.price) || 0,
          offerPrice: Number(watchForm.offerPrice) || Number(watchForm.price) || 0,
          stock: Number(watchForm.stock) || 0,
          imageUrl: watchForm.imageUrl, 
          images: additionalImages, 
          videoUrl: watchForm.videoUrl,
          model3DUrl: watchForm.model3DUrl,
          description: watchForm.description,
          tags: tagsArray, 
          priority: Number(watchForm.priority) || 0, 
          badge: watchForm.badge,
          amazonDetails: validAmazonDetails 
      };

      const res = await fetch('/api/products', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(finalProduct) 
      });
      
      const data = await res.json();

      if (res.ok && data.success) { 
          alert("Product Saved Successfully!"); addLog("[VAULT] Asset secured in global registry.");
          setWatchForm({ name: '', brand: '', category: categories[0] || 'Investment Grade', price: '', offerPrice: '', stock: '', imageUrl: '', images: ['', '', '', '', '', '', ''], videoUrl: '', model3DUrl: '', description: '', specifications: '', seoTags: '', priority: 0, badge: 'New Arrival', amazonDetails: [{ key: 'Dial Color', value: 'Black' }] });
          fetchSystemIntelligence(); 
      } else {
          alert(`Backend Rejected: ${data.error || 'Check fields and try again'}`);
          addLog(`[ERR] Asset injection failed: ${data.error || 'Server error'}`);
      }
    } catch (e) { 
        alert("Network Error! Could not connect to the database."); 
        addLog("[ERR] Asset injection failed: Network error");
    } finally { 
        setIsSyncing(false); 
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if(!confirm("Are you sure you want to delete this product?")) return;
    addLog(`[VAULT] Purging asset ID: ${id.slice(-6)}...`);
    setLiveWatches(prev => prev.filter(w => w._id !== id));
    try { await fetch(`/api/products`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) }); } catch(e) {}
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    setIsSyncing(true); addLog(`[LOGISTICS] Order ${id.slice(-4)} status shifted to ${newStatus}`);
    try {
        const res = await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
        if(res.ok) fetchSystemIntelligence();
    } catch(e) { alert("Failed to update order status."); } finally { setIsSyncing(false); }
  };

  const handleReviewAction = async (reviewId: string, visibility: string) => {
      setIsSyncing(true); addLog(`[REV] Modifying visibility protocol for review ${reviewId.slice(-4)}`);
      try {
          await fetch('/api/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reviewId, visibility }) });
          fetchSystemIntelligence();
      } catch (e) { alert("Failed to update review."); } finally { setIsSyncing(false); }
  };

  const handleRecruitAgent = async () => {
    if (!agentForm.name || !agentForm.email) return alert("Name and Email are required.");
    setIsSyncing(true); addLog("[NET] Generating new affiliate tracking node...");
    try {
      const res = await fetch('/api/agents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(agentForm) });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Affiliate Partner Added Successfully!`);
        setAgentForm({ name: '', email: '', code: '', tier: 'Partner', commissionRate: 5 });
        setIsAgentModalOpen(false);
        fetchSystemIntelligence();
      }
    } catch (error) { alert("Network Error."); } finally { setIsSyncing(false); }
  };

  const handleCreateCoupon = async () => {
      if(!couponForm.code || !couponForm.discountValue) return alert("Code and Discount Value are required.");
      setIsSyncing(true); addLog(`[MKT] Deploying campaign protocol ${couponForm.code}...`);
      try {
          await fetch('/api/admin/marketing', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(couponForm)});
          setCouponForm({code: '', discountValue: '', minOrder: '', validUntil: ''});
          fetchSystemIntelligence();
      } catch (e) { alert("Failed to generate coupon."); } finally { setIsSyncing(false); }
  };

  if (status === "loading") return <div className="h-screen bg-[#050505] flex items-center justify-center"><div className="text-[#D4AF37] animate-pulse font-mono flex flex-col items-center gap-4"><Activity size={40}/><p className="tracking-[10px] text-xs">BOOTING OS...</p></div></div>;
  if (!session || session.user?.role !== 'SUPER_ADMIN') return <div className="h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden"><div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div><Lock size={60} className="text-red-500 mb-8 animate-pulse relative z-10"/><button onClick={() => signIn("google")} className="relative z-10 bg-[#D4AF37] text-black px-12 py-5 rounded-full font-black tracking-widest uppercase shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:bg-white hover:shadow-[#D4AF37] transition-all">Authenticate Admin Access</button></div>;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#D4AF37] selection:text-black relative font-sans">
      
      {/* 🌟 TECH GRID BACKGROUND 🌟 */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/[0.05] blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#00F0FF]/[0.03] blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* RECRUITMENT MODAL */}
      <AnimatePresence>
        {isAgentModalOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} exit={{scale:0.9, y:20}} className="bg-black/60 border border-[#D4AF37]/50 p-12 rounded-[40px] w-full max-w-xl relative shadow-[0_0_50px_rgba(212,175,55,0.15)] backdrop-blur-2xl">
               <button onClick={() => setIsAgentModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
               <h3 className="text-3xl font-serif italic mb-2 text-[#D4AF37]">Deploy Affiliate Node</h3>
               <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-10 flex items-center gap-2"><Network size={12}/> Secure connection established</p>
               <div className="space-y-5">
                 <input value={agentForm.name} onChange={(e) => setAgentForm({...agentForm, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] font-mono text-gray-300" placeholder="Partner Identity (Name)"/>
                 <input value={agentForm.email} onChange={(e) => setAgentForm({...agentForm, email: e.target.value})} type="email" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] font-mono text-gray-300" placeholder="Transmission Link (Email)"/>
                 <div className="grid grid-cols-2 gap-4">
                   <input value={agentForm.code} onChange={(e) => setAgentForm({...agentForm, code: e.target.value})} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] uppercase font-mono text-[#D4AF37]" placeholder="Unique Tracker Code"/>
                   <input value={agentForm.commissionRate} onChange={(e) => setAgentForm({...agentForm, commissionRate: Number(e.target.value)})} type="number" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#D4AF37] font-mono text-green-400" placeholder="Yield %"/>
                 </div>
                 <select value={agentForm.tier} onChange={(e) => setAgentForm({...agentForm, tier: e.target.value})} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 outline-none focus:border-[#D4AF37] appearance-none">
                    <option className="bg-black">Partner</option><option className="bg-black">Premium Agent</option><option className="bg-black">Ambassador</option>
                 </select>
                 <button onClick={handleRecruitAgent} className="w-full py-6 bg-[#D4AF37] text-black font-black uppercase rounded-3xl text-[11px] tracking-[4px] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] mt-6 flex justify-center items-center gap-3"><Zap size={16}/> Initialize Protocol</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 HIGH-TECH SIDEBAR 🌟 */}
      <aside className="w-[320px] bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col z-50 relative">
        <div className="p-8 border-b border-white/5 flex items-center gap-5">
          <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
             <Fingerprint size={20}/>
          </div>
          <div className="overflow-hidden">
             <p className="text-[9px] text-[#00F0FF] font-mono uppercase tracking-widest mb-1 flex items-center gap-1"><Activity size={10} className="animate-pulse"/> Master Access</p>
             <h1 className="text-sm font-bold text-white truncate">{session.user?.name}</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {MODULES.map(m => (
            <button key={m.id} onClick={() => setActiveTab(m.id)} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group ${activeTab === m.id ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <div className="flex items-center gap-4">
                 <m.icon size={18} className={activeTab === m.id ? 'text-black' : 'group-hover:text-[#D4AF37] transition-colors'}/> 
                 {m.label}
              </div>
              {activeTab === m.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20">
            <div className="bg-[#00F0FF]/10 border border-[#00F0FF]/20 p-4 rounded-2xl mb-4 flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-ping"></div>
                <div>
                   <p className="text-[9px] font-black uppercase text-[#00F0FF] tracking-widest">Network Status</p>
                   <p className="text-[8px] font-mono text-gray-400 mt-1">Latency: 14ms | Encrypted</p>
                </div>
            </div>
            <button onClick={() => signOut()} className="w-full py-4 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/5 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex justify-center items-center gap-3"><Lock size={14}/> Terminate Session</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-10 lg:p-14 relative custom-scrollbar z-10">

        <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 border-b border-white/10 pb-8 gap-6">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <span className="bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-md text-[9px] font-mono uppercase tracking-widest flex items-center gap-2"><Cpu size={12}/> OS v4.2.0</span>
             </div>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-white tracking-tighter">
               {MODULES.find(m => m.id === activeTab)?.label}
             </h2>
          </div>
          <div className="flex gap-4">
             <div className="relative group">
                <button className="p-5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-[#D4AF37] transition-colors"><BellRing size={20} className="text-gray-400 group-hover:text-[#D4AF37]"/></button>
                {leads.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(239,68,68,0.5)] border-2 border-black">{leads.length}</span>}
             </div>
             <button onClick={() => fetchSystemIntelligence(false)} className="px-6 py-5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                <RefreshCcw size={16} className={isSyncing ? "animate-spin" : ""}/> Sync Nodes
             </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          
          {/* 🌟 REDESIGNED HUD DASHBOARD 🌟 */}
          {activeTab === 'FULL_DASHBOARD' && fullAnalytics && (
             <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} key="dash" className="space-y-8">
               
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 {/* Main Revenue Card */}
                 <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-[35px] relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                   <div className="absolute -right-10 -top-10 text-[#D4AF37] opacity-5 group-hover:opacity-10 transition-opacity"><BarChart3 size={250}/></div>
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-[4px] mb-4 flex items-center gap-2"><Wallet size={14}/> Total Capital Inflow</p>
                   <p className="text-5xl md:text-6xl font-black text-white font-serif tracking-tighter">₹{(fullAnalytics.metrics?.totalRevenue || 0).toLocaleString('en-IN')}</p>
                   <div className="mt-8 flex items-center gap-4">
                      <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] px-3 py-1 rounded-md font-mono flex items-center gap-1"><TrendingUp size={10}/> Active</span>
                      <span className="text-[10px] text-gray-500 font-mono tracking-widest">Real-time ledger tracking</span>
                   </div>
                 </div>

                 {/* Orders Card */}
                 <div onClick={() => setDashboardView('orders')} className={`bg-black/40 backdrop-blur-xl border p-8 rounded-[35px] cursor-pointer transition-all flex flex-col justify-between ${dashboardView === 'orders' ? 'border-[#00F0FF]/50 shadow-[0_0_30px_rgba(0,240,255,0.1)]' : 'border-white/10 hover:border-white/30'}`}>
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-[4px] flex items-center gap-2"><Package size={14}/> Confirmed Orders</p>
                   <div>
                     <p className="text-5xl font-black text-[#00F0FF] font-mono tracking-tighter">{fullAnalytics.metrics?.totalOrders || 0}</p>
                     <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-1">Click to expand <ChevronRight size={10}/></p>
                   </div>
                 </div>
                 
                 {/* Abandoned Card */}
                 <div onClick={() => setDashboardView('abandoned')} className={`bg-black/40 backdrop-blur-xl border p-8 rounded-[35px] cursor-pointer transition-all flex flex-col justify-between ${dashboardView === 'abandoned' ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-white/10 hover:border-white/30'}`}>
                   <p className="text-gray-500 text-[10px] font-black uppercase tracking-[4px] flex items-center gap-2"><AlertTriangle size={14} className={leads.length > 0 ? "text-red-500 animate-pulse" : ""}/> Lost Requisitions</p>
                   <div>
                     <p className="text-5xl font-black text-red-500 font-mono tracking-tighter">{leads.length}</p>
                     <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-1">Click to analyze <ChevronRight size={10}/></p>
                   </div>
                 </div>
              </div>

              {/* Bottom Row: List + Terminal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Dynamic List Viewer */}
                  <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[35px] p-8 md:p-10 min-h-[450px]">
                     <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-6">
                        <h3 className="text-xl font-serif text-white tracking-wide">
                           {dashboardView === 'orders' ? 'Latest Secured Transmissions (Orders)' : 'Unrecovered Assets (Abandoned Carts)'}
                        </h3>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${dashboardView === 'orders' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-red-500/10 text-red-500'}`}>
                           {dashboardView === 'orders' ? `${orders.length} Total` : `${leads.length} Pending Recovery`}
                        </span>
                     </div>

                     <div className="space-y-3">
                        {dashboardView === 'orders' && (
                           orders.length === 0 ? <p className="text-gray-600 font-mono text-sm">No positive transmissions found.</p> :
                           orders.slice(0, 8).map((o: any, i: number) => (
                              <div key={i} className="flex justify-between items-center p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                                 <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 bg-[#00F0FF]/10 text-[#00F0FF] rounded-xl flex items-center justify-center font-mono text-xs border border-[#00F0FF]/20">
                                       {o.orderId?.slice(-4) || 'UKN'}
                                    </div>
                                    <div>
                                       <p className="font-bold text-white text-sm">{o.customer?.name || 'Guest Identity'}</p>
                                       <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mt-1">{o.customer?.email || o.customer?.phone}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-lg font-mono font-bold text-green-400">₹{(o.totalAmount || 0).toLocaleString()}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-white/10 rounded text-[8px] font-black uppercase text-gray-300">{o.status}</span>
                                 </div>
                              </div>
                           ))
                        )}

                        {dashboardView === 'abandoned' && (
                           leads.length === 0 ? <p className="text-gray-600 font-mono text-sm">0 Data drops. Network secure.</p> :
                           leads.map((lead: any, i: number) => (
                              <div key={i} className="flex justify-between items-center p-5 bg-red-500/5 border border-red-500/10 rounded-2xl hover:border-red-500/30 transition-colors group">
                                 <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center"><AlertTriangle size={16} /></div>
                                    <div>
                                       <p className="font-bold text-white text-sm font-mono flex items-center gap-2">
                                          {lead.phone || lead.email || 'Encrypted User'} 
                                          <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded uppercase font-black tracking-widest">Lost Sale</span>
                                       </p>
                                       <p className="text-[9px] text-red-400/70 font-mono uppercase tracking-widest mt-1">Pending Value: ₹{lead.cartTotal?.toLocaleString() || '---'}</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-2">
                                    {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="px-3 py-2 bg-green-500/10 text-green-500 text-[9px] font-black uppercase rounded-lg border border-green-500/20 hover:bg-green-50 hover:text-black transition-colors">Ping WA</a>}
                                    {lead.email && <a href={`mailto:${lead.email}`} className="px-3 py-2 bg-white/5 text-gray-300 text-[9px] font-black uppercase rounded-lg border border-white/10 hover:bg-white hover:text-black transition-colors">Ping Mail</a>}
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>

                  {/* 🌟 NEW: TERMINAL LOG WINDOW 🌟 */}
                  <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[35px] p-8 flex flex-col shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
                     <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                         <Terminal size={16} className="text-[#D4AF37]"/>
                         <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Live Network Feed</h3>
                     </div>
                     <div className="flex-1 overflow-hidden flex flex-col justify-end space-y-2">
                         {systemLogs.map((log, i) => (
                             <motion.div initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} key={i} className="text-[10px] font-mono leading-relaxed">
                                 <span className="text-[#D4AF37] mr-2">[{new Date().toLocaleTimeString()}]</span>
                                 <span className={log.includes('[ERR]') ? 'text-red-400' : log.includes('[SEC]') ? 'text-green-400' : 'text-gray-300'}>{log}</span>
                             </motion.div>
                         ))}
                     </div>
                  </div>

              </div>
             </motion.div>
          )}

          {/* ================= CRM ================= */}
          {activeTab === 'CRM' && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} key="crm" className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
                <div className="p-8 md:p-10 border-b border-white/10 flex justify-between items-center">
                   <h3 className="text-2xl font-serif text-white">Client Identity Matrix</h3>
                   <span className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">{leads.length} Identities Found</span>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead className="bg-black/60 text-[9px] font-black uppercase tracking-[5px] text-gray-500 border-b border-white/10">
                        <tr>
                          <th className="p-6 md:p-8 pl-10 whitespace-nowrap">Client Vector</th>
                          <th className="p-6 md:p-8 text-center whitespace-nowrap">Referral Origin</th>
                          <th className="p-6 md:p-8 text-center whitespace-nowrap">Wallet Funds</th>
                          <th className="p-6 md:p-8 text-right pr-10 whitespace-nowrap">Capital Acquired</th>
                        </tr>
                     </thead>
                     <tbody>
                        {leads.length === 0 && customers.length === 0 ? <tr><td colSpan={4} className="p-20 text-center text-gray-500 font-mono text-sm">No client signatures detected.</td></tr> : leads.slice(0,15).map((c:any, i:number) => (
                           <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                              <td className="p-6 md:p-8 pl-10">
                                 <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center font-mono text-xs uppercase text-white shadow-lg">{c.phone?.slice(-2) || 'XX'}</div>
                                    <div>
                                       <p className="font-bold text-sm md:text-base text-white font-mono">{c.phone || 'Encrypted User'}</p>
                                       <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1 opacity-70 group-hover:opacity-100">{c.email || `ID: ${c._id?.slice(-8)}`}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-6 md:p-8 text-center">
                                 <span className="px-3 py-1 rounded bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 text-[9px] font-mono tracking-widest">{c.referralCode || 'DIRECT_LINK'}</span>
                              </td>
                              <td className="p-6 md:p-8 text-center font-mono text-[#D4AF37] font-bold text-lg">
                                 ₹{c.walletBalance || 0}
                              </td>
                              <td className="p-6 md:p-8 text-right pr-10">
                                 <p className="font-mono font-bold text-xl text-white">₹{(c.cartTotal || 0).toLocaleString()}</p>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
             </motion.div>
          )}

          {/* ================= MARKETING ================= */}
          {activeTab === 'MARKETING' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="marketing" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-5">
                  <div className="bg-black/40 backdrop-blur-xl p-10 rounded-[40px] border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                     <h3 className="text-2xl font-serif text-white mb-8 flex items-center gap-3"><Gift size={24} className="text-[#D4AF37]"/> Campaign Configurator</h3>
                     <div className="space-y-5">
                        <div>
                           <label className="text-[9px] uppercase font-mono tracking-widest text-gray-400 block mb-2">Access Code (Coupon)</label>
                           <input value={couponForm.code} onChange={e=>setCouponForm({...couponForm, code: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-sm uppercase font-mono outline-none focus:border-[#D4AF37] text-white" placeholder="e.g. VIP2026"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[9px] uppercase font-mono tracking-widest text-gray-400 block mb-2">Discount Cut (%)</label>
                              <input value={couponForm.discountValue} onChange={e=>setCouponForm({...couponForm, discountValue: e.target.value})} type="number" className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-sm font-mono outline-none focus:border-[#D4AF37] text-white" placeholder="15"/>
                           </div>
                           <div>
                              <label className="text-[9px] uppercase font-mono tracking-widest text-gray-400 block mb-2">Min. Capital (₹)</label>
                              <input value={couponForm.minOrder} onChange={e=>setCouponForm({...couponForm, minOrder: e.target.value})} type="number" className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-sm font-mono outline-none focus:border-[#D4AF37] text-white" placeholder="50000"/>
                           </div>
                        </div>
                        <button onClick={handleCreateCoupon} className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase rounded-2xl text-[10px] tracking-[4px] hover:bg-white transition-all shadow-xl mt-4 flex justify-center items-center gap-2"><Zap size={14}/> Deploy Protocol</button>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-7 bg-black/40 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
                  <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                     <h4 className="text-white font-serif text-xl">Active Campaign Nodes</h4>
                  </div>
                  <div className="space-y-4">
                     {coupons.length === 0 ? <p className="text-center py-20 text-gray-600 font-mono text-sm">No promotional nodes running.</p> : coupons.map((c, i) => (
                        <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-[25px] flex justify-between items-center group hover:border-[#D4AF37]/50 transition-colors">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] font-mono text-xl border border-[#D4AF37]/20 shadow-inner">{c.discountValue}%</div>
                              <div>
                                 <p className="font-mono font-bold text-2xl text-white tracking-widest mb-1">{c.code}</p>
                                 <div className="flex gap-4">
                                    <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest">Executions: {c.usedCount || 0}</p>
                                    <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest">Floor: ₹{c.minOrderValue?.toLocaleString() || 0}</p>
                                 </div>
                              </div>
                           </div>
                           <button className="p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= INVENTORY ================= */}
          {activeTab === 'INVENTORY' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="inv" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
               
               <div className="xl:col-span-5 space-y-8 h-max sticky top-0">
                  {/* Category Builder */}
                  <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[35px] border border-white/10 shadow-lg">
                     <h3 className="text-white text-lg font-serif mb-5 flex items-center gap-2"><Layout size={18} className="text-[#D4AF37]"/> Tag Classification</h3>
                     <div className="flex gap-3 mb-5">
                        <input value={newCategory} onChange={e=>setNewCategory(e.target.value)} className="flex-1 bg-black/50 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-[#D4AF37] font-mono text-white" placeholder="New sector..." />
                        <button onClick={() => { if(newCategory){ setCategories([...categories, newCategory]); setNewCategory(""); } }} className="px-6 bg-[#D4AF37] text-black font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-white transition-all">Add</button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {categories.map((cat, i) => (
                           <div key={i} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                              <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">{cat}</span>
                              <button onClick={()=>setCategories(categories.filter(c=>c!==cat))} className="text-red-400 hover:text-red-500"><X size={12}/></button>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Asset Injection Form */}
                  <div className="bg-black/40 backdrop-blur-xl p-10 rounded-[40px] border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] relative overflow-hidden">
                     <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/10 pb-6">
                        <div>
                           <h3 className="text-2xl font-serif text-white">Inject New Asset</h3>
                           <p className="text-[9px] text-[#D4AF37] font-mono uppercase tracking-widest mt-1">Manual URI mapping active</p>
                        </div>
                        <Package size={30} className="text-[#D4AF37]/50"/>
                     </div>
                     
                     <div className="space-y-6 relative z-10">
                        <div className="space-y-4">
                           <input value={watchForm.name} onChange={(e) => setWatchForm({...watchForm, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-sm font-serif italic outline-none focus:border-[#D4AF37] text-white" placeholder="Designation (e.g. Royal Oak)"/>
                           <div className="grid grid-cols-2 gap-4">
                             <input value={watchForm.brand} onChange={(e) => setWatchForm({...watchForm, brand: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-xs font-mono uppercase tracking-widest outline-none focus:border-[#D4AF37] text-white" placeholder="Creator Brand"/>
                             
                             <div className="relative">
                                 <input 
                                     list="category-options"
                                     value={watchForm.category} 
                                     onChange={(e) => setWatchForm({...watchForm, category: e.target.value})} 
                                     className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-[10px] font-mono uppercase tracking-widest text-white outline-none focus:border-[#D4AF37]" 
                                     placeholder="Type Category..."
                                 />
                                 <datalist id="category-options">
                                     {categories.map((c, i) => <option key={i} value={c} />)}
                                 </datalist>
                             </div>

                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="text-[8px] font-mono uppercase text-[#D4AF37] tracking-widest mb-1 block">Z-Index (Priority)</label>
                               <input type="number" value={watchForm.priority} onChange={(e) => setWatchForm({...watchForm, priority: Number(e.target.value)})} className="w-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-3 rounded-lg text-sm font-mono outline-none focus:border-[#D4AF37] text-[#D4AF37]" placeholder="100" />
                           </div>
                           <div>
                               <label className="text-[8px] font-mono uppercase text-gray-500 tracking-widest mb-1 block">Visual Badge</label>
                               <input value={watchForm.badge} onChange={(e) => setWatchForm({...watchForm, badge: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-xs outline-none focus:border-[#D4AF37] text-white" placeholder="e.g. Rare Edition" />
                           </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-5">
                            <div><label className="text-[8px] font-mono uppercase text-gray-500 tracking-widest mb-1 block">Base Price</label><input value={watchForm.price} onChange={(e) => setWatchForm({...watchForm, price: e.target.value})} type="number" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-sm font-mono outline-none focus:border-[#D4AF37] text-white" /></div>
                            <div><label className="text-[8px] font-mono uppercase text-[#00F0FF] tracking-widest mb-1 block">Market Price</label><input value={watchForm.offerPrice} onChange={(e) => setWatchForm({...watchForm, offerPrice: e.target.value})} type="number" className="w-full bg-[#00F0FF]/5 border border-[#00F0FF]/20 p-3 rounded-lg text-sm font-mono outline-none focus:border-[#00F0FF] text-[#00F0FF]" /></div>
                            <div><label className="text-[8px] font-mono uppercase text-gray-500 tracking-widest mb-1 block">Units Stored</label><input value={watchForm.stock} onChange={(e) => setWatchForm({...watchForm, stock: e.target.value})} type="number" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-sm font-mono outline-none focus:border-[#D4AF37] text-white" /></div>
                        </div>

                        {/* Visual Media Engine */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center border-b border-white/10 pb-2">
                               <label className="text-[10px] font-mono uppercase text-gray-400 tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Asset Render URLs</label>
                               <span className="text-[9px] font-mono text-[#D4AF37]">{watchForm.images.filter(x => typeof x === 'string' && x.trim() !== '').length}/8 Slots</span>
                           </div>
                           
                           <input value={watchForm.imageUrl} onChange={e=>setWatchForm({...watchForm, imageUrl: e.target.value})} className="w-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-3 rounded-lg text-xs font-mono outline-none focus:border-[#D4AF37] text-white" placeholder="Primary Thumbnail URI"/>
                           
                           <div className="flex flex-wrap gap-3 items-center">
                              {watchForm.images.filter(img => typeof img === 'string' && img.trim() !== '').map((img, i) => (
                                <div key={i} className="w-16 h-16 rounded-lg overflow-hidden group relative border border-white/20">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button onClick={()=>setWatchForm({...watchForm, images: watchForm.images.filter(x => x !== img)})} className="absolute top-1 right-1 p-1 bg-black/80 backdrop-blur rounded-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10}/></button>
                                </div>
                              ))}
                              
                              {watchForm.images.filter(img => typeof img === 'string' && img.trim() !== '').length < 8 && (
                                  <div className="scale-75 origin-left">
                                      <PremiumUploadNode placeholder="IMG" onUploadSuccess={(url: string)=>setWatchForm({...watchForm, images: [...watchForm.images.filter(x => typeof x === 'string' && x.trim() !== ''), url]})} />
                                  </div>
                              )}
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4 pt-2">
                               <div>
                                  <label className="text-[8px] font-mono uppercase text-gray-500 tracking-widest mb-1 flex items-center gap-1"><Video size={10}/> MP4 URI</label>
                                  <input value={watchForm.videoUrl} onChange={(e) => setWatchForm({...watchForm, videoUrl: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-[10px] font-mono outline-none focus:border-white text-white" placeholder="Video Link"/>
                               </div>
                               <div>
                                  <label className="text-[8px] font-mono uppercase text-[#D4AF37] tracking-widest mb-1 flex items-center gap-1"><Box size={10}/> Spline URI</label>
                                  <input value={watchForm.model3DUrl} onChange={(e) => setWatchForm({...watchForm, model3DUrl: e.target.value})} className="w-full bg-black/50 border border-[#D4AF37]/20 p-3 rounded-lg text-[10px] font-mono outline-none focus:border-[#D4AF37] text-[#D4AF37]" placeholder="3D Model Link"/>
                               </div>
                           </div>
                        </div>

                        {/* Specs & Data */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                           <div className="flex justify-between items-center border-b border-white/10 pb-2">
                               <label className="text-[10px] font-mono uppercase text-gray-400 tracking-widest flex items-center gap-2"><AlignJustify size={14}/> Specs Array</label>
                               <button onClick={()=>setWatchForm({...watchForm, amazonDetails: [...watchForm.amazonDetails, {key:'', value:''}]})} className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest hover:text-white">+ Row</button>
                           </div>
                           <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                               {watchForm.amazonDetails.map((detail, i) => (
                                   <div key={i} className="flex gap-2 items-center">
                                       <input value={detail.key} onChange={e=>{ const n=[...watchForm.amazonDetails]; n[i].key=e.target.value; setWatchForm({...watchForm, amazonDetails:n}); }} className="w-1/3 bg-black/50 border border-white/10 p-2 rounded text-[10px] font-mono outline-none focus:border-[#D4AF37] text-gray-400" placeholder="e.g. Dial"/>
                                       <input value={detail.value} onChange={e=>{ const n=[...watchForm.amazonDetails]; n[i].value=e.target.value; setWatchForm({...watchForm, amazonDetails:n}); }} className="flex-1 bg-black/50 border border-white/10 p-2 rounded text-[10px] font-mono outline-none focus:border-[#D4AF37] text-white" placeholder="e.g. Onyx Black"/>
                                       <button onClick={()=>{ const n=watchForm.amazonDetails.filter((_,idx)=>idx!==i); setWatchForm({...watchForm, amazonDetails:n}); }} className="text-red-500 p-1 hover:bg-red-500/20 rounded"><X size={12}/></button>
                                   </div>
                               ))}
                           </div>

                           <div className="bg-[#00F0FF]/5 border border-[#00F0FF]/20 p-4 rounded-xl">
                              <p className="text-[8px] font-mono text-[#00F0FF] uppercase tracking-widest flex items-center gap-2 mb-2"><Search size={10}/> Neural Tags (SEO)</p>
                              <input value={watchForm.seoTags} onChange={(e) => setWatchForm({...watchForm, seoTags: e.target.value})} className="w-full bg-transparent border-b border-[#00F0FF]/30 p-1 text-[10px] font-mono outline-none text-white placeholder-gray-600" placeholder="Tags (csv)..." />
                           </div>

                           <textarea value={watchForm.description} onChange={(e) => setWatchForm({...watchForm, description: e.target.value})} rows={3} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-sm font-serif italic outline-none focus:border-[#D4AF37] text-white custom-scrollbar" placeholder="Lore / Story..."/>
                        </div>

                        <button onClick={handlePublishAsset} className="w-full py-6 bg-[#D4AF37] text-black font-black uppercase rounded-2xl text-[10px] tracking-[6px] hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] mt-6 flex justify-center items-center gap-3"><Save size={16}/> Inject to Matrix</button>
                     </div>
                  </div>
               </div>

               <div className="xl:col-span-7">
                  <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                     <h3 className="text-xl font-serif text-white">Live Vault Matrix</h3>
                     <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded border border-[#D4AF37]/20">{liveWatches.length} Nodes Active</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                     {liveWatches.map((watch, idx) => (
                       <div key={watch._id || idx} className="bg-black/40 backdrop-blur-md p-6 rounded-[30px] border border-white/10 flex flex-col justify-between group hover:border-[#D4AF37]/50 transition-all duration-500 shadow-xl relative overflow-hidden">
                          
                          <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
                             {watch.badge && <span className="bg-[#D4AF37] text-black text-[7px] font-black px-2 py-1 rounded uppercase tracking-widest">{watch.badge}</span>}
                             {watch.stock < 3 && <span className="bg-red-500 text-white text-[7px] font-black px-2 py-1 rounded uppercase tracking-widest animate-pulse">Low Stk: {watch.stock}</span>}
                          </div>
                          
                          <div className="absolute top-4 left-4 z-20 bg-black/80 px-2 py-0.5 rounded border border-white/20 text-[7px] font-mono text-gray-400">Z: {watch.priority || 0}</div>

                          <div className="h-40 bg-black/60 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden mb-5 border border-white/5 group-hover:border-white/10 transition-colors">
                             <img src={watch.imageUrl || (watch.images && watch.images[0])} className="h-full object-contain mix-blend-screen transition-transform group-hover:scale-110 duration-700 relative z-10" />
                             {watch.model3DUrl && <Box size={16} className="absolute bottom-3 right-3 text-[#D4AF37] z-20"/>}
                             {watch.videoUrl && <Video size={16} className="absolute bottom-3 left-3 text-white/50 z-20"/>}
                          </div>
                          
                          <div className="flex-1 flex flex-col">
                             <p className="text-[8px] font-mono text-[#D4AF37] uppercase tracking-[3px] mb-1">{watch.brand}</p>
                             <h4 className="text-lg font-serif text-white leading-tight mb-3 line-clamp-1">{watch.name || watch.title}</h4>
                             
                             <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-auto">
                                <div>
                                   <p className="text-[7px] font-mono text-gray-500 uppercase tracking-widest mb-1">Market Val</p>
                                   <p className="text-lg font-bold font-mono text-white tracking-tighter">₹{Number(watch.offerPrice || watch.price || watch.basePrice).toLocaleString('en-IN')}</p>
                                </div>
                                <button onClick={() => handleDeleteAsset(watch._id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"><Trash2 size={14}/></button>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= ORDER TRACKER ================= */}
          {activeTab === 'ORDER_TRACKER' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="orders" className="space-y-8">
               <div className="bg-gradient-to-r from-blue-900/20 to-black p-10 rounded-[40px] border border-blue-500/30 flex justify-between items-center shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                  <div className="flex items-center gap-6">
                     <div className="p-5 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20"><Network size={30}/></div>
                     <div>
                        <h3 className="text-3xl font-serif italic text-white mb-1">Global Dispatch Network</h3>
                        <p className="text-[10px] text-blue-300/70 font-mono uppercase tracking-[4px]">Logistics Control Matrix</p>
                     </div>
                  </div>
               </div>
               
               <div className="space-y-4">
                 {orders.length === 0 ? <p className="text-center py-20 text-gray-600 font-mono text-sm">No logistics tasks in queue.</p> : orders.map((o: any, i: number) => (
                    <div key={i} className="p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-[30px] flex flex-col md:flex-row items-center justify-between group hover:border-blue-500/50 transition-colors shadow-lg">
                       <div className="flex items-center gap-6 mb-6 md:mb-0 w-full md:w-auto">
                          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono text-xs font-black shadow-inner">#{o.orderId?.slice(-4) || 'UKN'}</div>
                          <div>
                             <h4 className="font-bold text-xl text-white mb-1">{o.customer?.name || 'Guest User'}</h4>
                             <p className="text-[9px] text-gray-400 font-mono uppercase tracking-[3px] flex items-center gap-2"><MapPin size={10}/> {o.customer?.city || 'Unknown'}, {o.customer?.country || 'IN'} <span className="mx-1 text-white/20">|</span> <Package size={10}/> {o.items?.length || 1} Asset(s)</p>
                          </div>
                       </div>
                       <div className="flex flex-wrap md:flex-nowrap items-center gap-12 w-full lg:w-auto justify-between lg:justify-end">
                          <div className="text-left md:text-right">
                            <p className="text-[8px] text-gray-500 font-mono uppercase tracking-widest mb-1">Transferred Capital</p>
                            <p className="font-bold text-white text-2xl font-mono tracking-tighter">₹{(o.totalAmount || 0).toLocaleString()}</p>
                          </div>
                          <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                          <select value={o.status} onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)} className="w-40 bg-black border border-white/20 text-[#D4AF37] font-mono text-[10px] uppercase tracking-widest outline-none rounded-xl p-3 cursor-pointer hover:border-[#D4AF37] transition-colors appearance-none text-center">
                            <option className="bg-black" value="PENDING">PENDING</option><option className="bg-black" value="PROCESSING">PROCESSING</option>
                            <option className="bg-black" value="DISPATCHED">DISPATCHED</option><option className="bg-black" value="TRANSIT">IN TRANSIT</option>
                            <option className="bg-black text-green-500" value="DELIVERED">DELIVERED</option><option className="bg-black text-red-500" value="CANCELLED">CANCELLED</option>
                          </select>
                       </div>
                    </div>
                 ))}
               </div>
            </motion.div>
          )}

          {/* ================= PAGE BUILDER ================= */}
          {activeTab === 'PAGE_BUILDER' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="builder" className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-20">
               
               <div className="bg-black/40 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 shadow-2xl h-max space-y-10">
                  <h3 className="text-[#D4AF37] text-sm font-serif italic mb-2 border-b border-white/10 pb-6"><Layout size={18} className="inline mr-2"/> User Interface Matrix</h3>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                       <label className="text-[9px] font-mono uppercase text-gray-500 tracking-[3px] block mb-3">Primary Aura (HEX)</label>
                       <div className="flex gap-3">
                          <input type="color" value={uiConfig.primaryColor} onChange={(e)=>setUiConfig({...uiConfig, primaryColor: e.target.value})} className="w-12 h-12 rounded-xl bg-black border border-white/10 p-1 cursor-pointer shrink-0"/>
                          <input value={uiConfig.primaryColor} onChange={(e)=>setUiConfig({...uiConfig, primaryColor: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs font-mono text-white outline-none focus:border-[#D4AF37]"/>
                       </div>
                    </div>
                    <div>
                       <label className="text-[9px] font-mono uppercase text-gray-500 tracking-[3px] block mb-3">Void Space (HEX)</label>
                       <div className="flex gap-3">
                          <input type="color" value={uiConfig.bgColor} onChange={(e)=>setUiConfig({...uiConfig, bgColor: e.target.value})} className="w-12 h-12 rounded-xl bg-black border border-white/10 p-1 cursor-pointer shrink-0"/>
                          <input value={uiConfig.bgColor} onChange={(e)=>setUiConfig({...uiConfig, bgColor: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs font-mono text-white outline-none focus:border-[#D4AF37]"/>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-5 pt-8 border-t border-white/5">
                      <label className="text-[9px] font-mono uppercase text-gray-500 tracking-[3px] block"><Globe size={12} className="inline mr-2"/> Social Links</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-2 px-4 focus-within:border-[#D4AF37]">
                             <Instagram size={14} className="text-gray-500 mr-3" /><input value={socialLinks.instagram} onChange={e=>setSocialLinks({...socialLinks, instagram: e.target.value})} className="bg-transparent border-none outline-none text-[10px] font-mono text-white w-full py-1" placeholder="Instagram URL" />
                         </div>
                         <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-2 px-4 focus-within:border-[#D4AF37]">
                             <Facebook size={14} className="text-gray-500 mr-3" /><input value={socialLinks.facebook} onChange={e=>setSocialLinks({...socialLinks, facebook: e.target.value})} className="bg-transparent border-none outline-none text-[10px] font-mono text-white w-full py-1" placeholder="Facebook URL" />
                         </div>
                         <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-2 px-4 focus-within:border-[#D4AF37]">
                             <Twitter size={14} className="text-gray-500 mr-3" /><input value={socialLinks.twitter} onChange={e=>setSocialLinks({...socialLinks, twitter: e.target.value})} className="bg-transparent border-none outline-none text-[10px] font-mono text-white w-full py-1" placeholder="Twitter URL" />
                         </div>
                         <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-2 px-4 focus-within:border-[#D4AF37]">
                             <Youtube size={14} className="text-gray-500 mr-3" /><input value={socialLinks.youtube} onChange={e=>setSocialLinks({...socialLinks, youtube: e.target.value})} className="bg-transparent border-none outline-none text-[10px] font-mono text-white w-full py-1" placeholder="YouTube URL" />
                         </div>
                         <div className="flex items-center bg-black/50 border border-white/10 rounded-xl p-2 px-4 focus-within:border-[#D4AF37] md:col-span-2">
                             <LinkIcon size={16} className="text-gray-500 mr-3" /><input value={socialLinks.linkedin} onChange={e=>setSocialLinks({...socialLinks, linkedin: e.target.value})} className="bg-transparent border-none outline-none text-[10px] font-mono text-white w-full py-1" placeholder="LinkedIn URL" />
                         </div>
                      </div>
                  </div>

                  <div className="space-y-6 pt-10 border-t border-white/5">
                      <div className="flex justify-between items-center mb-6 relative">
                          <div>
                              <h3 className="text-[#D4AF37] text-sm font-black uppercase tracking-[5px]">Homepage Image Gallery</h3>
                          </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((slot, i) => (
                            <div key={slot} className="p-4 bg-black border border-white/10 rounded-3xl relative group flex flex-col items-center">
                                <span className={`absolute top-3 left-3 px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full z-20 ${galleryImages[i] ? 'bg-black text-white' : 'bg-[#D4AF37] text-black'}`}>
                                    Slot #{slot}
                                </span>
                                {galleryImages[i] ? (
                                    <div className="w-full h-28 rounded-2xl overflow-hidden relative border border-white/10 mb-2 mt-4">
                                        <img src={galleryImages[i]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        <button onClick={()=>setGalleryImages(galleryImages.filter((_,idx)=>idx!==i))} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                                    </div>
                                ) : (
                                    <div className="mt-4"><PremiumUploadNode placeholder={`Img ${slot}`} onUploadSuccess={(url: string)=>{
                                        const newGallery = [...galleryImages];
                                        newGallery[i] = url;
                                        setGalleryImages(newGallery);
                                    }} /></div>
                                )}
                            </div>
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

               <div className="space-y-12">
                 
                 <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="text-[#D4AF37] text-xs font-black uppercase tracking-[5px] flex items-center gap-2"><MessageSquare size={16}/> FAQ Node Manager</h3>
                       <button onClick={() => setFaqs([...faqs, {q:'', a:''}])} className="text-[#D4AF37] hover:scale-125 transition-transform"><PlusCircle size={20}/></button>
                    </div>
                    <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                       {faqs.map((faq, i) => (
                          <div key={i} className="p-5 bg-black border border-white/10 rounded-2xl relative group">
                             <div className="flex justify-between gap-4 mb-2">
                               <input value={faq.q} onChange={e => { const n=[...faqs]; n[i].q=e.target.value; setFaqs(n); }} className="w-full bg-transparent border-b border-white/10 p-2 text-xs font-bold text-white outline-none focus:border-[#D4AF37]" placeholder="Question" />
                               <div className="flex flex-col gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                  <button onClick={()=>moveItem(faqs, i, -1, setFaqs)} className="hover:text-[#D4AF37]"><ChevronUp size={14}/></button>
                                  <button onClick={()=>moveItem(faqs, i, 1, setFaqs)} className="hover:text-[#D4AF37]"><ChevronDown size={14}/></button>
                               </div>
                             </div>
                             <textarea value={faq.a} onChange={e => { const n=[...faqs]; n[i].a=e.target.value; setFaqs(n); }} className="w-full bg-transparent p-2 text-xs text-gray-400 outline-none h-16 focus:border-[#D4AF37] border-b border-transparent" placeholder="Answer" />
                             <button onClick={()=>setFaqs(faqs.filter((_,idx)=>idx!==i))} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="text-[#D4AF37] text-xs font-black uppercase tracking-[5px]"><Award size={16} className="inline mr-2"/> "Worn By Icons" Builder</h3>
                       <button onClick={() => setVisionaries([...visionaries, {name:'', watch:'', img:''}])} className="text-[#D4AF37] hover:scale-125 transition-transform"><PlusCircle size={20}/></button>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                       {visionaries.map((v, i) => (
                          <div key={i} className="p-5 bg-black border border-white/10 rounded-2xl group relative flex items-center gap-4">
                             {v.img ? <img src={v.img} className="w-16 h-16 rounded-xl object-cover border border-white/10" /> : <PremiumUploadNode placeholder="Icon Img" onUploadSuccess={(url:string)=>{ const n=[...visionaries]; n[i].img=url; setVisionaries(n); }} />}
                             
                             <div className="flex-1 space-y-2">
                               <input value={v.name} onChange={e => { const n=[...visionaries]; n[i].name=e.target.value; setVisionaries(n); }} className="w-full bg-transparent border-b border-white/10 p-1 text-sm font-serif italic text-white outline-none focus:border-[#D4AF37]" placeholder="Icon Name (e.g. SRK)" />
                               <input value={v.watch} onChange={e => { const n=[...visionaries]; n[i].watch=e.target.value; setVisionaries(n); }} className="w-full bg-transparent border-b border-white/10 p-1 text-[10px] uppercase tracking-widest text-[#D4AF37] outline-none focus:border-[#D4AF37]" placeholder="Watch Identity" />
                             </div>
                             <div className="flex flex-col justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                                <button onClick={()=>moveItem(visionaries, i, -1, setVisionaries)} className="hover:text-[#D4AF37]"><ChevronUp size={14}/></button>
                                <button onClick={()=>setVisionaries(visionaries.filter((_,idx)=>idx!==i))} className="text-red-500"><Trash2 size={14}/></button>
                                <button onClick={()=>moveItem(visionaries, i, 1, setVisionaries)} className="hover:text-[#D4AF37]"><ChevronDown size={14}/></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

               </div>
            </motion.div>
          )}

          {/* 🌟 NEW: LEGAL & POLICIES BUILDER 🌟 */}
          {activeTab === 'LEGAL_PAGES' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="legal" className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-32">
               
               <div className="lg:col-span-4 space-y-8">
                  <div className="bg-[#0A0A0A] p-8 rounded-[40px] border border-white/5 shadow-2xl">
                     <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                        <h3 className="text-[#D4AF37] text-sm font-black uppercase tracking-[5px] flex items-center gap-3"><FileText size={20}/> Active Policies</h3>
                        <button onClick={() => setLegalPages([...legalPages, { id: Date.now().toString(), title: 'New Policy', slug: 'new-policy', content: '' }])} className="text-[#D4AF37] hover:scale-125 transition-transform"><PlusCircle size={20}/></button>
                     </div>
                     <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {legalPages.map((page) => (
                           <div key={page.id} onClick={() => setActiveLegalPageId(page.id)} className={`p-5 rounded-2xl border cursor-pointer transition-all flex justify-between items-center group ${activeLegalPageId === page.id ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg' : 'bg-black border-white/10 text-white hover:border-white/30'}`}>
                              <div>
                                 <h4 className="font-bold text-sm">{page.title}</h4>
                                 <p className={`text-[9px] font-mono mt-1 ${activeLegalPageId === page.id ? 'text-black/60' : 'text-gray-500'}`}>/{page.slug}</p>
                              </div>
                              <button onClick={(e)=>{ e.stopPropagation(); setLegalPages(legalPages.filter(p=>p.id!==page.id)); if(activeLegalPageId===page.id) setActiveLegalPageId(legalPages[0]?.id||''); }} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeLegalPageId === page.id ? 'text-red-800 hover:text-red-900' : 'text-red-500 hover:text-red-400'}`}><Trash2 size={16}/></button>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-[#0A0A0A] p-8 rounded-[40px] border border-white/5 shadow-2xl">
                     <h3 className="text-[#D4AF37] text-sm font-black uppercase tracking-[5px] mb-6 flex items-center gap-3"><MapPin size={20}/> Corporate Info</h3>
                     <div className="space-y-4">
                        <input value={corporateInfo.companyName} onChange={e=>setCorporateInfo({...corporateInfo, companyName: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-[#D4AF37]" placeholder="Company Legal Name" />
                        <textarea value={corporateInfo.address} onChange={e=>setCorporateInfo({...corporateInfo, address: e.target.value})} rows={3} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-[#D4AF37]" placeholder="Registered Address" />
                        <input value={corporateInfo.phone1} onChange={e=>setCorporateInfo({...corporateInfo, phone1: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-[#D4AF37]" placeholder="Primary Phone (e.g. +91 9876543210)" />
                        <input value={corporateInfo.phone2} onChange={e=>setCorporateInfo({...corporateInfo, phone2: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-[#D4AF37]" placeholder="Secondary Phone (Optional)" />
                        <input value={corporateInfo.email} onChange={e=>setCorporateInfo({...corporateInfo, email: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-[#D4AF37]" placeholder="Support Email" />
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-8">
                  {activeLegalPageId ? (
                     <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(212,175,55,0.15)] flex flex-col h-full min-h-[800px]">
                        <div className="flex gap-6 mb-8">
                           <div className="flex-1 space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500">Page Title</label>
                              <input value={legalPages.find(p=>p.id===activeLegalPageId)?.title || ''} onChange={e=>{ const n=[...legalPages]; const idx=n.findIndex(p=>p.id===activeLegalPageId); if(idx>-1) n[idx].title=e.target.value; setLegalPages(n); }} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xl font-serif italic text-white outline-none focus:border-[#D4AF37]" placeholder="e.g. Privacy Policy"/>
                           </div>
                           <div className="flex-1 space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500">URL Slug</label>
                              <div className="flex items-center bg-black border border-white/10 rounded-2xl px-4 focus-within:border-[#D4AF37] transition-colors">
                                 <span className="text-gray-600 font-mono text-sm">/policies/</span>
                                 <input value={legalPages.find(p=>p.id===activeLegalPageId)?.slug || ''} onChange={e=>{ const n=[...legalPages]; const idx=n.findIndex(p=>p.id===activeLegalPageId); if(idx>-1) n[idx].slug=e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-'); setLegalPages(n); }} className="bg-transparent border-none outline-none text-sm text-[#D4AF37] w-full py-5 font-mono" placeholder="privacy-policy"/>
                              </div>
                           </div>
                        </div>

                        <div className="flex-1 flex flex-col space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 flex justify-between">
                              <span>Page Content (HTML/Text)</span>
                              <span className="text-[#D4AF37]">Accepts standard HTML formatting</span>
                           </label>
                           <textarea value={legalPages.find(p=>p.id===activeLegalPageId)?.content || ''} onChange={e=>{ const n=[...legalPages]; const idx=n.findIndex(p=>p.id===activeLegalPageId); if(idx>-1) n[idx].content=e.target.value; setLegalPages(n); }} className="flex-1 w-full bg-black border border-white/10 p-8 rounded-[30px] text-sm font-sans leading-relaxed outline-none focus:border-[#D4AF37] text-gray-300 custom-scrollbar" placeholder="<h2>1. Introduction</h2><p>Welcome to our store...</p>"/>
                        </div>

                        <button onClick={handleDeployCMS} className="w-full py-7 bg-[#D4AF37] text-black font-black uppercase rounded-[30px] text-[11px] tracking-[6px] hover:bg-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)] mt-8">Deploy Architecture Globally</button>
                     </div>
                  ) : (
                     <div className="bg-[#0A0A0A] p-12 rounded-[50px] border border-white/5 h-full min-h-[800px] flex items-center justify-center flex-col text-center">
                        <FileText size={60} className="text-gray-600 mb-6 opacity-20"/>
                        <p className="text-gray-500 font-serif italic text-2xl">Select or create a node to begin drafting.</p>
                     </div>
                  )}
               </div>

            </motion.div>
          )}

          {/* 🌟 🌟 🌟 UPDATED: SENTIMENT CENTER (SHADOWBAN FEATURE ADDED) 🌟 🌟 🌟 */}
          {activeTab === 'REVIEWS' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="rev" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               
               <div className="lg:col-span-4 space-y-8">
                   <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[40px] border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                      <h3 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Inject Synthetic Testimonial</h3>
                      <div className="space-y-4">
                         <input value={fakeReview.userName} onChange={e=>setFakeReview({...fakeReview, userName: e.target.value})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-[#D4AF37] font-mono text-white" placeholder="Identity Name" />
                         <select value={fakeReview.rating} onChange={e=>setFakeReview({...fakeReview, rating: Number(e.target.value)})} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-xs font-mono text-[#D4AF37] outline-none focus:border-[#D4AF37] appearance-none">
                            <option className="bg-black" value={5}>5.0 - Optimal</option><option className="bg-black" value={4}>4.0 - Acceptable</option>
                         </select>
                         <textarea value={fakeReview.comment} onChange={e=>setFakeReview({...fakeReview, comment: e.target.value})} rows={4} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-xs font-serif italic outline-none focus:border-[#D4AF37] text-gray-300" placeholder="Synthetic feedback text..." />
                         
                         {/* 🌟 ADMIN CAN ALSO ADD MEDIA TO SYNTHETIC REVIEWS 🌟 */}
                         <div className="pt-2">
                             <label className="text-[9px] font-mono uppercase text-gray-500 tracking-[3px] block mb-2">Media Injection</label>
                             <div className="flex gap-2 items-center">
                                 {fakeReview.media && fakeReview.media.map((url, idx) => (
                                     <div key={idx} className="relative w-12 h-12 rounded overflow-hidden">
                                        <img src={url} className="w-full h-full object-cover"/>
                                        <button onClick={()=>setFakeReview({...fakeReview, media: fakeReview.media.filter(x => x !== url)})} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5"><X size={8}/></button>
                                     </div>
                                 ))}
                                 <div className="scale-75 origin-left">
                                     <PremiumUploadNode placeholder="IMG" onUploadSuccess={(url: string)=>setFakeReview({...fakeReview, media: [...(fakeReview.media || []), url]})} />
                                 </div>
                             </div>
                         </div>

                         <button onClick={handleInjectFakeReview} className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase rounded-xl text-[9px] tracking-widest hover:bg-white transition-all">Execute Injection</button>
                      </div>
                   </div>

                   {/* FAQs */}
                   <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-lg">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                           <h3 className="text-[#D4AF37] text-sm font-serif italic flex items-center gap-2"><MessageSquare size={16}/> FAQ Nodes</h3>
                           <button onClick={() => setFaqs([...faqs, {q:'', a:''}])} className="text-[#00F0FF] hover:scale-110 transition-transform"><PlusCircle size={16}/></button>
                        </div>
                        <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                           {faqs.map((faq, i) => (
                              <div key={i} className="p-4 bg-black/50 border border-white/10 rounded-xl relative group space-y-2">
                                 <input value={faq.q} onChange={e => { const n=[...faqs]; n[i].q=e.target.value; setFaqs(n); }} className="w-full bg-transparent border-b border-white/10 p-1 text-[10px] font-bold text-white outline-none focus:border-white" placeholder="Q:" />
                                 <textarea value={faq.a} onChange={e => { const n=[...faqs]; n[i].a=e.target.value; setFaqs(n); }} rows={2} className="w-full bg-transparent p-1 text-[10px] text-gray-400 outline-none focus:border-white border-b border-transparent" placeholder="A:" />
                                 <button onClick={()=>setFaqs(faqs.filter((_,idx)=>idx!==i))} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 p-1 bg-black rounded transition-all"><Trash2 size={12}/></button>
                              </div>
                           ))}
                        </div>
                   </div>
               </div>
               
               <div className="lg:col-span-8 bg-black/40 backdrop-blur-xl p-10 rounded-[50px] border border-white/10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
                    <div>
                        <h3 className="text-2xl font-serif text-white mb-1">Reputation Engine</h3>
                        <p className="text-[9px] text-[#00F0FF] font-mono uppercase tracking-widest">Shadowban filter active. Pending reviews stay at the top.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar pr-4">
                     {allReviews.map((rev:any, i:number) => (
                       <div key={i} className={`bg-black/60 border p-6 rounded-[30px] flex flex-col md:flex-row justify-between gap-6 transition-all group ${rev.visibility === 'pending' ? 'border-[#00F0FF]/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
                          
                          <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-base text-white flex items-center gap-2">{rev.userName} {rev.isAdminGenerated && <ShieldCheck size={12} className="text-[#D4AF37]"/>}</h4>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border tracking-widest ${rev.visibility === 'public' ? 'bg-green-500/10 text-green-500 border-green-500/20' : rev.visibility === 'pending' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/50 animate-pulse' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                   {rev.visibility === 'rejected' ? 'SHADOWBANNED' : rev.visibility || 'PENDING'}
                                </span>
                             </div>
                             <div className="flex gap-1 text-[#D4AF37] mb-3">{[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={12} fill="currentColor"/>)}</div>
                             <p className="text-gray-400 text-xs font-serif italic mb-3">"{rev.comment}"</p>
                             
                             {/* 🌟 SHOW MEDIA TO ADMIN 🌟 */}
                             {rev.media && rev.media.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                   {rev.media.map((m:string, idx:number) => (
                                      m.match(/\.(mp4|webm|mov)$/i) ? 
                                      <video key={idx} src={m} className="w-10 h-10 object-cover rounded border border-white/10" controls/> :
                                      <img key={idx} src={m} className="w-10 h-10 object-cover rounded border border-white/10"/>
                                   ))}
                                </div>
                             )}

                             <p className="text-[8px] text-gray-600 font-mono mt-3">Target ID: {rev.product?.slice(-6) || 'GLOBAL'}</p>
                          </div>
                          
                          <div className={`flex md:flex-col gap-3 justify-center md:min-w-[140px] transition-opacity ${rev.visibility === 'pending' ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`}>
                             <button onClick={()=>handleReviewAction(rev._id, 'public')} className="flex-1 py-2 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-black rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Approve</button>
                             <button onClick={()=>handleReviewAction(rev._id, 'rejected')} className="flex-1 py-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Ghost/Hide</button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 8. SALES FORCE ================= */}
          {activeTab === 'SALES_FORCE' && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key="salesforce" className="space-y-12">
               <div className="bg-gradient-to-br from-[#0A0A0A] to-[#00150F] p-16 rounded-[60px] border border-[#D4AF37]/30 flex flex-col md:flex-row justify-between items-center shadow-[0_20px_50px_rgba(212,175,55,0.1)] relative overflow-hidden gap-10">
                  <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/4"><LinkIcon size={300}/></div>
                  <div className="relative z-10 max-w-2xl">
                    <h3 className="text-5xl md:text-6xl font-serif italic mb-6 text-white leading-tight">Affiliate Protocol</h3>
                    <p className="text-gray-400 text-sm font-mono tracking-widest">Network traffic and commission monitor.</p>
                  </div>
                  <button onClick={() => setIsAgentModalOpen(true)} className="relative z-10 bg-[#D4AF37] text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[4px] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-3 shrink-0">
                     <PlusCircle size={16}/> Create Tracking Node
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[35px] border border-white/10">
                     <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Users size={12}/> Network Size</p>
                     <h2 className="text-5xl font-black font-mono text-white">{agents.length}</h2>
                  </div>
                  <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[35px] border border-[#00F0FF]/20 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
                     <p className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={12}/> Global Hits</p>
                     <h2 className="text-5xl font-black font-mono text-white">{agents.reduce((acc, a) => acc + (a.clicks || 0), 0).toLocaleString()}</h2>
                  </div>
                  <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[35px] border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                     <p className="text-[10px] font-mono text-green-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Wallet size={12}/> Total Capital Raised</p>
                     <h2 className="text-5xl font-black font-mono text-white">₹{agents.reduce((acc, a) => acc + (a.revenue || 0), 0).toLocaleString()}</h2>
                  </div>
               </div>

               <div className="bg-black/40 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-white/10"><h4 className="text-[11px] font-mono uppercase tracking-[5px] text-gray-400">Node Ledger</h4></div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[5px] text-gray-500 border-b border-white/10">
                            <tr><th className="p-6 pl-10">Agent Code</th><th className="p-6 text-center">Hits</th><th className="p-6 text-center">Conversions</th><th className="p-6 text-right pr-10">Yield Generated</th></tr>
                         </thead>
                         <tbody>
                            {agents.length === 0 ? (
                                <tr><td colSpan={4} className="p-20 text-center font-mono text-gray-500 text-sm">No agents deployed.</td></tr>
                            ) : agents.map((agent, i) => (
                               <tr key={agent._id || `agt-${i}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                  <td className="p-6 pl-10">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-xl flex items-center justify-center font-mono text-xs">{agent.name?.split(' ').map((n:any)=>n[0]).join('').substring(0,2) || 'A'}</div>
                                        <div><p className="font-bold text-sm text-white mb-0.5">{agent.name}</p><p className="text-[8px] text-[#00F0FF] font-mono tracking-widest uppercase">?ref={agent.code}</p></div>
                                     </div>
                                  </td>
                                  <td className="p-6 text-center text-gray-300 font-mono text-lg">{agent.clicks || 0}</td>
                                  <td className="p-6 text-center font-bold text-green-400 text-lg">{agent.sales || 0}</td>
                                  <td className="p-6 text-right pr-10"><p className="font-bold text-xl text-white font-mono">₹{(agent.revenue || 0).toLocaleString()}</p></td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 9. AI NEURAL CORE ================= */}
          {activeTab === 'AI_ENGINE' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="ai" className="max-w-4xl mx-auto space-y-10">
               
               <div className="text-center mb-12">
                   <Cpu size={60} className="text-[#00F0FF] mx-auto mb-6 animate-pulse opacity-50"/>
                   <h2 className="text-4xl font-serif italic text-white mb-2">Neural Pricing Protocol</h2>
                   <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Autonomous dynamic valuation engine.</p>
               </div>

               <div className="bg-black/40 backdrop-blur-xl p-12 rounded-[40px] border border-[#00F0FF]/30 shadow-[0_0_50px_rgba(0,240,255,0.05)] space-y-12 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent"></div>
                  
                  <div className="flex justify-between items-center border-b border-white/10 pb-8">
                     <div>
                        <h4 className="text-xl font-serif text-white mb-1">Engine Status</h4>
                        <p className="text-[9px] font-mono uppercase tracking-[3px] text-gray-500">Allow AI to manipulate prices</p>
                     </div>
                     <div className="flex items-center gap-4 bg-black border border-white/10 p-2 rounded-full">
                        <span className={`text-[9px] uppercase font-black tracking-widest px-4 ${pricingRules.isAiPricingActive ? 'text-[#00F0FF]' : 'text-gray-600'}`}>{pricingRules.isAiPricingActive ? 'ONLINE' : 'OFFLINE'}</span>
                        <button onClick={() => setPricingRules({...pricingRules, isAiPricingActive: !pricingRules.isAiPricingActive})} className={`w-16 h-8 rounded-full p-1 transition-colors ${pricingRules.isAiPricingActive ? 'bg-[#00F0FF]' : 'bg-gray-800'}`}>
                           <div className={`w-6 h-6 bg-black rounded-full transition-transform shadow-md ${pricingRules.isAiPricingActive ? 'translate-x-8' : 'translate-x-0'}`}></div>
                        </button>
                     </div>
                  </div>

                  <div className="space-y-10">
                     <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <div className="flex justify-between items-end mb-4">
                           <label className="text-[10px] font-mono uppercase text-gray-400 tracking-[3px] flex items-center gap-2"><TrendingUp size={14} className="text-green-500"/> Surge Cap (Max Increase)</label>
                           <span className="text-2xl font-mono text-white">{pricingRules.maxMarkupPercent}%</span>
                        </div>
                        <input type="range" min="0" max="50" value={pricingRules.maxMarkupPercent} onChange={(e) => setPricingRules({...pricingRules, maxMarkupPercent: Number(e.target.value)})} className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer" style={{accentColor: '#00F0FF'}} />
                        <p className="text-[8px] text-gray-500 font-mono mt-3 text-right">Upper limit for high-demand assets.</p>
                     </div>
                  </div>

                  <button onClick={handleSaveAIRules} className="w-full py-6 bg-[#00F0FF] text-black font-black uppercase rounded-2xl text-[10px] tracking-[4px] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] mt-8 flex items-center justify-center gap-3">
                     <Save size={16}/> Compile Logic Matrix
                  </button>
               </div>
            </motion.div>
          )}

          {/* ================= 10. SECURITY ================= */}
          {activeTab === 'SECURITY' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-3xl mx-auto mt-20">
               <div className="bg-gradient-to-r from-red-900/30 to-black border border-red-500/30 p-12 rounded-[50px] flex flex-col items-center text-center shadow-[0_0_80px_rgba(239,68,68,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ef444405_10px,#ef444405_20px)] pointer-events-none"></div>
                  
                  <div className="p-6 bg-red-500/10 rounded-[30px] text-red-500 mb-8 border border-red-500/20 relative z-10"><ShieldAlert size={60} className="animate-pulse" /></div>
                  <h3 className="text-4xl font-serif italic text-white mb-2 relative z-10">Global Lockdown</h3>
                  <p className="text-[10px] text-red-400 font-mono uppercase tracking-[4px] mb-10 relative z-10">System is currently secure. AES-256 Active.</p>
                  
                  <button className="px-14 py-6 bg-red-600 text-white text-[12px] font-black uppercase tracking-[6px] rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:bg-red-500 transition-all flex items-center gap-3 relative z-10">
                     <Lock size={18}/> Initiate Defcon 1 (Maintenance)
                  </button>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ImperialGodmodeOS), { ssr: false });
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
import RedirectManager from '@/components/Admin/RedirectManager';
import dynamic from 'next/dynamic';

// 🌟 SEO COMPONENTS IMPORTED 🌟
import SeoPanel from '@/components/Admin/SeoPanel';
import ImageSeoPanel from '@/components/Admin/ImageSeoPanel';
import SeoAnalyticsDashboard from '@/components/Admin/SeoAnalyticsDashboard';

const MODULES = [
  { id: 'FULL_DASHBOARD', icon: BarChart3, label: 'Main Dashboard' },
  { id: 'INVENTORY', icon: Package, label: 'Products & Inventory' },
  { id: 'ORDER_TRACKER', icon: Truck, label: 'Manage Orders' },
  { id: 'CRM', icon: Users, label: 'Customers & CRM' },
  { id: 'MARKETING', icon: Gift, label: 'Coupons & Marketing' },
  { id: 'PAGE_BUILDER', icon: Layout, label: 'Website Builder' },
  { id: 'AMBASSADORS', icon: Award, label: 'Brand Ambassadors' }, 
  { id: 'SEO_ENGINE', icon: Globe, label: 'SEO Command Center' }, 
  { id: 'LEGAL_PAGES', icon: FileText, label: 'Legal Policies' },
  { id: 'REVIEWS', icon: Star, label: 'Customer Reviews' },
  { id: 'SALES_FORCE', icon: LinkIcon, label: 'Affiliates & Partners' },
  { id: 'AI_ENGINE', icon: Zap, label: 'Smart Pricing AI' },
  { id: 'SECURITY', icon: ShieldAlert, label: 'Security & Maintenance' }
];

const DEFAULT_GALLERY: string[] = [];

const PremiumUploadNode = ({ onUploadSuccess, placeholder="Image/Video" }: any) => {
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
                 preview ? (preview.match(/\.(mp4|webm|mov)$/i) ? <video src={preview} className="w-full h-full object-cover rounded-xl shadow-lg" autoPlay muted loop/> : <img src={preview} className="w-full h-full object-cover rounded-xl shadow-lg" />) :
                 <>
                    <UploadCloud size={16} className="text-gray-500 group-hover:text-[#D4AF37] mb-1.5 transition-colors"/>
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-tight group-hover:text-[#D4AF37] transition-colors">{dragging ? "Drop File" : `Upload ${placeholder}`}</span>
                 </>
                }
            </label>
        </div>
    );
};

function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('FULL_DASHBOARD');
  const [dashboardView, setDashboardView] = useState<'orders' | 'abandoned'>('orders');
  const [isSyncing, setIsSyncing] = useState(false);

  const [systemLogs, setSystemLogs] = useState<string[]>(["System initialized. Production environment connected."]);

  const [leads, setLeads] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [liveWatches, setLiveWatches] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [fullAnalytics, setFullAnalytics] = useState<any>(null);

  const [celebs, setCelebs] = useState<any[]>([]);
  const [newCeleb, setNewCeleb] = useState({ name: '', title: '', imageUrl: '' });

  const [heroSlides, setHeroSlides] = useState([{ id: 1, type: 'video', url: '', heading: 'Welcome to Essential' }]);
  const [aboutConfig, setAboutConfig] = useState({ content: '', alignment: 'center', style: 'luxury', boldWords: '' });
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_GALLERY); 
  const [promoVideos, setPromoVideos] = useState<string[]>(["", "", "", "", ""]); 

  const [uiConfig, setUiConfig] = useState({ primaryColor: '#D4AF37', bgColor: '#050505', fontFamily: 'serif', buttonRadius: 'full' });
  const [categories, setCategories] = useState(["Investment Grade", "Rare Vintage", "Modern Complications"]);
  const [newCategory, setNewCategory] = useState("");
  const [faqs, setFaqs] = useState([{ q: 'Are these authentic?', a: 'Yes, 100% verified.' }]);
  const [socialLinks, setSocialLinks] = useState({ instagram: '', facebook: '', twitter: '', youtube: '', linkedin: '' });
  
  const [corporateInfo, setCorporateInfo] = useState({ companyName: 'Essential Rush Pvt Ltd', address: '', phone1: '', phone2: '', email: '' });
  const [legalPages, setLegalPages] = useState([{ id: '1', title: 'Privacy Policy', slug: 'privacy-policy', content: '' }]);
  const [activeLegalPageId, setActiveLegalPageId] = useState('1');

  const [manualReview, setManualReview] = useState<{userName: string, comment: string, rating: number, product: string, visibility: string, isAdminGenerated: boolean, media: string[]}>({ userName: '', comment: '', rating: 5, product: 'GLOBAL', visibility: 'public', isAdminGenerated: true, media: [] });
  
  const [watchForm, setWatchForm] = useState({ 
      name: '', brand: '', category: categories[0] || '', price: '', offerPrice: '', stock: '', 
      imageUrl: '', images: ['', '', '', '', '', '', ''], videoUrl: '', model3DUrl: '', 
      description: '', seoTags: '', specifications: '', priority: 0, badge: 'New Arrival', 
      amazonDetails: [{ key: 'Dial Color', value: 'Black' }],
      vipVaultKey: '', vipDiscount: '', transitFee: '0', taxPercentage: '18', taxInclusive: true,
      seo: { metaTitle: '', metaDescription: '', focusKeyword: '', slug: '', noindex: false, imageAltTexts: {} }
  });

  const [couponForm, setCouponForm] = useState({ code: '', discountValue: '', minOrder: '', validUntil: '' });
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentForm, setAgentForm] = useState({ name: '', email: '', code: '', tier: 'Sales Partner', commissionRate: 5 });
  const [pricingRules, setPricingRules] = useState({ isAiPricingActive: true, maxMarkupPercent: 15, maxDiscountPercent: 10, lowStockThreshold: 3, trendingThreshold: 10 });

  const addLog = (msg: string) => {
      setSystemLogs(prev => [msg, ...prev].slice(0, 8)); 
  };

  const fetchDashboardData = async (silent = false) => {
    if (!silent) {
        setIsSyncing(true);
        if(systemLogs.length === 1) addLog("Syncing real-time database modules...");
    }
    try {
      const ts = new Date().getTime();
      const [resLeads, resCms, resProducts, resAgents, resOrders, resRules, resAnalytics, resReviews, resMarketing, resCust, resCelebs] = await Promise.all([
        fetch(`/api/admin/analytics?t=${ts}`).then(r => r.ok ? r.json() : {leads: []}),
        fetch(`/api/cms?t=${ts}`).then(r => r.ok ? r.json() : {data: null}),
        fetch(`/api/products?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/agents?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/orders?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/ai/rules?t=${ts}`).then(r => r.ok ? r.json() : {data: null}),
        fetch(`/api/dashboard/full-analytics?t=${ts}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/reviews?admin=true&t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/admin/marketing?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/admin/users?t=${ts}`).then(r => r.ok ? r.json() : {data: []}).catch(()=>({data:[]})),
        fetch(`/api/celebrity?t=${ts}`).then(r => r.ok ? r.json() : {data: []})
      ]);
      
      if (resLeads.leads) setLeads(resLeads.leads);
      if (resProducts.data) setLiveWatches(resProducts.data.filter((w:any)=>w&&w._id).sort((a:any, b:any) => (b.priority || 0) - (a.priority || 0)));
      if (resAgents.data) setAgents(resAgents.data);
      if (resOrders.data) setOrders(resOrders.data);
      if (resRules.data) setPricingRules(resRules.data);
      if (resAnalytics && resAnalytics.success) setFullAnalytics(resAnalytics);
      if (resCelebs.data) setCelebs(resCelebs.data);
      
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
        if(resCms.data.promotionalVideos) setPromoVideos(resCms.data.promotionalVideos); 
        if(resCms.data.uiConfig) setUiConfig(resCms.data.uiConfig);
        if(resCms.data.categories) setCategories(resCms.data.categories);
        if(resCms.data.faqs) setFaqs(resCms.data.faqs);
        if(resCms.data.socialLinks) setSocialLinks(resCms.data.socialLinks);
        if(resCms.data.corporateInfo) setCorporateInfo(resCms.data.corporateInfo); 
        if(resCms.data.legalPages) setLegalPages(resCms.data.legalPages); 
      }
    } catch (e) { 
        if (!silent) addLog("Error: Database connection disrupted."); 
    } finally { 
        if (!silent) setIsSyncing(false); 
    }
  };

  useEffect(() => { 
      if (session?.user?.role === 'SUPER_ADMIN') fetchDashboardData(); 
  }, [session]);

  const handleAddHeroSlide = () => setHeroSlides([...heroSlides, { id: Date.now(), type: 'video', url: '', heading: 'New Banner' }]);
  const handleRemoveHeroSlide = (id: number) => setHeroSlides(heroSlides.filter(s => s.id !== id));
  
  const handleSaveCMS = async () => {
    setIsSyncing(true); addLog("Pushing UI configuration to database...");
    try {
      await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ heroSlides, aboutConfig, galleryImages, promotionalVideos: promoVideos, uiConfig, categories, faqs, socialLinks, corporateInfo, legalPages }) });
      alert("Settings Saved Successfully!"); addLog("CMS sync complete.");
    } catch (e) { alert("Failed to save settings."); } finally { setIsSyncing(false); }
  };

  const handleSaveAIRules = async () => {
    setIsSyncing(true); addLog("Pushing pricing algorithms...");
    try {
      await fetch('/api/ai/rules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pricingRules) });
      alert("Pricing Rules Updated Successfully!"); addLog("Rules updated.");
    } catch (e) { alert("Failed to save pricing rules."); } finally { setIsSyncing(false); }
  };

  const handleAddManualReview = async () => {
    if (!manualReview.userName || !manualReview.comment) return alert("Please fill name and review comment.");
    setIsSyncing(true); addLog(`Saving admin review...`);
    try {
      await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(manualReview) });
      setManualReview({ userName: '', comment: '', rating: 5, product: 'GLOBAL', visibility: 'public', isAdminGenerated: true, media: [] });
      fetchDashboardData();
      alert("Review Added Successfully!");
    } catch (e) { alert("Failed to add review."); } finally { setIsSyncing(false); }
  };

  const handleSaveProduct = async () => {
    if (!watchForm.name.trim() || !watchForm.price.toString().trim() || !watchForm.imageUrl.trim()) {
        return alert("⚠️ Missing Fields! Product Name, Base Price, and Main Image URL are mandatory.");
    }
    setIsSyncing(true); addLog("Encrypting product data...");
    try {
      const validAmazonDetails = watchForm.amazonDetails.filter(d => d.key.trim() !== '' && d.value.trim() !== '');
      const tagsArray = watchForm.seoTags.split(',').map(s=>s.trim()).filter(s=>s);
      const additionalImages = watchForm.images.filter(img => typeof img === 'string' && img.trim() !== "");

      const generatedSlug = watchForm.seo.slug || watchForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
      const generatedSku = `PRD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      const finalProduct = { 
          name: watchForm.name, slug: generatedSlug, sku: generatedSku, brand: watchForm.brand, category: watchForm.category,
          price: Number(watchForm.price) || 0, offerPrice: Number(watchForm.offerPrice) || Number(watchForm.price) || 0, stock: Number(watchForm.stock) || 0,
          imageUrl: watchForm.imageUrl, images: additionalImages, videoUrl: watchForm.videoUrl, model3DUrl: watchForm.model3DUrl,
          description: watchForm.description, tags: tagsArray, priority: Number(watchForm.priority) || 0, badge: watchForm.badge, amazonDetails: validAmazonDetails,
          vipVaultKey: watchForm.vipVaultKey.toUpperCase(), vipDiscount: Number(watchForm.vipDiscount) || 0, transitFee: Number(watchForm.transitFee) || 0, taxPercentage: Number(watchForm.taxPercentage) || 18, taxInclusive: watchForm.taxInclusive,
          seo: watchForm.seo
      };

      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(finalProduct) });
      const data = await res.json();

      if (res.ok && data.success) { 
          alert("Product Saved Successfully!"); addLog("Product live.");
          setWatchForm({ 
              name: '', brand: '', category: categories[0] || '', price: '', offerPrice: '', stock: '', imageUrl: '', images: ['', '', '', '', '', '', ''], videoUrl: '', model3DUrl: '', description: '', specifications: '', seoTags: '', priority: 0, badge: 'New Arrival', amazonDetails: [{ key: 'Dial Color', value: 'Black' }],
              vipVaultKey: '', vipDiscount: '', transitFee: '0', taxPercentage: '18', taxInclusive: true,
              seo: { metaTitle: '', metaDescription: '', focusKeyword: '', slug: '', noindex: false, imageAltTexts: {} }
          });
          fetchDashboardData(); 
      } else { alert(`Error saving product: ${data.error || 'Check fields and try again'}`); }
    } catch (e) { alert("Network Error!"); } 
    finally { setIsSyncing(false); }
  };

  // 🚀 🚨 INSTANT DELETION OPERATIONS (OPTIMISTIC UI UPDATES) 🚨 🚀
  
  const handleDeleteProduct = async (id: string) => {
    if(!confirm("Delete this product from vault?")) return;
// API call success hone ke baad ye line zaroor honi chahiye:
setLiveWatches(prevWatches => prevWatches.filter(watch => watch._id !== id));
    try { await fetch(`/api/products`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) }); } catch(e) {}
  };

  const handleDeleteCoupon = async (id: string) => {
      if(!confirm("Delete this coupon code?")) return;
      setCoupons(prev => prev.filter(c => c._id !== id)); 
      try { await fetch(`/api/admin/marketing/${id}`, { method: 'DELETE' }); } catch(e) {}
  };

  const handleDeleteAffiliate = async (id: string) => {
      if(!confirm("Remove this affiliate partner?")) return;
      setAgents(prev => prev.filter(a => a._id !== id)); 
      try { await fetch(`/api/agents`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) }); } catch(e) {}
  };

  const handleDeleteReview = async (id: string) => {
      if(!confirm("Permanently delete this review?")) return;
      setAllReviews(prev => prev.filter(r => r._id !== id)); 
      try { await fetch(`/api/reviews`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) }); } catch(e) {}
  };

  const handleDeleteOrder = async (id: string) => {
      if(!confirm("Permanently delete this order?")) return;
      setOrders(prev => prev.filter(o => o._id !== id)); 
      try { await fetch(`/api/orders`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) }); } catch(e) {}
  };

  const handleDeleteLead = async (id: string) => {
      if(!confirm("Permanently erase this client record?")) return;
      setLeads(prev => prev.filter(l => l._id !== id)); 
      try { await fetch(`/api/admin/users/${id}`, { method: 'DELETE' }); } catch(e) {}
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    setIsSyncing(true); addLog(`Order ${id.slice(-4)} updated to ${newStatus}`);
    try {
        const res = await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
        if(res.ok) fetchDashboardData();
    } catch(e) { alert("Failed to update order status."); } finally { setIsSyncing(false); }
  };

  const handleUpdateReviewStatus = async (reviewId: string, visibility: string) => {
      setIsSyncing(true); addLog(`Updating review visibility...`);
      try {
          await fetch('/api/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reviewId, visibility }) });
          fetchDashboardData();
      } catch (e) { alert("Failed to update review."); } finally { setIsSyncing(false); }
  };

  const handleAddAffiliate = async () => {
    if (!agentForm.name || !agentForm.email) return alert("Name and Email are required.");
    setIsSyncing(true); addLog("Creating secure affiliate profile...");
    try {
      const res = await fetch('/api/agents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(agentForm) });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Affiliate Partner Added Successfully!`); setAgentForm({ name: '', email: '', code: '', tier: 'Partner', commissionRate: 5 });
        setIsAgentModalOpen(false); fetchDashboardData();
      }
    } catch (error) { alert("Network Error."); } finally { setIsSyncing(false); }
  };

  const handleCreateCoupon = async () => {
      if(!couponForm.code || !couponForm.discountValue) return alert("Code and Discount Value are required.");
      setIsSyncing(true); addLog(`Saving marketing rule...`);
      try {
          await fetch('/api/admin/marketing', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(couponForm)});
          setCouponForm({code: '', discountValue: '', minOrder: '', validUntil: ''}); fetchDashboardData();
      } catch (e) { alert("Failed to save coupon."); } finally { setIsSyncing(false); }
  };

  const handleAddCelebrity = async () => {
      if(!newCeleb.name || !newCeleb.imageUrl) return alert("Name and Image are required.");
      setIsSyncing(true); addLog("Adding Brand Ambassador...");
      try {
          const res = await fetch('/api/celebrity', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(newCeleb) });
          if(res.ok) { 
              const data = await res.json();
              setCelebs([data.data, ...celebs]);
              setNewCeleb({ name: '', title: '', imageUrl: '' }); 
              alert("Ambassador Added Successfully!"); 
          }
      } catch(e) { alert("Failed to add Ambassador"); } finally { setIsSyncing(false); }
  };

  const handleDeleteCeleb = async (id: string) => {
      if(!confirm("Remove this ambassador?")) return;
      setCelebs(prev => prev.filter(c => c._id !== id)); 
      try { await fetch(`/api/celebrity`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) }); } catch(e) {}
  };

  const exportToCSV = () => {
    if(orders.length === 0) return alert("No orders to export");
    const headers = ["Order ID, Customer Name, Phone, Email, Total Amount, Status, Date"];
    const rows = orders.map(o => `${o.orderId || 'N/A'},"${o.customer?.name || 'Guest'}","${o.customer?.phone || ''}","${o.customer?.email || ''}",${o.totalAmount},${o.status},${new Date(o.createdAt).toLocaleDateString()}`);
    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Essential_Orders_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (status === "loading") return <div className="h-screen bg-[#050505] flex items-center justify-center"><div className="text-[#D4AF37] animate-pulse font-mono flex flex-col items-center gap-4"><Activity size={40}/><p className="tracking-[5px] text-xs font-bold">AUTHENTICATING...</p></div></div>;
  if (!session || session.user?.role !== 'SUPER_ADMIN') return <div className="h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden"><div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div><Lock size={60} className="text-red-500 mb-8 animate-pulse relative z-10"/><button onClick={() => signIn("google")} className="relative z-10 bg-[#D4AF37] text-black px-12 py-5 rounded-full font-bold tracking-widest uppercase shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:bg-white hover:shadow-[#D4AF37] transition-all hover:scale-105">Login to Vault</button></div>;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#D4AF37] selection:text-black relative font-sans">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/[0.05] blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#00F0FF]/[0.03] blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* AFFILIATE MODAL */}
      <AnimatePresence>
        {isAgentModalOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} exit={{scale:0.9, y:20}} className="bg-black/80 border border-[#D4AF37]/50 p-10 rounded-[30px] w-full max-w-xl relative shadow-2xl backdrop-blur-2xl">
               <button onClick={() => setIsAgentModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
               <h3 className="text-2xl font-bold mb-2 text-[#D4AF37]">Add Affiliate Partner</h3>
               <p className="text-xs uppercase tracking-widest text-gray-500 mb-8">Securely assign tracking credentials.</p>
               <div className="space-y-4">
                 <input value={agentForm.name} onChange={(e) => setAgentForm({...agentForm, name: e.target.value})} className="w-full bg-black/50 border border-white/20 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="Partner Name"/>
                 <input value={agentForm.email} onChange={(e) => setAgentForm({...agentForm, email: e.target.value})} type="email" className="w-full bg-black/50 border border-white/20 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="Partner Email Address"/>
                 <div className="grid grid-cols-2 gap-4">
                   <input value={agentForm.code} onChange={(e) => setAgentForm({...agentForm, code: e.target.value})} className="w-full bg-black/50 border border-white/20 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37] uppercase text-[#D4AF37]" placeholder="Unique Code (e.g. VIP10)"/>
                   <input value={agentForm.commissionRate} onChange={(e) => setAgentForm({...agentForm, commissionRate: Number(e.target.value)})} type="number" className="w-full bg-black/50 border border-white/20 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37] text-green-400" placeholder="Commission %"/>
                 </div>
                 <select value={agentForm.tier} onChange={(e) => setAgentForm({...agentForm, tier: e.target.value})} className="w-full bg-black/50 border border-white/20 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 outline-none focus:border-[#D4AF37] appearance-none">
                    <option className="bg-black">Partner</option><option className="bg-black">Premium Agent</option><option className="bg-black">Brand Ambassador</option>
                 </select>
                 <button onClick={handleAddAffiliate} className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl text-xs hover:bg-white transition-all mt-4 flex justify-center items-center gap-2"><Zap size={16}/> Provision Partner</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className="w-[300px] bg-black/60 backdrop-blur-2xl border-r border-white/10 flex flex-col z-50 relative">
        <div className="p-8 border-b border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
             <ShieldCheck size={20}/>
          </div>
          <div className="overflow-hidden">
             <p className="text-[9px] text-[#00F0FF] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Activity size={10} className="animate-pulse"/> System Secured</p>
             <h1 className="text-sm font-bold text-white truncate">{session.user?.name}</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {MODULES.map(m => (
            <button key={m.id} onClick={() => setActiveTab(m.id)} className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all group ${activeTab === m.id ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              <div className="flex items-center gap-3">
                 <m.icon size={16} className={activeTab === m.id ? 'text-black' : 'group-hover:text-[#D4AF37] transition-colors'}/> 
                 {m.label}
              </div>
              {activeTab === m.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 bg-black/40">
            <button onClick={() => signOut()} className="w-full py-4 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all flex justify-center items-center gap-2"><Lock size={14}/> Close Vault</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative custom-scrollbar z-10">

        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 border-b border-white/10 pb-6 gap-6">
          <div>
             <h2 className="text-3xl lg:text-4xl font-serif text-white">
               {MODULES.find(m => m.id === activeTab)?.label}
             </h2>
          </div>
          <div className="flex gap-4">
             <button className="p-4 bg-black border border-white/20 rounded-xl hover:border-[#D4AF37] transition-colors relative">
               <BellRing size={18} className="text-gray-400"/>
               {leads.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">{leads.length}</span>}
             </button>
             <button onClick={() => fetchDashboardData(false)} className="px-5 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <RefreshCcw size={16} className={isSyncing ? "animate-spin" : ""}/> Sync Database
             </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          
          {/* ================= 1. COMMAND CENTER (DASHBOARD) ================= */}
          {activeTab === 'FULL_DASHBOARD' && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} key="dash" className="space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 <div className="lg:col-span-2 bg-[#111] border border-white/10 p-8 rounded-[30px] relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
                   <div className="absolute -right-10 -top-10 text-[#D4AF37] opacity-5 group-hover:opacity-10 transition-opacity"><BarChart3 size={200}/></div>
                   <p className="text-gray-400 text-xs font-bold uppercase mb-4 flex items-center gap-2"><Wallet size={16}/> Total Vault Revenue</p>
                   <p className="text-4xl md:text-5xl font-bold text-white">₹{(fullAnalytics?.metrics?.totalRevenue || 0).toLocaleString('en-IN')}</p>
                 </div>

                 <div onClick={() => setDashboardView('orders')} className={`bg-[#111] border p-8 rounded-[30px] cursor-pointer transition-all flex flex-col justify-between hover:scale-[1.02] ${dashboardView === 'orders' ? 'border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'border-white/10 hover:border-white/30'}`}>
                   <p className="text-gray-400 text-xs font-bold uppercase flex items-center gap-2"><Package size={16}/> Total Orders</p>
                   <div>
                     <p className="text-4xl font-bold text-[#00F0FF]">{fullAnalytics?.metrics?.totalOrders || 0}</p>
                     <p className="text-[10px] text-gray-500 uppercase mt-2 flex items-center gap-1">View Details <ChevronRight size={12}/></p>
                   </div>
                 </div>
                 
                 <div onClick={() => setDashboardView('abandoned')} className={`bg-[#111] border p-8 rounded-[30px] cursor-pointer transition-all flex flex-col justify-between hover:scale-[1.02] ${dashboardView === 'abandoned' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/10 hover:border-white/30'}`}>
                   <p className="text-gray-400 text-xs font-bold uppercase flex items-center gap-2"><AlertTriangle size={16} className={leads.length > 0 ? "text-red-500 animate-pulse" : ""}/> Abandoned Carts</p>
                   <div>
                     <p className="text-4xl font-bold text-red-500">{leads.length}</p>
                     <p className="text-[10px] text-gray-500 uppercase mt-2 flex items-center gap-1">View Details <ChevronRight size={12}/></p>
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-[30px] p-8 min-h-[400px]">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                       <h3 className="text-xl font-bold text-white">
                          {dashboardView === 'orders' ? 'Recent Dispatches' : 'Abandoned Acquisitions'}
                       </h3>
                    </div>

                    <div className="space-y-4">
                       {dashboardView === 'orders' && (
                          orders.length === 0 ? <p className="text-gray-600 text-sm uppercase tracking-widest text-center py-10 font-bold">No Records Found</p> :
                          orders.slice(0, 8).map((o: any, i: number) => (
                             <div key={i} className="flex justify-between items-center p-4 bg-black border border-white/10 rounded-xl hover:border-[#D4AF37]/50 transition-colors">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-[#00F0FF]/10 text-[#00F0FF] rounded-lg flex items-center justify-center text-xs font-bold">
                                      #{o.orderId?.slice(-4) || 'UKN'}
                                   </div>
                                   <div>
                                      <p className="font-bold text-white text-sm">{o.customer?.name || 'Guest User'}</p>
                                      <p className="text-xs text-gray-500">{o.customer?.email || o.customer?.phone}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-lg font-bold text-green-400">₹{(o.totalAmount || 0).toLocaleString()}</p>
                                   <span className="text-[10px] uppercase text-gray-400">{o.status}</span>
                                </div>
                             </div>
                          ))
                       )}

                       {/* 🚨 VIP WHATSAPP RETARGETING BUTTONS IN ABANDONED VIEW 🚨 */}
                       {dashboardView === 'abandoned' && (
                          leads.length === 0 ? <p className="text-gray-600 text-sm uppercase tracking-widest text-center py-10 font-bold">Vault is Clear</p> :
                          leads.map((lead: any, i: number) => {
                              const phoneClean = lead.phone?.replace(/[^0-9]/g, '') || '';
                              const msg1Hr = encodeURIComponent(`Dear ${lead.name || 'Client'},\n\nYour Vault is still open. Your selected timepiece is reserved for the next 24 hours. Please let us know if you need assistance completing your acquisition.\n\n- Essential Rush Concierge`);
                              const msg24Hr = encodeURIComponent(`Update from Essential Rush Vault:\n\n${lead.name ? `Mr/Ms ${lead.name}` : 'Dear Client'}, we currently have only 2 pieces remaining for the asset you selected. Secure your acquisition before the vault closes.\n\nResume Checkout: https://essential-ivory.vercel.app/cart`);
                              const msg48Hr = encodeURIComponent(`Exclusive Access, ${lead.name || 'Client'}.\n\nWe deeply value your taste. Use Vault Key *VIP10* at checkout to receive a 10% privilege on your pending cart value of ₹${lead.cartTotal?.toLocaleString()}.\n\nSecure here: https://essential-ivory.vercel.app/cart`);

                              return (
                                 <div key={i} className="flex flex-col xl:flex-row justify-between xl:items-center p-5 bg-red-900/10 border border-red-500/20 rounded-xl hover:border-red-500/50 transition-colors gap-4 shadow-lg">
                                    <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center shrink-0"><AlertTriangle size={20} /></div>
                                       <div>
                                          <p className="font-bold text-white text-base">{lead.name || 'Anonymous Client'}</p>
                                          <p className="text-xs text-red-400 font-mono mt-1">Value: ₹{lead.cartTotal?.toLocaleString() || '---'} <span className="mx-2 text-white/20">|</span> {lead.phone || lead.email}</p>
                                       </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-3">
                                       {lead.phone ? (
                                           <div className="flex flex-wrap gap-2 justify-end">
                                               <a href={`https://wa.me/${phoneClean}?text=${msg1Hr}`} target="_blank" className="px-4 py-2 bg-white/10 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition-colors border border-white/10" title="Send 1 Hour After Abandonment">
                                                   1 Hr Follow-up
                                               </a>
                                               <a href={`https://wa.me/${phoneClean}?text=${msg24Hr}`} target="_blank" className="px-4 py-2 bg-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-500 hover:text-black transition-colors border border-orange-500/20" title="Send 24 Hours After Abandonment">
                                                   24 Hr FOMO
                                               </a>
                                               <a href={`https://wa.me/${phoneClean}?text=${msg48Hr}`} target="_blank" className="px-4 py-2 bg-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-green-500 hover:text-black transition-colors border border-green-500/20" title="Send 48 Hours After with VIP Code">
                                                   48 Hr VIP
                                               </a>
                                           </div>
                                       ) : (
                                           <span className="text-[10px] text-gray-500 uppercase tracking-widest text-right">Email Only Lead</span>
                                       )}
                                       
                                       <div className="text-right">
                                           <button onClick={() => handleDeleteLead(lead._id)} className="text-red-500/70 text-[10px] uppercase font-bold tracking-widest hover:text-red-500 transition-colors flex items-center justify-end gap-1 ml-auto">
                                               <Trash2 size={12}/> Erase Lead
                                           </button>
                                       </div>
                                    </div>
                                 </div>
                              );
                          }
                       ))}
                    </div>
                 </div>

                 <div className="bg-[#111] border border-white/10 rounded-[30px] p-8 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><Terminal size={16}/> System Logs</h3>
                    <div className="flex-1 overflow-hidden flex flex-col justify-end space-y-2">
                        {systemLogs.map((log, i) => (
                            <div key={i} className="text-xs text-gray-500">
                                <span className="text-[#D4AF37] mr-2">[{new Date().toLocaleTimeString()}]</span> {log}
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
             </motion.div>
          )}
          <div className="bg-[#111] border border-white/10 rounded-[30px] p-8 flex flex-col">
   <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><Terminal size={16}/> System Logs</h3>
   <div className="flex-1 overflow-hidden flex flex-col justify-end space-y-2">
       {systemLogs.map((log, i) => (
           <div key={i} className="text-xs text-gray-500">
               <span className="text-[#D4AF37] mr-2">[{new Date().toLocaleTimeString()}]</span> {log}
           </div>
       ))}
   </div>
</div>

          {/* ================= 2. INVENTORY ================= */}
          {activeTab === 'INVENTORY' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="inv" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
               <div className="xl:col-span-5 space-y-8 h-max sticky top-0">
                 
                 <div className="bg-[#111] p-8 rounded-[30px] border border-white/10">
                     <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2"><Layout size={18} className="text-[#D4AF37]"/> Manage Categories</h3>
                     <div className="flex gap-3 mb-4">
                        <input value={newCategory} onChange={e=>setNewCategory(e.target.value)} className="flex-1 bg-black border border-white/20 p-3 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="New category..." />
                        <button onClick={() => { if(newCategory){ setCategories([...categories, newCategory]); setNewCategory(""); } }} className="px-6 bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-white transition-all">Add</button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {categories.map((cat, i) => (
                           <div key={i} className="flex items-center gap-2 bg-black px-4 py-2 rounded-lg border border-white/20">
                              <span className="text-xs text-gray-300">{cat}</span>
                              <button onClick={()=>setCategories(categories.filter(c=>c!==cat))} className="text-red-400 hover:text-red-500"><X size={14}/></button>
                           </div>
                        ))}
                     </div>
                 </div>

                 <div className="bg-[#111] p-8 rounded-[30px] border border-white/10 shadow-lg relative overflow-hidden">
                     <h3 className="text-2xl font-bold text-white mb-6">Vault Product Addition</h3>
                     <div className="space-y-5 relative z-10">
                        <input value={watchForm.name} onChange={(e) => setWatchForm({...watchForm, name: e.target.value})} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="Product Name (e.g. Royal Oak)"/>
                        
                         <div className="grid grid-cols-2 gap-4">
                          <input 
                            value={watchForm.brand} 
                            onChange={(e) => setWatchForm({...watchForm, brand: e.target.value})} 
                            className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37] text-white" 
                            placeholder="Brand Name"
                          />
                          <input 
                            value={watchForm.category} 
                            onChange={(e) => setWatchForm({...watchForm, category: e.target.value})} 
                            className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37] text-white" 
                            placeholder="Category Name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div><label className="text-xs text-gray-500 mb-1 block">Display Order</label><input type="number" value={watchForm.priority} onChange={(e) => setWatchForm({...watchForm, priority: Number(e.target.value)})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="100" /></div>
                           <div><label className="text-xs text-gray-500 mb-1 block">Product Badge</label><input value={watchForm.badge} onChange={(e) => setWatchForm({...watchForm, badge: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="e.g. Limited" /></div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-5">
                            <div><label className="text-xs text-gray-500 mb-1 block">Base Price (₹)</label><input value={watchForm.price} onChange={(e) => setWatchForm({...watchForm, price: e.target.value})} type="number" className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm outline-none focus:border-[#D4AF37] text-white" /></div>
                            <div><label className="text-xs text-[#00F0FF] mb-1 block">Sale Price (₹)</label><input value={watchForm.offerPrice} onChange={(e) => setWatchForm({...watchForm, offerPrice: e.target.value})} type="number" className="w-full bg-black border border-[#00F0FF]/30 p-3 rounded-lg text-sm outline-none focus:border-[#00F0FF] text-white" /></div>
                            <div><label className="text-xs text-gray-500 mb-1 block">Available Stock</label><input value={watchForm.stock} onChange={(e) => setWatchForm({...watchForm, stock: e.target.value})} type="number" className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm outline-none focus:border-[#D4AF37] text-white" /></div>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                <label className="text-sm font-bold text-white flex items-center gap-2">
                                    <ImageIcon size={16}/> Media Acquisition
                                </label>
                            </div>
                            
                            <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 w-full">
                                    <label className="text-xs text-gray-400 block mb-4 font-bold uppercase tracking-widest">Main Product Image (Required)</label>
                                    <PremiumUploadNode 
                                        placeholder="Main Image" 
                                        onUploadSuccess={(url: string) => setWatchForm({...watchForm, imageUrl: url})} 
                                    />
                                </div>
                                <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-dashed border-white/20 flex items-center justify-center bg-black shrink-0 relative group">
                                    {watchForm.imageUrl ? (
                                        <>
                                            <img src={watchForm.imageUrl} alt="Main Preview" className="w-full h-full object-cover" />
                                            <button 
                                                onClick={() => setWatchForm({...watchForm, imageUrl: ''})}
                                                className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase"
                                            >
                                                <Trash2 size={16} /> Remove
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-600 font-bold uppercase">No Source</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/10">
                                <label className="text-xs text-gray-400 block mb-4 font-bold uppercase tracking-widest">Additional Gallery (Max 6)</label>
                                
                                <div className="flex flex-wrap gap-4 items-center">
                                    {watchForm.images.filter(img => typeof img === 'string' && img.trim() !== '').map((img, i) => (
                                        <div key={i} className="w-24 h-24 rounded-xl overflow-hidden relative group border border-white/20 shadow-lg">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button 
                                                onClick={() => setWatchForm({...watchForm, images: watchForm.images.filter((_, idx) => idx !== i)})} 
                                                className="absolute top-1 right-1 p-1.5 bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14}/>
                                            </button>
                                        </div>
                                    ))}
                                    
                                    {watchForm.images.filter(img => typeof img === 'string' && img.trim() !== '').length < 6 && (
                                        <div className="scale-90 origin-left">
                                            <PremiumUploadNode 
                                                placeholder="Add Details" 
                                                onUploadSuccess={(url: string) => { 
                                                    const newGallery = [...watchForm.images.filter(x => typeof x === 'string' && x.trim() !== '')]; 
                                                    newGallery.push(url); 
                                                    setWatchForm({...watchForm, images: newGallery}); 
                                                }} 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                               <div><label className="text-xs text-gray-500 mb-1 block">Cinematic Video URL</label><input value={watchForm.videoUrl} onChange={(e) => setWatchForm({...watchForm, videoUrl: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm outline-none text-white focus:border-[#D4AF37]" placeholder="Paste Video URL"/></div>
                               <div><label className="text-xs text-gray-500 mb-1 block">3D Model Link (Optional)</label><input value={watchForm.model3DUrl} onChange={(e) => setWatchForm({...watchForm, model3DUrl: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm outline-none text-white focus:border-[#D4AF37]" placeholder="Paste 3D File URL"/></div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                           <div className="flex justify-between items-center border-b border-white/10 pb-2">
                               <label className="text-sm font-bold text-white flex items-center gap-2"><AlignJustify size={16}/> Specifications</label>
                               <button onClick={()=>setWatchForm({...watchForm, amazonDetails: [...watchForm.amazonDetails, {key:'', value:''}]})} className="text-[#D4AF37] text-xs font-bold hover:text-white px-3 py-1 bg-[#D4AF37]/10 rounded-lg transition-colors">+ Add Row</button>
                           </div>
                           
                           <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                               {watchForm.amazonDetails.map((detail, i) => (
                                   <div key={i} className="flex gap-3 items-center">
                                       <input 
                                          value={detail.key} 
                                          onChange={e=>{ const n=[...watchForm.amazonDetails]; n[i].key=e.target.value; setWatchForm({...watchForm, amazonDetails:n}); }} 
                                          className="w-1/3 bg-black border border-white/20 p-3 rounded-lg text-sm outline-none focus:border-[#D4AF37] text-white" 
                                          placeholder="e.g. Dial Color"
                                       />
                                       <input 
                                          value={detail.value} 
                                          onChange={e=>{ const n=[...watchForm.amazonDetails]; n[i].value=e.target.value; setWatchForm({...watchForm, amazonDetails:n}); }} 
                                          className="flex-1 bg-black border border-white/20 p-3 rounded-lg text-sm outline-none focus:border-[#D4AF37] text-white" 
                                          placeholder="e.g. Matte Black"
                                       />
                                       <button 
                                          onClick={()=>{ const n=watchForm.amazonDetails.filter((_,idx)=>idx!==i); setWatchForm({...watchForm, amazonDetails:n}); }} 
                                          className="text-red-500 p-3 hover:bg-red-500/20 rounded-lg transition-colors"
                                          title="Remove row"
                                       >
                                          <X size={16}/>
                                       </button>
                                   </div>
                               ))}
                           </div>

                           <div className="pt-4 border-t border-white/5">
                              <label className="text-xs text-gray-500 mb-2 block font-bold uppercase tracking-widest">Quick Tags</label>
                              <input value={watchForm.seoTags} onChange={(e) => setWatchForm({...watchForm, seoTags: e.target.value})} className="w-full bg-black border border-white/20 p-4 rounded-lg text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="luxury, watch, automatic..." />
                           </div>
                           
                           <div>
                               <label className="text-xs text-gray-500 mb-2 block font-bold uppercase tracking-widest">Detailed Description</label>
                               <textarea value={watchForm.description} onChange={(e) => setWatchForm({...watchForm, description: e.target.value})} rows={4} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37] text-white custom-scrollbar leading-relaxed" placeholder="Describe the masterpiece..."/>
                           </div>
                        </div>

                        <div className="mt-8 p-6 bg-black/40 border border-[#D4AF37]/30 rounded-2xl shadow-inner relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none"><ShieldCheck size={120} className="text-[#D4AF37]"/></div>
                            <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2 text-white relative z-10">
                                <ShieldCheck size={20} className="text-[#D4AF37]" /> Vault Pricing Rules
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative z-10">
                                <div className="p-4 bg-black rounded-xl border border-white/10">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex justify-between">
                                        VIP Vault Key <span className="text-gray-500 font-mono">(Optional)</span>
                                    </label>
                                    <input value={watchForm.vipVaultKey} onChange={(e) => setWatchForm({...watchForm, vipVaultKey: e.target.value.toUpperCase()})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm font-mono outline-none focus:border-[#D4AF37] uppercase text-[#D4AF37]" placeholder="e.g. ROLEXVIP" />
                                </div>
                                <div className="p-4 bg-black rounded-xl border border-white/10">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Vault Discount (₹)</label>
                                    <input type="number" value={watchForm.vipDiscount} onChange={(e) => setWatchForm({...watchForm, vipDiscount: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm font-mono outline-none focus:border-[#D4AF37] text-white" placeholder="5000" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                                <div className="p-4 bg-black rounded-xl border border-white/10">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Transit Fee (₹)</label>
                                    <input type="number" value={watchForm.transitFee} onChange={(e) => setWatchForm({...watchForm, transitFee: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm font-mono outline-none focus:border-[#D4AF37] text-white" placeholder="0 for Free" />
                                </div>
                                <div className="p-4 bg-black rounded-xl border border-white/10">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Tax Bracket (GST %)</label>
                                    <select value={watchForm.taxPercentage} onChange={(e) => setWatchForm({...watchForm, taxPercentage: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm font-mono outline-none focus:border-[#D4AF37] text-white appearance-none">
                                        <option className="bg-black" value="0">0% (Exempt)</option>
                                        <option className="bg-black" value="3">3% (Bullion)</option>
                                        <option className="bg-black" value="12">12%</option>
                                        <option className="bg-black" value="18">18% (Standard)</option>
                                        <option className="bg-black" value="28">28% (Luxury)</option>
                                    </select>
                                </div>
                                <div className="p-4 bg-black rounded-xl border border-white/10 flex flex-col justify-center items-center cursor-pointer transition-all hover:border-[#D4AF37]/50" onClick={() => setWatchForm({...watchForm, taxInclusive: !watchForm.taxInclusive})}>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block text-center">Tax Configuration</label>
                                    <div className={`px-2 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors w-full text-center ${watchForm.taxInclusive ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {watchForm.taxInclusive ? 'Inclusive' : 'Exclusive'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10 space-y-8">
                            <SeoPanel entityData={watchForm} setEntityData={setWatchForm} />
                            <ImageSeoPanel entityData={watchForm} setEntityData={setWatchForm} />
                        </div>

                        <button onClick={handleSaveProduct} className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all mt-4 flex justify-center items-center gap-2"><Save size={18}/> Push to Live Inventory</button>
                     </div>
                  </div>
               </div>

               <div className="xl:col-span-7">
                  <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                     <h3 className="text-2xl font-serif text-white">Live Assets</h3>
                     <span className="text-xs font-bold bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-2 rounded-lg">{liveWatches.length} Active</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                     {liveWatches.length === 0 ? <p className="col-span-2 text-center text-gray-600 py-20 font-bold uppercase tracking-widest">Vault is Empty</p> : liveWatches.map((watch, idx) => (
                       <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay: idx*0.05}} key={watch._id || idx} className="bg-[#111] p-6 rounded-[20px] border border-white/10 flex flex-col justify-between group hover:border-[#D4AF37]/50 transition-all shadow-lg relative overflow-hidden">
                          <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
                             {watch.badge && <span className="bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-1 rounded uppercase">{watch.badge}</span>}
                             {watch.stock < 3 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Low: {watch.stock}</span>}
                          </div>
                          <div className="h-48 bg-black rounded-xl flex items-center justify-center p-4 relative mb-4 border border-white/10">
                             <img src={watch.imageUrl || (watch.images && watch.images[0])} className="h-full object-contain transition-transform group-hover:scale-105 duration-500" />
                          </div>
                          <div className="flex-1 flex flex-col">
                             <p className="text-xs text-[#D4AF37] font-bold uppercase mb-1">{watch.brand}</p>
                             <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{watch.name}</h4>
                             <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-auto">
                                <div><p className="text-xs text-gray-500 mb-1">Price</p><p className="text-xl font-bold text-green-400">₹{Number(watch.offerPrice || watch.price).toLocaleString('en-IN')}</p></div>
                                <button onClick={() => handleDeleteProduct(watch._id)} className="p-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                             </div>
                          </div>
                       </motion.div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 3. MANAGE ORDERS ================= */}
          {activeTab === 'ORDER_TRACKER' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="orders" className="space-y-8">
               <div className="bg-[#111] p-10 rounded-[30px] border border-blue-500/30 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-blue-500/20 rounded-2xl text-blue-400"><Truck size={30}/></div>
                    <div>
                       <h3 className="text-3xl font-bold text-white mb-1">Order Logistics</h3>
                       <p className="text-sm text-gray-400">Track and fulfill global acquisitions.</p>
                    </div>
                  </div>
                  <button onClick={exportToCSV} className="bg-green-600 text-white px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      <Download size={18}/> Export Excel
                  </button>
               </div>
               
               <div className="space-y-4">
                 {orders.length === 0 ? <p className="text-center py-20 text-gray-600 font-bold tracking-widest uppercase">No Active Operations</p> : orders.map((o: any, i: number) => (
                    <div key={i} className="p-6 bg-[#111] border border-white/10 rounded-[20px] flex flex-col md:flex-row items-center justify-between hover:border-blue-500/50 transition-colors shadow-lg">
                       <div className="flex items-center gap-6 mb-6 md:mb-0 w-full md:w-auto">
                          <div className="w-16 h-16 rounded-xl bg-black border border-white/20 flex items-center justify-center text-white font-bold text-sm">#{o.orderId?.slice(-4) || 'UKN'}</div>
                          <div>
                             <h4 className="font-bold text-xl text-white mb-1">{o.customer?.name || 'Guest'}</h4>
                             <p className="text-xs text-gray-400 flex items-center gap-2"><MapPin size={12}/> {o.customer?.city || 'Unknown'}, {o.customer?.country || 'IN'} <span className="mx-2 text-white/20">|</span> <Package size={12}/> {o.items?.length || 1} Unit(s)</p>
                          </div>
                       </div>
                       <div className="flex flex-wrap md:flex-nowrap items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-left md:text-right">
                            <p className="text-xs text-gray-500 mb-1">Clearance Value</p>
                            <p className="font-bold text-green-400 text-2xl">₹{(o.totalAmount || 0).toLocaleString()}</p>
                          </div>
                          <select value={o.status} onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)} className="w-48 bg-black border border-white/30 text-white font-bold uppercase rounded-xl p-4 cursor-pointer hover:border-[#D4AF37] transition-colors appearance-none text-center">
                            <option value="PENDING">Clearance Pending</option>
                            <option value="PROCESSING">Processing Vault</option>
                            <option value="DISPATCHED">In Transit</option>
                            <option className="text-green-500" value="DELIVERED">Secured Delivery</option>
                            <option className="text-red-500" value="CANCELLED">Aborted</option>
                          </select>
                          
                          <button onClick={() => handleDeleteOrder(o._id)} className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                              <Trash2 size={18}/>
                          </button>
                       </div>
                    </div>
                 ))}
               </div>
            </motion.div>
          )}

          {/* ================= 4. CUSTOMERS & CRM ================= */}
          {activeTab === 'CRM' && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} key="crm" className="bg-[#111] border border-white/10 rounded-[30px] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">Client Roster</h3>
                   <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-2 rounded-lg text-xs font-bold">{leads.length} Identified</span>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead className="bg-black/50 text-xs font-bold uppercase text-gray-400 border-b border-white/10">
                        <tr>
                          <th className="p-6 pl-10">Client Identity</th>
                          <th className="p-6 text-center">Access Vector</th>
                          <th className="p-6 text-center">Vault Credits</th>
                          <th className="p-6 text-right pr-10">Portfolio Value</th>
                          <th className="p-6 text-center pr-10">Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {leads.length === 0 ? <tr><td colSpan={5} className="p-20 text-center text-gray-600 font-bold uppercase tracking-widest">Database Empty</td></tr> : leads.map((c:any, i:number) => (
                           <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="p-6 pl-10">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-sm font-bold text-white">{c.phone?.slice(-2) || 'XX'}</div>
                                    <div>
                                       <p className="font-bold text-white">{c.phone || 'Anonymous'}</p>
                                       <p className="text-xs text-gray-500 mt-1">{c.email || `REF: ${c._id?.slice(-8)}`}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-6 text-center text-sm text-gray-300">{c.referralCode || 'Organic'}</td>
                              <td className="p-6 text-center text-[#D4AF37] font-bold text-lg">₹{c.walletBalance || 0}</td>
                              <td className="p-6 text-right pr-10"><p className="font-bold text-xl text-green-400">₹{(c.cartTotal || 0).toLocaleString()}</p></td>
                              <td className="p-6 text-center pr-10">
                                  <button onClick={() => handleDeleteLead(c._id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                      <Trash2 size={16}/>
                                  </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
             </motion.div>
          )}

          {/* ================= 5. COUPONS & MARKETING ================= */}
          {activeTab === 'MARKETING' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="marketing" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-5">
                  <div className="bg-[#111] p-10 rounded-[30px] border border-white/10">
                     <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><Gift size={24} className="text-[#D4AF37]"/> Define Marketing Rule</h3>
                     <div className="space-y-5">
                        <div>
                           <label className="text-xs text-gray-400 block mb-2">Access Key (Code)</label>
                           <input value={couponForm.code} onChange={e=>setCouponForm({...couponForm, code: e.target.value})} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm uppercase outline-none focus:border-[#D4AF37] text-white" placeholder="e.g. VIP20"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs text-gray-400 block mb-2">Yield (%)</label>
                              <input value={couponForm.discountValue} onChange={e=>setCouponForm({...couponForm, discountValue: e.target.value})} type="number" className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="15"/>
                           </div>
                           <div>
                              <label className="text-xs text-gray-400 block mb-2">Floor Value (₹)</label>
                              <input value={couponForm.minOrder} onChange={e=>setCouponForm({...couponForm, minOrder: e.target.value})} type="number" className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="50000"/>
                           </div>
                        </div>
                        <button onClick={handleCreateCoupon} className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl text-sm hover:bg-white transition-all mt-4">Execute Rule</button>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-7 bg-[#111] p-10 rounded-[30px] border border-white/10">
                  <h4 className="text-white font-bold text-xl mb-6 border-b border-white/10 pb-4">Active Market Logic</h4>
                  <div className="space-y-4">
                     {coupons.length === 0 ? <p className="text-center py-20 text-gray-600 font-bold uppercase tracking-widest">No Rules Defined</p> : coupons.map((c, i) => (
                        <div key={i} className="p-6 bg-black border border-white/20 rounded-2xl flex justify-between items-center group hover:border-[#D4AF37] transition-colors">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center text-[#D4AF37] font-bold text-2xl">{c.discountValue}%</div>
                              <div>
                                 <p className="font-bold text-2xl text-white mb-1 tracking-widest">{c.code}</p>
                                 <p className="text-xs text-gray-400">Triggered: {c.usedCount || 0} times | Threshold: ₹{c.minOrderValue?.toLocaleString() || 0}</p>
                              </div>
                           </div>
                           <button onClick={() => handleDeleteCoupon(c._id)} className="p-3 bg-red-500/20 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"><Trash2 size={20}/></button>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 6. WEBSITE BUILDER ================= */}
          {activeTab === 'PAGE_BUILDER' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="builder" className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-20">
               
               <div className="bg-[#111] p-10 rounded-[30px] border border-white/10 space-y-10 h-max">
                  <h3 className="text-[#D4AF37] text-lg font-bold mb-4 border-b border-white/10 pb-4 flex items-center gap-2"><Layout size={20}/> UI Configuration</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div><label className="text-xs text-gray-400 block mb-2">Brand Accent</label><div className="flex gap-3"><input type="color" value={uiConfig.primaryColor} onChange={(e)=>setUiConfig({...uiConfig, primaryColor: e.target.value})} className="w-12 h-12 rounded-lg bg-black border border-white/20 p-1 cursor-pointer"/><input value={uiConfig.primaryColor} onChange={(e)=>setUiConfig({...uiConfig, primaryColor: e.target.value})} className="w-full bg-black border border-white/20 rounded-lg p-3 text-sm text-white outline-none font-mono"/></div></div>
                    <div><label className="text-xs text-gray-400 block mb-2">Base Canvas</label><div className="flex gap-3"><input type="color" value={uiConfig.bgColor} onChange={(e)=>setUiConfig({...uiConfig, bgColor: e.target.value})} className="w-12 h-12 rounded-lg bg-black border border-white/20 p-1 cursor-pointer"/><input value={uiConfig.bgColor} onChange={(e)=>setUiConfig({...uiConfig, bgColor: e.target.value})} className="w-full bg-black border border-white/20 rounded-lg p-3 text-sm text-white outline-none font-mono"/></div></div>
                  </div>
                  
                  <div className="space-y-6 pt-8 border-t border-white/10">
                      <h3 className="text-[#D4AF37] text-sm font-bold uppercase">Dynamic Lookbook</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <div key={idx} className="p-4 bg-black border border-white/20 rounded-xl relative group flex flex-col items-center min-h-[140px] justify-center">
                                <span className="absolute top-2 left-2 text-[10px] text-gray-500 font-bold z-20">Matrix {idx + 1}</span>
                                {galleryImages[idx] ? (
                                    <div className="absolute inset-2 rounded-lg overflow-hidden mt-6">
                                        <img src={galleryImages[idx]} className="w-full h-full object-cover" />
                                        <button onClick={()=>{ const arr=[...galleryImages]; arr.splice(idx,1); setGalleryImages(arr); }} className="absolute top-1 right-1 p-1.5 bg-red-500 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                                    </div>
                                ) : ( 
                                    <div className="mt-4 scale-75 origin-center">
                                        <PremiumUploadNode placeholder="Push" onUploadSuccess={(url: string)=>{ const arr=[...galleryImages]; arr[idx]=url; setGalleryImages(arr); }} />
                                    </div> 
                                )}
                            </div>
                        ))}
                      </div>
                  </div>
                  <button onClick={handleSaveCMS} className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all mt-6">Commit UI Overrides</button>
               </div>

               <div className="space-y-8">
                 <div className="bg-[#111] p-10 rounded-[30px] border border-white/10">
                    <h3 className="text-[#D4AF37] text-lg font-bold mb-6 border-b border-white/10 pb-4">Hero Projection Matrix</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-4">
                       {heroSlides.length === 0 ? <p className="text-gray-600 text-xs font-bold tracking-widest uppercase py-4">No Projections Active</p> : heroSlides.map((slide, i) => (
                          <div key={slide.id || i} className="p-6 bg-black border border-white/20 rounded-2xl space-y-4 relative">
                             <div className="flex justify-between items-center"><span className="text-xs font-bold text-[#D4AF37]">Sequence {i+1}</span><button onClick={() => handleRemoveHeroSlide(slide.id)} className="text-red-500 text-xs font-bold hover:underline">Erase</button></div>
                             <select value={slide.type} onChange={(e) => { const n = [...heroSlides]; n[i].type = e.target.value; setHeroSlides(n); }} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm text-white outline-none"><option value="video">Cinematic Video</option><option value="image">Static Image</option></select>
                             <input value={slide.url} onChange={(e) => { const n = [...heroSlides]; n[i].url = e.target.value; setHeroSlides(n); }} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm text-blue-400 outline-none font-mono" placeholder="Target Source URL"/>
                             <input value={slide.heading} onChange={(e) => { const n = [...heroSlides]; n[i].heading = e.target.value; setHeroSlides(n); }} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm text-white outline-none" placeholder="Overlay Typography"/>
                          </div>
                       ))}
                    </div>
                    <button onClick={handleAddHeroSlide} className="w-full bg-white/5 border border-white/20 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">+ Append Sequence</button>
                 </div>

<div className="bg-[#111] p-10 rounded-[30px] border border-[#00F0FF]/30">
                    <h3 className="text-[#00F0FF] text-lg font-bold mb-2 border-b border-white/10 pb-4 flex items-center gap-2"><Video size={20}/> Atmospheric Bridges</h3>
                    <p className="text-xs text-gray-400 mb-6">Full-bleed transitional videos deployed between main blocks.</p>
                    
                    <div className="space-y-4">
                        {/* 🚨 FIX: Array increased to [0, 1, 2, 3, 4] for 5 bridge slots 🚨 */}
                        {[0, 1, 2, 3, 4].map((slot) => (
                            <div key={slot} className="flex flex-col md:flex-row items-center gap-4 bg-black p-4 rounded-2xl border border-white/10">
                                <div className="w-full md:w-24 text-xs font-bold text-gray-500">Bridge {slot + 1}</div>
                                <input 
                                    value={promoVideos[slot] || ''} 
                                    onChange={(e) => { const newVids = [...promoVideos]; newVids[slot] = e.target.value; setPromoVideos(newVids); }} 
                                    className="flex-1 bg-transparent border border-white/20 p-3 rounded-lg text-sm text-[#00F0FF] font-mono outline-none w-full" 
                                    placeholder="Target .mp4 URL..."
                                />
                                <div className="scale-75 origin-right">
                                    <PremiumUploadNode placeholder="Push" onUploadSuccess={(url:string)=>{ const newVids = [...promoVideos]; newVids[slot] = url; setPromoVideos(newVids); }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSaveCMS} className="w-full py-4 bg-[#00F0FF] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all mt-6 text-sm">Commit Bridges</button>
                 </div>
                                </div>
            </motion.div>
          )}

          {/* ================= 7. AMBASSADORS (CELEBRITIES) ================= */}
          {activeTab === 'AMBASSADORS' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="ambassadors" className="space-y-8">
               <div className="bg-[#111] p-10 rounded-[30px] border border-white/10 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                     <h3 className="text-2xl font-serif text-white mb-6 flex items-center gap-3"><Award size={24} className="text-[#D4AF37]"/> Secure New Identity</h3>
                     <input value={newCeleb.name} onChange={e=>setNewCeleb({...newCeleb, name: e.target.value})} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Designation Name"/>
                     <input value={newCeleb.title} onChange={e=>setNewCeleb({...newCeleb, title: e.target.value})} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Role (e.g. Architect / Collector)"/>
                     <button onClick={handleAddCelebrity} className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl text-sm hover:bg-white transition-all mt-4">Append Profile</button>
                  </div>
                  <div className="flex flex-col gap-4 items-center justify-center border-l border-white/10 pl-8">
                     <PremiumUploadNode placeholder="Visual" onUploadSuccess={(url:string)=>setNewCeleb({...newCeleb, imageUrl: url})} />
                     {newCeleb.imageUrl && <div className="h-32 w-32 rounded-xl overflow-hidden border border-white/20"><img src={newCeleb.imageUrl} className="w-full h-full object-cover"/></div>}
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {celebs.length === 0 ? <p className="col-span-full text-center text-gray-600 font-bold uppercase tracking-widest py-10">No Identities Found</p> : celebs.map((c) => (
                      <div key={c._id} className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden relative group shadow-lg hover:border-[#D4AF37]/50 transition-all">
                          <div className="h-56 relative">
                              <img src={c.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <button onClick={() => handleDeleteCeleb(c._id)} className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"><Trash2 size={14}/></button>
                          </div>
                          <div className="p-5 text-center">
                              <h4 className="font-bold text-lg text-white mb-1">{c.name}</h4>
                              <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">{c.title}</p>
                          </div>
                      </div>
                  ))}
               </div>
            </motion.div>
          )}

          {/* ================= 8. SEO ENGINE ================= */}
          {activeTab === 'SEO_ENGINE' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="seo" className="space-y-8">
                <SeoAnalyticsDashboard />
                <RedirectManager /> 
            </motion.div>
          )}

          {/* ================= 9. LEGAL POLICIES ================= */}
          {activeTab === 'LEGAL_PAGES' && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} key="legal" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-[#111] p-8 rounded-[30px] border border-white/10">
                     <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <h3 className="text-lg font-bold text-white">Active Nodes</h3>
                        <button 
                            onClick={() => {
                                const cinematicTemplate = `<h1>New Core Protocol</h1>\n\n<p>Initialization of <strong>ESSENTIAL RUSH</strong> protocol. Replace this matrix with operational guidelines.</p>\n\n<h2>01. Primary Directive</h2>\n<p>Insert data constraints here. Utilize the asset injector to map visual coordinates.</p>`;
                                const newId = Date.now().toString();
                                setLegalPages([...legalPages, { id: newId, title: 'New Protocol', slug: 'new-protocol', content: cinematicTemplate }]);
                                setActiveLegalPageId(newId);
                            }} 
                            className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors"
                        >
                            + Instantiate
                        </button>
                     </div>
                     <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {legalPages.length === 0 ? <p className="text-gray-600 text-xs font-bold text-center uppercase tracking-widest py-4">No Nodes Active</p> : legalPages.map((page) => (
                           <div key={page.id} onClick={() => setActiveLegalPageId(page.id)} className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${activeLegalPageId === page.id ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-black border-white/20 hover:border-gray-500'}`}>
                              <div>
                                 <h4 className={`font-bold text-sm ${activeLegalPageId === page.id ? 'text-[#D4AF37]' : 'text-white'}`}>{page.title}</h4>
                                 <p className="text-xs text-gray-500 mt-1 font-mono">/policies/{page.slug}</p>
                              </div>
                              <button onClick={(e)=>{ e.stopPropagation(); setLegalPages(legalPages.filter(p=>p.id!==page.id)); if(activeLegalPageId===page.id) setActiveLegalPageId(legalPages[0]?.id||''); }} className="text-red-500 p-2 hover:bg-red-500/20 rounded-lg"><Trash2 size={16}/></button>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-[#111] p-8 rounded-[30px] border border-white/10">
                     <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Entity Coordinates</h3>
                     <div className="space-y-4">
                        <input value={corporateInfo.companyName} onChange={e=>setCorporateInfo({...corporateInfo, companyName: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Corporate Entity Name" />
                        <textarea value={corporateInfo.address} onChange={e=>setCorporateInfo({...corporateInfo, address: e.target.value})} rows={2} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Physical Location" />
                        <input value={corporateInfo.phone1} onChange={e=>setCorporateInfo({...corporateInfo, phone1: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Primary Comm Channel" />
                        <input value={corporateInfo.email} onChange={e=>setCorporateInfo({...corporateInfo, email: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Digital Comm Channel" />
                     </div>
                  </div>
                </div>

                <div className="lg:col-span-8 bg-[#111] p-10 rounded-[30px] border border-white/10">
                   {activeLegalPageId ? (
                      <div className="space-y-6 flex flex-col h-full">
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Node Identifier</label>
                               <input value={legalPages.find(p=>p.id===activeLegalPageId)?.title || ''} onChange={e=>{ const n=[...legalPages]; const idx=n.findIndex(p=>p.id===activeLegalPageId); if(idx>-1) n[idx].title=e.target.value; setLegalPages(n); }} className="w-full bg-black border border-white/20 p-4 rounded-xl text-lg text-white outline-none focus:border-[#D4AF37]" placeholder="e.g. Privacy Protocol"/>
                            </div>
                            <div>
                               <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Routing Path</label>
                               <input value={legalPages.find(p=>p.id===activeLegalPageId)?.slug || ''} onChange={e=>{ const n=[...legalPages]; const idx=n.findIndex(p=>p.id===activeLegalPageId); if(idx>-1) n[idx].slug=e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-'); setLegalPages(n); }} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm text-[#00F0FF] font-mono outline-none focus:border-[#D4AF37]" placeholder="e.g. privacy-protocol"/>
                            </div>
                         </div>
                         
                         <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-end mb-3">
                               <label className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest block">Structural Matrix (HTML)</label>
                               
                               <div className="flex items-center gap-3 bg-black border border-white/10 p-2 rounded-xl">
                                   <span className="text-[10px] text-gray-500 uppercase font-bold ml-2">Inject Assets:</span>
                                   <div className="scale-75 origin-right h-12">
                                       <PremiumUploadNode 
                                          placeholder="File" 
                                          onUploadSuccess={(url: string) => {
                                             const isVideo = url.match(/\.(mp4|webm|mov)$/i);
                                             const mediaTag = isVideo 
                                                 ? `\n\n<video src="${url}" autoplay loop muted playsinline></video>\n\n` 
                                                 : `\n\n<img src="${url}" alt="Vault Asset" />\n\n`;
                                             
                                             const n = [...legalPages];
                                             const idx = n.findIndex(p => p.id === activeLegalPageId);
                                             if (idx > -1) {
                                                n[idx].content = (n[idx].content || '') + mediaTag;
                                                setLegalPages(n);
                                                addLog("Asset injected into layout matrix.");
                                             }
                                          }} 
                                       />
                                   </div>
                               </div>
                            </div>

                            <textarea 
                                value={legalPages.find(p=>p.id===activeLegalPageId)?.content || ''} 
                                onChange={e=>{ const n=[...legalPages]; const idx=n.findIndex(p=>p.id===activeLegalPageId); if(idx>-1) n[idx].content=e.target.value; setLegalPages(n); }} 
                                rows={18} 
                                className="w-full h-full bg-black border border-white/20 p-6 rounded-2xl text-sm text-[#b3b3b3] font-mono outline-none focus:border-[#D4AF37] custom-scrollbar leading-relaxed" 
                                placeholder="Construct layout parameters here..."
                            />
                         </div>

                         <div className="mt-8 p-6 bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl">
                             <h4 className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                 <ImageIcon size={16} /> Asset Detection Stream
                             </h4>
                             
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                 {(() => {
                                     const currentContent = legalPages.find(p=>p.id===activeLegalPageId)?.content || '';
                                     const urls: string[] = [];
                                     const regex = /src="(https?:\/\/[^"]+)"/g;
                                     let match;
                                     while ((match = regex.exec(currentContent)) !== null) {
                                         urls.push(match[1]);
                                     }

                                     if (urls.length === 0) return <p className="text-xs text-gray-600 col-span-full uppercase font-bold tracking-widest text-center py-4">Stream Clear</p>;

                                     return urls.map((url, idx) => (
                                         <div key={idx} className="group relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
                                             {url.match(/\.(mp4|webm|mov)$/i) ? (
                                                 <video src={url} className="w-full h-full object-cover" />
                                             ) : (
                                                 <img src={url} className="w-full h-full object-cover" />
                                             )}
                                             
                                             <button 
                                                 onClick={() => {
                                                     const n = [...legalPages];
                                                     const pageIndex = n.findIndex(p => p.id === activeLegalPageId);
                                                     if(pageIndex > -1) {
                                                         const tagRegex = new RegExp(`<img[^>]*src="${url}"[^>]*>|<video[^>]*src="${url}"[^>]*>[^<]*</video>`, 'g');
                                                         n[pageIndex].content = n[pageIndex].content.replace(tagRegex, '');
                                                         setLegalPages(n);
                                                     }
                                                 }}
                                                 className="absolute inset-0 bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
                                             >
                                                 <Trash2 size={24} className="mb-1"/>
                                                 Erase Target
                                             </button>
                                         </div>
                                     ));
                                 })()}
                             </div>
                         </div>

                         <button onClick={handleSaveCMS} className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all mt-4 flex justify-center items-center gap-2"><Save size={18}/> Commit Node Overrides</button>
                      </div>
                   ) : (
                      <div className="h-full flex items-center justify-center flex-col text-gray-500 py-32 border-2 border-dashed border-white/10 rounded-2xl">
                         <Radar size={60} className="mb-4 opacity-50 text-[#D4AF37]"/>
                         <p className="text-xs font-bold uppercase tracking-widest">Select a Node to Intercept</p>
                      </div>
                   )}
                </div>
             </motion.div>
          )}

          {/* ================= 10. REVIEWS ================= */}
          {activeTab === 'REVIEWS' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="rev" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-4 space-y-8">
                   <div className="bg-[#111] p-8 rounded-[30px] border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Inject Manual Feedback</h3>
                      <div className="space-y-4">
                         <input value={manualReview.userName} onChange={e=>setManualReview({...manualReview, userName: e.target.value})} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Client Alias" />
                         <select value={manualReview.rating} onChange={e=>setManualReview({...manualReview, rating: Number(e.target.value)})} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm text-[#D4AF37] outline-none focus:border-[#D4AF37] appearance-none"><option value={5}>Tier 5 - Flawless</option><option value={4}>Tier 4 - Acceptable</option></select>
                         <textarea value={manualReview.comment} onChange={e=>setManualReview({...manualReview, comment: e.target.value})} rows={4} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm text-white outline-none focus:border-[#D4AF37] custom-scrollbar" placeholder="Formulate feedback structure..." />
                         
                         <div>
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Upload Evidence</label>
                             <div className="flex gap-3 items-center">
                                 {manualReview.media && manualReview.media.map((url, idx) => (
                                     <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20 shadow-lg group"><img src={url} className="w-full h-full object-cover"/><button onClick={()=>setManualReview({...manualReview, media: manualReview.media.filter(x => x !== url)})} className="absolute inset-0 bg-red-600/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button></div>
                                 ))}
                                 {manualReview.media.length < 3 && (
                                    <div className="scale-75 origin-left">
                                        <PremiumUploadNode placeholder="Scan" onUploadSuccess={(url: string)=>setManualReview({...manualReview, media: [...(manualReview.media || []), url]})} />
                                    </div>
                                 )}
                             </div>
                         </div>
                         <button onClick={handleAddManualReview} className="w-full py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl text-xs hover:bg-white transition-all mt-4">Compile Entry</button>
                      </div>
                   </div>
               </div>
               
               <div className="lg:col-span-8 bg-[#111] p-10 rounded-[30px] border border-white/10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
                    <h3 className="text-2xl font-bold text-white">Feedback Stream</h3>
                  </div>
                  
                  <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar pr-4">
                     {allReviews.length === 0 ? <p className="text-center text-gray-600 font-bold uppercase tracking-widest py-10">Stream Empty</p> : allReviews.map((rev:any, i:number) => (
                       <div key={i} className={`bg-black border p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 transition-all shadow-lg ${rev.visibility === 'pending' ? 'border-[#00F0FF]' : 'border-white/10 hover:border-[#D4AF37]/30'}`}>
                          <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-white text-lg">{rev.userName}</h4>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border ${rev.visibility === 'public' ? 'bg-green-500/10 text-green-500 border-green-500/20' : rev.visibility === 'pending' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/20 animate-pulse' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>{rev.visibility || 'STANDBY'}</span>
                             </div>
                             <div className="flex gap-1 text-[#D4AF37] mb-4">{[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={14} fill="currentColor"/>)}</div>
                             <p className="text-gray-300 text-sm leading-relaxed mb-4">"{rev.comment}"</p>
                             {rev.media && rev.media.length > 0 && (
                                <div className="flex gap-3">
                                   {rev.media.map((m:string, idx:number) => m.match(/\.(mp4|webm|mov)$/i) ? <video key={idx} src={m} className="w-20 h-20 object-cover rounded-xl border border-white/10" controls/> : <img key={idx} src={m} className="w-20 h-20 object-cover rounded-xl border border-white/10"/>)}
                                </div>
                             )}
                          </div>
                          <div className={`flex md:flex-col gap-3 justify-center min-w-[140px]`}>
                             <button onClick={()=>handleUpdateReviewStatus(rev._id, 'public')} className="w-full py-3 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Validate</button>
                             <button onClick={()=>handleUpdateReviewStatus(rev._id, 'rejected')} className="w-full py-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Suppress</button>
                             <button onClick={()=>handleDeleteReview(rev._id)} className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all mt-auto flex items-center justify-center gap-2"><Trash2 size={14}/> Erase</button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 11. AFFILIATES ================= */}
          {activeTab === 'SALES_FORCE' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="salesforce" className="space-y-8">
               <div className="bg-[#111] p-10 rounded-[40px] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div><h3 className="text-3xl font-bold text-white mb-2">Network Terminals</h3><p className="text-gray-400 text-sm">Oversee registered referral vectors.</p></div>
                  <button onClick={() => setIsAgentModalOpen(true)} className="bg-[#D4AF37] text-black px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"><PlusCircle size={18}/> Provision Terminal</button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#111] p-8 rounded-[30px] border border-white/10"><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Active Nodes</p><h2 className="text-4xl font-bold text-white">{agents.length}</h2></div>
                  <div className="bg-[#111] p-8 rounded-[30px] border border-white/10"><p className="text-[#00F0FF] text-xs font-bold uppercase tracking-widest mb-2">Total Packets</p><h2 className="text-4xl font-bold text-white">{agents.reduce((acc, a) => acc + (a.clicks || 0), 0).toLocaleString()}</h2></div>
                  <div className="bg-[#111] p-8 rounded-[30px] border border-white/10"><p className="text-green-500 text-xs font-bold uppercase tracking-widest mb-2">Total Output</p><h2 className="text-4xl font-bold text-white">₹{agents.reduce((acc, a) => acc + (a.revenue || 0), 0).toLocaleString()}</h2></div>
               </div>

               <div className="bg-[#111] rounded-[30px] border border-white/10 overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-white/10"><h4 className="text-lg font-bold text-white">Terminal Ledger</h4></div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-black/50 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/10">
                            <tr><th className="p-6 pl-8">Identity</th><th className="p-6 text-center">Pings</th><th className="p-6 text-center">Conversions</th><th className="p-6 text-right">Yield</th><th className="p-6 text-center pr-8">Actions</th></tr>
                         </thead>
                         <tbody>
                            {agents.length === 0 ? (
                                <tr><td colSpan={5} className="p-16 text-center text-gray-600 font-bold uppercase tracking-widest">No Active Vectors.</td></tr>
                            ) : agents.map((agent, i) => (
                               <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                  <td className="p-6 pl-8">
                                     <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-black border border-white/20 rounded-full flex items-center justify-center text-white font-bold">{agent.name?.charAt(0) || 'U'}</div>
                                        <div><p className="font-bold text-white text-sm">{agent.name}</p><p className="text-[10px] text-[#00F0FF] uppercase tracking-widest mt-1">Key: {agent.code}</p></div>
                                     </div>
                                  </td>
                                  <td className="p-6 text-center text-gray-300 font-mono">{agent.clicks || 0}</td>
                                  <td className="p-6 text-center font-bold text-green-400 font-mono">{agent.sales || 0}</td>
                                  <td className="p-6 text-right font-bold text-white font-mono">₹{(agent.revenue || 0).toLocaleString()}</td>
                                  <td className="p-6 text-center pr-8"><button onClick={() => handleDeleteAffiliate(agent._id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16}/></button></td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 12. AI PRICING ================= */}
          {activeTab === 'AI_ENGINE' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="ai" className="max-w-3xl mx-auto space-y-10">
               <div className="text-center mb-10">
                   <BrainCircuit size={60} className="text-[#00F0FF] mx-auto mb-6"/>
                   <h2 className="text-3xl font-bold text-white mb-2">Algorithmic Valuation</h2>
                   <p className="text-gray-400 text-sm">Dynamic fluctuation based on market velocity.</p>
               </div>

               <div className="bg-[#111] p-10 rounded-[30px] border border-[#00F0FF]/30 space-y-8 shadow-[0_0_50px_rgba(0,240,255,0.05)]">
                  <div className="flex justify-between items-center border-b border-white/10 pb-6">
                     <div>
                        <h4 className="text-lg font-bold text-white">Enable Deep Learning</h4>
                        <p className="text-xs text-gray-500 mt-1">Permit automatic price recalibration for limited stock assets.</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold uppercase tracking-widest ${pricingRules.isAiPricingActive ? 'text-[#00F0FF]' : 'text-gray-600'}`}>{pricingRules.isAiPricingActive ? 'ONLINE' : 'OFFLINE'}</span>
                        <button onClick={() => setPricingRules({...pricingRules, isAiPricingActive: !pricingRules.isAiPricingActive})} className={`w-16 h-8 rounded-full p-1 transition-colors ${pricingRules.isAiPricingActive ? 'bg-[#00F0FF]' : 'bg-gray-800'}`}>
                           <div className={`w-6 h-6 bg-white rounded-full transition-transform ${pricingRules.isAiPricingActive ? 'translate-x-8' : 'translate-x-0'}`}></div>
                        </button>
                     </div>
                  </div>

                  <div>
                     <div className="flex justify-between items-end mb-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Absolute Price Ceiling</label>
                        <span className="text-2xl font-mono text-[#00F0FF]">{pricingRules.maxMarkupPercent}%</span>
                     </div>
                     <input type="range" min="0" max="50" value={pricingRules.maxMarkupPercent} onChange={(e) => setPricingRules({...pricingRules, maxMarkupPercent: Number(e.target.value)})} className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer" style={{accentColor: '#00F0FF'}} />
                     <p className="text-xs text-gray-600 mt-4">Restricts the maximum allowable deviation from the base coordinate.</p>
                  </div>

                  <button onClick={handleSaveAIRules} className="w-full py-5 bg-[#00F0FF] text-black font-bold uppercase tracking-widest rounded-xl text-sm hover:bg-white transition-all mt-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                     Compile Algorithm
                  </button>
               </div>
            </motion.div>
          )}

          {/* ================= 13. SECURITY ================= */}
          {activeTab === 'SECURITY' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-2xl mx-auto mt-20">
               <div className="bg-[#111] border border-red-500/30 p-16 rounded-[40px] flex flex-col items-center text-center shadow-[0_0_100px_rgba(239,68,68,0.1)]">
                  <div className="p-6 bg-red-500/10 rounded-full mb-8"><Fingerprint size={60} className="text-red-500" /></div>
                  <h3 className="text-4xl font-bold text-white mb-4">System Integrity</h3>
                  <p className="text-gray-400 text-sm mb-12">All external nodes are secure. Execute full lockdown in case of breach.</p>
                  <button className="px-10 py-5 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-500 transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:scale-105">
                     <AlertTriangle size={18}/> Initiate Lockdown
                  </button>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
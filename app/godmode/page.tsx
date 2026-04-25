"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  BarChart3, Package, BrainCircuit, Landmark, Users, RefreshCcw, Trash2, Layout, Video, 
  AlignCenter, AlignLeft, AlignRight, PlusCircle, Link as LinkIcon, ShieldCheck, Eye, Save, 
  ImageIcon, Box, Zap, AlertTriangle, Truck, MapPin, BellRing, Edit3, Plus, X, 
  CheckCircle, Bot, Star, TrendingUp, Wallet, Activity, ShieldAlert, Download, MessageSquare, 
  FileText, Search, ChevronRight, Gift, Shield, Globe, Lock, ChevronUp, ChevronDown, Award, UploadCloud,
  Instagram, Facebook, Twitter, Youtube, Phone, Mail, Linkedin, AlignJustify,
  Terminal, Radar, Fingerprint, Cpu, Network
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// 🚀 BATCH 1 MODULAR COMPONENTS 
import DashboardTab from '../../components/godmode/tabs/DashboardTab';
import InventoryTab from '../../components/godmode/tabs/InventoryTab';
import OrderTrackerTab from '../../components/godmode/tabs/OrderTrackerTab';
import SeoEngineTab from '../../components/godmode/tabs/SeoEngineTab';
import LegalPagesTab from '../../components/godmode/tabs/LegalPagesTab';
import ReviewsTab from '../../components/godmode/tabs/ReviewsTab';
import SalesForceTab from '../../components/godmode/tabs/SalesForceTab';
import AiEngineTab from '../../components/godmode/tabs/AiEngineTab';
import SecurityTab from '../../components/godmode/tabs/SecurityTab';

import RedirectManager from '../../components/godmode/RedirectManager';
import SeoPanel from '../../components/godmode/SeoPanel';
import ImageSeoPanel from '../../components/godmode/ImageSeoPanel';
import SeoAnalyticsDashboard from '../../components/godmode/SeoAnalyticsDashboard';

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('FULL_DASHBOARD');
  const [dashboardView, setDashboardView] = useState<'orders' | 'abandoned'>('orders');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [systemLogs, setSystemLogs] = useState<string[]>(["System initialized. Production environment connected."]);

  const [leads, setLeads] = useState<any[]>([]);
  const [vipDispatchingKey, setVipDispatchingKey] = useState<string | null>(null);
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
  const [agentForm, setAgentForm] = useState({ name: '', email: '', code: '', tier: 'Partner', commissionRate: 5 });
  const [pricingRules, setPricingRules] = useState({ isAiPricingActive: true, maxMarkupPercent: 15, maxDiscountPercent: 10, lowStockThreshold: 3, trendingThreshold: 10 });
  
  const addLog = (msg: string) => {
      setSystemLogs(prev => [msg, ...prev].slice(0, 8)); 
  };

  const handleAdminLogout = async () => {
    try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
    await signOut();
    window.location.reload();
  };

  const dispatchVIPRecovery = async (channel: "email" | "sms" | "whatsapp", lead: any) => {
    const leadId = lead?._id;
    if (!leadId) return;
    const key = `${channel}:${leadId}`;
    setVipDispatchingKey(key);

    const endpoint = channel === "email" ? "/api/abandoned-carts/dispatch/email" : channel === "sms" ? "/api/abandoned-carts/dispatch/sms" : "/api/abandoned-carts/dispatch/whatsapp";
    try {
      const res = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Dispatch failed");
      if (channel === "whatsapp" && data.url) window.open(data.url, "_blank", "noopener,noreferrer");
      addLog(`VIP ${channel.toUpperCase()} sent for ${lead.name || "Client"}.`);
    } catch (e: any) {
      addLog(`VIP ${channel.toUpperCase()} dispatch failed: ${e?.message || "Unknown error"}`);
      alert(`VIP ${channel.toUpperCase()} failed. Please try again.`);
    } finally { setVipDispatchingKey(null); }
  };

  const fetchDashboardData = async (silent = false) => {
    if (!silent) { setIsSyncing(true); if(systemLogs.length === 1) addLog("Syncing real-time database modules..."); }
    try {
      const ts = new Date().getTime();
      const [resLeads, resCms, resProducts, resAgents, resOrders, resRules, resAnalytics, resReviews, resMarketing, resCust, resCelebs] = await Promise.all([
        fetch(`/api/abandoned-carts?t=${ts}`).then(r => r.ok ? r.json() : {leads: []}),
        fetch(`/api/cms?t=${ts}`).then(r => r.ok ? r.json() : {data: null}),
        fetch(`/api/products?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/agents?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/orders?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/ai/rules?t=${ts}`).then(r => r.ok ? r.json() : {data: null}),
        fetch(`/api/dashboard/full-analytics?t=${ts}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/reviews?admin=true&t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/coupons?t=${ts}`).then(r => r.ok ? r.json() : {data: []}),
        fetch(`/api/customers?t=${ts}`).then(r => r.ok ? r.json() : {data: []}).catch(()=>({data:[]})),
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

  useEffect(() => { if (session?.user?.role === 'SUPER_ADMIN') fetchDashboardData(); }, [session]);

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
      fetchDashboardData(true);
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
          alert("Product Saved Successfully!");
          addLog("Product live.");
          setWatchForm({ 
              name: '', brand: '', category: categories[0] || '', price: '', offerPrice: '', stock: '', imageUrl: '', images: ['', '', '', '', '', '', ''], videoUrl: '', model3DUrl: '', description: '', specifications: '', seoTags: '', priority: 0, badge: 'New Arrival', amazonDetails: [{ key: 'Dial Color', value: 'Black' }],
              vipVaultKey: '', vipDiscount: '', transitFee: '0', taxPercentage: '18', taxInclusive: true,
              seo: { metaTitle: '', metaDescription: '', focusKeyword: '', slug: '', noindex: false, imageAltTexts: {} }
          });
          fetchDashboardData(true); 
      } else { alert(`Error saving product: ${data.error || 'Check fields and try again'}`); }
    } catch (e) { alert("Network Error!"); } 
    finally { setIsSyncing(false); }
  };
  
  const handleDeleteProduct = async (id: string) => {
    if(!confirm("Delete this product from vault?")) return;
    setLiveWatches(prevWatches => prevWatches.filter(watch => watch._id !== id));
    try { 
      await fetch(`/api/products`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
      fetchDashboardData(true);
    } catch(e) {}
  };

  const handleDeleteCoupon = async (id: string) => {
      if(!confirm("Delete this coupon code?")) return;
      setCoupons(prev => prev.filter(c => c._id !== id)); 
      try { 
        await fetch(`/api/coupons`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
        fetchDashboardData(true);
      } catch(e) {}
  };

  const handleDeleteAffiliate = async (id: string) => {
      if(!confirm("Remove this affiliate partner?")) return;
      setAgents(prev => prev.filter(a => a._id !== id)); 
      try { 
        await fetch(`/api/agents`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
        fetchDashboardData(true);
      } catch(e) {}
  };

  const handleDeleteReview = async (id: string) => {
      if(!confirm("Permanently delete this review?")) return;
      setAllReviews(prev => prev.filter(r => r._id !== id)); 
      try { 
        await fetch(`/api/reviews`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
        fetchDashboardData(true);
      } catch(e) {}
  };

  const handleDeleteOrder = async (id: string) => {
      if(!confirm("Permanently delete this order?")) return;
      setOrders(prev => prev.filter(o => o._id !== id)); 
      try { 
        await fetch(`/api/orders`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
        fetchDashboardData(true);
      } catch(e) {}
  };

  const handleDeleteLead = async (id: string) => {
      if(!confirm("Permanently erase this client record?")) return;
      setLeads(prev => prev.filter(l => l._id !== id)); 
      try { 
        await fetch(`/api/customers`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
        fetchDashboardData(true);
      } catch(e) {}
  };

  const handleDeleteCeleb = async (id: string) => {
      if(!confirm("Remove this ambassador?")) return;
      setCelebs(prev => prev.filter(c => c._id !== id)); 
      try { 
        await fetch(`/api/celebrity`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
        fetchDashboardData(true);
      } catch(e) {}
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    setIsSyncing(true); addLog(`Order ${id.slice(-4)} updated to ${newStatus}`);
    try {
        const res = await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
        if(res.ok) fetchDashboardData(true);
    } catch(e) { alert("Failed to update order status."); } finally { setIsSyncing(false); }
  };

  const handleUpdateTracking = async (id: string, trackingId: string) => {
    setIsSyncing(true); addLog(`Order ${id.slice(-4)} tracking updated`);
    try {
        const res = await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, trackingId }) });
        if(res.ok) { fetchDashboardData(true); alert("Tracking ID Saved!"); }
    } catch(e) { alert("Failed to update tracking."); } finally { setIsSyncing(false); }
  };

  const handleUpdateReviewStatus = async (reviewId: string, visibility: string) => {
      setIsSyncing(true); addLog(`Updating review visibility...`);
      try {
          await fetch('/api/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reviewId, visibility }) });
          fetchDashboardData(true);
      } catch (e) { alert("Failed to update review."); } finally { setIsSyncing(false); }
  };

  const handleAddAffiliate = async () => {
    if (!agentForm.name || !agentForm.email || !agentForm.code) return alert("Name, Email, and Code are required.");
    setIsSyncing(true); addLog("Creating secure affiliate profile...");
    try {
      const res = await fetch('/api/agents', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ name: agentForm.name, email: agentForm.email, code: agentForm.code, commission: agentForm.commissionRate, role: agentForm.tier }) 
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Affiliate Partner Added Successfully!`);
        setAgentForm({ name: '', email: '', code: '', tier: 'Partner', commissionRate: 5 });
        setIsAgentModalOpen(false); 
        fetchDashboardData(true);
      } else { alert(data.error || "Failed to add partner"); }
    } catch (error) { alert("Network Error."); } finally { setIsSyncing(false); }
  };

  const handleCreateCoupon = async () => {
      if(!couponForm.code || !couponForm.discountValue) return alert("Code and Discount Value are required.");
      setIsSyncing(true); addLog(`Saving marketing rule...`);
      try {
          await fetch('/api/coupons', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(couponForm)});
          setCouponForm({code: '', discountValue: '', minOrder: '', validUntil: ''}); fetchDashboardData(true);
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
  if (!session || session.user?.role !== 'SUPER_ADMIN') return <div className="h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden"><div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div><Lock size={60} className="text-red-500 mb-8 animate-pulse relative z-10"/><button onClick={() => signIn("google")} className="relative z-10 bg-[#D4AF37] text-black px-12 py-5 rounded-full font-bold tracking-widest uppercase shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:bg-white hover:shadow-[#D4AF37] transition-all hover:scale-105">Admin sign in</button></div>;
  
  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#D4AF37] selection:text-black relative font-sans w-full max-w-[100vw]">
      
      {/* ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-[#0A0A0A] border border-white/10 p-6 md:p-10 rounded-[30px] w-full max-w-3xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
               <div className="absolute top-0 right-0 p-10 md:p-20 opacity-5 pointer-events-none"><Truck size={200}/></div>
               <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 md:top-8 md:right-8 text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"><X size={24}/></button>
               
               <h3 className="text-2xl md:text-3xl font-bold text-[#D4AF37] mb-2 italic font-serif">Deep Intelligence Report</h3>
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[5px] text-gray-500 mb-8">ORDER ID: {selectedOrder.orderId}</p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-b border-white/5 pb-10">
                  <div className="space-y-6">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-3">Client Protocol</p>
                        <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/5 space-y-2">
                           <p className="text-lg md:text-xl font-bold text-white">{selectedOrder.shippingData?.name || selectedOrder.customer?.name}</p>
                           <p className="text-sm text-gray-400 font-mono">{selectedOrder.shippingData?.phone || selectedOrder.customer?.phone}</p>
                           <p className="text-sm text-gray-400 font-mono break-all">{selectedOrder.shippingData?.email || selectedOrder.customer?.email}</p>
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-3">Delivery Vector</p>
                        <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/5">
                           <p className="text-sm text-gray-300 leading-relaxed italic font-serif">
                              {selectedOrder.shippingData?.address}<br/>
                              {selectedOrder.shippingData?.city}, {selectedOrder.shippingData?.state}<br/>
                              {selectedOrder.shippingData?.pincode}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-3">Acquired Assets</p>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                           {selectedOrder.items.map((item: any, i: number) => (
                              <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 group hover:border-[#D4AF37]/30 transition-all">
                                 <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg p-2 border border-white/10 flex items-center justify-center shrink-0">
                                       <img src={item.imageUrl || item.image} className="w-full h-full object-contain" alt="" />
                                    </div>
                                    <div>
                                       <p className="text-[10px] md:text-xs font-bold text-white line-clamp-1">{item.name}</p>
                                       <p className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase mt-1">QTY: {item.qty || item.quantity || 1} UNIT(S)</p>
                                    </div>
                                 </div>
                                 <p className="text-xs md:text-sm font-bold text-[#D4AF37] font-mono">₹{((item.offerPrice || item.price) * (item.qty || item.quantity || 1)).toLocaleString()}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="pt-6 border-t border-white/5">
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Clearance Value</p>
                              <p className="text-2xl md:text-3xl font-bold text-green-400 font-mono">₹{(selectedOrder.totalAmount || 0).toLocaleString()}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Payment Status</p>
                              <p className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">{selectedOrder.paymentStatus || 'PAID'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex justify-end">
                  <button onClick={() => setSelectedOrder(null)} className="w-full md:w-auto px-10 py-4 bg-[#D4AF37] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]">Close Intelligence Brief</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/[0.05] blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#00F0FF]/[0.03] blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* AFFILIATE MODAL */}
      <AnimatePresence>
        {isAgentModalOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} exit={{scale:0.9, y:20}} className="bg-black/80 border border-[#D4AF37]/50 p-6 md:p-10 rounded-[30px] w-full max-w-xl relative shadow-2xl backdrop-blur-2xl">
               <button onClick={() => setIsAgentModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
               <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#D4AF37]">Add Affiliate Partner</h3>
               <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 mb-8">Securely assign tracking credentials.</p>
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
                 <button onClick={handleAddAffiliate} className="w-full py-5 min-h-[44px] bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl text-xs hover:bg-white transition-all mt-4 flex justify-center items-center gap-2"><Zap size={16}/> Provision Partner</button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex w-[300px] bg-black/60 backdrop-blur-2xl border-r border-white/10 flex-col z-50 relative">
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
             <button onClick={() => handleAdminLogout()} className="w-full py-4 text-red-500 text-[10px] font-bold uppercase tracking-widest border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all flex justify-center items-center gap-2"><Lock size={14}/> Sign out</button>
        </div>
      </aside>

      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden overflow-y-auto p-4 md:p-8 lg:p-12 relative custom-scrollbar z-10 pt-[calc(env(safe-area-inset-top)+16px)]">

        <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 mb-6 border-b border-white/10 scrollbar-hide snap-x w-full pt-2">
            {MODULES.map(m => (
                <button
                    key={m.id}
                    onClick={() => setActiveTab(m.id)}
                    className={`shrink-0 snap-start flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all min-h-[44px] ${
                        activeTab === m.id ? 'bg-[#D4AF37] text-black shadow-lg' : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}
                >
                    <m.icon size={14} className={activeTab === m.id ? 'text-black' : 'text-[#D4AF37]'} />
                    {m.label}
                </button>
            ))}
        </div>

        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-10 border-b border-white/10 pb-6 gap-4">
          <div>
             <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white">
               {MODULES.find(m => m.id === activeTab)?.label}
             </h2>
          </div>
          <div className="flex w-full lg:w-auto gap-3">
             <button className="flex-1 lg:flex-none justify-center p-4 min-h-[44px] bg-black border border-white/20 rounded-xl hover:border-[#D4AF37] transition-colors relative flex items-center">
               <BellRing size={18} className="text-gray-400 mx-auto"/>
               {leads.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">{leads.length}</span>}
             </button>
             <button onClick={() => fetchDashboardData(false)} className="flex-[3] lg:flex-none justify-center px-5 py-4 min-h-[44px] bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <RefreshCcw size={16} className={isSyncing ? "animate-spin" : ""}/> Sync Data
             </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          
          {/* ================= 1. COMMAND CENTER (DASHBOARD) ================= */}
          {activeTab === 'FULL_DASHBOARD' && (
            <DashboardTab
              fullAnalytics={fullAnalytics}
              dashboardView={dashboardView}
              setDashboardView={setDashboardView}
              leads={leads}
              orders={orders}
              dispatchVIPRecovery={dispatchVIPRecovery}
              vipDispatchingKey={vipDispatchingKey}
              handleDeleteLead={handleDeleteLead}
              systemLogs={systemLogs}
            />
          )}

          {/* ================= 2. INVENTORY ================= */}
          {activeTab === 'INVENTORY' && (
            <InventoryTab
              categories={categories}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              setCategories={setCategories}
              watchForm={watchForm}
              setWatchForm={setWatchForm}
              handleSaveProduct={handleSaveProduct}
              liveWatches={liveWatches}
              handleDeleteProduct={handleDeleteProduct}
              PremiumUploadNode={PremiumUploadNode}
            />
          )}

          {/* ================= 3. MANAGE ORDERS ================= */}
          {activeTab === 'ORDER_TRACKER' && (
            <OrderTrackerTab
              orders={orders}
              exportToCSV={exportToCSV}
              handleUpdateOrderStatus={handleUpdateOrderStatus}
              handleUpdateTracking={handleUpdateTracking}
              setSelectedOrder={setSelectedOrder}
              handleDeleteOrder={handleDeleteOrder}
            />
          )}

          {/* ================= 4. CUSTOMERS & CRM ================= */}
          {activeTab === 'CRM' && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} key="crm" className="bg-[#111] border border-white/10 rounded-[20px] md:rounded-[30px] overflow-hidden shadow-2xl w-full">
                <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <h3 className="text-xl md:text-2xl font-bold text-white">Client Roster</h3>
                   <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold">{leads.length} Identified</span>
                </div>
                <div className="overflow-x-auto w-full max-w-[100vw]">
                   <table className="w-full text-left min-w-[700px]">
                     <thead className="bg-black/50 text-[10px] md:text-xs font-bold uppercase text-gray-400 border-b border-white/10">
                        <tr>
                          <th className="p-4 md:p-6 pl-6 md:pl-10">Client Identity</th>
                          <th className="p-4 md:p-6 text-center">Access Vector</th>
                          <th className="p-4 md:p-6 text-center">Store credit</th>
                          <th className="p-4 md:p-6 text-right pr-6 md:pr-10">Portfolio Value</th>
                          <th className="p-4 md:p-6 text-center pr-6 md:pr-10">Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                       {leads.length === 0 ? <tr><td colSpan={5} className="p-10 md:p-20 text-center text-gray-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">Database Empty</td></tr> : leads.map((c:any, i:number) => (
                           <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                              <td className="p-4 md:p-6 pl-6 md:pl-10">
                                 <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-xs md:text-sm font-bold text-white shrink-0">{c.phone?.slice(-2) || 'XX'}</div>
                                    <div className="overflow-hidden">
                                       <p className="font-bold text-white text-xs md:text-sm truncate">{c.phone || 'Anonymous'}</p>
                                       <p className="text-[10px] md:text-xs text-gray-500 mt-1 truncate">{c.email || `REF: ${c._id?.slice(-8)}`}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-4 md:p-6 text-center text-xs md:text-sm text-gray-300">{c.referralCode || 'Organic'}</td>
                              <td className="p-4 md:p-6 text-center text-[#D4AF37] font-bold text-sm md:text-lg">₹{c.walletBalance || 0}</td>
                              <td className="p-4 md:p-6 text-right pr-6 md:pr-10"><p className="font-bold text-base md:text-xl text-green-400">₹{(c.cartTotal || 0).toLocaleString()}</p></td>
                              <td className="p-4 md:p-6 text-center pr-6 md:pr-10">
                                  <button onClick={() => handleDeleteLead(c._id)} className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all mx-auto">
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
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="marketing" className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full">
               <div className="lg:col-span-5 w-full">
                  <div className="bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[30px] border border-white/10">
                     <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3"><Gift size={24} className="text-[#D4AF37]"/> Define Rule</h3>
                     <div className="space-y-4 md:space-y-5">
                        <div>
                           <label className="text-[10px] md:text-xs text-gray-400 block mb-2">Access Key (Code)</label>
                           <input value={couponForm.code} onChange={e=>setCouponForm({...couponForm, code: e.target.value})} className="w-full min-h-[44px] bg-black border border-white/20 p-3 md:p-4 rounded-xl text-xs md:text-sm uppercase outline-none focus:border-[#D4AF37] text-white" placeholder="e.g. VIP20"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-[10px] md:text-xs text-gray-400 block mb-2">Yield (%)</label>
                              <input value={couponForm.discountValue} onChange={e=>setCouponForm({...couponForm, discountValue: e.target.value})} type="number" className="w-full min-h-[44px] bg-black border border-white/20 p-3 md:p-4 rounded-xl text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="15"/>
                           </div>
                           <div>
                              <label className="text-[10px] md:text-xs text-gray-400 block mb-2">Floor Value (₹)</label>
                              <input value={couponForm.minOrder} onChange={e=>setCouponForm({...couponForm, minOrder: e.target.value})} type="number" className="w-full min-h-[44px] bg-black border border-white/20 p-3 md:p-4 rounded-xl text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="50000"/>
                           </div>
                        </div>
                        <button onClick={handleCreateCoupon} className="w-full min-h-[44px] py-4 md:py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl text-xs md:text-sm hover:bg-white transition-all mt-4">Execute Rule</button>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-7 bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[30px] border border-white/10 w-full">
                  <h4 className="text-white font-bold text-lg md:text-xl mb-4 md:mb-6 border-b border-white/10 pb-4">Active Market Logic</h4>
                  <div className="space-y-4">
                     {coupons.length === 0 ? <p className="text-center py-10 md:py-20 text-gray-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">No Rules Defined</p> : coupons.map((c, i) => (
                        <div key={i} className="p-4 md:p-6 bg-black border border-white/20 rounded-2xl flex flex-row justify-between items-center group hover:border-[#D4AF37] transition-colors gap-3">
                           <div className="flex items-center gap-4 md:gap-6">
                              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center text-[#D4AF37] font-bold text-xl md:text-2xl shrink-0">{c.discountValue}%</div>
                              <div className="overflow-hidden">
                                 <p className="font-bold text-lg md:text-2xl text-white mb-1 tracking-widest truncate">{c.code}</p>
                                 <p className="text-[9px] md:text-xs text-gray-400 truncate">Triggered: {c.usedCount || 0} times | Threshold: ₹{c.minOrderValue?.toLocaleString() || 0}</p>
                              </div>
                           </div>
                           <button onClick={() => handleDeleteCoupon(c._id)} className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-red-500/20 text-red-500 rounded-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shrink-0"><Trash2 size={18}/></button>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* ================= 6. WEBSITE BUILDER ================= */}
          {activeTab === 'PAGE_BUILDER' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="builder" className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-10 pb-20 w-full">
               
               <div className="bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[30px] border border-white/10 space-y-8 md:space-y-10 h-max w-full">
                  <h3 className="text-[#D4AF37] text-base md:text-lg font-bold mb-4 border-b border-white/10 pb-4 flex items-center gap-2"><Layout size={20}/> UI Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div><label className="text-[10px] md:text-xs text-gray-400 block mb-2">Brand Accent</label><div className="flex gap-3"><input type="color" value={uiConfig.primaryColor} onChange={(e)=>setUiConfig({...uiConfig, primaryColor: e.target.value})} className="w-12 h-12 min-h-[44px] rounded-lg bg-black border border-white/20 p-1 cursor-pointer shrink-0"/><input value={uiConfig.primaryColor} onChange={(e)=>setUiConfig({...uiConfig, primaryColor: e.target.value})} className="w-full min-h-[44px] bg-black border border-white/20 rounded-lg p-3 text-xs md:text-sm text-white outline-none font-mono"/></div></div>
                    <div><label className="text-[10px] md:text-xs text-gray-400 block mb-2">Base Canvas</label><div className="flex gap-3"><input type="color" value={uiConfig.bgColor} onChange={(e)=>setUiConfig({...uiConfig, bgColor: e.target.value})} className="w-12 h-12 min-h-[44px] rounded-lg bg-black border border-white/20 p-1 cursor-pointer shrink-0"/><input value={uiConfig.bgColor} onChange={(e)=>setUiConfig({...uiConfig, bgColor: e.target.value})} className="w-full min-h-[44px] bg-black border border-white/20 rounded-lg p-3 text-xs md:text-sm text-white outline-none font-mono"/></div></div>
                  </div>
                  
                  <div className="space-y-6 pt-6 md:pt-8 border-t border-white/10">
                      <h3 className="text-[#D4AF37] text-[10px] md:text-sm font-bold uppercase">Dynamic Lookbook</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <div key={idx} className="p-2 md:p-4 bg-black border border-white/20 rounded-xl relative group flex flex-col items-center min-h-[120px] md:min-h-[140px] justify-center">
                                <span className="absolute top-2 left-2 text-[8px] md:text-[10px] text-gray-500 font-bold z-20">Slide {idx + 1}</span>
                                {galleryImages[idx] ? (
                                    <div className="absolute inset-2 rounded-lg overflow-hidden mt-6">
                                        <img src={galleryImages[idx]} className="w-full h-full object-cover" />
                                        <button onClick={()=>{ const arr=[...galleryImages]; arr.splice(idx,1); setGalleryImages(arr); }} className="absolute top-1 right-1 p-1.5 min-h-[30px] min-w-[30px] flex items-center justify-center bg-red-500 rounded text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                                    </div>
                                 ) : ( 
                                    <div className="mt-4 scale-[0.6] md:scale-75 origin-center">
                                        <PremiumUploadNode placeholder="Push" onUploadSuccess={(url: string)=>{ const arr=[...galleryImages]; arr[idx]=url; setGalleryImages(arr); }} />
                                    </div> 
                                )}
                            </div>
                        ))}
                      </div>
                  </div>
                  <button onClick={handleSaveCMS} className="w-full min-h-[44px] py-4 md:py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl text-[10px] md:text-xs hover:bg-white transition-all mt-6">Commit UI Overrides</button>
               </div>

               <div className="space-y-6 md:space-y-8 w-full">
                 <div className="bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[30px] border border-white/10">
                    <h3 className="text-[#D4AF37] text-base md:text-lg font-bold mb-4 md:mb-6 border-b border-white/10 pb-4">Home page hero</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-4 w-full overflow-x-hidden">
                       {heroSlides.length === 0 ? <p className="text-gray-600 text-[10px] md:text-xs font-bold tracking-widest uppercase py-4">No Projections Active</p> : heroSlides.map((slide, i) => (
                          <div key={slide.id || i} className="p-4 md:p-6 bg-black border border-white/20 rounded-2xl space-y-4 relative w-full">
                             <div className="flex justify-between items-center"><span className="text-[10px] md:text-xs font-bold text-[#D4AF37]">Sequence {i+1}</span><button onClick={() => handleRemoveHeroSlide(slide.id)} className="text-red-500 text-[10px] md:text-xs font-bold hover:underline min-h-[30px] px-2">Erase</button></div>
                             <select value={slide.type} onChange={(e) => { const n = [...heroSlides]; n[i].type = e.target.value; setHeroSlides(n); }} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm text-white outline-none"><option value="video">Cinematic Video</option><option value="image">Static Image</option></select>
                             <input value={slide.url} onChange={(e) => { const n = [...heroSlides]; n[i].url = e.target.value; setHeroSlides(n); }} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm text-blue-400 outline-none font-mono" placeholder="Target Source URL"/>
                             <input value={slide.heading} onChange={(e) => { const n = [...heroSlides]; n[i].heading = e.target.value; setHeroSlides(n); }} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm text-white outline-none" placeholder="Overlay Typography"/>
                          </div>
                       ))}
                    </div>
                    <button onClick={handleAddHeroSlide} className="w-full min-h-[44px] bg-white/5 border border-white/20 py-3 md:py-4 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">+ Append Sequence</button>
                 </div>

                 <div className="bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[30px] border border-[#00F0FF]/30 w-full overflow-hidden">
                    <h3 className="text-[#00F0FF] text-base md:text-lg font-bold mb-2 border-b border-white/10 pb-4 flex items-center gap-2"><Video size={20}/> Atmospheric Bridges</h3>
                    <p className="text-[10px] md:text-xs text-gray-400 mb-6">Full-bleed transitional videos deployed between main blocks.</p>
                    
                    <div className="space-y-4">
                        {[0, 1, 2, 3, 4].map((slot) => (
                            <div key={slot} className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 bg-black p-3 md:p-4 rounded-2xl border border-white/10">
                                <div className="w-full md:w-24 text-[10px] md:text-xs font-bold text-gray-500">Bridge {slot + 1}</div>
                                <div className="flex w-full items-center gap-2">
                                  <input 
                                      value={promoVideos[slot] || ''} 
                                      onChange={(e) => { const newVids = [...promoVideos]; newVids[slot] = e.target.value; setPromoVideos(newVids); }} 
                                      className="flex-1 bg-transparent border border-white/20 p-3 rounded-lg text-xs md:text-sm text-[#00F0FF] font-mono outline-none w-full min-w-0" 
                                      placeholder="Target .mp4 URL..."
                                  />
                                  <div className="scale-[0.65] md:scale-75 origin-right shrink-0">
                                      <PremiumUploadNode placeholder="Push" onUploadSuccess={(url:string)=>{ const newVids = [...promoVideos]; newVids[slot] = url; setPromoVideos(newVids); }} />
                                  </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSaveCMS} className="w-full min-h-[44px] py-4 bg-[#00F0FF] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all mt-6 text-[10px] md:text-xs">Commit Bridges</button>
                 </div>
               </div>
            </motion.div>
          )}

          {/* ================= 7. AMBASSADORS (CELEBRITIES) ================= */}
          {activeTab === 'AMBASSADORS' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} key="ambassadors" className="space-y-6 md:space-y-8 w-full">
               <div className="bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[30px] border border-white/10 flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="flex-1 space-y-4">
                     <h3 className="text-xl md:text-2xl font-serif text-white mb-4 md:mb-6 flex items-center gap-3"><Award size={24} className="text-[#D4AF37]"/> Secure New Identity</h3>
                     <input value={newCeleb.name} onChange={e=>setNewCeleb({...newCeleb, name: e.target.value})} className="w-full min-h-[44px] bg-black border border-white/20 p-4 rounded-xl text-xs md:text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Designation Name"/>
                     <input value={newCeleb.title} onChange={e=>setNewCeleb({...newCeleb, title: e.target.value})} className="w-full min-h-[44px] bg-black border border-white/20 p-4 rounded-xl text-xs md:text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Role (e.g. Architect / Collector)"/>
                     <button onClick={handleAddCelebrity} className="w-full min-h-[44px] py-4 md:py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl text-[10px] md:text-sm hover:bg-white transition-all mt-2 md:mt-4">Append Profile</button>
                  </div>
                  <div className="flex flex-row md:flex-col gap-4 items-center justify-center border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                     <PremiumUploadNode placeholder="Visual" onUploadSuccess={(url:string)=>setNewCeleb({...newCeleb, imageUrl: url})} />
                     {newCeleb.imageUrl && <div className="h-24 w-24 md:h-32 md:w-32 rounded-xl overflow-hidden border border-white/20"><img src={newCeleb.imageUrl} className="w-full h-full object-cover"/></div>}
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {celebs.length === 0 ? <p className="col-span-full text-center text-gray-600 font-bold uppercase tracking-widest py-10 text-[10px] md:text-xs">No Identities Found</p> : celebs.map((c) => (
                      <div key={c._id} className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden relative group shadow-lg hover:border-[#D4AF37]/50 transition-all">
                          <div className="h-40 md:h-56 relative">
                              <img src={c.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              <button onClick={() => handleDeleteCeleb(c._id)} className="absolute top-2 right-2 md:top-3 md:right-3 p-2 min-h-[36px] min-w-[36px] bg-red-500 text-white rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:scale-110 flex items-center justify-center"><Trash2 size={14}/></button>
                          </div>
                          <div className="p-4 md:p-5 text-center">
                              <h4 className="font-bold text-sm md:text-lg text-white mb-1 truncate">{c.name}</h4>
                              <p className="text-[8px] md:text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider truncate">{c.title}</p>
                          </div>
                      </div>
                  ))}
               </div>
            </motion.div>
          )}

          {/* ================= 8. SEO ENGINE ================= */}
          {activeTab === 'SEO_ENGINE' && (
            <SeoEngineTab />
          )}

          {/* ================= 9. LEGAL PAGES ================= */}
          {activeTab === 'LEGAL_PAGES' && (
            <LegalPagesTab
              legalPages={legalPages}
              setLegalPages={setLegalPages}
              activeLegalPageId={activeLegalPageId}
              setActiveLegalPageId={setActiveLegalPageId}
              corporateInfo={corporateInfo}
              setCorporateInfo={setCorporateInfo}
              handleSaveCMS={handleSaveCMS}
              PremiumUploadNode={PremiumUploadNode}
            />
          )}

          {/* ================= 10. REVIEWS ================= */}
          {activeTab === 'REVIEWS' && (
            <ReviewsTab
              manualReview={manualReview}
              setManualReview={setManualReview}
              handleAddManualReview={handleAddManualReview}
              allReviews={allReviews}
              handleUpdateReviewStatus={handleUpdateReviewStatus}
              handleDeleteReview={handleDeleteReview}
              PremiumUploadNode={PremiumUploadNode}
            />
          )}

          {/* ================= 11. AFFILIATES ================= */}
          {activeTab === 'SALES_FORCE' && (
            <SalesForceTab
              agents={agents}
              setIsAgentModalOpen={setIsAgentModalOpen}
              handleDeleteAffiliate={handleDeleteAffiliate}
            />
          )}

          {/* ================= 12. AI PRICING ================= */}
          {activeTab === 'AI_ENGINE' && (
            <AiEngineTab
              pricingRules={pricingRules}
              setPricingRules={setPricingRules}
              handleSaveAIRules={handleSaveAIRules}
            />
          )}

          {/* ================= 13. SECURITY ================= */}
          {activeTab === 'SECURITY' && (
            <SecurityTab />
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Menu, Search, ShieldCheck, ShoppingBag, Plus, Sparkles, ChevronDown, Lock, X, Star, CheckCircle, 
  Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail, Linkedin, ArrowRight, Camera, UploadCloud, RefreshCcw, Trash2
} from 'lucide-react';
import Link from 'next/link';
// PhantomGuard imported but temporarily bypassed to prevent localhost JS crash
import { PhantomGuard } from '@/components/PhantomGuard';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

const LUXURY_BRANDS = ["ROLEX", "PATEK PHILIPPE", "AUDEMARS PIGUET", "RICHARD MILLE", "CARTIER", "OMEGA", "VACHERON CONSTANTIN"];
const DEFAULT_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1587836374828-cb4387df3c56?q=80&w=1000",
  "https://images.unsplash.com/photo-1508685096489-77a46807e604?q=80&w=1000",
  "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000",
  "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000",
  "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1000"
];

const DEFAULT_PROMO_VIDEOS = [
    "https://cdn.pixabay.com/video/2020/05/24/40092-424840899_large.mp4", 
    "https://cdn.pixabay.com/video/2021/08/11/84687-587289569_large.mp4", 
    "https://cdn.pixabay.com/video/2020/02/21/32616-393246231_large.mp4", 
    "", 
    ""  
];

// 🌟 PREMIUM TOAST COMPONENT
const LuxuryToast = ({ show, message, type = "success" }: any) => (
    <AnimatePresence>
        {show && (
            <motion.div 
                initial={{ opacity: 0, y: 50, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-10 left-1/2 z-[3000] bg-white/95 backdrop-blur-xl border border-gray-200 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px]"
            >
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-red-500/20 text-red-500'}`}
                >
                    {type === 'success' ? <ShoppingBag size={20} /> : <X size={20} />}
                </motion.div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-[#D4AF37]">Cart updated</p>
                    <p className="text-gray-900 text-sm font-serif italic">{message}</p>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

const CinematicBreak = ({ videoUrl, title }: { videoUrl?: string, title?: string }) => {
    if (!videoUrl || videoUrl.trim() === '') return null;
    return (
        <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-[50vh] md:h-[70vh] bg-gray-900 overflow-hidden border-t border-b border-gray-100 will-change-transform"
        >
            <motion.video 
                src={videoUrl} 
                autoPlay loop muted playsInline preload="none"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="w-full h-full object-cover opacity-60" 
            />
            {title && (
                <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white text-4xl md:text-7xl font-serif tracking-[5px] uppercase drop-shadow-2xl font-bold"
                    >
                        {title}
                    </motion.h2>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 z-10"></div>
        </motion.section>
    );
};

// 🚨 HERO SECTION (VIDEO POSTER OPTIMIZATION)
const Isolated4DHero = ({ config }: { config: any }) => {
  const heroRef = useRef(null);
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const rawSlides = config?.heroSlides || [];
  const slides = (rawSlides.length > 0 && rawSlides[0]?.url?.length > 5) 
    ? rawSlides 
    : [{ type: 'video', url: 'https://cdn.pixabay.com/video/2020/05/24/40092-424840899_large.mp4', heading: 'PREMIUM WATCHES' }];
  
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.5 });

  const textScale = useTransform(smoothScroll, [0, 0.8], [1, 1.3]); 
  const textOpacity = useTransform(smoothScroll, [0, 0.6], [1, 0]);
  const videoScale = useTransform(smoothScroll, [0, 1], [1, 1.1]);

  useEffect(() => {
    if (!currentSlide || slides.length <= 1) return; 
    const timer = setInterval(() => { 
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length); 
    }, 6000); 
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]);

  return (
    <section 
        ref={heroRef} 
        onClick={() => router.push('/shop')} 
        className="relative h-[100vh] md:h-[120vh] w-full bg-black cursor-pointer overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        
        <motion.div 
            style={{ scale: textScale, opacity: textOpacity }} 
            className="absolute z-30 text-center pointer-events-none w-full px-4"
        >
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlideIndex} 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }} 
                transition={{ duration: 0.8 }} 
              >
                <p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-[15px] md:tracking-[20px] mb-6 drop-shadow-md">ESSENTIAL</p>
                <h2 className="text-5xl md:text-[130px] lg:text-[160px] font-serif leading-none tracking-tighter text-white font-bold max-w-[95vw] mx-auto drop-shadow-2xl">
                  {currentSlide?.heading || 'Premium Watches'}
                </h2>
                <div className="mt-12">
                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-[6px] animate-pulse">Click Here to Shop</p>
                </div>
              </motion.div>
            </AnimatePresence>
        </motion.div>
        
        <motion.div style={{ scale: videoScale }} className="absolute inset-0 w-full h-full z-10 overflow-hidden bg-black pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlideIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 w-full h-full">
              {currentSlide?.type === 'image' ? (
                 <img 
                    src={currentSlide.url} 
                    className="w-full h-full object-cover opacity-70" 
                    alt={`Essential Rush Banner - Slide ${currentSlideIndex + 1}`}
                 />
              ) : (
                 <video 
                   key={currentSlide?.url} 
                   src={currentSlide?.url}
                   autoPlay 
                   muted 
                   loop 
                   playsInline 
                   preload="auto" 
                   // ⚡ SPEED TRICK: Added poster so screen is never black while video buffers
                   poster="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2000"
                   className="w-full h-full object-cover opacity-70"
                 />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
        </motion.div>

        {slides.length > 1 && (
            <div className="absolute bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-40 flex gap-4 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md" onClick={(e)=>e.stopPropagation()}>
                {slides.map((_: any, i: number) => (
                    <button 
                        key={i} 
                        onClick={() => setCurrentSlideIndex(i)} 
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${i === currentSlideIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/80'}`} 
                    />
                ))}
            </div>
        )}
      </div>
    </section>
  );
};

const FadeUp = ({ children, delay = 0, className = "" }: any) => (
  <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay, ease: "easeOut" }} viewport={{ once: true, margin: "-50px" }} className={className}>{children}</motion.div>
);

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  
  const [liveWatches, setLiveWatches] = useState<any[]>([]); 
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_GALLERY_IMAGES); 
  const [promoVideos, setPromoVideos] = useState<string[]>(DEFAULT_PROMO_VIDEOS);
  const [config, setConfig] = useState<any>(null);
  const [liveCelebrities, setLiveCelebrities] = useState<any[]>([]);
  const [liveFaqs, setLiveFaqs] = useState<any[]>([]);
  const [flowingReviews, setFlowingReviews] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<any>(null);
  const [corporateInfo, setCorporateInfo] = useState<any>(null);
  const [legalPages, setLegalPages] = useState<any[]>([]);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ userName: '', comment: '', rating: 5 });
  const [reviewMedia, setReviewMedia] = useState<string[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [honeyPot, setHoneyPot] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showLuxuryToast = (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ show: true, message: msg, type });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  useEffect(() => {
    const fetchPersonalizedData = async () => {
      try {
        const ts = new Date().getTime();
        const [c, ai, rev, celebRes] = await Promise.all([
          fetch(`/api/cms?t=${ts}`).catch(()=>null),
          fetch(`/api/products?t=${ts}`).catch(()=>null),
          fetch(`/api/reviews?t=${ts}`).catch(()=>null),
          fetch(`/api/celebrity?t=${ts}`).catch(()=>null)
        ]);

        if(c?.ok) { 
            const res = await c.json(); 
            setConfig(res.data || {}); 
            if (res.data?.uiConfig) {
                document.documentElement.style.setProperty('--theme-primary', '#000000');
                document.documentElement.style.setProperty('--theme-bg', '#FAFAFA');
            }
            if (res.data?.galleryImages) setGalleryImages(res.data.galleryImages);
            if (res.data?.promotionalVideos) setPromoVideos(res.data.promotionalVideos); 
            if (res.data?.faqs) setLiveFaqs(res.data.faqs);
            if (res.data?.socialLinks) setSocialLinks(res.data.socialLinks);
            if (res.data?.corporateInfo) setCorporateInfo(res.data.corporateInfo);
            if (res.data?.legalPages) setLegalPages(res.data.legalPages);
        }
        if(celebRes?.ok) {
            const celebData = await celebRes.json();
            if (celebData.data) setLiveCelebrities(celebData.data);
        }
        if(ai?.ok) { 
           const res = await ai.json(); 
           setLiveWatches((res.data || []).sort((a:any, b:any) => (b.priority || 0) - (a.priority || 0)));
        }
        if(rev?.ok) {
           const revData = await rev.json();
           let pubRevs = (revData.data || []).filter((r:any) => r.visibility === 'public');
           const myLocalReviews = JSON.parse(localStorage.getItem('my_ghost_reviews') || '[]');
           const globalLocalRevs = myLocalReviews.filter((r:any) => r.product === 'GLOBAL');
           const finalLocal = globalLocalRevs.filter((localRev: any) => 
               !pubRevs.some((pubRev: any) => pubRev.userName === localRev.userName && pubRev.comment === localRev.comment)
           );
           setFlowingReviews([...finalLocal, ...pubRevs]);
        }
        setCart(JSON.parse(localStorage.getItem('luxury_cart') || '[]'));
        setIsDataLoading(false);
      } catch (e) { 
        console.error("Home Page Data Fetch Error:", e);
        setIsDataLoading(false); 
      }
    };
    fetchPersonalizedData();
  }, []);

  const dynamicBrands = useMemo(() => {
    const brandsSet = new Set(liveWatches.map(w => w.brand).filter(b => b));
    const arr = Array.from(brandsSet);
    return arr.length > 0 ? arr : LUXURY_BRANDS;
  }, [liveWatches]);

  const latestWatches = liveWatches.slice(0, 8); 

  const categories = useMemo(() => {
    const fetchedCats = config?.categories || [];
    const aiCats = liveWatches.map(w => w.category).filter(c => c);
    return ["ALL", ...Array.from(new Set([...fetchedCats, ...aiCats]))];
  }, [liveWatches, config]);

 const filteredWatches = useMemo(() => {
    return liveWatches.filter(w => {
      const catMatch = activeCategory === "ALL" || w.category === activeCategory;
      
      // 🚨 FIX: Made string methods completely safe from undefined crashes
      const safeName = w.name || "";
      const safeBrand = w.brand || "";
      
      const searchMatch = safeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          safeBrand.toLowerCase().includes(searchTerm.toLowerCase());
                          
      return catMatch && searchMatch;
    });
  }, [liveWatches, activeCategory, searchTerm]);

  const addToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'unauthenticated' || !session) {
        showLuxuryToast("Please Login to access the vault.", "error");
        setTimeout(() => router.push('/login'), 2000); 
        return;
    }

    const exists = cart.find(item => item._id === product._id);
    const newCart = exists ? cart.map(i => i._id === product._id ? {...i, qty: i.qty+1} : i) : [...cart, {...product, qty: 1}];
    setCart(newCart);
    localStorage.setItem('luxury_cart', JSON.stringify(newCart));
    
    showLuxuryToast(`${product.name} added to your collection.`, "success");

    try {
        const cartTotal = newCart.reduce((total, item) => total + (Number(item.offerPrice || item.price) * item.qty), 0);
        await fetch(`/api/cart/sync?t=${Date.now()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: newCart,
                totalAmount: cartTotal,
                user: { name: session.user?.name, email: session.user?.email, phone: (session.user as any)?.phone || '' }
            })
        });

        if (session?.user?.email || (session.user as any)?.phone) {
            await fetch(`/api/cart/verify-lead?t=${Date.now()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: session.user?.name || 'Guest',
                    email: session.user?.email || '',
                    phone: (session.user as any)?.phone || '',
                    cartItems: newCart,
                    cartTotal
                })
            });
        }
    } catch (err) {
        console.error("Cart sync failed");
    }
  };

  const handleCustomerMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (data.success && data.url) setReviewMedia(prev => [...prev, data.url]);
          else showLuxuryToast("Upload failed.", "error");
      } catch(err) { showLuxuryToast("Network error.", "error"); } finally { setIsUploadingMedia(false); }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeyPot.length > 0) return setReviewStatus('success'); 
    if (!reviewForm.userName || !reviewForm.comment) return showLuxuryToast("Fill details.", "error");

    setReviewStatus('submitting');
    try {
        const payload = { ...reviewForm, media: reviewMedia, product: 'GLOBAL', visibility: 'pending' };
        const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) {
            const localReview = { ...payload, isGhost: true };
            setFlowingReviews(prev => [localReview, ...prev]);
            const existingLocal = JSON.parse(localStorage.getItem('my_ghost_reviews') || '[]');
            localStorage.setItem('my_ghost_reviews', JSON.stringify([localReview, ...existingLocal]));
            setReviewStatus('success');
            setTimeout(() => { setIsReviewModalOpen(false); setReviewStatus('idle'); setReviewForm({ userName: '', comment: '', rating: 5 }); setReviewMedia([]); }, 2000);
        }
    } catch (err) { setReviewStatus('error'); }
  };

  return (
    <div className="bg-[#FAFAFA] text-black font-sans selection:bg-black selection:text-white overflow-x-hidden scroll-smooth">
      
      <LuxuryToast show={toast.show} message={toast.message} type={toast.type} />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-[1000]" style={{ scaleX }} />

      {/* 🌟 FULL SCREEN MENU 🌟 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1100] bg-black/70 backdrop-blur-3xl flex flex-col p-8 md:p-24 overflow-hidden border-t border-[#D4AF37]/30"
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(212,175,55,0.25),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.10),transparent_40%),linear-gradient(to_bottom,rgba(0,0,0,0.65),rgba(0,0,0,0.9))]"
            />
            <div aria-hidden className="absolute inset-x-0 top-6 h-px bg-[#D4AF37]/30" />
            <div aria-hidden className="absolute inset-x-0 bottom-10 h-px bg-[#D4AF37]/20" />

            <div className="relative z-10 flex justify-end">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-4 rounded-full border border-[#D4AF37]/35 bg-black/25 text-[#D4AF37] hover:text-black hover:bg-[#D4AF37] hover:rotate-90 transition-all duration-500 shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"
              >
                <X size={35} />
              </button>
            </div>

            <nav className="relative z-10 flex-1 flex flex-col justify-center space-y-10 md:space-y-14">
                {["Home", "Shop Watches", "About Us", "My Account"].map((m, i) => (
                    <motion.div key={m} initial={{x: -50, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{delay: i * 0.1}}>
                        <Link
                          href={m === "Home" ? "/" : m === "Shop Watches" ? "/shop" : m === "My Account" ? "/account" : "#ourstory"}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-white text-5xl md:text-8xl font-serif font-bold hover:text-[#D4AF37] transition-all tracking-tight block whitespace-nowrap leading-[0.95] drop-shadow-[0_0_18px_rgba(212,175,55,0.22)]"
                        >
                          {m}
                        </Link>
                    </motion.div>
                ))}
            </nav>
            <div className="relative z-10 mt-auto border-t border-white/10 pt-8 flex justify-between items-center">
              <div className="flex gap-8">
                <Instagram className="text-white/50 hover:text-[#D4AF37] cursor-pointer transition-colors" />
                <Facebook className="text-white/50 hover:text-[#D4AF37] cursor-pointer transition-colors" />
              </div>
              <p className="text-white/55 text-[10px] font-bold uppercase tracking-[5px]">
                Essential Rush
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 REVIEW MODAL 🌟 */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[1200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
            <motion.div initial={{scale:0.95}} animate={{scale:1}} className="bg-white p-8 md:p-12 rounded-[30px] w-full max-w-lg relative shadow-2xl">
               <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 bg-gray-100 text-gray-500 rounded-full p-2 hover:bg-black hover:text-white transition-all"><X size={20}/></button>
               {reviewStatus === 'success' ? (
                   <div className="text-center py-10"><CheckCircle size={60} className="text-green-500 mx-auto mb-4" /><h3 className="text-2xl font-serif text-black mb-2 font-bold">Review Sent!</h3><p className="text-gray-500 text-sm">Thank you for your thoughts.</p></div>
               ) : (
                   <>
                       <h3 className="text-2xl font-serif font-bold text-black mb-6">Write a Review</h3>
                       <div className="space-y-4">
                           <div><label className="text-xs font-bold text-gray-500 mb-1 block">Name</label><input value={reviewForm.userName} onChange={e=>setReviewForm({...reviewForm, userName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="John Doe"/></div>
                           <div><label className="text-xs font-bold text-gray-500 mb-1 block">Rating</label><div className="flex gap-2">{[1,2,3,4,5].map(star => (<button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className={`transition-transform hover:scale-110 ${reviewForm.rating >= star ? 'text-black' : 'text-gray-200'}`}><Star size={28} fill={reviewForm.rating >= star ? "currentColor" : "none"} /></button>))}</div></div>
                           <div><label className="text-xs font-bold text-gray-500 mb-1 block">Review</label><textarea value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm, comment: e.target.value})} rows={3} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black custom-scrollbar" placeholder="What do you think?"/></div>
                           <div className="border-t border-gray-100 pt-4">
                               <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2"><Camera size={14}/> Add Photo/Video</label>
                               <div className="flex flex-wrap gap-4">
                                   {reviewMedia.map((url: string, idx: number) => (
                                       <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 group">
                                           {url.match(/\.(mp4|webm|mov)$/i) ? 
                    <video 
                        src={url} 
                        className="w-full h-full object-cover" 
                        playsInline
                        preload="none"
                        muted
                        aria-label={`Review media ${idx + 1}`}
                    /> : 
                    <img 
                        src={url} 
                        className="w-full h-full object-cover" 
                        alt={`Review media ${idx + 1}`}
                    />
                }
                                           <button onClick={()=>setReviewMedia(reviewMedia.filter(x => x !== url))} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"><Trash2 size={14}/></button>
                                       </div>
                                   ))}
                                   <div className="relative w-16 h-16 rounded-xl border border-gray-300 hover:border-black flex flex-col items-center justify-center cursor-pointer bg-gray-50">{isUploadingMedia ? <RefreshCcw size={16} className="text-black animate-spin"/> : <><UploadCloud size={16} className="text-gray-500"/><span className="text-[8px] font-bold text-gray-500">Upload</span></>}<input type="file" accept="image/*,video/*" onChange={handleCustomerMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploadingMedia}/></div>
                               </div>
                           </div>
                           <button onClick={handleReviewSubmit} disabled={reviewStatus === 'submitting' || isUploadingMedia} className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 text-xs mt-2">{reviewStatus === 'submitting' ? 'Sending...' : 'Send Review'}</button>
                       </div>
                   </>
               )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 HEADER STACK 🌟 */}
      <div className="bg-[#050505] text-white py-2.5 px-4 md:px-12 flex justify-between items-center text-[8px] md:text-[9px] font-bold uppercase tracking-[3px] z-[601] relative border-b border-gray-800">
        <div className="flex items-center gap-2"><Lock size={10}/> Safe checkout</div>
        <div className="hidden sm:block text-gray-300">Free Shipping in India</div>
        <div className="flex gap-4"><span>Cash on Delivery</span></div>
      </div>

      <nav className={`fixed w-full z-[600] transition-all duration-500 ease-in-out ${isScrolled ? 'top-0 h-16 md:h-20 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm' : 'top-9 md:top-10 h-20 md:h-28 bg-transparent'}`}>
        <div className="flex items-center justify-between px-4 md:px-12 h-full relative">
          <div className="flex items-center gap-6">
            <button onClick={()=>setIsMenuOpen(true)} className={`p-2 -ml-2 rounded-full transition-all active:scale-95 ${isScrolled ? 'text-black hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                <Menu size={24}/>
            </button>
            <div className={`hidden lg:flex gap-8 text-[10px] font-bold uppercase tracking-[3px] ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
              <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
              <Link href="#ourstory" className="hover:text-black transition-colors">About Us</Link>
            </div>
          </div>
          
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <h1 className={`text-xl md:text-3xl font-serif font-black tracking-[6px] md:tracking-[10px] uppercase transition-all ${isScrolled ? 'text-black' : 'text-white drop-shadow-md'}`}>Essential</h1>
          </Link>
          
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/account" className={`hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[2px] transition-all border ${isScrolled ? 'bg-black text-white border-black' : 'bg-white/20 text-white border-white/30 backdrop-blur-md hover:bg-white hover:text-black'}`}>
               <ShieldCheck size={14} /> Account
            </Link>
            <div className="relative cursor-pointer group p-2" onClick={() => router.push('/checkout')}>
              <ShoppingBag size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isScrolled ? 'text-black' : 'text-white'}`}/>
              {cart.length > 0 && <span className="absolute top-0 right-0 bg-black text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow-md border border-white">{cart.length}</span>}
            </div>
          </div>
        </div>
      </nav>

      <Isolated4DHero config={config} />

      <CinematicBreak videoUrl={promoVideos[0]} title="Quality Watches" />

      {/* 🌟 BRANDS 🌟 */}
      <section className="bg-white py-10 border-b border-gray-100 overflow-hidden relative z-[40]">
        <div className="flex w-[200%]">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 30, repeat: Infinity }} className="flex gap-12 md:gap-24 items-center px-10 will-change-transform">
            {dynamicBrands.concat(dynamicBrands).map((b: any, i: number) => (
              <div key={`brand-${i}`} className="flex items-center gap-6 group cursor-default">
                 <span className="text-xl md:text-3xl font-serif italic tracking-tighter whitespace-nowrap text-gray-300 group-hover:text-black transition-colors duration-500">{b}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🌟 NEW ARRIVALS (WITH SKELETONS) 🌟 */}
      <section className="py-20 md:py-32 relative overflow-hidden border-b border-gray-200">
         <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2000" 
               className="w-full h-full object-cover opacity-30 grayscale" 
               alt="Essential Rush Heritage Collection Background"
            />
             <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA]/90 to-[#FAFAFA]"></div>
         </div>

         <div className="relative z-10 px-6 md:px-16 max-w-[1600px] mx-auto mb-12 flex justify-between items-end">
            <div>
               <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[5px] mb-2">Just Landed</p>
               <h2 className="text-4xl md:text-6xl font-serif text-black tracking-tight font-bold drop-shadow-sm">New Arrivals.</h2>
            </div>
            <Link href="/shop" className="text-xs font-bold uppercase border-b-2 border-black pb-1 hover:text-gray-500 transition-all hidden md:block">Shop All</Link>
         </div>

         <div className="relative z-10 w-full overflow-x-auto custom-scrollbar snap-x snap-mandatory scroll-pl-6 md:scroll-pl-16 pb-10">
             <div className="flex gap-6 md:gap-8 px-6 md:px-16 w-max">
                 {/* ⚡ SPEED TRICK: SKELETONS FOR NEW ARRIVALS */}
                 {isDataLoading ? (
                     Array.from({ length: 4 }).map((_, i) => (
                         <div key={`skel-${i}`} className="w-[260px] md:w-[340px] shrink-0 snap-start bg-white/95 backdrop-blur-md rounded-[20px] p-6 border border-gray-200 shadow-sm animate-pulse flex flex-col">
                             <div className="h-56 md:h-72 bg-gray-100 rounded-2xl mb-6"></div>
                             <div className="h-3 w-1/3 bg-gray-200 rounded mb-3"></div>
                             <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                             <div className="mt-auto flex justify-between items-center border-t border-gray-100 pt-4">
                                 <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                                 <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                             </div>
                         </div>
                     ))
                 ) : latestWatches.length > 0 ? (
                     latestWatches.map((watch: any, i: number) => (
                         <div key={`horiz-${i}`} onClick={()=>router.push(`/product/${watch.slug || watch._id}`)} className="w-[260px] md:w-[340px] shrink-0 snap-start bg-white/95 backdrop-blur-md rounded-[20px] p-6 border border-gray-200 group hover:border-black hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col will-change-transform shadow-lg">
                            <div className="h-56 md:h-72 bg-gray-50/50 rounded-2xl mb-6 p-6 flex items-center justify-center relative overflow-hidden">
                                {watch.badge && <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full z-10 shadow-sm">{watch.badge}</span>}
                                {/* ⚡ SPEED TRICK: Fetch priority on top watches */}
                                <img 
                                    src={watch.imageUrl || (watch.images && watch.images[0])} 
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                                    loading={i < 2 ? "eager" : "lazy"} 
                                    fetchPriority={i < 2 ? "high" : "auto"}
                                    alt={`${watch.brand} ${watch.name} - Premium Timepiece`}
                                />
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-1">{watch.brand}</p>
                            <h4 className="text-lg md:text-xl font-serif text-black leading-tight line-clamp-1 mb-4 font-bold">{watch.name}</h4>
                            <div className="mt-auto flex justify-between items-center border-t border-gray-100 pt-4">
                                <p className="font-bold text-lg md:text-xl text-black">₹{Number(watch.offerPrice || watch.price).toLocaleString()}</p>
                                <button onClick={(e) => addToCart(watch, e)} className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all active:scale-95 shadow-md">
                                    <Plus size={16}/>
                                </button>
                            </div>
                         </div>
                     ))
                 ) : (
                     <p className="text-gray-500 font-serif italic py-10 px-6">New arrivals dropping soon.</p>
                 )}
             </div>
         </div>
      </section>

      <CinematicBreak videoUrl={promoVideos[1]} title="Premium Selection" />

      {/* 🌟 COLLECTION (WITH SKELETONS) 🌟 */}
      <section id="ourcollection" className="py-20 md:py-32 relative overflow-hidden bg-white">
        {promoVideos[2] && (
            <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0 opacity-[0.03] pointer-events-none">
                <video src={promoVideos[2]} autoPlay loop muted playsInline preload="none" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
            </div>
        )}

        <div className="relative z-10 px-6 md:px-16 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-gray-200 pb-8">
              <div className="mb-8 md:mb-0">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[5px] mb-2">Shop Now</p>
                <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-black font-bold">The Shop.</h2>
              </div>
              
              <div className="w-full md:w-auto flex flex-col items-end gap-4">
                 <div className="flex flex-wrap gap-2 justify-start md:justify-end w-full">
                   {categories.map((cat: any, i: number) => (
                     <button key={`cat-${i}`} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeCategory === cat ? 'bg-black text-white shadow-md' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-black hover:text-black'}`}>{cat}</button>
                   ))}
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
             {/* ⚡ SPEED TRICK: SKELETONS FOR SHOP GRID */}
             {isDataLoading ? (
                 Array.from({ length: 8 }).map((_, i) => (
                     <div key={`shop-skel-${i}`} className="bg-white/90 p-4 md:p-6 rounded-[20px] border border-gray-200 h-full flex flex-col animate-pulse">
                         <div className="aspect-square bg-gray-100 rounded-xl mb-6"></div>
                         <div className="h-3 w-1/4 bg-gray-200 rounded mb-2"></div>
                         <div className="h-5 w-3/4 bg-gray-200 rounded mb-4"></div>
                         <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
                             <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
                             <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                         </div>
                     </div>
                 ))
             ) : filteredWatches.length === 0 ? (
                 <div className="col-span-full py-32 text-center flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm rounded-[30px] border border-gray-200">
                    <Sparkles size={40} className="text-gray-300 mb-6"/>
                    <h3 className="text-2xl font-serif text-black mb-3 font-bold">No watches found</h3>
                    <p className="text-gray-500 text-sm max-w-sm px-4">Try selecting a different category.</p>
                 </div>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {filteredWatches.map((watch: any, i: number) => (
                    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{opacity:0}} transition={{ duration: 0.5 }} key={watch._id || i} className="group bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-[20px] border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-500 flex flex-col h-full relative cursor-pointer" onClick={() => router.push(`/product/${watch.slug || watch._id}`)}>
                      
                      {watch.badge && <span className="absolute top-4 left-4 bg-black text-white text-[8px] font-bold px-2.5 py-1 rounded-md uppercase z-20 shadow-sm">{watch.badge}</span>}
                      
                      <div className="flex aspect-square bg-gray-50/80 rounded-xl overflow-hidden mb-6 items-center justify-center p-6 relative will-change-transform">
                        <img 
                                src={watch.imageUrl || (watch.images && watch.images[0])} 
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                                loading="lazy" 
                                alt={`${watch.brand} ${watch.name} - Premium Timepiece`}
                            />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[2px] mb-1">{watch.brand}</p>
                            <h4 className="text-lg md:text-xl font-serif text-black leading-tight mb-4 font-bold line-clamp-2">{watch.name}</h4>
                        </div>
                        <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Price</p>
                            <p className="text-lg md:text-2xl text-black font-bold tracking-tight">₹{Number(watch.offerPrice || watch.price).toLocaleString()}</p>
                          </div>
                          <button onClick={(e) => addToCart(watch, e)} className="w-10 h-10 bg-gray-100 text-black rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center active:scale-90">
                             <Plus size={18}/>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
        </div>
      </section>

      {/* 🌟 GALLERY 🌟 */}
      <section className="py-24 bg-[#FAFAFA] border-t border-gray-200 hidden md:flex items-center justify-center">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-10 px-10">
          <motion.div style={{ y: y1 }} className="w-1/3 flex flex-col gap-10 pt-16 will-change-transform">
            <img src={galleryImages[0]} className="w-full h-[400px] object-cover rounded-[30px] shadow-lg" />
            <img src={galleryImages[3]} className="w-full h-[300px] object-cover rounded-[30px] shadow-lg" />
          </motion.div>
          <div className="w-1/3 flex flex-col gap-10">
            <div className="text-center py-10 px-6">
              <FadeUp><p className="text-gray-500 text-[10px] font-bold uppercase tracking-[10px] mb-4">Design</p></FadeUp>
              <FadeUp delay={0.1}><h2 className="text-5xl lg:text-7xl font-serif tracking-tight mb-6 font-bold text-black">Modern <br/><span className="text-gray-400 italic">Styles.</span></h2></FadeUp>
            </div>
            <img src={galleryImages[2]} className="w-full h-[500px] object-cover rounded-[40px] shadow-lg" />
          </div>
          <motion.div style={{ y: y2 }} className="w-1/3 flex flex-col gap-10 pt-32 will-change-transform">
            <img src={galleryImages[4]} className="w-full h-[450px] object-cover rounded-[30px] shadow-lg" />
            <img src={galleryImages[5]} className="w-full h-[350px] object-cover rounded-[30px] shadow-lg" />
          </motion.div>
        </div>
      </section>

      {/* 🌟 OUR STORY 🌟 */}
      <section id="ourstory" className="py-24 md:py-40 bg-black text-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className={config?.aboutConfig?.alignment === 'right' ? 'lg:order-2 text-right' : config?.aboutConfig?.alignment === 'center' ? 'text-center col-span-full max-w-4xl mx-auto' : 'text-left'}>
            <FadeUp>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-[10px] mb-6 flex items-center gap-4">
                    <span className="w-8 h-px bg-white/50 hidden md:block"></span> {config?.aboutConfig?.title || "ABOUT US"}
                </p>
            </FadeUp>
            <FadeUp delay={0.1}>
                <h2 className="text-5xl md:text-8xl font-serif leading-[1] tracking-tight mb-8 text-white font-bold">
                    Built to <br/><span className="text-gray-400 italic">Last.</span>
                </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
                <p className="text-white/70 text-lg md:text-2xl leading-relaxed font-serif max-w-3xl">
                  {(config?.aboutConfig?.content || "We bring the world's best watches directly to you. Every piece is guaranteed authentic and checked for quality.").split(' ').map((word: string, idx: number) => {
                     const isBold = config?.aboutConfig?.boldWords?.split(',').map((w:string)=>w.trim().toLowerCase()).includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''));
                     return isBold ? <strong key={`bold-${idx}`} className="font-bold text-white"> {word} </strong> : <span key={`reg-${idx}`}> {word} </span>;
                  })}
                </p>
            </FadeUp>
          </div>
          {config?.aboutConfig?.alignment !== 'center' && (
              <FadeUp delay={0.3} className="h-[400px] md:h-[600px] w-full bg-white/5 rounded-[40px] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1200" className="w-full h-full object-cover opacity-80 hover:scale-105 transition-all duration-[2s]" alt="Story" />
              </FadeUp>
          )}
        </div>
      </section>

      <CinematicBreak videoUrl={promoVideos[3]} />

      {/* 🌟 BRAND AMBASSADORS 🌟 */}
      <section className="py-24 md:py-40 bg-white text-black border-t border-gray-100 relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full overflow-hidden opacity-[0.02] pointer-events-none z-0 flex whitespace-nowrap will-change-transform">
            <motion.h2 animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 50, repeat: Infinity }} className="text-[100px] md:text-[250px] font-serif italic text-black font-black">
                TRUSTED BY MANY • MODERN STYLES • TRUSTED BY MANY • 
            </motion.h2>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-10 relative z-10 mb-20 text-center">
            <FadeUp>
                <p className="text-gray-500 uppercase tracking-[15px] text-[10px] font-bold mb-6">WORN BY LEADERS</p>
                <h2 className="text-5xl md:text-[100px] font-serif text-black tracking-tight leading-none font-bold">Trusted Faces.</h2>
            </FadeUp>
        </div>

        <div className="relative w-full overflow-hidden flex z-20 py-10">
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-[200px] bg-gradient-to-r from-white to-transparent z-30 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-[200px] bg-gradient-to-l from-white to-transparent z-30 pointer-events-none"></div>

            <div className="flex w-[300%] md:w-[200%]">
                <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 35, repeat: Infinity }} className="flex gap-6 md:gap-12 items-stretch px-8 will-change-transform hover:[animation-play-state:paused]">
                    {liveCelebrities.length === 0 ? (
                        [1, 2, 3, 4, 5].map((_, i) => <div key={i} className="w-[240px] md:w-[350px] aspect-[3/4] bg-gray-100 rounded-[30px] animate-pulse"></div>)
                    ) : (
                        Array(4).fill(liveCelebrities).flat().map((celeb: any, i: number) => (
                            <div key={`${celeb._id}-${i}`} className="w-[240px] md:w-[380px] aspect-[3/4] relative group rounded-[30px] overflow-hidden shrink-0 shadow-lg cursor-pointer">
                                {(celeb.imageUrl || celeb.img) && <img src={celeb.imageUrl || celeb.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[1s] relative z-10" alt={celeb.name} />}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end z-20">
                                    <h4 className="text-white text-3xl font-serif mb-1 font-bold">{celeb.name}</h4>
                                    <span className="text-[10px] uppercase font-bold tracking-[2px] text-gray-300">{celeb.title || celeb.watch}</span>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
      </section>

 {/* 🌟 REVIEWS 🌟 */}
      <section id="reviews" className="py-24 md:py-40 relative overflow-hidden border-t border-gray-200">
          {promoVideos[4] && (
              <div className="absolute inset-0 z-0">
                 <video src={promoVideos[4]} autoPlay loop muted playsInline preload="none" className="w-full h-full object-cover opacity-80" />
                 <div className="absolute inset-0 bg-white/90 backdrop-blur-xl"></div>
              </div>
          )}

          <div className="text-center mb-20 relative z-10 px-6">
             <h2 className="text-5xl md:text-8xl font-serif mb-6 text-black tracking-tight font-bold">Customer Reviews.</h2>
             <button onClick={() => setIsReviewModalOpen(true)} className="mt-8 px-10 py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[3px] hover:bg-gray-800 transition-all flex items-center justify-center mx-auto gap-3">
                 <Camera size={16}/> Write a Review
             </button>
          </div>
          {flowingReviews.length > 0 && (
              <div className="flex w-[300%] md:w-[200%] relative z-10">
                <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 40, repeat: Infinity }} className="flex gap-6 md:gap-10 items-stretch px-10 will-change-transform hover:[animation-play-state:paused]">
                    {flowingReviews.concat(flowingReviews).map((rev: any, i: number) => (
                        <div key={i} className="flex-shrink-0 w-[300px] md:w-[450px] bg-white/80 backdrop-blur-md border border-white p-8 md:p-12 rounded-[40px] flex flex-col justify-between shadow-lg hover:bg-white hover:shadow-2xl transition-all duration-500">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div><p className="font-serif text-2xl font-bold mb-1 text-black">{rev.userName}</p><p className="text-[9px] text-gray-500 font-bold uppercase tracking-[2px]">Verified Buyer</p></div>
                                    <ShieldCheck size={24} className="text-green-600"/>
                                </div>
                                <div className="flex gap-1 text-black mb-6">
                                    {[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={16} fill="currentColor"/>)}
                                </div>
                                <p className="text-gray-700 font-serif text-lg leading-relaxed line-clamp-4">"{rev.comment}"</p>
                                {rev.media && rev.media.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pt-6 mt-6 border-t border-gray-200">
                                        {rev.media.map((mediaUrl: string, mIdx: number) => (
                                            mediaUrl.match(/\.(mp4|webm|mov)$/i) ? <video key={mIdx} src={mediaUrl} playsInline preload="none" muted className="h-16 w-16 object-cover rounded-xl border border-gray-200 shrink-0" /> : <img key={mIdx} src={mediaUrl} className="h-16 w-16 object-cover rounded-xl border border-gray-200 shrink-0" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </motion.div>
              </div>
          )}
      </section>

      {/* 🌟 FAQ 🌟 */}
      <section className="py-24 md:py-40 relative overflow-hidden border-t border-gray-200">
        <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1508685096489-77a46807e604?q=80&w=2000" className="w-full h-full object-cover grayscale opacity-30" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/95 to-[#FAFAFA]/90"></div>
        </div>

        <div className="max-w-[1000px] mx-auto px-8 relative z-10">
           <FadeUp><h2 className="text-5xl md:text-7xl font-serif text-center mb-20 text-black tracking-tight font-bold drop-shadow-sm">Help & FAQs.</h2></FadeUp>
           <div className="space-y-4">
              {liveFaqs.length === 0 ? <p className="text-center text-gray-500">No questions yet.</p> : liveFaqs.map((faq: any, i: number) => (
                <div key={i} className={`bg-white/90 backdrop-blur-sm rounded-[30px] border transition-all duration-500 ${openFaq === i ? 'border-black shadow-lg' : 'border-gray-200 hover:border-gray-400'}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-8 md:p-10 text-left flex justify-between items-center group">
                    <span className="font-serif font-bold text-xl md:text-3xl pr-8 text-black">{faq.q}</span>
                    <div className={`p-4 rounded-full transition-all duration-500 ${openFaq === i ? 'bg-black text-white rotate-180' : 'bg-gray-50 text-gray-500 border border-gray-200 group-hover:border-black group-hover:text-black'}`}><ChevronDown size={24}/></div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{duration: 0.5}} className="px-8 md:px-10 pb-10"><p className="text-gray-600 font-sans text-base md:text-lg leading-relaxed border-t border-gray-200 pt-6">{faq.a}</p></motion.div>}
                  </AnimatePresence>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 🌟 FOOTER 🌟 */}
      <footer className="bg-black text-white pt-24 pb-12 border-t border-gray-800 relative z-20">
         <div className="max-w-[1600px] mx-auto px-8 md:px-20">
            <div className="flex flex-col md:flex-row justify-between border-b border-gray-800 pb-16 mb-16 gap-12">
                <div><h3 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-4">Stay Updated.</h3><p className="text-gray-400 text-sm md:text-base">Get emails about new watches and sales.</p></div>
                <div className="flex w-full md:w-auto h-max self-center border-b border-gray-600 focus-within:border-white transition-all pb-2"><input type="email" placeholder="Your Email" className="bg-transparent p-4 text-white outline-none text-lg w-full md:w-[300px]" /><button className="text-white font-bold uppercase tracking-[2px] text-xs px-6 hover:text-gray-300 transition-all">Sign Up</button></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 text-left">
                <div><h4 className="text-[10px] font-bold uppercase tracking-[4px] text-gray-500 mb-8">Shop</h4><ul className="space-y-4 text-sm font-medium"><li><Link href="/shop" className="hover:text-gray-300 transition-all">All Watches</Link></li><li><Link href="/checkout" className="hover:text-gray-300 transition-all">My Cart</Link></li></ul></div>
                <div><h4 className="text-[10px] font-bold uppercase tracking-[4px] text-gray-500 mb-8">Help</h4><ul className="space-y-4 text-sm font-medium"><li><Link href="/account" className="hover:text-gray-300 transition-all">My Account</Link></li><li><Link href="#faq" className="hover:text-gray-300 transition-all">Help Center</Link></li></ul></div>
                <div className="col-span-2 md:col-span-1"><h4 className="text-[10px] font-bold uppercase tracking-[4px] text-gray-500 mb-8">Legal</h4><ul className="space-y-4 text-sm font-medium">{legalPages.map((page:any, i:number) => (<li key={i}><Link href={`/policies/${page.slug}`} className="hover:text-gray-300 transition-all">{page.title}</Link></li>))}</ul></div>
                <div className="col-span-2 md:col-span-1"><h4 className="text-[10px] font-bold uppercase tracking-[4px] text-gray-500 mb-8">Contact</h4><div className="space-y-4 text-sm font-medium"><p className="text-white">{corporateInfo?.companyName || 'Essential Rush'}</p><p className="text-gray-400 flex items-center gap-3"><Mail size={16}/> {corporateInfo?.email || 'support@essential.com'}</p><div className="flex gap-6 mt-6"><Instagram className="text-gray-400 hover:text-white transition-all cursor-pointer" size={24} /><Facebook className="text-gray-400 hover:text-white transition-all cursor-pointer" size={24} /></div></div></div>
            </div>
            <div className="text-center border-t border-gray-800 pt-8"><p className="text-[10px] font-bold uppercase tracking-[5px] text-gray-600">© 2026 ESSENTIAL RUSH. ALL RIGHTS RESERVED.</p></div>
         </div>
      </footer>
    </div>
  );
}
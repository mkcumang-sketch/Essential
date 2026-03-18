"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Menu, Search, ShieldCheck, Shield, 
  RotateCcw, Award, ChevronDown, ShoppingBag, 
  Plus, Heart, Globe, Lock, Anchor, Eye, Sparkles, ChevronRight, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const LUXURY_BRANDS = ["ROLEX", "PATEK PHILIPPE", "AUDEMARS PIGUET", "RICHARD MILLE", "CARTIER", "OMEGA", "VACHERON CONSTANTIN"];

const DEFAULT_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1587836374828-cb4387df3c56?q=80&w=1000",
  "https://images.unsplash.com/photo-1508685096489-77a46807e604?q=80&w=1000",
  "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000",
  "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000",
  "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1000"
];

// ================= HERO PARALLAX ENGINE =================
const Isolated4DHero = ({ config }: { config: any }) => {
  const heroRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const slides = config?.heroSlides?.length > 0 ? config.heroSlides : [{ type: 'video', url: 'https://videos.pexels.com/video-files/5608078/5608078-uhd_2560_1440_30fps.mp4', heading: 'LUXURY' }];
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 40, damping: 20, mass: 0.2 });

  const textScale = useTransform(smoothScroll, [0, 0.7], [1, 30]); 
  const textOpacity = useTransform(smoothScroll, [0, 0.4, 0.6], [1, 1, 0]);
  const videoScale = useTransform(smoothScroll, [0, 0.8], [1.1, 0.6]);
  const videoRotateX = useTransform(smoothScroll, [0, 0.8], [0, 35]);
  const videoY = useTransform(smoothScroll, [0, 0.8], ["0%", "5%"]);
  const videoRadius = useTransform(smoothScroll, [0, 0.8], ["0px", "60px"]);

  useEffect(() => {
    if (!currentSlide) return;
    if (currentSlide.type === 'image') {
      const timer = setTimeout(() => { setCurrentSlideIndex((prev) => (prev + 1) % slides.length); }, 6000); 
      return () => clearTimeout(timer);
    } else if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentSlideIndex, currentSlide?.type, slides.length]);

  return (
    <section ref={heroRef} className="relative h-[350vh] w-full bg-[var(--theme-bg)]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[2000px]">
        
        {/* Cinematic Typography */}
        <AnimatePresence mode="wait">
          <motion.div key={currentSlideIndex} initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} style={{ scale: textScale, opacity: textOpacity }} className="absolute z-30 text-center pointer-events-none w-full">
            <p className="text-[var(--theme-primary)] text-[10px] md:text-xs font-black uppercase tracking-[30px] mb-8 drop-shadow-2xl">GLOBAL HERITAGE</p>
            <h2 className="text-8xl md:text-[180px] lg:text-[250px] font-serif leading-[0.8] tracking-tighter text-white italic font-black uppercase max-w-[95vw] mx-auto break-words drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {currentSlide?.heading || 'ESSENTIAL'}
            </h2>
          </motion.div>
        </AnimatePresence>
        
        {/* Dynamic Media Layer */}
        <motion.div style={{ scale: videoScale, rotateX: videoRotateX, y: videoY, borderRadius: videoRadius }} className="absolute inset-0 w-full h-full z-10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] origin-bottom border border-white/5 bg-black pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlideIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 w-full h-full">
              {currentSlide?.type === 'image' ? (
                 <img src={currentSlide.url} className="w-full h-full object-cover scale-110 grayscale filter contrast-125 brightness-50 opacity-70" />
              ) : (
                 <video ref={videoRef} autoPlay muted playsInline onEnded={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)} className="w-full h-full object-cover scale-110 grayscale filter contrast-125 brightness-50 opacity-70">
                   <source src={currentSlide?.url} type="video/mp4" />
                 </video>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-transparent to-black opacity-80"></div>
          <div className="absolute inset-0 bg-[var(--theme-primary)] mix-blend-overlay opacity-10"></div>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 flex gap-4 pointer-events-auto">
          {slides.map((slide: any, i: number) => (
             <div key={`ind-${i}`} onClick={() => setCurrentSlideIndex(i)} className={`h-1 cursor-pointer transition-all duration-700 rounded-full ${currentSlideIndex === i ? 'w-16 bg-[var(--theme-primary)]' : 'w-4 bg-white/20 hover:bg-white/50'}`}></div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 text-[var(--theme-primary)] flex flex-col items-center animate-bounce">
          <span className="text-[7px] font-black uppercase tracking-[5px] mb-2">Ascend</span>
          <div className="w-px h-12 bg-[var(--theme-primary)]"></div>
        </motion.div>
      </div>
    </section>
  );
};

// ================= CUSTOM CURSOR ENGINE =================
const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 700 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 700 });
  useEffect(() => {
    const handleMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return (
    <motion.div className="fixed top-0 left-0 w-10 h-10 border border-[var(--theme-primary)] rounded-full pointer-events-none z-[9999] hidden lg:flex items-center justify-center mix-blend-difference shadow-[0_0_15px_var(--theme-primary)]" style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}>
      <div className="w-1.5 h-1.5 bg-[var(--theme-primary)] rounded-full"></div>
    </motion.div>
  );
};

const FadeUp = ({ children, delay = 0, className = "" }: any) => (
  <motion.div initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }} viewport={{ once: true, margin: "-100px" }} className={className}>{children}</motion.div>
);

// ================= MAIN FRONTEND COMPONENT =================
export default function EssentialUltimateStore() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [cart, setCart] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [liveWatches, setLiveWatches] = useState<any[]>([]); 
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_GALLERY_IMAGES); 
  
  const [config, setConfig] = useState<any>(null);
  const [liveCelebrities, setLiveCelebrities] = useState<any[]>([]);
  const [liveFaqs, setLiveFaqs] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [globalTheme, setGlobalTheme] = useState({ primaryColor: '#D4AF37', bgColor: '#050505', fontFamily: 'serif' });

  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 600]);

  // Handle Scroll state for Navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Affiliate Tracking
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if(refCode) {
        localStorage.setItem('affiliate_ref', refCode.toUpperCase());
        fetch('/api/agents/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: refCode }) }).catch(()=>{});
    }
  }, []);

  // Fetch Global Data
  useEffect(() => {
    const fetchPersonalizedData = async () => {
      try {
        const ts = new Date().getTime();
        let sessionId = localStorage.getItem('er_session');
        if (!sessionId) {
            sessionId = `sess_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('er_session', sessionId);
        }

        const [c, ai, cl, f] = await Promise.all([
          fetch(`/api/cms?t=${ts}`, { cache: 'no-store' }).catch(()=>null),
          fetch(`/api/ai/recommendations?sessionId=${sessionId}&t=${ts}`, { cache: 'no-store' }).catch(()=>null),
          fetch(`/api/celebrities`).catch(()=>null),
          fetch(`/api/faqs`).catch(()=>null)
        ]);

        if(c?.ok) { 
            const res = await c.json(); 
            setConfig(res.data || {}); 
            if (res.data?.uiConfig) {
                setGlobalTheme(res.data.uiConfig);
                document.documentElement.style.setProperty('--theme-primary', res.data.uiConfig.primaryColor || '#D4AF37');
                document.documentElement.style.setProperty('--theme-bg', res.data.uiConfig.bgColor || '#050505');
            }
            if (res.data?.galleryImages && res.data.galleryImages.length === 6) {
                setGalleryImages(res.data.galleryImages);
            }
        }
        if(cl?.ok) { const res = await cl.json(); setLiveCelebrities(res.data || []); }
        if(f?.ok) { const res = await f.json(); setLiveFaqs(res.data || []); }
        
        if(ai?.ok) { 
           const res = await ai.json(); 
           setLiveWatches(res.recommended || []);
           setRecentlyViewed(res.recentlyViewed || []);
           setTrending(res.trending || []);
        }

        setCart(JSON.parse(localStorage.getItem('luxury_cart') || '[]'));
        setIsDataLoading(false);
      } catch (e) { setIsDataLoading(false); }
    };
    fetchPersonalizedData();
  }, []);

  const dynamicBrands = useMemo(() => {
    const brandsSet = new Set(liveWatches.map(w => w.brand).filter(b => b));
    const arr = Array.from(brandsSet);
    return arr.length > 0 ? arr : LUXURY_BRANDS;
  }, [liveWatches]);

  const categories = useMemo(() => {
    return ["ALL", ...Array.from(new Set(liveWatches.map(w => w.category).filter(c => c)))];
  }, [liveWatches]);

  const filteredWatches = useMemo(() => {
    return liveWatches.filter(w => {
      const catMatch = activeCategory === "ALL" || w.category === activeCategory;
      const searchMatch = w.name?.toLowerCase().includes(searchTerm.toLowerCase()) || w.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [liveWatches, activeCategory, searchTerm]);

  const addToCart = (product: any) => {
    const sessionId = localStorage.getItem('er_session');
    fetch('/api/ai/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, action: 'CART', productId: product._id, category: product.category }) }).catch(()=>{});

    const exists = cart.find(item => item._id === product._id);
    const newCart = exists ? cart.map(i => i._id === product._id ? {...i, qty: i.qty+1} : i) : [...cart, {...product, qty: 1}];
    setCart(newCart);
    localStorage.setItem('luxury_cart', JSON.stringify(newCart));
    
    // Smooth navigation to checkout instead of abrupt push
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => router.push('/checkout'), 300);
  };

  if (isDataLoading) return <div className="h-screen bg-[var(--theme-bg)] flex items-center justify-center"><div className="w-16 h-16 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin shadow-[0_0_30px_var(--theme-primary)]"></div></div>;

  return (
    <div className="bg-[#FAFAFA] text-[#050505] font-sans selection:bg-[var(--theme-primary)] selection:text-white overflow-x-hidden">
      <CustomCursor />

      {/* ================= TOP REQUISITION BAR ================= */}
      <div className="bg-[#00150F] text-[var(--theme-primary)] py-2.5 px-10 flex justify-between items-center text-[9px] font-black uppercase tracking-[4px] z-[200] relative border-b border-[var(--theme-primary)]/20">
        <div className="flex items-center gap-6"><span className="flex items-center gap-2 animate-pulse"><Lock size={12}/> Global Enterprise Node</span></div>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3 }} className="font-serif italic text-center hidden md:block">Private Allocations & Bespoke Sourcing Active</motion.div>
        <div className="text-right flex gap-6"><span>USD / EUR / INR</span><span>Secure System</span></div>
      </div>

      {/* ================= ENTERPRISE NAVIGATION ================= */}
      <nav className={`fixed w-full z-[150] transition-all duration-700 border-b ${isScrolled ? 'top-0 h-24 bg-white/95 backdrop-blur-3xl border-gray-200 shadow-xl' : 'top-10 h-32 bg-transparent border-transparent'}`}>
        <div className="flex items-center justify-between px-10 md:px-24 h-full">
          <div className="flex items-center gap-12">
            <Menu className={`cursor-pointer hover:scale-110 transition-transform ${isScrolled ? 'text-black' : 'text-white'}`} size={32} strokeWidth={1}/>
            <div className={`hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[6px] ${isScrolled ? 'text-gray-500' : 'text-white/70'}`}>
              <Link href="#vault" className={`transition-colors ${isScrolled ? 'hover:text-[var(--theme-primary)]' : 'hover:text-white'}`}>The Vault</Link>
              <Link href="#heritage" className={`transition-colors ${isScrolled ? 'hover:text-[var(--theme-primary)]' : 'hover:text-white'}`}>Story</Link>
              <Link href="#" className={`transition-colors ${isScrolled ? 'hover:text-[var(--theme-primary)]' : 'hover:text-white'}`}>Concierge</Link>
            </div>
          </div>
          
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <h1 className={`text-3xl font-serif font-black tracking-[15px] uppercase transition-colors ${isScrolled ? 'text-[#050505]' : 'text-white drop-shadow-2xl'}`}>Essential</h1>
            {!isScrolled && <span className="text-[7px] font-black uppercase tracking-[12px] text-[var(--theme-primary)] mt-2 drop-shadow-md">Global Timepieces</span>}
          </Link>
          
          <div className="flex items-center gap-8 md:gap-12">
            <a href="/godmode" className={`hidden md:flex items-center gap-3 px-8 py-3.5 rounded-full text-[9px] font-black uppercase tracking-[4px] transition-all shadow-xl cursor-pointer relative group ${isScrolled ? 'bg-[#050505] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-black' : 'bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white hover:text-black'}`}>
               <ShieldCheck size={14} className="group-hover:animate-pulse" /> Command OS
            </a>
            <div className="relative cursor-pointer group" onClick={() => router.push('/checkout')}>
              <ShoppingBag size={28} strokeWidth={1.5} className={`group-hover:scale-110 transition-transform ${isScrolled ? 'text-black' : 'text-white'}`}/>
              {cart.length > 0 && <span className="absolute -top-3 -right-3 bg-[var(--theme-primary)] text-black w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xl">{cart.length}</span>}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <Isolated4DHero config={config} />

      {/* ================= STATUS TICKER ================= */}
      <section className="bg-white py-20 border-b border-gray-100 overflow-hidden relative z-[40]">
        <div className="flex w-[200%]">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 80, repeat: Infinity }} className="flex gap-40 items-center px-10">
            {dynamicBrands.concat(dynamicBrands).map((b: any, i: number) => (
              <div key={`brand-${i}`} className="flex items-center gap-10">
                 <span className="text-3xl md:text-7xl font-serif italic tracking-tighter transition-all whitespace-nowrap text-gray-200 hover:text-black cursor-default">{b}</span>
                 <Sparkles size={20} className="text-[var(--theme-primary)] opacity-50"/>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= AI PERSONALIZED VAULT GRID ================= */}
      <section id="vault" className="py-48 px-6 md:px-16 max-w-[2000px] mx-auto bg-[#FAFAFA] relative overflow-hidden">
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-[var(--theme-primary)] blur-[300px] opacity-5 pointer-events-none"></div>

        <div className="flex flex-col xl:flex-row justify-between items-end mb-32 border-b border-gray-200 pb-16 relative z-10">
          <div className="text-left w-full xl:w-1/2">
            <h3 className="text-[var(--theme-primary)] text-[11px] font-black uppercase tracking-[15px] mb-8 flex items-center gap-6"><span className="w-16 h-[2px] bg-[var(--theme-primary)]"></span> Neural AI Curated</h3>
            <h2 className="text-7xl md:text-[140px] font-serif tracking-tighter leading-none text-[#050505] italic pr-10">The Global Vault.</h2>
          </div>
          
          <div className="w-full xl:w-auto mt-16 xl:mt-0 flex flex-col items-end gap-10">
             {/* Search */}
             <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-full border border-gray-200 shadow-sm w-full md:w-96">
                <Search size={18} className="text-gray-400"/>
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-xs font-black uppercase tracking-widest text-black w-full" placeholder="Search Registry..." />
             </div>
             {/* Categories */}
             <div className="flex flex-wrap gap-4 justify-end">
               {categories.map((cat: any, i: number) => (
                 <button key={`cat-${i}`} onClick={() => setActiveCategory(cat)} className={`px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 shadow-sm ${activeCategory === cat ? 'bg-[#00150F] text-[var(--theme-primary)] scale-105' : 'bg-white border border-gray-200 text-gray-500 hover:border-black hover:text-black'}`}>{cat}</button>
               ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 relative z-10">
          {filteredWatches.length === 0 ? (
             <div className="col-span-full py-32 text-center flex flex-col items-center justify-center">
                <Shield size={60} className="text-gray-200 mb-6"/>
                <p className="font-serif italic text-4xl text-gray-400">Vault Nodes Unreachable / Empty for this query.</p>
             </div>
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredWatches.map((watch: any, i: number) => (
                <motion.div key={watch._id || `watch-${i}`} layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.8 }} className="group bg-white p-10 rounded-[60px] border border-gray-100 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-[var(--theme-primary)]/30 transition-all duration-700 relative flex flex-col h-full overflow-hidden">
                  
                  {/* Tags */}
                  <div className="absolute top-10 left-10 z-20 flex flex-col gap-3">
                    {watch.stock < 3 && <span className="bg-red-500 text-white text-[8px] font-black uppercase tracking-[4px] px-4 py-2 rounded-full shadow-lg animate-pulse">Rare Asset</span>}
                    {watch.tags?.includes('Trending') && <span className="bg-[#00150F] text-[var(--theme-primary)] text-[8px] font-black uppercase tracking-[4px] px-4 py-2 rounded-full shadow-lg">Trending</span>}
                  </div>

                  {/* Image Area */}
                  <Link href={`/product/${watch.slug || watch._id}`} className="flex aspect-[4/5] bg-[#FDFDFD] rounded-[45px] overflow-hidden mb-10 items-center justify-center p-12 relative group cursor-pointer">
                    <motion.img whileHover={{ scale: 1.15, rotate: -4 }} transition={{ duration: 1, ease: "easeOut" }} src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)] relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
                    
                    {/* Hover Explore Button */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                       <span className="bg-white/90 backdrop-blur-md text-black px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">Explore <ArrowRight size={12}/></span>
                    </div>
                  </Link>

                  {/* Content Area */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                         <p className="text-[10px] font-black text-[var(--theme-primary)] uppercase tracking-[5px]">{watch.brand}</p>
                      </div>
                      <h4 className="text-3xl font-serif text-[#050505] leading-tight mb-6 tracking-tighter group-hover:text-[var(--theme-primary)] transition-colors">{watch.name || watch.title}</h4>
                    </div>
                    
                    <div className="flex justify-between items-end mt-auto pt-8 border-t border-gray-50">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">MSRP Valuation</p>
                        <div className="flex items-center gap-3">
                           <p className="text-3xl text-[#00150F] font-black tracking-tighter font-serif">₹{Number(watch.offerPrice || watch.price || watch.basePrice || 0).toLocaleString('en-IN')}</p>
                           {(watch.offerPrice && (watch.price || watch.basePrice) > watch.offerPrice) && <p className="text-gray-300 line-through text-xs font-black">₹{Number(watch.price || watch.basePrice || 0).toLocaleString('en-IN')}</p>}
                        </div>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); addToCart(watch); }} className="p-5 bg-[#050505] text-white rounded-3xl hover:bg-[var(--theme-primary)] hover:text-black transition-all duration-300 shadow-xl active:scale-90"><Plus size={24}/></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ================= DYNAMIC GALLERY OF PRECISION ================= */}
      <section className="py-64 bg-white overflow-hidden border-t border-gray-100">
        <div className="max-w-[2000px] mx-auto h-[180vh] flex gap-10 px-10">
          <motion.div style={{ y: y1 }} className="w-1/3 flex flex-col gap-10 pt-60">
            <img src={galleryImages[0]} className="w-full h-[60vh] object-cover rounded-[60px] shadow-2xl filter contrast-110" />
            <img src={galleryImages[3]} className="w-full h-[50vh] object-cover rounded-[60px] shadow-2xl filter contrast-110" />
            <img src={galleryImages[1]} className="w-full h-[70vh] object-cover rounded-[60px] shadow-2xl filter contrast-110" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="w-1/3 flex flex-col gap-10 -mt-[60vh]">
            <div className="text-center py-60 px-10">
              <FadeUp><p className="text-[var(--theme-primary)] text-[10px] font-black uppercase tracking-[15px] mb-8">Engineering</p></FadeUp>
              <FadeUp delay={0.2}><h2 className="text-7xl xl:text-[140px] font-serif tracking-tighter mb-10 leading-[0.9]">The Art <br/><span className="italic text-gray-300">Of Time</span></h2></FadeUp>
              <FadeUp delay={0.4}><p className="text-gray-500 font-serif italic text-2xl leading-relaxed">"Where microscopic mechanical engineering meets aesthetic transcendence."</p></FadeUp>
            </div>
            <img src={galleryImages[2]} className="w-full h-[80vh] object-cover rounded-[60px] shadow-2xl filter contrast-110" />
            <div className="bg-[#00150F] text-[var(--theme-primary)] p-20 rounded-[60px] shadow-2xl text-center relative overflow-hidden group">
               <Anchor size={80} strokeWidth={1} className="mx-auto mb-12 opacity-50 group-hover:scale-110 transition-transform duration-1000" />
               <h3 className="text-5xl font-serif italic mb-8 text-white">Marine Mastery</h3>
               <p className="text-white/60 text-xs tracking-[5px] leading-loose uppercase font-black">Tested at 3,900 meters <br/> below sea level.</p>
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--theme-primary)] blur-[100px] opacity-20 pointer-events-none"></div>
            </div>
          </motion.div>
          <motion.div style={{ y: y1 }} className="w-1/3 flex flex-col gap-10 pt-[50vh]">
            <img src={galleryImages[4]} className="w-full h-[80vh] object-cover rounded-[60px] shadow-2xl filter contrast-110" />
            <img src={galleryImages[5]} className="w-full h-[55vh] object-cover rounded-[60px] shadow-2xl filter contrast-110" />
          </motion.div>
        </div>
      </section>

      {/* ================= HERITAGE SECTION (CMS CONTROLLED) ================= */}
      <section id="heritage" className="py-64 bg-[#00150F] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] bg-[var(--theme-primary)] blur-[500px] opacity-10 rounded-full pointer-events-none"></div>
        <div className="max-w-[1800px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-40 items-center relative z-10">
          <div className={config?.aboutConfig?.alignment === 'right' ? 'lg:order-2 text-right' : config?.aboutConfig?.alignment === 'center' ? 'text-center col-span-full max-w-5xl mx-auto' : 'text-left'}>
            <FadeUp>
                <p className={`text-[var(--theme-primary)] text-[12px] font-black uppercase tracking-[20px] mb-12 flex items-center gap-6 ${config?.aboutConfig?.alignment === 'center' ? 'justify-center' : config?.aboutConfig?.alignment === 'right' ? 'justify-end' : ''}`}>
                    <span className="w-16 h-px bg-[var(--theme-primary)]"></span> {config?.aboutConfig?.title || "Our Genesis"}
                </p>
            </FadeUp>
            <FadeUp delay={0.2}>
                <h2 className="text-7xl lg:text-[140px] font-serif leading-[0.9] tracking-tighter mb-16 italic text-gray-100">
                    Legacy is a <br/><span className="text-[var(--theme-primary)] not-italic font-black">Masterpiece.</span>
                </h2>
            </FadeUp>
            <FadeUp delay={0.4}>
                <p className={`text-gray-400 text-3xl leading-[1.6] font-serif italic font-light ${config?.aboutConfig?.alignment === 'center' ? 'mx-auto' : ''}`}>
                  {(config?.aboutConfig?.content || "Essential Rush was founded to protect, curate, and distribute the world's most significant mechanical art pieces. We believe that true luxury is defined by the weight of its history and the precision of its future.").split(' ').map((word: string, idx: number) => {
                     const isBold = config?.aboutConfig?.boldWords?.split(',').map((w:string)=>w.trim().toLowerCase()).includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''));
                     return isBold ? <strong key={`bold-${idx}`} className="font-black not-italic text-white"> {word} </strong> : <span key={`reg-${idx}`}> {word} </span>;
                  })}
                </p>
            </FadeUp>
            <FadeUp delay={0.6}>
               <button className="mt-20 px-12 py-6 border border-[var(--theme-primary)] text-[var(--theme-primary)] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[var(--theme-primary)] hover:text-black transition-all duration-500">Discover More</button>
            </FadeUp>
          </div>
          {config?.aboutConfig?.alignment !== 'center' && (
              <FadeUp delay={0.5} className="relative group h-[1000px] w-full bg-white/5 rounded-[80px] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1200" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[3s]" alt="Heritage" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00150F] via-transparent to-[#00150F]/50"></div>
              </FadeUp>
          )}
        </div>
      </section>

      {/* ================= VISIONARIES (CELEBRITY CIRCLE) ================= */}
      <section className="py-64 bg-white border-t border-gray-100">
        <div className="max-w-[1900px] mx-auto px-10">
          <FadeUp>
             <div className="text-center mb-40">
                <h2 className="text-7xl md:text-[160px] font-serif mb-10 text-[#050505] tracking-tighter leading-[0.9] italic">Worn By <br/> Icons</h2>
                <p className="text-[var(--theme-primary)] uppercase tracking-[15px] text-[11px] font-black flex items-center justify-center gap-6"><span className="w-10 h-px bg-[var(--theme-primary)]"></span> THE CIRCLE OF ELITES <span className="w-10 h-px bg-[var(--theme-primary)]"></span></p>
             </div>
          </FadeUp>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {liveCelebrities.length === 0 ? (
               [1, 2, 3].map((_, i) => <div key={i} className="aspect-[3/4.5] bg-gray-100 rounded-[60px] animate-pulse"></div>)
            ) : liveCelebrities.map((celeb: any, i: number) => (
              <FadeUp key={celeb._id || i} delay={i * 0.2}>
                <div className="group relative aspect-[3/4.5] rounded-[80px] overflow-hidden bg-[#050505] shadow-2xl">
                  <img src={celeb.img} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent opacity-90 p-16 flex flex-col justify-end translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                      <p className="text-[var(--theme-primary)] text-[9px] font-black uppercase tracking-[8px] mb-4 flex items-center gap-2"><Award size={14}/> Verified Node</p>
                      <h4 className="text-white text-5xl font-serif mb-4 tracking-tighter">{celeb.name}</h4>
                      <div className="w-full h-px bg-white/20 mb-4"></div>
                      <span className="text-[11px] uppercase font-black tracking-[4px] text-gray-400">{celeb.watch}</span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-48 bg-[#FAFAFA] border-t border-gray-200 relative overflow-hidden">
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--theme-primary)] blur-[200px] opacity-10 rounded-full pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-10 relative z-10">
           <FadeUp><h2 className="text-6xl md:text-[100px] font-serif text-center mb-32 text-[#050505] tracking-tighter leading-none">Common <br/><span className="italic text-gray-400">Enquiries</span></h2></FadeUp>
           <div className="space-y-6">
              {liveFaqs.length === 0 ? <p className="text-center text-gray-400 font-serif italic text-2xl">No Enquiries registered.</p> : liveFaqs.map((faq: any, i: number) => (
                <div key={faq._id || i} className={`bg-white rounded-[40px] overflow-hidden border transition-all duration-500 shadow-sm ${openFaq === i ? 'border-[var(--theme-primary)] shadow-[0_20px_40px_rgba(0,0,0,0.05)]' : 'border-gray-100 hover:border-gray-300'}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-12 py-10 text-left flex justify-between items-center group transition-all">
                    <span className="font-serif italic text-3xl text-[#050505] tracking-tight group-hover:text-[var(--theme-primary)] transition-colors pr-10">{faq.q}</span>
                    <div className={`p-5 rounded-full transition-all duration-500 shrink-0 ${openFaq === i ? 'bg-[var(--theme-primary)] text-black rotate-180' : 'bg-[#FAFAFA] text-black group-hover:bg-gray-100'}`}><ChevronDown size={24}/></div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{duration: 0.4}} className="px-12 pb-12">
                          <div className="w-16 h-px bg-[var(--theme-primary)] mb-8"></div>
                          <p className="text-gray-500 text-xl font-serif leading-relaxed italic">{faq.a}</p>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ================= MASSIVE FOOTER ================= */}
      <footer className="bg-[#050505] text-white pt-64 pb-20 px-10 md:px-20 relative overflow-hidden">
         <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 text-white/[0.015] text-[300px] md:text-[500px] lg:text-[700px] font-serif font-black uppercase tracking-tighter w-full text-center pointer-events-none select-none leading-none">Essential</div>
         
         <div className="max-w-[1900px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32 relative z-10">
            <div className="lg:col-span-6">
               <div className="flex items-center gap-10 mb-20">
                  <span className="text-8xl md:text-[120px] text-[var(--theme-primary)] drop-shadow-[0_0_30px_var(--theme-primary)]">♞</span>
                  <h2 className="text-6xl md:text-8xl font-serif font-black tracking-[20px] uppercase leading-none">ESSENTIAL</h2>
               </div>
               <p className="text-gray-400 text-4xl md:text-5xl font-serif italic max-w-3xl leading-[1.2] tracking-tighter">"Legacy is not what we leave behind, it is what we choose to wear every single day."</p>
               <div className="mt-20 flex gap-6">
                  <a href="#" className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Globe size={20}/></a>
                  <a href="#" className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Anchor size={20}/></a>
               </div>
            </div>
            
            <div className="lg:col-span-3 space-y-16 lg:pl-10">
               <h4 className="text-[10px] font-black uppercase tracking-[10px] text-[var(--theme-primary)] flex items-center gap-4"><span className="w-8 h-px bg-[var(--theme-primary)]"></span> The Vault</h4>
               <ul className="space-y-8 text-gray-500 text-xs font-black tracking-[5px] uppercase">
                  <li><Link href="/" className="hover:text-white transition-colors">Global Catalogue</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Bespoke Sourcing</Link></li>
                  <li><a href="/godmode" className="hover:text-[var(--theme-primary)] transition-colors underline decoration-[var(--theme-primary)] decoration-2 underline-offset-8 mt-4 inline-block">Command Node OS</a></li>
               </ul>
            </div>
            
            <div className="lg:col-span-3 space-y-16">
               <h4 className="text-[10px] font-black uppercase tracking-[10px] text-[var(--theme-primary)] flex items-center gap-4"><span className="w-8 h-px bg-[var(--theme-primary)]"></span> Registry</h4>
               <ul className="space-y-8 text-gray-500 text-xs font-black tracking-[5px] uppercase">
                  <li><a href="#" className="hover:text-white transition-colors">Authentication Ledger</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Private Sales Protocol</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Legal Framework</a></li>
               </ul>
            </div>
         </div>

         <div className="max-w-[1900px] mx-auto mt-48 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
            <p className="text-[8px] font-black uppercase tracking-[8px] text-gray-600">© 2026 Essential Rush Enterprise. All Rights Reserved Globally.</p>
            <div className="flex gap-12 text-[8px] font-black uppercase tracking-[5px] text-gray-600">
               <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Node</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
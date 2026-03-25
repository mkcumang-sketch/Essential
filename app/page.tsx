"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Menu, Search, ShieldCheck, ShoppingBag, Plus, Sparkles, ChevronDown, Lock, X, Star, CheckCircle, 
  Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail, Linkedin, ArrowRight, Camera, UploadCloud, RefreshCcw, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { PhantomGuard } from '@/components/PhantomGuard';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// 🌟 SETTINGS & DEFAULTS
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

// 🌟 VIDEO BREAK COMPONENT (Simple English & Fast)
const CinematicBreak = ({ videoUrl, title }: { videoUrl?: string, title?: string }) => {
    if (!videoUrl || videoUrl.trim() === '') return null;
    return (
        <section className="relative w-full h-[60vh] md:h-[80vh] bg-black overflow-hidden border-t border-b border-white/10 will-change-transform">
            <video 
                src={videoUrl} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover opacity-60 scale-105" 
            />
            {title && (
                <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-white text-3xl md:text-6xl font-serif tracking-[10px] uppercase drop-shadow-2xl"
                    >
                        {title}
                    </motion.h2>
                </div>
            )}
        </section>
    );
};

// 🌟 HERO BANNER (Simple English & Clickable)
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

  const textScale = useTransform(smoothScroll, [0, 0.8], [1, 1.4]); 
  const textOpacity = useTransform(smoothScroll, [0, 0.6], [1, 0]);
  const videoScale = useTransform(smoothScroll, [0, 1], [1, 1.15]);

  useEffect(() => {
    if (!currentSlide) return;
    const timer = setInterval(() => { 
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length); 
    }, 6000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section 
        ref={heroRef} 
        onClick={() => router.push('/shop')} 
        className="relative h-[100vh] md:h-[120vh] w-full bg-[var(--theme-bg)] cursor-pointer will-change-transform overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlideIndex} 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.1 }} 
            transition={{ duration: 1.2 }} 
            style={{ scale: textScale, opacity: textOpacity }} 
            className="absolute z-30 text-center pointer-events-none w-full px-4"
          >
            <p className="text-[var(--theme-primary)] text-[10px] md:text-xs font-black uppercase tracking-[20px] mb-6">ESSENTIAL</p>
            <h2 className="text-6xl md:text-[130px] lg:text-[160px] font-serif leading-none tracking-tighter text-white italic font-black max-w-[95vw] mx-auto drop-shadow-2xl">
              {currentSlide?.heading || 'PREMIUM WATCHES'}
            </h2>
            <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-white/50 text-[10px] font-black uppercase tracking-[8px] animate-pulse">Click to Shop Now</p>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <motion.div style={{ scale: videoScale }} className="absolute inset-0 w-full h-full z-10 overflow-hidden bg-black pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlideIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 2 }} className="absolute inset-0 w-full h-full">
              {currentSlide?.type === 'image' ? (
                 <img src={currentSlide.url} className="w-full h-full object-cover opacity-60" alt="Hero Banner"/>
              ) : (
                 <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-60">
                   <source src={currentSlide?.url} type="video/mp4" />
                 </video>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-transparent to-black/50"></div>
        </motion.div>

        {slides.length > 1 && (
            <div className="absolute bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-40 flex gap-4 bg-black/40 px-6 py-3 rounded-full border border-white/10" onClick={(e)=>e.stopPropagation()}>
                {slides.map((_: any, i: number) => (
                    <button 
                        key={i} 
                        onClick={() => setCurrentSlideIndex(i)} 
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${i === currentSlideIndex ? 'bg-[#D4AF37] scale-150 shadow-[0_0_15px_rgba(212,175,55,1)]' : 'bg-white/30'}`} 
                    />
                ))}
            </div>
        )}
      </div>
    </section>
  );
};

const FadeUp = ({ children, delay = 0, className = "" }: any) => (
  <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay }} viewport={{ once: true, margin: "-100px" }} className={className}>{children}</motion.div>
);

function FrontPageStore() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Logic States
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

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ userName: '', comment: '', rating: 5 });
  const [reviewMedia, setReviewMedia] = useState<string[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [honeyPot, setHoneyPot] = useState("");

  // Performance Fix: Scroll Passive
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                document.documentElement.style.setProperty('--theme-primary', res.data.uiConfig.primaryColor || '#D4AF37');
                document.documentElement.style.setProperty('--theme-bg', res.data.uiConfig.bgColor || '#050505');
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
           setFlowingReviews(revData.data || []);
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

  const latestWatches = liveWatches.slice(0, 8); 

  const categories = useMemo(() => {
    const aiCats = liveWatches.map(w => w.category).filter(c => c);
    return ["ALL", ...Array.from(new Set(aiCats))];
  }, [liveWatches]);

  const filteredWatches = useMemo(() => {
    return liveWatches.filter(w => {
      const catMatch = activeCategory === "ALL" || w.category === activeCategory;
      const searchMatch = w.name?.toLowerCase().includes(searchTerm.toLowerCase()) || w.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [liveWatches, activeCategory, searchTerm]);

  const addToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 🌟 FIXED: Stop click conflict with Hero Banner
    const exists = cart.find(item => item._id === product._id);
    const newCart = exists ? cart.map(i => i._id === product._id ? {...i, qty: i.qty+1} : i) : [...cart, {...product, qty: 1}];
    setCart(newCart);
    localStorage.setItem('luxury_cart', JSON.stringify(newCart));
    alert("Added to Cart!");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.userName || !reviewForm.comment) return alert("Fill data.");
    setReviewStatus('submitting');
    try {
        const payload = { ...reviewForm, media: reviewMedia, product: 'GLOBAL', visibility: 'pending' };
        const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) setReviewStatus('success');
    } catch (err) { setReviewStatus('error'); }
  };

  if (isDataLoading) return <div className="h-screen bg-[var(--theme-bg)] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-[#FAFAFA] text-[#050505] font-sans selection:bg-[var(--theme-primary)] selection:text-white overflow-x-hidden scroll-smooth">

      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[var(--theme-primary)] origin-left z-[1000] shadow-[0_0_15px_rgba(212,175,55,0.8)]" style={{ scaleX }} />

      {/* 🌟 FULL FUNCTIONAL HAMBURGER OVERLAY 🌟 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-3xl flex flex-col p-10 md:p-24 overflow-hidden">
            <div className="flex justify-end"><button onClick={()=>setIsMenuOpen(false)} className="p-4 bg-white/5 rounded-full text-[#D4AF37] hover:rotate-90 transition-all duration-500"><X size={35} /></button></div>
            <nav className="flex-1 flex flex-col justify-center space-y-8 md:space-y-12">
                {["Home", "Shop", "Our Story", "My Account"].map((m, i) => (
                    <motion.div key={m} initial={{x: -50, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{delay: i * 0.1}}>
                        <Link href={m === "Home" ? "/" : m === "Shop" ? "/shop" : m === "My Account" ? "/account" : "#ourstory"} onClick={()=>setIsMenuOpen(false)} className="text-white text-5xl md:text-8xl font-serif italic font-black hover:text-[#D4AF37] transition-all tracking-tighter block">{m}.</Link>
                    </motion.div>
                ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 FIXED: NON-OVERLAPPING STACKED HEADER 🌟 */}
      <div className="bg-[#00150F] text-[var(--theme-primary)] py-3 px-6 md:px-12 flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase tracking-[4px] z-[601] relative border-b border-white/5">
        <div className="flex items-center gap-2"><Lock size={10}/> 100% SECURE STORE</div>
        <div className="hidden sm:block">FREE SHIPPING IN INDIA</div>
        <div className="flex gap-4"><span>CASH ON DELIVERY</span></div>
      </div>

      <nav className={`fixed w-full z-[600] transition-all duration-500 ease-in-out ${isScrolled ? 'top-0 h-16 md:h-20 bg-white/95 backdrop-blur-xl border-b border-gray-200' : 'top-10 md:top-12 h-20 md:h-28 bg-transparent'}`}>
        <div className="flex items-center justify-between px-6 md:px-16 h-full relative">
          <div className="flex items-center gap-6">
            {/* 🌟 MENU TRIGGER FIXED 🌟 */}
            <button onClick={()=>setIsMenuOpen(true)} className={`p-2 rounded-full transition-all active:scale-90 ${isScrolled ? 'text-black hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
                <Menu size={28}/>
            </button>
            <div className={`hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[5px] ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
              <Link href="/shop" className="hover:text-[var(--theme-primary)] transition-colors">All Watches</Link>
              <Link href="#ourstory" className="hover:text-[var(--theme-primary)] transition-colors">Our Story</Link>
            </div>
          </div>
          
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <h1 className={`text-2xl md:text-3xl font-serif font-black tracking-[10px] md:tracking-[15px] uppercase transition-all ${isScrolled ? 'text-black' : 'text-white drop-shadow-lg'}`}>Essential</h1>
          </Link>
          
          <div className="flex items-center gap-5 md:gap-10">
            <Link href="/account" className={`hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[3px] transition-all border ${isScrolled ? 'bg-black text-white border-black' : 'bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white hover:text-black'}`}>
               <ShieldCheck size={14} /> Account
            </Link>
            <div className="relative cursor-pointer group" onClick={() => router.push('/checkout')}>
              <ShoppingBag size={24} className={`transition-transform duration-300 group-hover:scale-110 ${isScrolled ? 'text-black' : 'text-white'}`}/>
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-md border-2 border-white">{cart.length}</span>}
            </div>
          </div>
        </div>
      </nav>

      <Isolated4DHero config={config} />

      <CinematicBreak videoUrl={promoVideos[0]} title="True Precision" />

      {/* 🌟 BRAND LOGOS SECTION 🌟 */}
      <section className="bg-white py-10 md:py-16 border-b border-gray-100 overflow-hidden relative z-[40]">
        <div className="flex w-[200%]">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 35, repeat: Infinity }} className="flex gap-16 md:gap-32 items-center px-10 will-change-transform">
            {dynamicBrands.concat(dynamicBrands).map((b: any, i: number) => (
              <div key={`brand-${i}`} className="flex items-center gap-8 group">
                 <span className="text-2xl md:text-4xl font-serif italic tracking-tighter whitespace-nowrap text-gray-200 group-hover:text-black transition-colors duration-500">{b}</span>
                 <Sparkles size={16} className="text-[var(--theme-primary)] opacity-30 group-hover:opacity-100 transition-opacity"/>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🌟 NEW ARRIVALS SECTION 🌟 */}
      {latestWatches.length > 0 && (
          <section className="py-20 md:py-32 bg-white border-b border-gray-100 relative overflow-hidden">
             <div className="px-6 md:px-16 max-w-[1800px] mx-auto mb-16 flex justify-between items-end">
                <div>
                   <p className="text-[var(--theme-primary)] text-[10px] font-black uppercase tracking-[10px] mb-4">Just Landed</p>
                   <h2 className="text-4xl md:text-7xl font-serif italic text-black tracking-tighter">New Arrivals.</h2>
                </div>
                <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-2 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">View All</Link>
             </div>

             <div className="w-full overflow-x-auto custom-scrollbar snap-x snap-mandatory scroll-pl-6 md:scroll-pl-16 pb-12">
                 <div className="flex gap-6 md:gap-10 px-6 md:px-16 w-max">
                     {latestWatches.map((watch: any, i: number) => (
                         <div key={`horiz-${i}`} onClick={()=>router.push(`/product/${watch.slug || watch._id}`)} className="w-[260px] md:w-[360px] shrink-0 snap-start bg-[#FAFAFA] rounded-[30px] p-6 md:p-8 border border-gray-100 group hover:border-[#D4AF37] hover:shadow-2xl transition-all duration-700 cursor-pointer flex flex-col">
                            <div className="h-56 md:h-72 bg-white rounded-2xl mb-8 p-6 flex items-center justify-center relative overflow-hidden border border-gray-50">
                                {watch.badge && <span className="absolute top-4 left-4 bg-black text-[#D4AF37] text-[8px] font-black uppercase px-3 py-1 rounded-full z-10">{watch.badge}</span>}
                                <img src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 will-change-transform" />
                            </div>
                            <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[4px] mb-2">{watch.brand}</p>
                            <h4 className="text-xl md:text-2xl font-serif text-black leading-tight line-clamp-1 mb-6">{watch.name}</h4>
                            <div className="mt-auto flex justify-between items-center border-t border-gray-100 pt-6">
                                <p className="font-serif italic font-black text-lg md:text-2xl text-gray-900">₹{Number(watch.offerPrice || watch.price).toLocaleString('en-IN')}</p>
                                <button onClick={(e) => addToCart(watch, e)} className="px-6 py-3 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl active:scale-95">
                                    Add to Cart
                                </button>
                            </div>
                         </div>
                     ))}
                 </div>
             </div>
          </section>
      )}

      {/* 🌟 VIDEO BREAK 2 🌟 */}
      <CinematicBreak videoUrl={promoVideos[1]} title="Our History" />

      {/* 🌟 OUR COLLECTION (CATALOGUE) 🌟 */}
      <section id="ourcollection" className="py-24 md:py-40 px-6 md:px-16 max-w-[1800px] mx-auto bg-[#FAFAFA] relative overflow-hidden">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-20 border-b border-gray-200 pb-12 relative z-10">
          <div className="mb-10 xl:mb-0">
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[10px] mb-4">Shop Now</p>
            <h2 className="text-6xl md:text-9xl font-serif tracking-tighter leading-none text-black italic">Our Collection.</h2>
          </div>
          
          <div className="w-full xl:w-auto flex flex-col items-end gap-6">
             <div className="flex flex-wrap gap-3 justify-start md:justify-end w-full">
               {categories.map((cat: any, i: number) => (
                 <button key={`cat-${i}`} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeCategory === cat ? 'bg-black text-white shadow-2xl scale-110' : 'bg-white border border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}>{cat}</button>
               ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 relative z-10">
         {filteredWatches.length === 0 ? (
             <div className="col-span-full py-40 text-center flex flex-col items-center justify-center bg-gray-50/50 rounded-[40px] border border-gray-100">
                <Sparkles size={50} className="text-gray-200 mb-8 animate-pulse"/>
                <h3 className="text-3xl font-serif text-gray-900 mb-4 tracking-tighter">Updating Collection</h3>
                <p className="text-gray-400 text-sm max-w-sm px-6 font-medium">Please check back soon for our newest additions.</p>
                <button onClick={() => setActiveCategory('ALL')} className="mt-10 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-2">See All Watches</button>
             </div>
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredWatches.map((watch: any, i: number) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{opacity:0, scale:0.9}} transition={{ duration: 0.6 }} key={watch._id || i} className="group bg-white p-6 md:p-8 rounded-[40px] border border-gray-100 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:border-[#D4AF37]/40 transition-all duration-700 flex flex-col h-full relative cursor-pointer" onClick={() => router.push(`/product/${watch.slug || watch._id}`)}>
                  
                  {watch.badge && <span className="absolute top-6 left-6 bg-[#D4AF37] text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-sm">{watch.badge}</span>}
                  
                  <div className="flex aspect-square bg-gray-50 rounded-[30px] overflow-hidden mb-8 items-center justify-center p-8 relative will-change-transform">
                    <img src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[4px] mb-2">{watch.brand}</p>
                    <h4 className="text-xl md:text-2xl font-serif text-black leading-tight mb-4 group-hover:text-[#D4AF37] transition-colors line-clamp-2">{watch.name}</h4>
                    <div className="flex justify-between items-end mt-auto pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Buy Now</p>
                        <p className="text-2xl text-black font-black font-serif italic">₹{Number(watch.offerPrice || watch.price).toLocaleString()}</p>
                      </div>
                      <button onClick={(e) => addToCart(watch, e)} className="w-14 h-14 bg-black text-white rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl active:scale-90 flex items-center justify-center group-hover:rotate-90">
                         <Plus size={24}/>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* 🌟 VIDEO BREAK 3 🌟 */}
      <CinematicBreak videoUrl={promoVideos[2]} title="Mastery" />

      {/* 🌟 DYNAMIC GALLERY (PARALLAX OPTIMIZED) 🌟 */}
      <section className="py-24 bg-white border-t border-gray-100 hidden md:flex items-center justify-center">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-10 px-10">
          <motion.div style={{ y: y1 }} className="w-1/3 flex flex-col gap-10 pt-20 will-change-transform">
            <img src={galleryImages[0]} className="w-full h-[450px] object-cover rounded-[50px] shadow-2xl hover:scale-105 transition-transform duration-700" />
            <img src={galleryImages[3]} className="w-full h-[350px] object-cover rounded-[50px] shadow-2xl hover:scale-105 transition-transform duration-700" />
          </motion.div>
          <div className="w-1/3 flex flex-col gap-10">
            <div className="text-center py-10 px-4">
              <FadeUp><p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[15px] mb-6">Quality</p></FadeUp>
              <FadeUp delay={0.1}><h2 className="text-6xl lg:text-8xl font-serif tracking-tighter mb-6 leading-[0.8]">Visual <br/><span className="italic text-gray-300">Poetry.</span></h2></FadeUp>
            </div>
            <img src={galleryImages[2]} className="w-full h-[550px] object-cover rounded-[60px] shadow-2xl hover:scale-105 transition-transform duration-700" />
          </div>
          <motion.div style={{ y: y2 }} className="w-1/3 flex flex-col gap-10 pt-40 will-change-transform">
            <img src={galleryImages[4]} className="w-full h-[500px] object-cover rounded-[50px] shadow-2xl hover:scale-105 transition-transform duration-700" />
            <img src={galleryImages[5]} className="w-full h-[400px] object-cover rounded-[50px] shadow-2xl hover:scale-105 transition-transform duration-700" />
          </motion.div>
        </div>
      </section>

      {/* 🌟 OUR STORY SECTION (SIMPLE ENGLISH) 🌟 */}
      <section id="ourstory" className="py-24 md:py-48 bg-[#00150F] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
          <div className={config?.aboutConfig?.alignment === 'right' ? 'lg:order-2 text-right' : config?.aboutConfig?.alignment === 'center' ? 'text-center col-span-full max-w-4xl mx-auto' : 'text-left'}>
            <FadeUp>
                <p className="text-[var(--theme-primary)] text-[10px] font-black uppercase tracking-[10px] mb-8 flex items-center gap-4">
                    <span className="w-8 h-px bg-[var(--theme-primary)] hidden md:block"></span> {config?.aboutConfig?.title || "Our Story"}
                </p>
            </FadeUp>
            <FadeUp delay={0.1}>
                <h2 className="text-4xl md:text-8xl font-serif leading-[1.1] tracking-tighter mb-8 italic text-gray-100">
                    Built to <br/><span className="text-[var(--theme-primary)] not-italic font-black">Last Forever.</span>
                </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
                <p className="text-gray-400 text-base md:text-xl leading-relaxed font-serif italic">
                  {(config?.aboutConfig?.content || "We bring the world's most beautiful watches directly to you. Every piece in our collection is checked for quality and authenticity.").split(' ').map((word: string, idx: number) => {
                     const isBold = config?.aboutConfig?.boldWords?.split(',').map((w:string)=>w.trim().toLowerCase()).includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''));
                     return isBold ? <strong key={`bold-${idx}`} className="font-black not-italic text-white"> {word} </strong> : <span key={`reg-${idx}`}> {word} </span>;
                  })}
                </p>
            </FadeUp>
          </div>
          {config?.aboutConfig?.alignment !== 'center' && (
              <FadeUp delay={0.3} className="h-[400px] md:h-[600px] w-full bg-white/5 rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1200" className="w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 hover:scale-105 transition-all duration-[2s]" alt="Heritage" />
              </FadeUp>
          )}
        </div>
      </section>

      {/* 🌟 VIDEO BREAK 4 🌟 */}
      <CinematicBreak videoUrl={promoVideos[3]} />

      {/* 🌟 WORN BY ICONS MARQUEE FIXED 🌟 */}
      <section className="py-32 md:py-48 bg-[#050505] text-white border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full overflow-hidden opacity-[0.05] pointer-events-none z-0 flex whitespace-nowrap will-change-transform">
            <motion.h2 animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 40, repeat: Infinity }} className="text-[100px] md:text-[250px] font-serif italic text-white font-black">
                LEGACY OF THE ELITE • WORN BY ICONS • THE ART OF TIME • LEGACY OF THE ELITE • 
            </motion.h2>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-10 relative z-10 mb-20 text-center">
            <FadeUp>
                <p className="text-[var(--theme-primary)] uppercase tracking-[10px] text-[8px] md:text-[9px] font-black flex items-center justify-center gap-4 mb-4">
                    <span className="w-8 h-px bg-[var(--theme-primary)]"></span> Trusted by the Elite <span className="w-8 h-px bg-[var(--theme-primary)]"></span>
                </p>
                <h2 className="text-5xl md:text-8xl font-serif text-white tracking-tighter leading-none italic mb-8">Worn By Icons.</h2>
            </FadeUp>
        </div>

        <div className="relative w-full overflow-hidden flex z-20 py-10">
            <div className="absolute left-0 top-0 bottom-0 w-10 md:w-64 bg-gradient-to-r from-[#050505] to-transparent z-30 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-10 md:w-64 bg-gradient-to-l from-[#050505] to-transparent z-30 pointer-events-none"></div>

            <div className="flex w-[300%] md:w-[200%]">
                <motion.div 
                    animate={{ x: ["0%", "-50%"] }} 
                    transition={{ ease: "linear", duration: Math.max(liveCelebrities.length * 10, 30), repeat: Infinity }} 
                    className="flex gap-6 md:gap-16 items-stretch px-4 md:px-8 will-change-transform hover:[animation-play-state:paused]"
                >
                    {liveCelebrities.length === 0 ? (
                        [1, 2, 3, 4, 5].map((_, i) => <div key={i} className="w-[250px] md:w-[450px] aspect-[3/4] bg-white/5 rounded-[40px] animate-pulse shrink-0 border border-white/10"></div>)
                    ) : (
                        Array(4).fill(liveCelebrities).flat().map((celeb: any, i: number) => (
                            <div key={`${celeb._id}-${i}`} className="w-[250px] md:w-[400px] aspect-[3/4] relative group rounded-[30px] md:rounded-[40px] overflow-hidden shrink-0 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] cursor-pointer">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[var(--theme-primary)] rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 z-0"></div>
                                {(celeb.imageUrl || celeb.img) && (
                                    <img src={celeb.imageUrl || celeb.img} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 relative z-10" alt={celeb.name} />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 md:p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500 z-20">
                                    <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <Sparkles size={14} className="text-[var(--theme-primary)]"/>
                                        <span className="text-[8px] md:text-[10px] uppercase font-black tracking-[4px] text-white">Ambassador</span>
                                    </div>
                                    <h4 className="text-white text-2xl md:text-4xl font-serif mb-1 tracking-tighter">{celeb.name}</h4>
                                    <span className="text-[8px] md:text-[10px] uppercase font-black tracking-[4px] text-[var(--theme-primary)]">{celeb.title || celeb.watch}</span>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
      </section>

      {/* 🌟 CUSTOMER REVIEWS 🌟 */}
      <section id="reviews" className="py-20 md:py-32 bg-white border-t border-gray-100 overflow-hidden relative">
          <div className="text-center mb-12 relative z-10 px-4">
             <h2 className="text-4xl md:text-7xl font-serif italic mb-4 text-[#050505] tracking-tighter leading-none">Customer <br/><span className="text-gray-300">Reviews</span></h2>
             <button onClick={() => setIsReviewModalOpen(true)} className="mt-6 px-8 py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--theme-primary)] hover:text-black transition-colors shadow-lg flex items-center justify-center mx-auto gap-2">
                 <Camera size={14}/> Write a Review
             </button>
          </div>

          {flowingReviews.length > 0 && (
              <div className="flex w-[300%] md:w-[200%] relative z-10">
                <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: flowingReviews.length * 10, repeat: Infinity }} className="flex gap-6 md:gap-10 items-stretch px-4 md:px-10 will-change-transform hover:[animation-play-state:paused]">
                    {flowingReviews.concat(flowingReviews).map((rev: any, i: number) => (
                        <div key={i} className="flex-shrink-0 w-[280px] md:w-[400px] bg-[#FAFAFA] border border-gray-100 p-6 md:p-8 rounded-[20px] md:rounded-[30px] flex flex-col justify-between shadow-sm hover:shadow-xl transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-serif text-lg md:text-xl font-bold mb-1">{rev.userName}</p>
                                        <p className="text-[8px] text-[var(--theme-primary)] font-black uppercase tracking-widest">Verified Buyer</p>
                                    </div>
                                    <ShieldCheck size={16} className="text-[var(--theme-primary)]"/>
                                </div>
                                <div className="flex gap-1 text-[var(--theme-primary)] mb-4">
                                    {[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={12} fill="currentColor"/>)}
                                </div>
                                <p className="text-gray-600 font-serif italic text-sm leading-relaxed line-clamp-4">"{rev.comment}"</p>
                                {rev.media && rev.media.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pt-4 mt-4 border-t border-gray-200">
                                        {rev.media.map((mediaUrl: string, mIdx: number) => (
                                            mediaUrl.match(/\.(mp4|webm|mov)$/i) ? <video key={mIdx} src={mediaUrl} className="h-12 w-12 object-cover rounded-lg border border-gray-200 shrink-0" /> : <img key={mIdx} src={mediaUrl} className="h-12 w-12 object-cover rounded-lg border border-gray-200 shrink-0" />
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

      {/* 🌟 VIDEO BREAK 5 🌟 */}
      <CinematicBreak videoUrl={promoVideos[4]} title="Quality First" />

      {/* 🌟 FAQ SECTION 🌟 */}
      <section className="py-20 md:py-32 bg-[#FAFAFA] border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
           <h2 className="text-4xl md:text-6xl font-serif text-center mb-16 text-[#050505] tracking-tighter">Common Questions</h2>
           <div className="space-y-4">
              {liveFaqs.length === 0 ? <p className="text-center text-gray-400">No questions yet.</p> : liveFaqs.map((faq: any, i: number) => (
                <div key={faq._id || i} className={`bg-white rounded-2xl border transition-all ${openFaq === i ? 'border-[var(--theme-primary)] shadow-md' : 'border-gray-100 hover:border-gray-300'}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 text-left flex justify-between items-center group">
                    <span className="font-serif font-bold text-base md:text-lg pr-4 group-hover:text-[var(--theme-primary)]">{faq.q}</span>
                    <ChevronDown size={18} className={`transition-transform ${openFaq === i ? 'rotate-180 text-[var(--theme-primary)]' : 'text-gray-400'}`}/>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6">
                          <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">{faq.a}</p>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 🌟 MEGA FOOTER (SIMPLE ENGLISH) 🌟 */}
      <footer className="bg-black text-white pt-20 pb-10 border-t-[8px] border-[#D4AF37]">
         <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-16 mb-16 gap-10">
                <div>
                    <h3 className="text-4xl md:text-6xl font-serif italic mb-2">Essential News.</h3>
                    <p className="text-sm text-gray-400 max-w-sm">Sign up for special offers and new watch releases.</p>
                </div>
                <div className="flex w-full md:w-auto h-max self-center"><input type="email" placeholder="Email address" className="bg-white/5 border border-white/20 p-4 text-white outline-none rounded-l-2xl text-sm w-full md:w-80 focus:border-[#D4AF37]" /><button className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs px-10 py-4 rounded-r-2xl hover:bg-white transition-all">Subscribe</button></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
                <div><h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Shop</h4><ul className="space-y-4 text-sm font-bold"><li><Link href="/shop" className="hover:text-[#D4AF37] transition-all">Browse Watches</Link></li><li><Link href="/checkout" className="hover:text-[#D4AF37] transition-all">My Cart</Link></li></ul></div>
                <div><h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Help</h4><ul className="space-y-4 text-sm font-bold"><li><Link href="/account" className="hover:text-[#D4AF37] transition-all">My Account</Link></li><li><Link href="#faq" className="hover:text-[#D4AF37] transition-all">Support Center</Link></li></ul></div>
                <div><h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Policies</h4><ul className="space-y-4 text-sm font-bold">{legalPages.map((page:any, i:number) => (<li key={i}><Link href={`/policies/${page.slug}`} className="hover:text-[#D4AF37] transition-all">{page.title}</Link></li>))}</ul></div>
                <div><h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-8">Contact</h4><div className="space-y-4 text-sm font-bold"><p className="text-white">{corporateInfo?.companyName || 'Essential Rush'}</p><p className="text-gray-400 flex items-center justify-center md:justify-start gap-3"><Mail size={16}/> {corporateInfo?.email || 'support@essential.com'}</p></div></div>
            </div>
         </div>
         <div className="text-center border-t border-white/10 pt-8"><p className="text-[10px] uppercase tracking-[5px] text-gray-700">© 2026 Essential Rush. All Rights Reserved.</p></div>
      </footer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(FrontPageStore), { ssr: false });
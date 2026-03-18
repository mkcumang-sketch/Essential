"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Menu, Search, ShieldCheck, Shield, 
  RotateCcw, Award, ChevronDown, ShoppingBag, 
  Plus, Heart, Globe, Lock, Anchor, Eye, Sparkles 
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

const Isolated4DHero = ({ config }: { config: any }) => {
  const heroRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const slides = config?.heroSlides?.length > 0 ? config.heroSlides : [{ type: 'video', url: 'https://videos.pexels.com/video-files/5608078/5608078-uhd_2560_1440_30fps.mp4', heading: 'ESSENTIAL' }];
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.2 });

  const textScale = useTransform(smoothScroll, [0, 0.7], [1, 40]); 
  const textOpacity = useTransform(smoothScroll, [0, 0.4, 0.6], [1, 1, 0]);
  const videoScale = useTransform(smoothScroll, [0, 0.8], [1.1, 0.5]);
  const videoRotateX = useTransform(smoothScroll, [0, 0.8], [0, 45]);
  const videoY = useTransform(smoothScroll, [0, 0.8], ["0%", "-10%"]);
  const videoRadius = useTransform(smoothScroll, [0, 0.8], ["0px", "100px"]);

  useEffect(() => {
    if (!currentSlide) return;
    if (currentSlide.type === 'image') {
      const timer = setTimeout(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }, 5000); 
      return () => clearTimeout(timer);
    } else if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentSlideIndex, currentSlide?.type, slides.length]);

  return (
    <section ref={heroRef} className="relative h-[350vh] w-full bg-[var(--theme-bg)]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[2000px]">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlideIndex} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.8 }} style={{ scale: textScale, opacity: textOpacity }} className="absolute z-30 text-center pointer-events-none w-full">
            <p className="text-[var(--theme-primary)] text-[10px] md:text-sm font-black uppercase tracking-[30px] mb-12 drop-shadow-2xl">ESTABLISHED 2026</p>
            <h2 className="text-8xl md:text-[150px] lg:text-[220px] font-serif leading-[0.8] tracking-tighter text-white italic font-black uppercase max-w-[90vw] mx-auto break-words">
              {currentSlide?.heading || 'LUXURY'}
            </h2>
          </motion.div>
        </AnimatePresence>
        
        <motion.div style={{ scale: videoScale, rotateX: videoRotateX, y: videoY, borderRadius: videoRadius }} className="absolute inset-0 w-full h-full z-10 overflow-hidden shadow-[0_100px_150px_rgba(0,0,0,1)] origin-bottom border border-white/5 bg-black pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlideIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 w-full h-full">
              {currentSlide?.type === 'image' ? (
                 <img src={currentSlide.url} className="w-full h-full object-cover scale-110 grayscale filter contrast-125 brightness-50 opacity-60" />
              ) : (
                 <video ref={videoRef} autoPlay muted playsInline onEnded={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)} className="w-full h-full object-cover scale-110 grayscale filter contrast-125 brightness-50 opacity-60">
                   <source src={currentSlide?.url} type="video/mp4" />
                 </video>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
        </motion.div>

        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 flex gap-4 pointer-events-auto">
          {slides.map((slide: any, i: number) => (
             <div key={`ind-${i}`} onClick={() => setCurrentSlideIndex(i)} className={`h-1 cursor-pointer transition-all duration-500 rounded-full ${currentSlideIndex === i ? 'w-12 bg-[var(--theme-primary)]' : 'w-4 bg-white/20 hover:bg-white/50'}`}></div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 text-[var(--theme-primary)] flex flex-col items-center animate-bounce">
          <span className="text-[8px] font-black uppercase tracking-[5px] mb-2">Engage Scroll</span>
          <div className="w-px h-16 bg-[var(--theme-primary)]"></div>
        </motion.div>
      </div>
    </section>
  );
};

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
    <motion.div className="fixed top-0 left-0 w-8 h-8 border border-[var(--theme-primary)] rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference" style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}>
      <div className="w-1 h-1 bg-[var(--theme-primary)] rounded-full"></div>
    </motion.div>
  );
};

const FadeUp = ({ children, delay = 0, className = "" }: any) => (
  <motion.div initial={{ y: 100, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }} viewport={{ once: true }} className={className}>{children}</motion.div>
);

export default function EssentialUltimateStore() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [cart, setCart] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
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
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 500]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if(refCode) {
        localStorage.setItem('affiliate_ref', refCode.toUpperCase());
        fetch('/api/agents/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: refCode }) }).catch(()=>{});
    }
  }, []);

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
    router.push('/checkout');
  };

  if (isDataLoading) return <div className="h-screen bg-[var(--theme-bg)] flex items-center justify-center"><div className="w-10 h-10 border-2 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-[#FAFAFA] text-[#050505] font-sans selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">
      <CustomCursor />

      {/* TOP REQUISITION BAR */}
      <div className="bg-[#002B19] text-[#D4AF37] py-2 px-10 flex justify-between items-center text-[9px] font-black uppercase tracking-[4px] z-[200] relative border-b border-[#D4AF37]/20">
        <div className="flex gap-8"><span className="flex items-center gap-2 animate-pulse"><Lock size={10}/> Private Secure Server</span></div>
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 4 }} className="font-serif italic text-center w-1/3 truncate">Enquire for Bespoke Allocations</motion.div>
        <div className="hidden md:block text-right">Global Nodes: Active</div>
      </div>

      {/* NAVIGATION */}
      <nav className="fixed top-8 w-full h-28 bg-white/90 backdrop-blur-3xl z-[150] border-b border-gray-100 flex items-center justify-between px-10 md:px-20 transition-all">
        <div className="flex items-center gap-12">
          <Menu className="cursor-pointer text-black hover:scale-110 transition-transform" size={32} strokeWidth={1}/>
          <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[5px] text-gray-500">
            <Link href="#heritage" className="hover:text-[#D4AF37] transition-colors">Heritage</Link>
            <Link href="#vault" className="hover:text-[#D4AF37] transition-colors">The Vault</Link>
          </div>
        </div>
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <h1 className="text-2xl font-serif font-black tracking-[12px] uppercase text-[#050505]">Essential</h1>
        </Link>
        <div className="flex items-center gap-8 md:gap-10">
          <a href="/godmode" className="flex items-center gap-2 bg-[#050505] text-[#D4AF37] px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[4px] hover:bg-[#D4AF37] hover:text-black transition-all border border-[#D4AF37]/30 shadow-xl cursor-pointer relative z-[200]">
             <ShieldCheck size={14} /> Admin OS
          </a>
          <Search onClick={() => setIsSearchOpen(!isSearchOpen)} className="cursor-pointer hover:text-[#D4AF37]" size={24} strokeWidth={1.5}/>
          <div className="relative cursor-pointer group" onClick={() => router.push('/checkout')}>
            <ShoppingBag size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform"/>
            {cart.length > 0 && <span className="absolute -top-3 -right-3 bg-[#D4AF37] text-black w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xl">{cart.length}</span>}
          </div>
        </div>
      </nav>

      <Isolated4DHero config={config} />

      {/* STATUS TICKER */}
      <section className="bg-white py-14 border-b border-gray-100 overflow-hidden relative z-[40]">
        <div className="flex w-[200%]">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 60, repeat: Infinity }} className="flex gap-32 items-center px-10">
            {dynamicBrands.concat(dynamicBrands).map((b: any, i: number) => (
              <span key={`brand-${i}`} className="text-2xl md:text-5xl font-serif italic tracking-tighter transition-all whitespace-nowrap text-gray-200 hover:text-black cursor-default">{b}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HERITAGE SECTION */}
      <section id="heritage" className="py-48 bg-[#002B19] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#D4AF37] blur-[350px] opacity-10 rounded-full"></div>
        <div className="max-w-[1700px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className={config?.aboutConfig?.alignment === 'right' ? 'lg:order-2 text-right' : config?.aboutConfig?.alignment === 'center' ? 'text-center col-span-full max-w-4xl mx-auto' : 'text-left'}>
            <FadeUp><p className={`text-[#D4AF37] text-[10px] font-black uppercase tracking-[10px] mb-10 flex items-center gap-4 ${config?.aboutConfig?.alignment === 'center' ? 'justify-center' : config?.aboutConfig?.alignment === 'right' ? 'justify-end' : ''}`}><span className="w-12 h-px bg-[#D4AF37]"></span> Our Genesis</p></FadeUp>
            <FadeUp delay={0.2}><h2 className="text-6xl md:text-9xl font-serif leading-[0.9] tracking-tighter mb-12">Legacy is a <br/><span className="italic text-[#D4AF37]">Timepiece.</span></h2></FadeUp>
            <FadeUp delay={0.4}>
                <p className={`text-gray-400 text-xl leading-relaxed mb-16 font-serif italic font-light ${config?.aboutConfig?.alignment === 'center' ? 'mx-auto' : 'max-w-xl'}`}>
                  {(config?.aboutConfig?.content || "Essential Rush was founded to protect mechanical art.").split(' ').map((word: string, idx: number) => {
                     const isBold = config?.aboutConfig?.boldWords?.split(',').map((w:string)=>w.trim().toLowerCase()).includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''));
                     return isBold ? <strong key={`bold-${idx}`} className="font-black not-italic text-[#D4AF37]"> {word} </strong> : <span key={`reg-${idx}`}> {word} </span>;
                  })}
                </p>
            </FadeUp>
          </div>
          {config?.aboutConfig?.alignment !== 'center' && (
              <FadeUp delay={0.5} className="relative group">
                <img src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1200" className="w-full h-[800px] object-cover rounded-[50px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000" alt="Heritage" />
              </FadeUp>
          )}
        </div>
      </section>

      {/* DYNAMIC GALLERY OF PRECISION */}
      <section className="py-48 bg-white overflow-hidden">
        <div className="max-w-[1800px] mx-auto h-[160vh] flex gap-12 px-6">
          <motion.div style={{ y: y1 }} className="w-1/4 flex flex-col gap-12 pt-40">
            <img src={galleryImages[0]} className="w-full h-[60vh] object-cover rounded-[50px] shadow-xl" />
            <img src={galleryImages[3]} className="w-full h-[50vh] object-cover rounded-[50px] shadow-xl" />
            <img src={galleryImages[1]} className="w-full h-[70vh] object-cover rounded-[50px] shadow-xl" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="w-1/2 flex flex-col gap-12 -mt-[50vh]">
            <div className="text-center py-40">
              <FadeUp><h2 className="text-7xl md:text-[140px] font-serif tracking-tighter mb-8 leading-none">The Art of <br/> Horology</h2></FadeUp>
              <FadeUp delay={0.2}><p className="text-gray-400 font-serif italic text-2xl max-w-lg mx-auto">"Where mechanical engineering meets aesthetic transcendence."</p></FadeUp>
            </div>
            <img src={galleryImages[2]} className="w-full h-[90vh] object-cover rounded-[60px] shadow-2xl" />
            <div className="bg-[#002B19] text-[#D4AF37] p-24 rounded-[60px] shadow-2xl text-center">
               <Anchor size={60} strokeWidth={1} className="mx-auto mb-10" />
               <h3 className="text-5xl font-serif italic mb-6">Marine Mastery</h3>
               <p className="text-white/60 text-sm tracking-widest leading-loose uppercase">The Rolex Submariner: <br/> Tested at 3,900 meters below sea level.</p>
            </div>
          </motion.div>
          <motion.div style={{ y: y1 }} className="w-1/4 flex flex-col gap-12 pt-80">
            <img src={galleryImages[4]} className="w-full h-[80vh] object-cover rounded-[50px] shadow-xl" />
            <img src={galleryImages[5]} className="w-full h-[55vh] object-cover rounded-[50px] shadow-xl" />
          </motion.div>
        </div>
      </section>

      {/* AI PERSONALIZED VAULT GRID */}
      <section id="vault" className="py-48 px-6 md:px-20 max-w-[1900px] mx-auto bg-[#FAFAFA]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 border-b border-gray-200 pb-16">
          <div className="text-left">
            <h3 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[15px] mb-6">AI Curated For You</h3>
            <h2 className="text-6xl md:text-9xl font-serif tracking-tighter leading-none">The Collection.</h2>
          </div>
          <div className="flex flex-wrap gap-4 mt-10 md:mt-0">
            {categories.map((cat: any, i: number) => (
              <button key={`cat-${i}`} onClick={() => setActiveCategory(cat)} className={`px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#002B19] text-[#D4AF37] scale-105' : 'bg-white border border-gray-200 text-black hover:border-[#D4AF37]'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {filteredWatches.length === 0 ? (
             <div className="col-span-full py-20 text-center font-serif italic text-3xl text-gray-400">Vault Nodes Unreachable / Empty</div>
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredWatches.map((watch: any, i: number) => (
                <motion.div key={watch._id || `watch-${i}`} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group bg-white p-10 rounded-[60px] border border-gray-100 hover:shadow-[0_50px_100px_rgba(0,0,0,0.05)] hover:border-[#D4AF37]/40 transition-all duration-1000 relative flex flex-col h-full">
                  <div className="absolute top-10 left-10 z-10">
                    {watch.stock < 3 && <span className="bg-[#D4AF37] text-white text-[8px] font-black uppercase tracking-[4px] px-4 py-2 rounded-full shadow-lg">Rare Asset</span>}
                  </div>
                  <Link href={`/product/${watch.slug || watch._id}`} className="flex aspect-[4/5] bg-[#FDFDFD] rounded-[45px] overflow-hidden mb-10 items-center justify-center p-12 relative group">
                    <motion.img whileHover={{ scale: 1.15, rotate: -3 }} transition={{ duration: 0.8 }} src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)]" />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[5px] italic">{watch.brand}</p>
                      <h4 className="text-3xl font-serif text-[#050505] leading-tight mb-8 tracking-tighter">{watch.name || watch.title}</h4>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-8 border-t border-gray-50">
                      <div>
                        {(watch.offerPrice && (watch.price || watch.basePrice) > watch.offerPrice) && <p className="text-gray-400 line-through text-[10px] font-black mb-1">₹{Number(watch.price || watch.basePrice || 0).toLocaleString('en-IN')}</p>}
                        <p className="text-3xl text-[#002B19] font-black tracking-tighter font-serif">₹{Number(watch.offerPrice || watch.price || watch.basePrice || 0).toLocaleString('en-IN')}</p>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); addToCart(watch); }} className="p-5 bg-[#050505] text-white rounded-3xl hover:bg-[#D4AF37] transition-all shadow-xl"><Plus size={24}/></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* VISIONARIES */}
      <section className="py-48 bg-white">
        <div className="max-w-[1700px] mx-auto px-10">
          <FadeUp><div className="text-center mb-32"><h2 className="text-6xl md:text-[140px] font-serif mb-8 text-[#050505] tracking-tighter leading-none">Worn by Icons</h2><p className="text-[#D4AF37] uppercase tracking-[12px] text-[10px] font-black">THE CIRCLE OF ELITES</p></div></FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {liveCelebrities.map((celeb: any, i: number) => (
              <FadeUp key={celeb._id || i} delay={i * 0.2}>
                <div className="group relative aspect-[3/4.5] rounded-[60px] overflow-hidden bg-[#050505]">
                  <img src={celeb.img} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent p-16 flex flex-col justify-end">
                      <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-[5px] mb-4">Acquisition Registry</p>
                      <h4 className="text-white text-5xl font-serif mb-2 tracking-tighter">{celeb.name}</h4>
                      <span className="text-xs uppercase font-bold tracking-[3px] text-white/50">{celeb.watch}</span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-48 bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-10">
           <FadeUp><h2 className="text-6xl md:text-8xl font-serif text-center mb-32 text-[#050505] tracking-tighter italic">Common Enquiries</h2></FadeUp>
           <div className="space-y-8">
              {liveFaqs.map((faq: any, i: number) => (
                <div key={faq._id || i} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-12 py-10 text-left flex justify-between items-center group transition-all">
                    <span className="font-serif italic text-2xl text-[#050505] group-hover:text-[#D4AF37]">{faq.q}</span>
                    <div className={`p-4 rounded-full transition-all ${openFaq === i ? 'bg-[#D4AF37] rotate-180' : 'bg-[#FAFAFA]'}`}><ChevronDown size={24}/></div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-12 pb-12 text-gray-500 text-lg font-serif">{faq.a}</motion.div>}
                  </AnimatePresence>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050505] text-white pt-64 pb-16 px-10 md:px-20 relative overflow-hidden">
         <div className="absolute top-20 left-1/2 -translate-x-1/2 text-white/[0.02] text-[400px] lg:text-[550px] font-serif font-black uppercase tracking-tighter w-full text-center pointer-events-none">Essential</div>
         <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-20 relative z-10">
            <div className="lg:col-span-2">
               <div className="flex items-center gap-8 mb-16"><span className="text-8xl text-[#D4AF37]">♞</span><h2 className="text-6xl font-serif font-black tracking-[20px] uppercase">ESSENTIAL</h2></div>
               <p className="text-gray-500 text-3xl md:text-4xl font-serif italic max-w-2xl leading-[1.2]">"Legacy is not what we leave behind, it is what we choose to wear every single day."</p>
            </div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-[8px] text-[#D4AF37] mb-16">The Vault</h4>
               <ul className="space-y-8 text-gray-500 text-xs font-black tracking-[5px] uppercase">
                  <li><Link href="/" className="hover:text-[#D4AF37]">Vault Catalogue</Link></li>
                  <li><a href="/godmode" className="hover:text-[#D4AF37] underline">Admin OS Access</a></li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
}

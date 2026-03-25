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

// 🌟 THE NEW CINEMATIC VIDEO BREAK COMPONENT 🌟
const CinematicBreak = ({ videoUrl, title }: { videoUrl?: string, title?: string }) => {
    if (!videoUrl || videoUrl.trim() === '') return null;
    return (
        <section className="relative w-full h-[50vh] md:h-[70vh] bg-black overflow-hidden border-t border-b border-white/10">
            <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" />
            {title && (
                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <h2 className="text-white text-3xl md:text-5xl font-serif tracking-[10px] uppercase drop-shadow-2xl">{title}</h2>
                </div>
            )}
        </section>
    );
};

const Isolated4DHero = ({ config }: { config: any }) => {
  const heroRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const rawSlides = config?.heroSlides || [];
  const slides = (rawSlides.length > 0 && rawSlides[0]?.url?.length > 5) 
    ? rawSlides 
    : [{ type: 'video', url: 'https://cdn.pixabay.com/video/2020/05/24/40092-424840899_large.mp4', heading: 'PREMIUM WATCHES' }];
  
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.5 });

  const textScale = useTransform(smoothScroll, [0, 0.8], [1, 1.5]); 
  const textOpacity = useTransform(smoothScroll, [0, 0.6], [1, 0]);
  const textY = useTransform(smoothScroll, [0, 0.8], ["0%", "-30%"]);
  const videoScale = useTransform(smoothScroll, [0, 1], [1.05, 0.9]);
  const videoY = useTransform(smoothScroll, [0, 1], ["0%", "5%"]);

  useEffect(() => {
    if (!currentSlide) return;
    const timer = setTimeout(() => { setCurrentSlideIndex((prev) => (prev + 1) % slides.length); }, 6000); 
    return () => clearTimeout(timer);
  }, [currentSlideIndex, currentSlide?.type, slides.length]);

  return (
    <section ref={heroRef} className="relative h-[100vh] md:h-[120vh] w-full bg-[var(--theme-bg)]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlideIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }} style={{ scale: textScale, opacity: textOpacity, y: textY }} className="absolute z-30 text-center pointer-events-none w-full will-change-transform px-4">
            <p className="text-[var(--theme-primary)] text-[10px] md:text-xs font-bold uppercase tracking-[15px] md:tracking-[20px] mb-4 drop-shadow-md">ESSENTIAL</p>
            <h2 className="text-5xl md:text-[120px] lg:text-[150px] font-serif leading-none tracking-tighter text-white italic font-bold max-w-[95vw] mx-auto drop-shadow-xl">
              {currentSlide?.heading || 'PREMIUM WATCHES'}
            </h2>
          </motion.div>
        </AnimatePresence>
        
        <motion.div style={{ scale: videoScale, y: videoY }} className="absolute inset-0 w-full h-full z-10 overflow-hidden bg-black pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlideIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 w-full h-full">
              {currentSlide?.type === 'image' ? (
                 <img src={currentSlide.url} className="w-full h-full object-cover opacity-70" alt="Hero Banner"/>
              ) : (
                 <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-70">
                   <source src={currentSlide?.url} type="video/mp4" />
                 </video>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-transparent to-black/50"></div>
        </motion.div>

        {slides.length > 1 && (
            <div className="absolute bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-40 flex gap-4 bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10">
                {/* 🌟 FIX: TypeScript Type Error fixed here by typing _ as any 🌟 */}
                {slides.map((_: any, i: number) => (
                    <button key={i} onClick={() => setCurrentSlideIndex(i)} className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${i === currentSlideIndex ? 'bg-[#D4AF37] scale-125 shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'bg-white/40 hover:bg-white'}`} />
                ))}
            </div>
        )}
      </div>
    </section>
  );
};

const FadeUp = ({ children, delay = 0, className = "" }: any) => (
  <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay }} viewport={{ once: true, margin: "-50px" }} className={className}>{children}</motion.div>
);

function FrontPageStore() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
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
            if (celebData.data && celebData.data.length > 0) setLiveCelebrities(celebData.data);
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
    const fetchedCats = config?.categories || [];
    const aiCats = liveWatches.map(w => w.category).filter(c => c);
    return ["ALL", ...Array.from(new Set([...fetchedCats, ...aiCats]))];
  }, [liveWatches, config]);

  const filteredWatches = useMemo(() => {
    return liveWatches.filter(w => {
      const catMatch = activeCategory === "ALL" || w.category === activeCategory;
      const searchMatch = w.name?.toLowerCase().includes(searchTerm.toLowerCase()) || w.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [liveWatches, activeCategory, searchTerm]);

  const addToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    const exists = cart.find(item => item._id === product._id);
    const newCart = exists ? cart.map(i => i._id === product._id ? {...i, qty: i.qty+1} : i) : [...cart, {...product, qty: 1}];
    setCart(newCart);
    localStorage.setItem('luxury_cart', JSON.stringify(newCart));
    alert("Added to Cart!");
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
          else alert("Upload failed.");
      } catch(err) { alert("Network error."); } finally { setIsUploadingMedia(false); }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeyPot.length > 0) return setReviewStatus('success'); 
    if (!reviewForm.userName || !reviewForm.comment) return alert("Please fill your details.");

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

  if (isDataLoading) return <div className="h-screen bg-[var(--theme-bg)] flex items-center justify-center"><div className="w-10 h-10 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-[#FAFAFA] text-[#050505] font-sans selection:bg-[var(--theme-primary)] selection:text-white overflow-x-hidden">

      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[var(--theme-primary)] origin-left z-[500]" style={{ scaleX }} />

      {/* 🌟 REVIEW MODAL (SIMPLIFIED ENGLISH) 🌟 */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 md:p-6 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{scale:0.95}} animate={{scale:1}} className="bg-white p-6 md:p-12 rounded-[30px] w-full max-w-lg relative shadow-2xl">
               <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 bg-gray-100 text-gray-500 rounded-full p-2 hover:bg-black hover:text-white transition-all"><X size={20}/></button>
               {reviewStatus === 'success' ? (
                   <div className="text-center py-10"><CheckCircle size={60} className="text-green-500 mx-auto mb-4" /><h3 className="text-2xl font-serif text-black mb-2">Review Submitted!</h3><p className="text-gray-500 text-sm">Thank you for your feedback.</p></div>
               ) : (
                   <>
                       <h3 className="text-2xl md:text-3xl font-serif font-bold text-black mb-6">Write a Review</h3>
                       <div className="space-y-4">
                           {PhantomGuard && <PhantomGuard value={honeyPot} onChange={setHoneyPot} />}
                           <div><label className="text-xs font-bold text-gray-500 mb-1 block">Your Name</label><input value={reviewForm.userName} onChange={e=>setReviewForm({...reviewForm, userName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="John Doe"/></div>
                           <div><label className="text-xs font-bold text-gray-500 mb-1 block">Rating</label><div className="flex gap-2">{[1,2,3,4,5].map(star => (<button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className={`transition-transform hover:scale-110 ${reviewForm.rating >= star ? 'text-[#D4AF37]' : 'text-gray-200'}`}><Star size={28} fill={reviewForm.rating >= star ? "currentColor" : "none"} /></button>))}</div></div>
                           <div><label className="text-xs font-bold text-gray-500 mb-1 block">Your Review</label><textarea value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm, comment: e.target.value})} rows={3} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black custom-scrollbar" placeholder="Tell us what you think..."/></div>
                           
                           <div className="border-t border-gray-100 pt-4">
                               <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2"><Camera size={14}/> Upload Photo/Video</label>
                               <div className="flex flex-wrap gap-4">
                                   
                                   {/* 🌟 FIX: React JSX Syntax Fragment added here 🌟 */}
                                   {reviewMedia.map((url: string, idx: number) => (
                                       <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 group">
                                           {url.match(/\.(mp4|webm|mov)$/i) ? (
                                               <video src={url} className="w-full h-full object-cover"/>
                                           ) : (
                                               <img src={url} className="w-full h-full object-cover"/>
                                           )}
                                           <button onClick={()=>setReviewMedia(reviewMedia.filter(x => x !== url))} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                               <Trash2 size={14}/>
                                           </button>
                                       </div>
                                   ))}

                                   <div className="relative w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#D4AF37] flex flex-col items-center justify-center cursor-pointer">{isUploadingMedia ? <RefreshCcw size={16} className="text-[#D4AF37] animate-spin"/> : <><UploadCloud size={16} className="text-gray-400"/><span className="text-[8px] font-bold text-gray-500">Upload</span></>}<input type="file" accept="image/*,video/*" onChange={handleCustomerMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploadingMedia}/></div>
                               </div>
                           </div>

                           <button onClick={handleReviewSubmit} disabled={reviewStatus === 'submitting' || isUploadingMedia} className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-50 text-xs mt-2">{reviewStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}</button>
                       </div>
                   </>
               )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#00150F] text-[var(--theme-primary)] py-2 px-4 md:px-10 flex justify-between items-center text-[8px] md:text-[9px] font-black uppercase tracking-widest z-[200] relative">
        <div className="flex items-center gap-2"><Lock size={10}/> 100% Secure</div>
        <div>Free Shipping in India</div>
        <div>Cash on Delivery</div>
      </div>

      <nav className={`fixed w-full z-[150] transition-all duration-300 border-b ${isScrolled ? 'top-0 h-16 md:h-20 bg-white/95 backdrop-blur-xl border-gray-200 shadow-sm' : 'top-0 h-20 md:h-28 bg-transparent border-transparent'}`}>
        <div className="flex items-center justify-between px-4 md:px-16 h-full relative">
          <div className="flex items-center gap-4 md:gap-6">
            <Menu onClick={()=>setIsMenuOpen(true)} className={`cursor-pointer hover:scale-105 transition-transform ${isScrolled ? 'text-black' : 'text-white'}`} size={24}/>
            <div className={`hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[5px] ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
              <Link href="/shop" className="hover:text-[var(--theme-primary)] transition-colors">Shop</Link>
              <Link href="#ourstory" className="hover:text-[var(--theme-primary)] transition-colors">Our Story</Link>
            </div>
          </div>
          
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <h1 className={`text-xl md:text-3xl font-serif font-black tracking-[5px] md:tracking-[10px] uppercase transition-colors ${isScrolled ? 'text-[#050505]' : 'text-white drop-shadow-lg'}`}>Essential</h1>
          </Link>
          
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/account" className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[3px] transition-all cursor-pointer ${isScrolled ? 'bg-black text-white hover:bg-[var(--theme-primary)] hover:text-black' : 'bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-black'}`}>
               <ShieldCheck size={14} /> Account
            </Link>
            <div className="relative cursor-pointer group" onClick={() => router.push('/checkout')}>
              <ShoppingBag size={20} className={`md:w-6 md:h-6 group-hover:scale-110 transition-transform ${isScrolled ? 'text-black' : 'text-white'}`}/>
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[var(--theme-primary)] text-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-black shadow-md">{cart.length}</span>}
            </div>
          </div>
        </div>
      </nav>

      <Isolated4DHero config={config} />

      {/* 🌟 VIDEO BREAK 1 🌟 */}
      <CinematicBreak videoUrl={promoVideos[0]} title="Unmatched Precision" />

      <section className="bg-white py-8 md:py-12 border-b border-gray-100 overflow-hidden relative z-[40]">
        <div className="flex w-[200%]">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 30, repeat: Infinity }} className="flex gap-10 md:gap-20 items-center px-4 md:px-10 will-change-transform">
            {dynamicBrands.concat(dynamicBrands).map((b: any, i: number) => (
              <div key={`brand-${i}`} className="flex items-center gap-4 md:gap-8">
                 <span className="text-xl md:text-4xl font-serif italic tracking-tighter whitespace-nowrap text-gray-300 hover:text-black transition-colors">{b}</span>
                 <Sparkles size={14} className="text-[var(--theme-primary)] opacity-40"/>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {latestWatches.length > 0 && (
          <section className="py-16 md:py-24 bg-white border-b border-gray-100 relative overflow-hidden">
             <div className="px-4 md:px-12 max-w-[1800px] mx-auto mb-8 flex justify-between items-end">
                <div>
                   <p className="text-[var(--theme-primary)] text-[8px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[10px] mb-2">Just Landed</p>
                   <h2 className="text-3xl md:text-5xl font-serif italic text-black tracking-tighter">New Arrivals.</h2>
                </div>
                <Link href="/shop" className="text-xs font-bold uppercase underline hidden md:block hover:text-[var(--theme-primary)]">View All</Link>
             </div>

             <div className="w-full overflow-x-auto custom-scrollbar snap-x snap-mandatory scroll-pl-4 md:scroll-pl-12 pb-8">
                 <div className="flex gap-4 md:gap-6 px-4 md:px-12 w-max">
                     {latestWatches.map((watch: any, i: number) => (
                         <div key={`horiz-${i}`} className="w-[240px] md:w-[320px] shrink-0 snap-start bg-[#FAFAFA] rounded-[20px] md:rounded-[30px] p-4 md:p-6 border border-gray-200 group hover:border-[var(--theme-primary)] hover:shadow-xl transition-all relative flex flex-col">
                            {watch.badge && <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[8px] font-black uppercase px-2 py-1 rounded-md z-10 shadow-sm">{watch.badge}</span>}
                            <Link href={`/product/${watch.slug || watch._id}`} className="h-40 md:h-56 bg-white rounded-xl mb-4 p-4 flex items-center justify-center relative overflow-hidden block cursor-pointer">
                                <img src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                            </Link>
                            <p className="text-[8px] font-black text-[var(--theme-primary)] uppercase tracking-widest mb-1">{watch.brand}</p>
                            <h4 className="text-base md:text-lg font-serif text-black leading-tight line-clamp-1 mb-2 md:mb-4">{watch.name}</h4>
                            <div className="mt-auto flex justify-between items-center border-t border-gray-200 pt-3">
                                <p className="font-bold text-sm md:text-base">₹{Number(watch.offerPrice || watch.price || watch.basePrice || 0).toLocaleString('en-IN')}</p>
                                <button onClick={(e) => addToCart(watch, e)} className="px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors shadow-sm">
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
      <CinematicBreak videoUrl={promoVideos[1]} title="The Vault Collection" />

      {/* ================= THE VAULT (MATRIX) ================= */}
      <section id="ourcollection" className="py-20 md:py-32 px-4 md:px-12 max-w-[1800px] mx-auto bg-[#FAFAFA] relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-gray-200 pb-6 relative z-10">
          <div className="mb-6 md:mb-0">
            <p className="text-[var(--theme-primary)] text-[8px] md:text-[10px] font-black uppercase tracking-widest md:tracking-[10px] mb-2">Shop by Category</p>
            <h2 className="text-4xl md:text-6xl font-serif tracking-tighter leading-none text-black italic">Our Collection.</h2>
          </div>
          
          <div className="w-full md:w-auto flex flex-col items-end gap-4">
             <div className="flex flex-wrap gap-2 justify-start md:justify-end w-full">
               {categories.map((cat: any, i: number) => (
                 <button key={`cat-${i}`} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-black text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500'}`}>{cat}</button>
               ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 relative z-10">
         {filteredWatches.length === 0 ? (
             <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-gray-100">
                <Sparkles size={30} className="text-gray-300 mb-4"/>
                <h3 className="text-2xl font-serif text-gray-900 mb-2">Updating Collection</h3>
                <p className="text-gray-500 text-sm max-w-sm px-4">We are currently adding new watches to this category. Please check back later.</p>
                <button onClick={() => setActiveCategory('ALL')} className="mt-6 text-xs font-bold uppercase underline">View All</button>
             </div>
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredWatches.map((watch: any, i: number) => (
                <motion.div key={watch._id || `watch-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity:0, scale:0.9}} transition={{ duration: 0.3 }} className="group bg-white p-4 md:p-6 rounded-[20px] md:rounded-[30px] border border-gray-100 hover:shadow-xl hover:border-[var(--theme-primary)]/50 transition-all flex flex-col h-full relative cursor-pointer" onClick={() => router.push(`/product/${watch.slug || watch._id}`)}>
                  
                  {watch.badge && <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[8px] font-black px-2 py-0.5 rounded uppercase z-20">{watch.badge}</span>}
                  
                  <div className="flex aspect-square bg-gray-50 rounded-xl md:rounded-[20px] overflow-hidden mb-4 md:mb-6 items-center justify-center p-4 relative">
                    <img src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <p className="text-[8px] font-black text-[var(--theme-primary)] uppercase tracking-widest mb-1">{watch.brand}</p>
                    <h4 className="text-sm md:text-lg font-serif text-black leading-tight mb-2 line-clamp-2">{watch.name}</h4>
                    
                    <div className="flex justify-between items-end mt-auto pt-3 md:pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                        <p className="text-sm md:text-xl text-black font-bold tracking-tighter">₹{Number(watch.offerPrice || watch.price || watch.basePrice || 0).toLocaleString()}</p>
                      </div>
                      <button onClick={(e) => addToCart(watch, e)} className="p-2 md:p-3 bg-black text-white rounded-lg md:rounded-xl hover:bg-[#D4AF37] hover:text-black transition-colors shadow-md">
                         <Plus size={16}/>
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
      <CinematicBreak videoUrl={promoVideos[2]} title="Heritage & Craft" />

      {/* DYNAMIC GALLERY OF PRECISION */}
      <section className="py-20 bg-white border-t border-gray-100 hidden md:block">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-6 lg:gap-10 px-10">
          <motion.div style={{ y: y1 }} className="w-1/3 flex flex-col gap-6 lg:gap-10 pt-20">
            <img src={galleryImages[0]} className="w-full h-[300px] lg:h-[400px] object-cover rounded-[30px] lg:rounded-[40px] shadow-lg" />
            <img src={galleryImages[3]} className="w-full h-[250px] lg:h-[300px] object-cover rounded-[30px] lg:rounded-[40px] shadow-lg" />
          </motion.div>
          <div className="w-1/3 flex flex-col gap-6 lg:gap-10">
            <div className="text-center py-10 px-4">
              <FadeUp><p className="text-[var(--theme-primary)] text-[10px] font-black uppercase tracking-[10px] lg:tracking-[15px] mb-4">Craftsmanship</p></FadeUp>
              <FadeUp delay={0.1}><h2 className="text-4xl lg:text-6xl font-serif tracking-tighter mb-4">The Art <br/><span className="italic text-gray-300">Of Time</span></h2></FadeUp>
            </div>
            <img src={galleryImages[2]} className="w-full h-[400px] lg:h-[500px] object-cover rounded-[30px] lg:rounded-[40px] shadow-lg" />
          </div>
          <motion.div style={{ y: y2 }} className="w-1/3 flex flex-col gap-6 lg:gap-10 pt-40">
            <img src={galleryImages[4]} className="w-full h-[350px] lg:h-[450px] object-cover rounded-[30px] lg:rounded-[40px] shadow-lg" />
            <img src={galleryImages[5]} className="w-full h-[250px] lg:h-[350px] object-cover rounded-[30px] lg:rounded-[40px] shadow-lg" />
          </motion.div>
        </div>
      </section>

      <section id="ourstory" className="py-24 md:py-40 bg-[#00150F] text-white relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className={config?.aboutConfig?.alignment === 'right' ? 'lg:order-2 text-right' : config?.aboutConfig?.alignment === 'center' ? 'text-center col-span-full max-w-4xl mx-auto' : 'text-left'}>
            <FadeUp>
                <p className="text-[var(--theme-primary)] text-[10px] font-black uppercase tracking-widest md:tracking-[10px] mb-6 flex items-center gap-4">
                    <span className="w-8 h-px bg-[var(--theme-primary)] hidden md:block"></span> {config?.aboutConfig?.title || "Our Story"}
                </p>
            </FadeUp>
            <FadeUp delay={0.1}>
                <h2 className="text-4xl md:text-7xl font-serif leading-[1.1] tracking-tighter mb-8 italic text-gray-100">
                    Discover True <br/><span className="text-[var(--theme-primary)] not-italic font-black">Luxury.</span>
                </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
                <p className="text-gray-400 text-base md:text-xl leading-relaxed font-serif italic">
                  {(config?.aboutConfig?.content || "We bring the world's most premium watches directly to you. Guaranteed authenticity and unmatched service.").split(' ').map((word: string, idx: number) => {
                     const isBold = config?.aboutConfig?.boldWords?.split(',').map((w:string)=>w.trim().toLowerCase()).includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''));
                     return isBold ? <strong key={`bold-${idx}`} className="font-black not-italic text-white"> {word} </strong> : <span key={`reg-${idx}`}> {word} </span>;
                  })}
                </p>
            </FadeUp>
          </div>
          {config?.aboutConfig?.alignment !== 'center' && (
              <FadeUp delay={0.3} className="h-[400px] md:h-[600px] w-full bg-white/5 rounded-[30px] md:rounded-[50px] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1200" className="w-full h-full object-cover grayscale opacity-70" alt="Heritage" />
              </FadeUp>
          )}
        </div>
      </section>

      {/* 🌟 VIDEO BREAK 4 🌟 */}
      <CinematicBreak videoUrl={promoVideos[3]} />

      {/* 🌟 CELEBRITY SECTION WITH FLOATING STORY 🌟 */}
      <section className="py-32 md:py-48 bg-[#050505] text-white border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full overflow-hidden opacity-[0.05] pointer-events-none z-0 flex whitespace-nowrap">
            <motion.h2 animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 40, repeat: Infinity }} className="text-[100px] md:text-[250px] font-serif italic text-white font-black">
                LEGACY OF THE ELITE • TIMELESS PRECISION • WORN BY ICONS • MASTERPIECES • LEGACY OF THE ELITE • TIMELESS PRECISION • WORN BY ICONS • MASTERPIECES • 
            </motion.h2>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-10 relative z-10 mb-20 text-center">
            <FadeUp>
                <p className="text-[var(--theme-primary)] uppercase tracking-[10px] text-[8px] md:text-[9px] font-black flex items-center justify-center gap-4 mb-4">
                    <span className="w-8 h-px bg-[var(--theme-primary)]"></span> TRUSTED BY ELITES <span className="w-8 h-px bg-[var(--theme-primary)]"></span>
                </p>
                <h2 className="text-5xl md:text-8xl font-serif text-white tracking-tighter leading-none italic mb-8">Worn By Icons.</h2>
                <p className="text-gray-400 font-serif text-lg md:text-xl leading-relaxed italic max-w-3xl mx-auto">
                    "From global ambassadors to visionaries, our timepieces adorn the wrists of those who shape the world. Each watch tells a story of relentless ambition and uncompromising excellence."
                </p>
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
                                    <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
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

      <section id="reviews" className="py-20 md:py-32 bg-white border-t border-gray-100 overflow-hidden relative">
          <div className="text-center mb-12 relative z-10 px-4">
             <h2 className="text-4xl md:text-7xl font-serif italic mb-4 text-[#050505] tracking-tighter">Customer Reviews</h2>
             <button onClick={() => setIsReviewModalOpen(true)} className="mt-6 px-8 py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--theme-primary)] hover:text-black transition-colors shadow-lg flex items-center justify-center mx-auto gap-2">
                 <Camera size={14}/> Write a Review
             </button>
          </div>

          {flowingReviews.length > 0 && (
              <div className="flex w-[300%] md:w-[200%] relative z-10">
                <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: flowingReviews.length * 10, repeat: Infinity }} className="flex gap-6 md:gap-10 items-stretch px-4 md:px-10 will-change-transform">
                    {flowingReviews.concat(flowingReviews).map((rev: any, i: number) => (
                        <div key={i} className="flex-shrink-0 w-[280px] md:w-[400px] bg-[#FAFAFA] border border-gray-100 p-6 md:p-8 rounded-[20px] md:rounded-[30px] flex flex-col justify-between shadow-sm">
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
                                            mediaUrl.match(/\.(mp4|webm|mov)$/i) ? (
                                                <video key={mIdx} src={mediaUrl} className="h-12 w-12 md:h-16 md:w-16 object-cover rounded-lg border border-gray-200 shrink-0" />
                                            ) : (
                                                <img key={mIdx} src={mediaUrl} className="h-12 w-12 md:h-16 md:w-16 object-cover rounded-lg border border-gray-200 shrink-0" />
                                            )
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
      <CinematicBreak videoUrl={promoVideos[4]} />

      <section className="py-20 md:py-32 bg-[#FAFAFA] border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
           <h2 className="text-3xl md:text-5xl font-serif text-center mb-12 text-[#050505] tracking-tighter">FAQs</h2>
           <div className="space-y-3">
              {liveFaqs.length === 0 ? <p className="text-center text-gray-400">No questions yet.</p> : liveFaqs.map((faq: any, i: number) => (
                <div key={faq._id || i} className="bg-white rounded-2xl border border-gray-100">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 text-left flex justify-between items-center">
                    <span className="font-serif font-bold text-base md:text-lg pr-4">{faq.q}</span>
                    <ChevronDown size={18} className={`transition-transform ${openFaq === i ? 'rotate-180 text-[var(--theme-primary)]' : 'text-gray-400'}`}/>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6">
                          <p className="text-gray-600 text-sm">{faq.a}</p>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
           </div>
        </div>
      </section>

      <footer className="bg-black text-white pt-16 pb-8 border-t-[8px] border-[#D4AF37]">
         <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between border-b border-white/10 pb-12 mb-12 gap-8">
                <div>
                    <h3 className="text-3xl font-serif mb-2">Join Essential</h3>
                    <p className="text-sm text-gray-400 max-w-sm">Get exclusive access to private sales and new arrivals.</p>
                </div>
                <div className="flex w-full md:w-auto">
                    <input type="email" placeholder="Email address" className="bg-white/5 border border-white/20 p-3 md:p-4 text-white outline-none rounded-l-xl text-sm w-full md:w-64" />
                    <button className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs px-6 py-3 md:py-4 rounded-r-xl">Subscribe</button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Shop</h4>
                    <ul className="space-y-3 text-sm text-white">
                        <li><Link href="/shop" className="hover:text-[#D4AF37]">All Watches</Link></li>
                        <li><Link href="/checkout" className="hover:text-[#D4AF37]">Cart</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Support</h4>
                    <ul className="space-y-3 text-sm text-white">
                        <li><Link href="/account" className="hover:text-[#D4AF37]">My Account</Link></li>
                        <li><Link href="/contact" className="hover:text-[#D4AF37]">Contact Us</Link></li>
                    </ul>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Policies</h4>
                    <ul className="space-y-3 text-sm text-white">
                        {legalPages.map((page:any, i:number) => (
                           <li key={i}><Link href={`/policies/${page.slug}`} className="hover:text-[#D4AF37]">{page.title}</Link></li>
                        ))}
                    </ul>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Contact</h4>
                    <div className="space-y-2 text-sm text-white">
                        <p>{corporateInfo?.companyName || 'Essential Rush'}</p>
                        <p className="text-gray-400">{corporateInfo?.email || 'support@essential.com'}</p>
                    </div>
                </div>
            </div>
         </div>
         <div className="text-center border-t border-white/10 pt-6">
            <p className="text-[10px] uppercase tracking-[3px] text-gray-600">© {new Date().getFullYear()} Essential Rush. All Rights Reserved.</p>
         </div>
      </footer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(FrontPageStore), { ssr: false });
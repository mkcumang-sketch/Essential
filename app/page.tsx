"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Menu, Search, ShieldCheck, Shield, ShoppingBag, Plus, Sparkles, ChevronDown, Lock, X, Star, CheckCircle, 
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

const Isolated4DHero = ({ config }: { config: any }) => {
  const heroRef = useRef(null);
  const [honeyPot, setHoneyPot] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const rawSlides = config?.heroSlides || [];
  const slides = (rawSlides.length > 0 && rawSlides[0]?.url?.length > 5) 
    ? rawSlides 
    : [{ type: 'video', url: 'https://cdn.pixabay.com/video/2020/05/24/40092-424840899_large.mp4', heading: 'LUXURY WATCHES' }];
  
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
    if (currentSlide.type === 'image') {
      const timer = setTimeout(() => { setCurrentSlideIndex((prev) => (prev + 1) % slides.length); }, 6000); 
      return () => clearTimeout(timer);
    } else if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentSlideIndex, currentSlide?.type, slides.length]);

  return (
    <section ref={heroRef} className="relative h-[120vh] w-full bg-[var(--theme-bg)]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlideIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8 }} style={{ scale: textScale, opacity: textOpacity, y: textY }} className="absolute z-30 text-center pointer-events-none w-full will-change-transform">
            <p className="text-[var(--theme-primary)] text-xs font-bold uppercase tracking-[20px] mb-6 drop-shadow-md">PREMIUM COLLECTION</p>
            <h2 className="text-6xl md:text-[120px] lg:text-[150px] font-serif leading-none tracking-tighter text-white italic font-bold max-w-[95vw] mx-auto drop-shadow-xl">
              {currentSlide?.heading || 'PREMIUM WATCHES'}
            </h2>
          </motion.div>
        </AnimatePresence>
        <motion.div style={{ scale: videoScale, y: videoY }} className="absolute inset-0 w-full h-full z-10 overflow-hidden bg-black pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlideIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 w-full h-full">
              {currentSlide?.type === 'image' ? (
                 <img src={currentSlide.url} className="w-full h-full object-cover opacity-70" />
              ) : (
                 <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-70">
                   <source src={currentSlide?.url} type="video/mp4" />
                 </video>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-transparent to-black/50"></div>
        </motion.div>
      </div>
    </section>
  );
};

const FadeUp = ({ children, delay = 0, className = "" }: any) => (
  <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay }} viewport={{ once: true, margin: "-50px" }} className={className}>{children}</motion.div>
);

function FrontPageStore() {
  const router = useRouter();
  
  // 🌟 NEW FEATURE: Scroll Progress Bar 🌟
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  
  const [liveWatches, setLiveWatches] = useState<any[]>([]); 
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_GALLERY_IMAGES); 
  const [config, setConfig] = useState<any>(null);
  const [liveCelebrities, setLiveCelebrities] = useState<any[]>([]);
  const [liveFaqs, setLiveFaqs] = useState<any[]>([]);
  const [flowingReviews, setFlowingReviews] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [socialLinks, setSocialLinks] = useState<any>(null);
  const [corporateInfo, setCorporateInfo] = useState<any>(null);
  const [legalPages, setLegalPages] = useState<any[]>([]);

  // 🌟 REVIEW SYSTEM STATES 🌟
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ userName: '', comment: '', rating: 5 });
  const [reviewMedia, setReviewMedia] = useState<string[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        const [c, ai, rev] = await Promise.all([
          fetch(`/api/cms?t=${ts}`).catch(()=>null),
          fetch(`/api/products?t=${ts}`).catch(()=>null),
          fetch(`/api/reviews?t=${ts}`).catch(()=>null)
        ]);

        if(c?.ok) { 
            const res = await c.json(); 
            setConfig(res.data || {}); 
            if (res.data?.uiConfig) {
                document.documentElement.style.setProperty('--theme-primary', res.data.uiConfig.primaryColor || '#D4AF37');
                document.documentElement.style.setProperty('--theme-bg', res.data.uiConfig.bgColor || '#050505');
            }
            if (res.data?.galleryImages) setGalleryImages(res.data.galleryImages);
            if (res.data?.faqs) setLiveFaqs(res.data.faqs);
            if (res.data?.visionaries) setLiveCelebrities(res.data.visionaries);
            if (res.data?.socialLinks) setSocialLinks(res.data.socialLinks);
            if (res.data?.corporateInfo) setCorporateInfo(res.data.corporateInfo);
            if (res.data?.legalPages) setLegalPages(res.data.legalPages);
        }
        
        if(ai?.ok) { 
           const res = await ai.json(); 
           setLiveWatches((res.data || []).sort((a:any, b:any) => (b.priority || 0) - (a.priority || 0)));
        }

        if(rev?.ok) {
           const revData = await rev.json();
           // STRICT PUBLIC FILTER
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

  const addToCart = (product: any) => {
    const sessionId = localStorage.getItem('er_session');
    fetch('/api/ai/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, action: 'CART', productId: product._id, category: product.category }) }).catch(()=>{});

    const exists = cart.find(item => item._id === product._id);
    const newCart = exists ? cart.map(i => i._id === product._id ? {...i, qty: i.qty+1} : i) : [...cart, {...product, qty: 1}];
    setCart(newCart);
    localStorage.setItem('luxury_cart', JSON.stringify(newCart));
    router.push('/checkout');
  };
  // 1. Is component ko function ke bahar ya andar kahin bhi rakh sakte ho
const PhantomGuard = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
    <div style={{ position: 'absolute', opacity: 0, zIndex: -1, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <input type="text" name="b_name_fake" value={value} onChange={(e) => onChange(e.target.value)} tabIndex={-1} autoComplete="off" />
    </div>
);

// 2. FrontPageStore function ke andar yeh state add karo
const [honeyPot, setHoneyPot] = useState("");

  const handleCustomerMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (data.success && data.url) {
              setReviewMedia(prev => [...prev, data.url]);
          } else { alert("Media upload failed. Please try again."); }
      } catch(err) { alert("Network error during upload."); } finally { setIsUploadingMedia(false); }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ SECURITY CHECK: Agar bot ne hidden field bhari, toh chup-chaap return kar jao
    if (honeyPot.length > 0) {
        console.log("Bot detected and neutralized.");
        setReviewStatus('success'); // Bot ko lagega wo kamyab ho gaya
        return;
    }

    if (!reviewForm.userName || !reviewForm.comment) {
        return alert("Please fill your identity and experience.");
    }

    setReviewStatus('submitting');
    try {
        const payload = { 
            ...reviewForm, 
            media: reviewMedia, 
            product: 'GLOBAL', 
            visibility: 'pending',
            honeyPot: honeyPot // Backend ko bhi bhej rahe hain validation ke liye
        };
        
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            // 👻 GHOST LOGIC: User ko turant dikhao par DB mein pending rakho
            const localReview = { ...payload, isGhost: true };
            setFlowingReviews(prev => [localReview, ...prev]);
            const existingLocal = JSON.parse(localStorage.getItem('my_ghost_reviews') || '[]');
            localStorage.setItem('my_ghost_reviews', JSON.stringify([localReview, ...existingLocal]));

            setReviewStatus('success');
            setTimeout(() => {
                setIsReviewModalOpen(false);
                setReviewStatus('idle');
                setReviewForm({ userName: '', comment: '', rating: 5 });
                setReviewMedia([]);
                setHoneyPot("");
            }, 2000);
        }
    } catch (err) {
        setReviewStatus('error');
    }
};
  if (isDataLoading) return <div className="h-screen bg-[var(--theme-bg)] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-[#FAFAFA] text-[#050505] font-sans selection:bg-[var(--theme-primary)] selection:text-white overflow-x-hidden">

      {/* 🌟 NEW: SCROLL PROGRESS BAR 🌟 */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[var(--theme-primary)] origin-left z-[500] drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" style={{ scaleX }} />

      {/* 🌟 USER REVIEW MODAL WITH BOT PROTECTION 🌟 */}
<AnimatePresence>
  {isReviewModalOpen && (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 md:p-6 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{scale:0.95}} animate={{scale:1}} className="bg-white p-8 md:p-12 rounded-[40px] w-full max-w-lg relative shadow-2xl">
         <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-6 right-6 bg-gray-100 text-gray-500 rounded-full p-2 hover:bg-black hover:text-white transition-all"><X size={20}/></button>
         
         {reviewStatus === 'success' ? (
             <div className="text-center py-10">
                 <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                 <h3 className="text-3xl font-serif text-black mb-2">Transmission Secure</h3>
                 <p className="text-gray-500 text-sm font-serif italic">Your experience has been logged in our archives.</p>
             </div>
         ) : (
             <>
                 <h3 className="text-3xl font-serif font-bold text-black mb-8 italic">Contribute Experience</h3>
                 
                 <div className="space-y-6">
                     {/* 🛡️ THE TRAP: Invisible to humans, bait for bots */}
                     <PhantomGuard value={honeyPot} onChange={setHoneyPot} />

                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-2 block">Identity</label>
                        <input value={reviewForm.userName} onChange={e=>setReviewForm({...reviewForm, userName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black transition-all" placeholder="e.g. Alexander Kuruvilla"/>
                     </div>
                     
                     <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-2 block">Appraisal</label>
                         <div className="flex gap-2">
                             {[1,2,3,4,5].map(star => (
                                 <button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className={`transition-transform hover:scale-110 ${reviewForm.rating >= star ? 'text-[#D4AF37]' : 'text-gray-200'}`}>
                                     <Star size={32} fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                                 </button>
                             ))}
                         </div>
                     </div>

                     <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-2 block">Chronicle</label>
                         <textarea value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm, comment: e.target.value})} rows={3} className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black custom-scrollbar transition-all" placeholder="Describe the mechanical soul of your asset..."/>
                     </div>
                     
                     {/* MEDIA UPLOAD SECTION */}
                     <div className="border-t border-gray-100 pt-6">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-4 flex items-center gap-2"><Camera size={14} className="text-black"/> Visual Evidence</label>
                         <div className="flex flex-wrap gap-4">
                             {reviewMedia.map((url, idx) => (
                                 <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                                     {url.match(/\.(mp4|webm|mov)$/i) ? <video src={url} className="w-full h-full object-cover"/> : <img src={url} className="w-full h-full object-cover"/>}
                                     <button onClick={()=>setReviewMedia(reviewMedia.filter(x => x !== url))} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Trash2 size={16}/></button>
                                 </div>
                             ))}
                             
                             <div className="relative w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all flex flex-col items-center justify-center cursor-pointer">
                                 {isUploadingMedia ? <RefreshCcw size={20} className="text-[#D4AF37] animate-spin"/> : <><UploadCloud size={20} className="text-gray-400 mb-1"/><span className="text-[8px] font-bold text-gray-500 uppercase">Inject</span></>}
                                 <input type="file" accept="image/*,video/*" onChange={handleCustomerMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploadingMedia}/>
                             </div>
                         </div>
                     </div>

                     <button onClick={handleReviewSubmit} disabled={reviewStatus === 'submitting' || isUploadingMedia} className="w-full py-6 bg-black text-white font-black uppercase tracking-[4px] rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl disabled:opacity-50 text-[11px]">
                         {reviewStatus === 'submitting' ? 'Encrypting Data...' : 'Confirm Secure Submission'}
                     </button>
                 </div>
             </>
         )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <div className="bg-[#00150F] text-[var(--theme-primary)] py-2.5 px-6 md:px-10 flex justify-between items-center text-[9px] font-black uppercase tracking-[4px] z-[200] relative">
        <div className="flex items-center gap-4"><span className="flex items-center gap-2"><Lock size={12}/> Secure 100% Genuine Store</span></div>
        <div className="hidden md:block">Free Insured Shipping Across India</div>
        <div className="flex gap-4"><span>Cash on Delivery Available</span></div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{opacity:0, backdropFilter:'blur(0px)'}} animate={{opacity:1, backdropFilter:'blur(20px)'}} exit={{opacity:0, backdropFilter:'blur(0px)'}} className="fixed inset-0 z-[300] bg-black/80 flex flex-col p-10">
            <div className="flex justify-end mb-20"><X size={32} className="text-[#D4AF37] cursor-pointer hover:rotate-90 transition-transform" onClick={()=>setIsMenuOpen(false)} /></div>
            <nav className="space-y-10 text-center font-serif text-5xl font-black italic tracking-tighter flex flex-col">
                {["Home", "Our Collection", "Our Story", "Checkout"].map((m, i) => (
                    <motion.div key={m} initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: i * 0.1}}>
                        <Link href={m === "Home" ? "/" : m === "Checkout" ? "/checkout" : `#${m.toLowerCase().replace(' ','')}`} onClick={()=>setIsMenuOpen(false)} className="text-white hover:text-[#D4AF37] transition-colors">
                            {m}
                        </Link>
                    </motion.div>
                ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={`fixed w-full z-[150] transition-all duration-500 border-b ${isScrolled ? 'top-0 h-20 bg-white/95 backdrop-blur-xl border-gray-200 shadow-md' : 'top-0 h-28 bg-transparent border-transparent'}`}>
        <div className="flex items-center justify-between px-6 md:px-16 h-full relative">
          <div className="flex items-center gap-6">
            <Menu onClick={()=>setIsMenuOpen(true)} className={`cursor-pointer hover:scale-105 transition-transform ${isScrolled ? 'text-black' : 'text-white'}`} size={28}/>
            <div className={`hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[5px] ${isScrolled ? 'text-gray-600' : 'text-white/80'}`}>
              <Link href="#ourcollection" className="hover:text-[var(--theme-primary)] transition-colors">Collection</Link>
              <Link href="#ourstory" className="hover:text-[var(--theme-primary)] transition-colors">Our Story</Link>
            </div>
          </div>
          
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <h1 className={`text-2xl md:text-3xl font-serif font-black tracking-[10px] uppercase transition-colors ${isScrolled ? 'text-[#050505]' : 'text-white drop-shadow-lg'}`}>Essential</h1>
          </Link>
          
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/account" className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[3px] transition-all cursor-pointer ${isScrolled ? 'bg-black text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-black' : 'bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-black'}`}>
               <ShieldCheck size={14} /> Track Order
            </Link>
            <div className="relative cursor-pointer group" onClick={() => router.push('/checkout')}>
              <ShoppingBag size={24} className={`group-hover:scale-110 transition-transform ${isScrolled ? 'text-black' : 'text-white'}`}/>
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[var(--theme-primary)] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-md">{cart.length}</span>}
            </div>
          </div>
        </div>
      </nav>

      <Isolated4DHero config={config} />

      <section className="bg-white py-12 border-b border-gray-100 overflow-hidden relative z-[40]">
        <div className="flex w-[200%]">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 40, repeat: Infinity }} className="flex gap-20 items-center px-10 will-change-transform">
            {dynamicBrands.concat(dynamicBrands).map((b: any, i: number) => (
              <div key={`brand-${i}`} className="flex items-center gap-8">
                 <span className="text-2xl md:text-4xl font-serif italic tracking-tighter whitespace-nowrap text-gray-300 hover:text-black cursor-default transition-colors">{b}</span>
                 <Sparkles size={16} className="text-[var(--theme-primary)] opacity-40"/>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {latestWatches.length > 0 && (
          <section className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
             <div className="px-6 md:px-12 max-w-[1800px] mx-auto mb-12 flex justify-between items-end">
                <div>
                   <p className="text-[var(--theme-primary)] text-[10px] font-black uppercase tracking-[10px] mb-3">Recently Added</p>
                   <h2 className="text-4xl md:text-5xl font-serif italic text-black tracking-tighter">New Arrivals.</h2>
                </div>
                <div className="hidden md:flex gap-2">
                   <ArrowRight className="text-gray-300 animate-pulse" size={32}/>
                </div>
             </div>

             <div className="w-full overflow-x-auto custom-scrollbar snap-x snap-mandatory scroll-pl-6 md:scroll-pl-12 pb-10">
                 <div className="flex gap-6 px-6 md:px-12 w-max">
                     {latestWatches.map((watch: any, i: number) => (
                         <Link href={`/product/${watch.slug || watch._id}`} key={`horiz-${i}`} className="w-[280px] md:w-[350px] shrink-0 snap-start bg-[#FAFAFA] rounded-[30px] p-6 border border-gray-200 group hover:border-[var(--theme-primary)] hover:shadow-2xl transition-all cursor-pointer relative block">
                            {watch.badge && <span className="absolute top-4 left-4 bg-[#D4AF37] text-black text-[8px] font-black uppercase px-3 py-1 rounded-full z-10 shadow-md">{watch.badge}</span>}
                            <div className="h-48 md:h-64 bg-white rounded-2xl mb-6 p-4 flex items-center justify-center relative overflow-hidden">
                                <img src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <p className="text-[8px] font-black text-[var(--theme-primary)] uppercase tracking-widest mb-1">{watch.brand}</p>
                            <h4 className="text-lg font-serif text-black leading-tight line-clamp-1 mb-4">{watch.name}</h4>
                            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                                <p className="font-mono font-bold text-sm">₹{Number(watch.offerPrice || watch.price || watch.basePrice || 0).toLocaleString('en-IN')}</p>
                                <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-[var(--theme-primary)] transition-colors"><Plus size={14}/></button>
                            </div>
                         </Link>
                     ))}
                 </div>
             </div>
          </section>
      )}

      {/* ================= THE VAULT (MATRIX) ================= */}
      <section id="ourcollection" className="py-32 px-6 md:px-12 max-w-[1800px] mx-auto bg-[#FAFAFA] relative overflow-hidden">
        <div className="absolute top-20 left-0 w-[300px] h-[300px] bg-[var(--theme-primary)] blur-[100px] opacity-10 pointer-events-none rounded-full"></div>

        <div className="flex flex-col xl:flex-row justify-between items-end mb-20 border-b border-gray-200 pb-10 relative z-10">
          <div className="text-left w-full xl:w-1/2">
            <h3 className="text-[var(--theme-primary)] text-[10px] font-black uppercase tracking-[10px] mb-4 flex items-center gap-4"><span className="w-10 h-[2px] bg-[var(--theme-primary)]"></span> Handpicked For You</h3>
            <h2 className="text-6xl md:text-9xl font-serif tracking-tighter leading-none text-[#050505] italic">Our Collection.</h2>
          </div>
          
          <div className="w-full xl:w-auto mt-10 xl:mt-0 flex flex-col items-end gap-6">
             <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm w-full md:w-80 hover:border-black transition-colors focus-within:border-black">
                <Search size={16} className="text-gray-400"/>
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest text-black w-full" placeholder="Search Watches..." />
             </div>
             <div className="flex flex-wrap gap-3 justify-end">
               {categories.map((cat: any, i: number) => (
                 <button key={`cat-${i}`} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#00150F] text-[var(--theme-primary)] shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:border-black hover:text-black'}`}>{cat}</button>
               ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
         {filteredWatches.length === 0 ? (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="col-span-full py-32 text-center flex flex-col items-center justify-center bg-gray-50 rounded-[40px] border border-gray-100">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <Sparkles size={30} className="text-gray-300"/>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Curating the Vault</h3>
                <p className="text-gray-500 font-serif text-lg max-w-md leading-relaxed px-4">
                    Our horologists are currently preparing an exclusive selection of timepieces for this category. Please check back shortly for private acquisitions.
                </p>
                <button onClick={() => {setSearchTerm(''); setActiveCategory('ALL');}} className="mt-8 text-xs font-medium uppercase tracking-widest text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                    View Entire Collection
                </button>
             </motion.div>
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredWatches.map((watch: any, i: number) => (
                <motion.div key={watch._id || `watch-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity:0, scale:0.9}} transition={{ duration: 0.4 }} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 hover:border-[var(--theme-primary)]/30 transition-all duration-500 flex flex-col h-full relative">
                  
                  {watch.badge && <span className="absolute top-8 left-8 bg-[#D4AF37] text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md z-20">{watch.badge}</span>}

                  <div className="flex justify-between items-start mb-6">
                    {watch.stock < 3 ? <span className="bg-red-500 text-white text-[8px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full animate-pulse">Few Left</span> : <span></span>}
                    <p className="text-[9px] font-black text-[var(--theme-primary)] uppercase tracking-[3px] ml-auto">{watch.brand}</p>
                  </div>

                  <Link href={`/product/${watch.slug || watch._id}`} className="flex aspect-[4/5] bg-gray-50 rounded-[30px] overflow-hidden mb-8 items-center justify-center p-8 relative cursor-pointer">
                    <img src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <h4 className="text-2xl font-serif text-[#050505] leading-tight mb-4 tracking-tighter group-hover:text-[var(--theme-primary)] transition-colors line-clamp-2">{watch.name || watch.title}</h4>
                    
                    {watch.amazonDetails && watch.amazonDetails.length > 0 && (
                        <div className="mb-6 space-y-1">
                            {watch.amazonDetails.slice(0, 2).map((d:any, i:number) => (
                                <p key={i} className="text-[10px] font-mono text-gray-500 line-clamp-1"><span className="text-gray-400">{d.key}:</span> {d.value}</p>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-end mt-auto pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                        <div className="flex items-center gap-2">
                           <p className="text-2xl text-black font-black tracking-tighter font-serif">₹{Number(watch.offerPrice || watch.price || watch.basePrice || 0).toLocaleString('en-IN')}</p>
                           {(watch.offerPrice && (watch.price || watch.basePrice) > watch.offerPrice) && <p className="text-gray-300 line-through text-[10px] font-black">₹{Number(watch.price || watch.basePrice || 0).toLocaleString()}</p>}
                        </div>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); addToCart(watch); }} className="p-4 bg-black text-white rounded-2xl hover:bg-[var(--theme-primary)] hover:text-black hover:scale-110 transition-all shadow-lg"><Plus size={20}/></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* DYNAMIC GALLERY OF PRECISION */}
      <section className="py-20 md:py-32 bg-white border-t border-gray-100 hidden md:block">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-6 lg:gap-10 px-10">
          <motion.div style={{ y: y1 }} className="w-1/3 flex flex-col gap-6 lg:gap-10 pt-20">
            <img src={galleryImages[0]} className="w-full h-[300px] lg:h-[400px] object-cover rounded-[30px] lg:rounded-[40px] shadow-lg filter contrast-110 hover:scale-[1.02] transition-transform duration-500" />
            <img src={galleryImages[3]} className="w-full h-[250px] lg:h-[300px] object-cover rounded-[30px] lg:rounded-[40px] shadow-lg filter contrast-110 hover:scale-[1.02] transition-transform duration-500" />
          </motion.div>
          <div className="w-1/3 flex flex-col gap-6 lg:gap-10">
            <div className="text-center py-10 px-4">
              <FadeUp><p className="text-[var(--theme-primary)] text-[8px] lg:text-[10px] font-black uppercase tracking-[10px] lg:tracking-[15px] mb-6">Craftsmanship</p></FadeUp>
              <FadeUp delay={0.1}><h2 className="text-5xl lg:text-7xl font-serif tracking-tighter mb-8 leading-[0.9]">The Art <br/><span className="italic text-gray-300">Of Time</span></h2></FadeUp>
              <FadeUp delay={0.2}><p className="text-gray-500 font-serif italic text-lg lg:text-xl leading-relaxed">"Where microscopic mechanical engineering meets aesthetic transcendence."</p></FadeUp>
            </div>
            <img src={galleryImages[2]} className="w-full h-[400px] lg:h-[500px] object-cover rounded-[30px] lg:rounded-[40px] shadow-lg filter contrast-110 hover:scale-[1.02] transition-transform duration-500" />
          </div>
          <motion.div style={{ y: y2 }} className="w-1/3 flex flex-col gap-6 lg:gap-10 pt-40">
            <img src={galleryImages[4]} className="w-full h-[350px] lg:h-[450px] object-cover rounded-[30px] lg:rounded-[40px] shadow-lg filter contrast-110 hover:scale-[1.02] transition-transform duration-500" />
            <img src={galleryImages[5]} className="w-full h-[250px] lg:h-[350px] object-cover rounded-[30px] lg:rounded-[40px] shadow-lg filter contrast-110 hover:scale-[1.02] transition-transform duration-500" />
          </motion.div>
        </div>
      </section>

      <section id="ourstory" className="py-32 md:py-48 bg-[#00150F] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--theme-primary)] blur-[100px] opacity-10 rounded-full pointer-events-none"></div>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className={config?.aboutConfig?.alignment === 'right' ? 'lg:order-2 text-right' : config?.aboutConfig?.alignment === 'center' ? 'text-center col-span-full max-w-4xl mx-auto' : 'text-left'}>
            <FadeUp>
                <p className={`text-[var(--theme-primary)] text-[10px] font-black uppercase tracking-[10px] mb-8 flex items-center gap-4 ${config?.aboutConfig?.alignment === 'center' ? 'justify-center' : config?.aboutConfig?.alignment === 'right' ? 'justify-end' : ''}`}>
                    <span className="w-10 h-px bg-[var(--theme-primary)]"></span> {config?.aboutConfig?.title || "Our Story"}
                </p>
            </FadeUp>
            <FadeUp delay={0.1}>
                <h2 className="text-5xl md:text-8xl font-serif leading-[0.9] tracking-tighter mb-10 italic text-gray-100">
                    Legacy is a <br/><span className="text-[var(--theme-primary)] not-italic font-black">Masterpiece.</span>
                </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
                <p className={`text-gray-400 text-xl leading-relaxed font-serif italic font-light ${config?.aboutConfig?.alignment === 'center' ? 'mx-auto' : ''}`}>
                  {(config?.aboutConfig?.content || "Essential Rush was founded to protect, curate, and distribute the world's most significant mechanical art pieces.").split(' ').map((word: string, idx: number) => {
                     const isBold = config?.aboutConfig?.boldWords?.split(',').map((w:string)=>w.trim().toLowerCase()).includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''));
                     return isBold ? <strong key={`bold-${idx}`} className="font-black not-italic text-white"> {word} </strong> : <span key={`reg-${idx}`}> {word} </span>;
                  })}
                </p>
            </FadeUp>
          </div>
          {config?.aboutConfig?.alignment !== 'center' && (
              <FadeUp delay={0.3} className="relative group h-[600px] w-full bg-white/5 rounded-[50px] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=1200" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt="Heritage" />
              </FadeUp>
          )}
        </div>
      </section>

      <section className="py-32 md:py-48 bg-white border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <FadeUp>
             <div className="text-center mb-24">
                <h2 className="text-5xl md:text-8xl font-serif mb-6 text-[#050505] tracking-tighter leading-none italic">Worn By Icons</h2>
                <p className="text-[var(--theme-primary)] uppercase tracking-[10px] text-[9px] font-black flex items-center justify-center gap-4"><span className="w-8 h-px bg-[var(--theme-primary)]"></span> TRUSTED BY ELITES <span className="w-8 h-px bg-[var(--theme-primary)]"></span></p>
             </div>
          </FadeUp>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {liveCelebrities.length === 0 ? (
               [1, 2, 3].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-[40px] animate-pulse"></div>)
            ) : liveCelebrities.map((celeb: any, i: number) => (
              <FadeUp key={celeb._id || i} delay={i * 0.1}>
                <div className="group relative aspect-[3/4] rounded-[50px] overflow-hidden bg-[#050505] shadow-xl">
                  {celeb.img && <img src={celeb.img} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-90 p-10 flex flex-col justify-end translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="text-white text-3xl font-serif mb-2 tracking-tighter">{celeb.name}</h4>
                      <span className="text-[10px] uppercase font-black tracking-[3px] text-[var(--theme-primary)]">{celeb.watch}</span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 🌟 REVIEWS FLOWING SECTION 🌟 */}
      <section id="reviews" className="py-24 bg-white border-t border-gray-100 overflow-hidden relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--theme-primary)] blur-[120px] opacity-10 rounded-full pointer-events-none"></div>

          <div className="text-center mb-20 relative z-10 px-6">
             <h2 className="text-5xl md:text-8xl font-serif italic mb-6 text-[#050505] tracking-tighter leading-none">Customer <br/><span className="text-gray-300">Reviews</span></h2>
             <p className="text-[var(--theme-primary)] uppercase tracking-[10px] text-[9px] font-black flex items-center justify-center gap-4"><span className="w-8 h-px bg-[var(--theme-primary)]"></span> 100% VERIFIED BUYERS <span className="w-8 h-px bg-[var(--theme-primary)]"></span></p>
             <button onClick={() => setIsReviewModalOpen(true)} className="mt-10 px-10 py-5 bg-[#050505] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[var(--theme-primary)] hover:text-black hover:scale-105 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center mx-auto gap-2">
                 <Camera size={14}/> Write a Review
             </button>
          </div>

          {flowingReviews.length > 0 && (
              <div className="flex w-[200%] relative z-10">
                <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: flowingReviews.length * 10, repeat: Infinity }} className="flex gap-10 items-stretch px-10 will-change-transform hover:[animation-play-state:paused]">
                    {flowingReviews.concat(flowingReviews).map((rev: any, i: number) => (
                        <div key={i} className="flex-shrink-0 w-[450px] bg-[#FAFAFA] border border-gray-100 p-10 rounded-[35px] flex flex-col justify-between group hover:border-[var(--theme-primary)]/40 hover:shadow-xl transition-all duration-500 shadow-sm relative overflow-hidden">
                            {rev.isGhost && <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20"></div>}

                            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none ${rev.rating >= 4 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                            <div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div>
                                        <p className="font-serif italic text-2xl text-black leading-none mb-1">{rev.userName}</p>
                                        <p className="text-[9px] text-[var(--theme-primary)] font-black uppercase tracking-widest">Verified Purchase</p>
                                    </div>
                                    <ShieldCheck size={18} className="text-[var(--theme-primary)] opacity-60"/>
                                </div>
                                <div className="flex gap-1 text-[var(--theme-primary)] mb-5">
                                    {[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={14} fill="currentColor"/>)}
                                </div>
                                <p className="text-gray-600 font-serif italic text-base leading-relaxed relative z-10 line-clamp-4">"{rev.comment}"</p>

                                {rev.media && rev.media.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto custom-scrollbar pt-4 mt-4 border-t border-gray-200">
                                        {rev.media.map((mediaUrl: string, mIdx: number) => (
                                            mediaUrl.match(/\.(mp4|webm|mov)$/i) ? (
                                                <video key={mIdx} src={mediaUrl} controls className="h-16 w-16 object-cover rounded-xl border border-gray-200 shrink-0" />
                                            ) : (
                                                <img key={mIdx} src={mediaUrl} alt="Review attachment" className="h-16 w-16 object-cover rounded-xl border border-gray-200 shrink-0 cursor-pointer hover:scale-105 transition-transform" />
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3 pt-6 mt-8 border-t border-gray-200 relative z-10">
                               <CheckCircle size={16} className="text-green-500"/>
                               <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Feedback Verified</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
              </div>
          )}
      </section>

      <section className="py-32 md:py-48 bg-[#FAFAFA] border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
           <FadeUp><h2 className="text-5xl md:text-7xl font-serif text-center mb-20 text-[#050505] tracking-tighter leading-none">Frequently <br/><span className="italic text-gray-400">Asked Questions</span></h2></FadeUp>
           <div className="space-y-4">
              {liveFaqs.length === 0 ? <p className="text-center text-gray-400 font-serif italic">No Questions added yet.</p> : liveFaqs.map((faq: any, i: number) => (
                <div key={faq._id || i} className={`bg-white rounded-[30px] overflow-hidden border transition-all duration-300 ${openFaq === i ? 'border-[var(--theme-primary)] shadow-md' : 'border-gray-100 hover:border-gray-300'}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-8 py-6 text-left flex justify-between items-center group">
                    <span className="font-serif italic text-xl md:text-2xl text-[#050505] pr-6">{faq.q}</span>
                    <div className={`p-3 rounded-full transition-transform duration-300 shrink-0 ${openFaq === i ? 'bg-[var(--theme-primary)] text-black rotate-180' : 'bg-gray-50 text-black group-hover:bg-gray-200'}`}><ChevronDown size={20}/></div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{duration: 0.3}} className="px-8 pb-8">
                          <div className="w-10 h-px bg-[var(--theme-primary)] mb-6"></div>
                          <p className="text-gray-500 text-base font-serif italic">{faq.a}</p>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 🌟 MASSIVE MEGA FOOTER 🌟 */}
      <footer className="bg-black text-white pt-24 pb-12 border-t-[10px] border-[#D4AF37]">
         <div className="max-w-[1800px] mx-auto px-6 md:px-16">
            
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-16 mb-16 gap-10">
                <div className="text-center md:text-left">
                    <h3 className="text-sm font-black uppercase tracking-[5px] text-white/50 mb-2">Subscribe to our</h3>
                    <h2 className="text-5xl md:text-6xl font-serif italic font-black text-white tracking-tighter">Newsletter</h2>
                    <p className="text-sm text-gray-400 mt-4 max-w-sm">Stay updated with the latest offers, trends and launches. Get exclusive invite to private sales and much more.</p>
                </div>
                <div className="flex w-full md:w-auto">
                    <input type="email" placeholder="Your email address" className="bg-transparent border-b border-white/20 p-4 text-white outline-none focus:border-[#D4AF37] w-full md:w-80 font-mono text-sm" />
                    <button className="bg-red-600 text-white font-black uppercase tracking-widest text-xs px-8 py-4 ml-4 hover:bg-red-700 transition-colors">Subscribe</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
                
                <div className="space-y-6">
                    <h4 className="text-lg font-black uppercase tracking-widest text-white mb-8">Online Shopping</h4>
                    <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link></li>
                        {categories.slice(1,6).map((cat:any, i) => (
                           <li key={i}><button onClick={()=>{setActiveCategory(cat); router.push('#ourcollection');}} className="hover:text-[#D4AF37] transition-colors text-left">{cat}</button></li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-lg font-black uppercase tracking-widest text-white mb-8">Customer Policies</h4>
                    <ul className="space-y-4 text-sm font-bold text-gray-400">
                        {legalPages.map((page:any, i:number) => (
                           <li key={i}><Link href={`/policies/${page.slug}`} className="hover:text-[#D4AF37] transition-colors">{page.title}</Link></li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-lg font-black uppercase tracking-widest text-white mb-8">Useful Links</h4>
                    <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link href="/account" className="hover:text-[#D4AF37] transition-colors">My Account</Link></li>
                        <li><Link href="#ourstory" className="hover:text-[#D4AF37] transition-colors">About Us</Link></li>
                        <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Our Stores</Link></li>
                        <li><Link href="#" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link></li>
                        <li><Link href="/godmode" className="hover:text-[#D4AF37] transition-colors">Admin Dashboard</Link></li>
                    </ul>
                </div>

                <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
                    <h4 className="text-lg font-black uppercase tracking-widest text-white mb-8">Corporate Address</h4>
                    <div className="space-y-4 text-sm font-bold text-gray-400 flex flex-col items-center md:items-start">
                        <p className="text-white">{corporateInfo?.companyName || 'Essential Rush Pvt Ltd'}</p>
                        <p className="flex items-center gap-3 text-center md:text-left"><MapPin size={16} className="text-red-500 shrink-0"/> {corporateInfo?.address || 'Corporate Drive, Cochin - 682031'}</p>
                        {corporateInfo?.phone1 && <p className="flex items-center gap-3"><Phone size={16} className="text-green-500 shrink-0"/> {corporateInfo.phone1}</p>}
                        {corporateInfo?.phone2 && <p className="flex items-center gap-3"><Phone size={16} className="text-green-500 shrink-0"/> {corporateInfo.phone2}</p>}
                        <p className="flex items-center gap-3"><Mail size={16} className="text-white shrink-0"/> {corporateInfo?.email || 'support@essentialrush.com'}</p>
                    </div>
                    
                    <div className="flex gap-3 mt-8">
                        {socialLinks?.facebook && <a href={socialLinks.facebook} target="_blank" className="w-10 h-10 rounded bg-[#3b5998] flex items-center justify-center hover:opacity-80 transition-opacity"><Facebook size={18}/></a>}
                        {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank" className="w-10 h-10 rounded bg-[#E1306C] flex items-center justify-center hover:opacity-80 transition-opacity"><Instagram size={18}/></a>}
                        {socialLinks?.youtube && <a href={socialLinks.youtube} target="_blank" className="w-10 h-10 rounded bg-[#FF0000] flex items-center justify-center hover:opacity-80 transition-opacity"><Youtube size={18}/></a>}
                        {socialLinks?.linkedin && <a href={socialLinks.linkedin} target="_blank" className="w-10 h-10 rounded bg-[#0077b5] flex items-center justify-center hover:opacity-80 transition-opacity"><Linkedin size={18}/></a>}
                        {socialLinks?.twitter && <a href={socialLinks.twitter} target="_blank" className="w-10 h-10 rounded bg-[#1DA1F2] flex items-center justify-center hover:opacity-80 transition-opacity"><Twitter size={18}/></a>}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 pt-10 mt-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-white mb-4">Popular Searches</p>
                <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
                    {config?.aboutConfig?.boldWords || 'Watches for Men | Women\'s Watches | SmartWatches | Wedding Gifts | Fashion Brands | Leather Watches | Chronograph Watches | Luxury Watches | Swiss Made Watches | Gold Watches'}
                </p>
            </div>

         </div>

         <div className="text-center border-t border-white/10 mt-10 pt-6">
            <p className="text-[10px] font-black uppercase tracking-[5px] text-gray-600">© 2026 Essential Rush Enterprise. All Rights Reserved.</p>
         </div>
      </footer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(FrontPageStore), { ssr: false });
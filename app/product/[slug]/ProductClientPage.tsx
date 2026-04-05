"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    ShoppingBag, ArrowLeft, Star, Box, Video as VideoIcon, CheckCircle, User, X, Camera, UploadCloud, RefreshCcw, 
    ShieldCheck, Truck, Clock, ChevronDown, Lock
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/context/ToastContext'; 
import { optimizeImage } from '@/utils/optimizeimage'; 

// 🌟 GUEST LEAD CAPTURE MODAL 🌟
const GuestLeadModal = ({ isOpen, onClose, onSubmit, productPrice }: any) => {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!phone) return;
        setLoading(true);
        
        try {
            // Sends lead to Recovery Vault pipeline
            await fetch(`/api/cart/verify-lead?t=${Date.now()}`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, name, cartTotal: productPrice, cartItems: [] }) 
            });
            // Marks browser so we don't ask again for this specific user
            localStorage.setItem("guest_lead_captured", "true");
            onSubmit(); 
        } catch (error) {
            onSubmit(); // Proceed to cart even if analytics fail
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full relative shadow-[0_0_50px_rgba(212,175,55,0.15)]"
                    >
                        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors bg-gray-100 p-2 rounded-full"><X size={18}/></button>
                        
                        <div className="w-16 h-16 bg-black text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"><Lock size={24}/></div>
                        
                        <h3 className="text-3xl font-serif font-bold text-center text-black mb-2">Secure Your Slot</h3>
                        <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest mb-8 font-black">Pre-register to acquire this limited asset.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block pl-2">Identity</label>
                                <input required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl text-sm outline-none focus:border-black transition-colors" placeholder="Full Name" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block pl-2">Direct Contact</label>
                                <input required value={phone} onChange={e=>setPhone(e.target.value)} type="tel" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl text-sm outline-none focus:border-black transition-colors" placeholder="Phone Number / WhatsApp" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-5 bg-black text-[#D4AF37] font-black uppercase tracking-[4px] rounded-2xl text-xs hover:bg-[#D4AF37] hover:text-black transition-all mt-6 shadow-xl disabled:opacity-50">
                                {loading ? 'Please wait...' : 'Continue'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};


export default function ProductClientPage({ initialProduct, slug }: { initialProduct: any, slug: string }) {
    const router = useRouter();
    const { showToast } = useToast();
    const { data: session } = useSession();
    
    const [product, setProduct] = useState<any>(initialProduct);
    const [cart, setCart] = useState<any[]>([]);
    const [activeMedia, setActiveMedia] = useState<{type: 'image'|'video'|'3d', url: string}>({ type: 'image', url: '' });
    const [validImages, setValidImages] = useState<string[]>([]);
    const [activeAccordion, setActiveAccordion] = useState<string | null>('description');
    
    // Lead Capture State
    const [showLeadModal, setShowLeadModal] = useState(false);

    // Reviews State
    const [productReviews, setProductReviews] = useState<any[]>([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewForm, setReviewForm] = useState({ userName: '', comment: '', rating: 5 });
    const [reviewMedia, setReviewMedia] = useState<string[]>([]);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [reviewStatus, setReviewStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('luxury_cart') || '[]'));
        
        // Initialize Media
        const allImgs = [initialProduct.imageUrl, ...(initialProduct.images || [])].filter(Boolean);
        setValidImages(allImgs); 
        if (allImgs.length > 0) setActiveMedia({ type: 'image', url: allImgs[0] });

        // Fetch Reviews Silently
        const fetchReviews = async () => {
            try {
                const ts = new Date().getTime();
                const revRes = await fetch(`/api/reviews?t=${ts}`).then(r => r.json());
                let pubReviews = (revRes.data || []).filter((r: any) => (r.product === initialProduct._id || r.product === 'GLOBAL') && r.visibility === 'public');
                const localReviews = JSON.parse(localStorage.getItem('my_ghost_reviews') || '[]').filter((r: any) => (r.product === initialProduct._id || r.product === 'GLOBAL') && !pubReviews.some((p:any)=>p.userName === r.userName));
                setProductReviews([...localReviews, ...pubReviews]);
            } catch(e) { console.error("Review Sync Error", e); }
        };
        fetchReviews();
    }, [initialProduct]);

    // 🚨 MODIFIED: Enterprise Pre-Capture Logic (SILENT & POPUP) 🚨
    const handleAddToCartClick = () => {
        const isGuestTracked = localStorage.getItem("guest_lead_captured");
        
        if (session?.user) {
            // LOGGED IN USER: Silently capture Recovery Vault lead in background
            fetch(`/api/cart/verify-lead?t=${Date.now()}`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: session.user.name, 
                    email: session.user.email,
                    phone: (session.user as any).phone || '', 
                    cartTotal: product.offerPrice || product.price,
                    cartItems: [{ _id: product._id, name: product.name, price: product.offerPrice || product.price, qty: 1 }]
                }) 
            }).catch(() => {}); // Catch silent errors so UI doesn't break
            
            executeFinalAddToCart();
        } else if (!isGuestTracked) {
            // GUEST USER: Show Modal for the first time to get phone number
            setShowLeadModal(true);
        } else {
            // GUEST USER: Already provided info previously, just add to cart
            executeFinalAddToCart();
        }
    };

    // ORIGINAL CART LOGIC
    const executeFinalAddToCart = () => {
        const sessionId = localStorage.getItem('er_session');
        fetch('/api/ai/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, action: 'CART', productId: product._id, category: product.category }) }).catch(()=>{});

        const newCart = [...cart, { ...product, qty: 1 }];
        setCart(newCart); 
        localStorage.setItem('luxury_cart', JSON.stringify(newCart)); 
        
        setShowLeadModal(false); 
        showToast("Added to your saved list!", "success");
        setTimeout(() => router.push('/cart'), 500);
    };

    const handleUpload = async (e: any) => {
        const file = e.target.files?.[0]; 
        if (!file) return; 
        setIsUploadingMedia(true);
        const fd = new FormData(); 
        fd.append("file", file);
        try { 
            const res = await fetch("/api/upload", { method: "POST", body: fd }); 
            const data = await res.json(); 
            if(data.success) setReviewMedia(p=>[...p, data.url]); 
            else showToast("Upload failed. Secure connection interrupted.", "error");
        } catch(e){ showToast("Network Error connecting to secure server.", "error"); } 
        finally { setIsUploadingMedia(false); }
    }

    const submitReview = async () => {
        if (!reviewForm.userName || !reviewForm.comment) return showToast("Please provide your identity and experience.", "error");
        setReviewStatus('submitting');
        
        const payload = { ...reviewForm, media: reviewMedia, product: product._id, visibility: 'pending', isAdminGenerated: false };
        
        try {
            const res = await fetch('/api/reviews', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
            if(res.ok) {
                const localRev = {...payload, isGhost: true}; 
                setProductReviews(p=>[localRev, ...p]);
                localStorage.setItem('my_ghost_reviews', JSON.stringify([localRev, ...JSON.parse(localStorage.getItem('my_ghost_reviews')||'[]')]));
                
                setReviewStatus('success'); 
                setTimeout(() => { setIsReviewModalOpen(false); setReviewStatus('idle'); setReviewForm({ userName: '', comment: '', rating: 5 }); setReviewMedia([]); }, 2000);
            } else {
                showToast("Failed to transmit review.", "error");
                setReviewStatus('idle');
            }
        } catch (e) {
            showToast("Secure connection interrupted.", "error");
            setReviewStatus('idle');
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-[#D4AF37] selection:text-white pb-20">
            
            {/* LUXURY HEADER */}
            <header className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-200 py-6 px-6 md:px-12 flex justify-between items-center z-50 sticky top-0 shadow-sm">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"><ArrowLeft size={16}/> Back to shop</Link>
                <h1 className="text-2xl font-serif font-black tracking-[5px] uppercase absolute left-1/2 -translate-x-1/2">Essential</h1>
                <div className="relative cursor-pointer group" onClick={() => router.push('/cart')}>
                    <ShoppingBag size={24} className="text-black group-hover:scale-110 transition-transform"/>
                    {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-md">{cart.length}</span>}
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto py-16 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                
                {/* LEFT: CINEMATIC MEDIA GALLERY */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="aspect-[4/5] md:aspect-square bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm relative overflow-hidden flex items-center justify-center group">
                        {product.badge && <span className="absolute top-8 left-8 bg-[#D4AF37] text-black text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest z-20 shadow-lg">{product.badge}</span>}
                        {product.stock < 3 && product.stock > 0 && <span className="absolute top-8 right-8 bg-red-500 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest z-20 shadow-lg animate-pulse">Low Stock</span>}
                        
                        <AnimatePresence mode="wait">
                            {activeMedia.type === 'image' && (
                                <motion.img 
                                    key={activeMedia.url} 
                                    initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0}} transition={{duration:0.4}} 
src={activeMedia?.url ? optimizeImage(activeMedia.url) : '/placeholder-watch.png'} 
// Ya fir agar optimizeImage string return nahi karta null/empty par, toh seedha ye laga:
// src={activeMedia?.url || '/placeholder-watch.png'}                                    alt={product.seo?.imageAltTexts?.[activeMedia.url] || `${product.name} Main View`}
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                                />
                            )}
                            {activeMedia.type === 'video' && (
                                <motion.video key="vid" initial={{opacity:0}} animate={{opacity:1}} autoPlay loop muted playsInline className="w-full h-full object-cover rounded-3xl"><source src={activeMedia.url}/></motion.video>
                            )}
                            {activeMedia.type === '3d' && (
                                <motion.iframe key="3d" initial={{opacity:0}} animate={{opacity:1}} src={activeMedia.url} className="w-full h-full border-none rounded-3xl"/>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 pt-2">
                        {validImages.map((img, i) => (
                            <button key={i} onClick={()=>setActiveMedia({type:'image', url:img})} className={`w-24 h-28 shrink-0 border-2 rounded-2xl overflow-hidden transition-all duration-300 ${activeMedia.url === img ? 'border-black shadow-md scale-105' : 'border-transparent bg-white hover:border-gray-200'}`}>
                                <img src={optimizeImage(img)} alt={product.seo?.imageAltTexts?.[img] || `${product.name} Thumbnail ${i+1}`} className="w-full h-full object-contain mix-blend-multiply p-2"/>
                            </button>
                        ))}
                        {product.videoUrl && (
                            <button onClick={()=>setActiveMedia({type:'video', url:product.videoUrl})} className={`w-24 h-28 shrink-0 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${activeMedia.type === 'video' ? 'border-black bg-gray-100 shadow-md scale-105' : 'border-transparent bg-gray-50 hover:border-gray-200 text-gray-500 hover:text-black'}`}>
                                <VideoIcon size={24}/><span className="text-[9px] font-black uppercase tracking-widest">Play</span>
                            </button>
                        )}
                        {product.model3DUrl && (
                            <button onClick={()=>setActiveMedia({type:'3d', url:product.model3DUrl})} className={`w-24 h-28 shrink-0 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 ${activeMedia.type === '3d' ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] shadow-md scale-105' : 'border-transparent bg-[#D4AF37]/5 text-[#D4AF37]/60 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]'}`}>
                                <Box size={24}/><span className="text-[9px] font-black uppercase tracking-widest">3D View</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* RIGHT: PRODUCT INFO & ACCORDIONS */}
                <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-10">
                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[4px] mb-4 flex items-center gap-2">
                        <ShieldCheck size={14}/> Certified Authentic
                    </p>
                    <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand}</h2>
                    <h1 className="text-4xl md:text-5xl font-serif text-black leading-[1.1] mb-6 tracking-tighter">{product.name}</h1>
                    
                    <div className="flex items-end gap-4 mb-8 pb-8 border-b border-gray-200">
                        <p className="text-4xl font-serif font-black text-black">₹{Number(product.offerPrice || product.price).toLocaleString('en-IN')}</p>
                        {(product.offerPrice && product.price > product.offerPrice) && (
                            <p className="text-gray-400 line-through text-lg font-serif mb-1">₹{Number(product.price).toLocaleString()}</p>
                        )}
                    </div>

                    <div className="space-y-4 mb-10">
                        {/* Accordion 1: Description */}
                        <div className={`border rounded-2xl transition-all duration-300 ${activeAccordion === 'description' ? 'border-black bg-white shadow-sm' : 'border-gray-200 bg-transparent'}`}>
                            <button onClick={() => setActiveAccordion(activeAccordion === 'description' ? null : 'description')} className="w-full p-5 flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                                The Story <ChevronDown size={18} className={`transition-transform duration-300 ${activeAccordion === 'description' ? 'rotate-180' : ''}`}/>
                            </button>
                            <AnimatePresence>
                                {activeAccordion === 'description' && (
                                    <motion.div initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} className="overflow-hidden px-5 pb-5">
                                        <p className="text-gray-600 font-serif text-base leading-relaxed italic">{product.description || "A masterpiece of meticulous craftsmanship."}</p>
                                        {product.amazonDetails && product.amazonDetails.length > 0 && (
                                            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                                                {product.amazonDetails.map((detail: any, i: number) => detail.key && detail.value && (
                                                    <div key={i}>
                                                        <p className="text-[9px] uppercase font-black tracking-widest text-gray-400 mb-1">{detail.key}</p>
                                                        <p className="font-serif font-bold text-sm text-black">{detail.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Accordion 2: Shipping */}
                        <div className={`border rounded-2xl transition-all duration-300 ${activeAccordion === 'shipping' ? 'border-black bg-white shadow-sm' : 'border-gray-200 bg-transparent'}`}>
                            <button onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')} className="w-full p-5 flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                                Delivery & Returns <ChevronDown size={18} className={`transition-transform duration-300 ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`}/>
                            </button>
                            <AnimatePresence>
                                {activeAccordion === 'shipping' && (
                                    <motion.div initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} className="overflow-hidden px-5 pb-5 space-y-4">
                                        <div className="flex gap-4 items-start"><Truck size={20} className="text-[#D4AF37] shrink-0 mt-1"/><div><p className="font-bold text-sm">Insured Global Shipping</p><p className="text-xs text-gray-500 mt-1">Complimentary fully insured delivery via secure courier within 3-5 business days.</p></div></div>
                                        <div className="flex gap-4 items-start"><Clock size={20} className="text-[#D4AF37] shrink-0 mt-1"/><div><p className="font-bold text-sm">14-Day Returns</p><p className="text-xs text-gray-500 mt-1">Returns accepted within 14 days in unworn condition.</p></div></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="mt-auto">
                        {/* 🚨 THE SECURE ACQUISITION BUTTON 🚨 */}
                        <button onClick={handleAddToCartClick} className="w-full py-6 bg-black text-white rounded-[20px] font-black uppercase text-sm tracking-[4px] hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-3">
                            <ShoppingBag size={18}/> Add to cart
                        </button>
                    </div>
                </div>
            </main>
            
            {/* 🌟 REVIEWS ENGINE SECTION 🌟 */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-12 pb-32 pt-20 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-serif text-black mb-3">Client Experiences</h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-[#D4AF37]">
                            <Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500 ml-3">Based on {productReviews.length} verifications</span>
                        </div>
                    </div>
                    <button onClick={() => setIsReviewModalOpen(true)} className="mt-8 md:mt-0 px-10 py-5 bg-white border border-gray-200 shadow-sm text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:border-black hover:bg-black hover:text-white transition-all flex items-center gap-3">
                        <Camera size={16}/> Contribute Experience
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {productReviews.length === 0 ? (
                        <div className="col-span-full py-20 text-center border border-dashed border-gray-300 rounded-[30px] bg-white">
                            <ShieldCheck size={40} className="text-gray-300 mx-auto mb-4"/>
                            <p className="text-gray-500 font-serif text-xl italic">No recorded experiences yet for this asset.</p>
                        </div>
                    ) : productReviews.map((rev, i) => (
                        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} key={i} className="bg-white p-8 md:p-10 rounded-[30px] border border-gray-100 shadow-sm relative overflow-hidden group hover:border-[#D4AF37]/30 transition-colors">
                            {rev.isGhost && <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500/40"></div>}
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400"><User size={20}/></div>
                                    <div>
                                        <p className="font-bold text-lg text-black">{rev.userName}</p>
                                        <p className="text-[9px] text-green-600 font-black uppercase tracking-widest flex items-center gap-1 mt-0.5"><CheckCircle size={10}/> Checked by us</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 text-[#D4AF37]">{[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={14} fill="currentColor"/>)}</div>
                            </div>
                            
                            <p className="text-gray-600 text-base font-serif italic leading-relaxed mb-6">"{rev.comment}"</p>
                            
                            {rev.media && rev.media.length > 0 && (
                                <div className="flex gap-3 overflow-x-auto custom-scrollbar pt-4 border-t border-gray-100">
                                    {rev.media.map((mediaUrl: string, mIdx: number) => (
                                        mediaUrl.match(/\.(mp4|webm|mov)$/i) ? 
                                            <video key={mIdx} src={mediaUrl} controls playsInline preload="none" className="h-24 w-24 object-cover rounded-2xl border border-gray-200 shrink-0" /> : 
                                            <img key={mIdx} src={mediaUrl} className="h-24 w-24 object-cover rounded-2xl border border-gray-200 shrink-0 hover:scale-[1.02] transition-transform cursor-pointer" />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 🌟 REVIEW UPLOAD MODAL 🌟 */}
            <AnimatePresence>
                {isReviewModalOpen && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                        <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-white p-8 md:p-12 rounded-[40px] w-full max-w-lg relative my-8 shadow-2xl">
                            <button onClick={()=>setIsReviewModalOpen(false)} className="absolute top-6 right-6 bg-gray-100 text-gray-500 rounded-full p-2 hover:bg-gray-200 hover:text-black transition-colors"><X size={20}/></button>
                            
                            {reviewStatus === 'success' ? (
                                <div className="text-center py-12">
                                    <CheckCircle size={60} className="text-green-500 mx-auto mb-6" />
                                    <h3 className="text-3xl font-serif text-black mb-2">Transmission Secure</h3>
                                    <p className="text-gray-500 text-sm font-serif italic">Your experience has been securely logged.</p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-3xl font-serif text-black mb-8">Your Experience</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Identity</label>
                                            <input value={reviewForm.userName} onChange={e=>setReviewForm({...reviewForm, userName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black transition-colors" placeholder="e.g. James Bond"/>
                                        </div>
                                        
                                        <div>
                                            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Your rating</label>
                                            <div className="flex gap-2">
                                                {[1,2,3,4,5].map(star => (
                                                    <button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className={`transition-all hover:scale-110 ${reviewForm.rating >= star ? 'text-[#D4AF37]' : 'text-gray-300'}`}><Star size={32} fill={reviewForm.rating >= star ? "currentColor" : "none"} /></button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2 block">Chronicle</label>
                                            <textarea value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm, comment: e.target.value})} rows={3} className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl text-sm outline-none focus:border-black custom-scrollbar transition-colors" placeholder="Tell us what you think about this watch..."/>
                                        </div>
                                        
                                        <div className="border-t border-gray-100 pt-6">
                                            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4 flex items-center gap-2"><Camera size={14} className="text-black"/> Visual Evidence (Optional)</label>
                                            <div className="flex flex-wrap gap-4">
                                                {reviewMedia.map((url, idx) => (
                                                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                                        {url.match(/\.(mp4|webm|mov)$/i) ? <video src={url} playsInline preload="none" className="w-full h-full object-cover"/> : <img src={url} className="w-full h-full object-cover"/>}
                                                        <button onClick={()=>setReviewMedia(reviewMedia.filter(x => x !== url))} className="absolute top-1 right-1 bg-black/80 backdrop-blur-sm text-white rounded-full p-1 hover:bg-red-500 transition-colors"><X size={12}/></button>
                                                    </div>
                                                ))}
                                                <div className="relative w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-colors flex flex-col items-center justify-center cursor-pointer">
                                                    {isUploadingMedia ? <RefreshCcw size={20} className="text-gray-400 animate-spin"/> : <><UploadCloud size={20} className="text-gray-400 mb-1"/><span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Select</span></>}
                                                    <input type="file" accept="image/*,video/*" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploadingMedia}/>
                                                </div>
                                            </div>
                                        </div>

                                        <button onClick={submitReview} disabled={reviewStatus === 'submitting' || isUploadingMedia} className="w-full py-5 bg-black text-white font-black uppercase tracking-[4px] rounded-2xl text-xs hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-50 shadow-lg mt-4">
                                            {reviewStatus === 'submitting' ? 'Encrypting...' : 'Secure Transmission'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🌟 MOUNTING THE PRE-CAPTURE LEAD MODAL 🌟 */}
            <GuestLeadModal 
                isOpen={showLeadModal} 
                onClose={() => setShowLeadModal(false)} 
                onSubmit={executeFinalAddToCart} 
                productPrice={product.offerPrice || product.price} 
            />

        </div>
    );
}
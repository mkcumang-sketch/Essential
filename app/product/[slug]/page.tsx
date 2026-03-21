"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
    ShoppingBag, ShieldCheck, ArrowLeft, Plus, Star, Box, Video as VideoIcon, 
    Truck, CheckCircle, RefreshCcw, User, X, Camera, UploadCloud
} from 'lucide-react';

export default function LuxuryProductPage() {
    const router = useRouter();
    const params = useParams(); 
    const slug = params?.slug as string;
    
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState<any[]>([]);
    const [activeMedia, setActiveMedia] = useState<{type: 'image'|'video'|'3d', url: string}>({ type: 'image', url: '' });
    
    const [productReviews, setProductReviews] = useState<any[]>([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    
    // 🌟 REVIEW STATE (With Media Support) 🌟
    const [reviewForm, setReviewForm] = useState({ userName: '', comment: '', rating: 5 });
    const [reviewMedia, setReviewMedia] = useState<string[]>([]);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [reviewStatus, setReviewStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('luxury_cart') || '[]'));
        if (!slug) return;

        const fetchProductAndReviews = async () => {
            try {
                const res = await fetch(`/api/products`);
                const data = await res.json();
                
                if (data.data) {
                    const foundProduct = data.data.find((p: any) => p.slug === slug || p._id === slug);
                    if (foundProduct) {
                        setProduct(foundProduct);
                        setActiveMedia({ type: 'image', url: foundProduct.imageUrl });

                        // 🌟 STRICT FILTER FOR PUBLIC + GHOST REVIEWS 🌟
                        const revRes = await fetch(`/api/reviews`).then(r => r.json());
                        let pubReviews = [];
                        if (revRes.data) {
                            pubReviews = revRes.data.filter((r: any) => (r.product === foundProduct._id || r.product === 'GLOBAL') && r.visibility === 'public');
                        }
                        
                        const myLocalReviews = JSON.parse(localStorage.getItem('my_ghost_reviews') || '[]');
                        const mySpecificLocal = myLocalReviews.filter((r: any) => r.product === foundProduct._id || r.product === 'GLOBAL');
                        
                        const finalLocal = mySpecificLocal.filter((localRev: any) => 
                            !pubReviews.some((pubRev: any) => pubRev.userName === localRev.userName && pubRev.comment === localRev.comment)
                        );

                        setProductReviews([...finalLocal, ...pubReviews]);
                    }
                }
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };

        fetchProductAndReviews();
    }, [slug]);

    const addToCart = () => {
        const exists = cart.find(item => item._id === product._id);
        const newCart = exists ? cart.map(i => i._id === product._id ? {...i, qty: i.qty+1} : i) : [...cart, {...product, qty: 1}];
        setCart(newCart);
        localStorage.setItem('luxury_cart', JSON.stringify(newCart));
        router.push('/checkout');
    };

    // 🌟 CUSTOMER MEDIA UPLOAD 🌟
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
            } else { alert("Upload failed."); }
        } catch(err) { alert("Network error."); } finally { setIsUploadingMedia(false); }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewForm.userName || !reviewForm.comment) return alert("Fill name and review.");
        setReviewStatus('submitting');
        
        try {
            const payload = { 
                ...reviewForm, 
                media: reviewMedia, 
                product: product._id, 
                visibility: 'pending', // <--- ALWAYS PENDING FOR ADMIN APPROVAL
                isAdminGenerated: false 
            };
            
            const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            
            if (res.ok) {
                // 🌟 GHOST BAN: Save locally so user feels happy 🌟
                const localReview = { ...payload, isGhost: true };
                setProductReviews(prev => [localReview, ...prev]);
                const existingLocal = JSON.parse(localStorage.getItem('my_ghost_reviews') || '[]');
                localStorage.setItem('my_ghost_reviews', JSON.stringify([localReview, ...existingLocal]));

                setReviewStatus('success');
                setTimeout(() => { setIsReviewModalOpen(false); setReviewStatus('idle'); setReviewForm({ userName: '', comment: '', rating: 5 }); setReviewMedia([]); }, 2000);
            } else { alert("Failed to submit."); setReviewStatus('idle'); }
        } catch (err) { alert("Network error."); setReviewStatus('idle'); }
    };

    if (isLoading) return <div className="h-screen bg-[#FAFAFA] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black">
            
            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 py-6 px-6 md:px-12 flex justify-between items-center z-50">
                <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black"><ArrowLeft size={16}/> Back</Link>
                <div className="relative cursor-pointer group" onClick={() => router.push('/checkout')}>
                    <ShoppingBag size={24} className="text-black"/>
                    {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">{cart.length}</span>}
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto pt-32 pb-20 px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                <div className="space-y-4">
                    <div className="w-full aspect-[4/5] bg-white rounded-3xl flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm p-6">
                        <AnimatePresence mode="wait">
                            {activeMedia.type === 'image' && activeMedia.url && <motion.img key={activeMedia.url} src={activeMedia.url} className="w-full h-full object-contain mix-blend-multiply" />}
                            {activeMedia.type === 'video' && activeMedia.url && <motion.video key="vid" autoPlay loop muted playsInline className="w-full h-full object-cover rounded-2xl"><source src={activeMedia.url} /></motion.video>}
                            {activeMedia.type === '3d' && activeMedia.url && <motion.iframe key="3d" src={activeMedia.url} className="w-full h-full border-none rounded-2xl" />}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{product.brand}</p>
                    <h1 className="text-4xl md:text-5xl font-serif text-black leading-tight mb-6">{product.name}</h1>
                    
                    <div className="flex items-end gap-3 mb-8">
                        <p className="text-4xl font-serif font-black text-[#D4AF37]">₹{Number(product.offerPrice || product.price).toLocaleString('en-IN')}</p>
                        {(product.offerPrice && product.price > product.offerPrice) && <p className="text-gray-400 line-through text-sm mb-1">₹{Number(product.price).toLocaleString()}</p>}
                    </div>

                    <p className="text-gray-600 font-serif text-lg leading-relaxed mb-10">{product.description}</p>

                    <button onClick={addToCart} className="w-full py-5 bg-black text-white rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-[#D4AF37] hover:text-black transition-colors shadow-lg">Add to Cart</button>
                </div>
            </main>

            {/* 🌟 ENHANCED PRODUCT REVIEWS SECTION 🌟 */}
            <section className="max-w-[1200px] mx-auto px-6 pb-32 border-t border-gray-200 pt-20">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <h2 className="text-3xl font-serif text-black">Customer Reviews</h2>
                    <button onClick={() => setIsReviewModalOpen(true)} className="mt-4 md:mt-0 px-8 py-3 bg-white border-2 border-black text-black font-bold uppercase text-xs rounded-full hover:bg-black hover:text-white transition-colors flex items-center gap-2">
                        <Camera size={16}/> Write a Review
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {productReviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                    ) : productReviews.map((rev, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                            {rev.isGhost && <div className="absolute top-0 left-0 w-full h-1 bg-green-500/30"></div>}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><User size={20}/></div>
                                    <div>
                                        <p className="font-bold text-black">{rev.userName}</p>
                                        <p className="text-[10px] text-green-600 font-bold uppercase flex items-center gap-1"><CheckCircle size={10}/> Verified Buyer</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 text-[#D4AF37]">{[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={14} fill="currentColor"/>)}</div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">"{rev.comment}"</p>
                            
                            {/* 🌟 MEDIA DISPLAY IN REVIEWS 🌟 */}
                            {rev.media && rev.media.length > 0 && (
                                <div className="flex gap-3 overflow-x-auto pt-2 border-t border-gray-100">
                                    {rev.media.map((mediaUrl: string, mIdx: number) => (
                                        mediaUrl.match(/\.(mp4|webm|mov)$/i) ? 
                                            <video key={mIdx} src={mediaUrl} controls className="h-20 w-20 object-cover rounded-lg border border-gray-200 shrink-0" /> : 
                                            <img key={mIdx} src={mediaUrl} className="h-20 w-20 object-cover rounded-lg border border-gray-200 shrink-0" />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* 🌟 REVIEW UPLOAD MODAL 🌟 */}
            <AnimatePresence>
                {isReviewModalOpen && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md relative my-8 shadow-2xl">
                        <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 bg-gray-100 text-gray-500 rounded-full p-2"><X size={20}/></button>
                        
                        {reviewStatus === 'success' ? (
                            <div className="text-center py-10">
                                <CheckCircle size={50} className="text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-serif text-black mb-2">Review Submitted!</h3>
                                <p className="text-gray-500 text-sm">Thank you for sharing your experience.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-serif font-bold text-black mb-6">Write a Review</h3>
                                <div className="space-y-5">
                                    <input value={reviewForm.userName} onChange={e=>setReviewForm({...reviewForm, userName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="Your Name"/>
                                    
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Rating</label>
                                        <div className="flex gap-2">
                                            {[1,2,3,4,5].map(star => (
                                                <button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className={`${reviewForm.rating >= star ? 'text-[#D4AF37]' : 'text-gray-300'}`}><Star size={24} fill={reviewForm.rating >= star ? "currentColor" : "none"} /></button>
                                            ))}
                                        </div>
                                    </div>

                                    <textarea value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm, comment: e.target.value})} rows={3} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm outline-none focus:border-black" placeholder="Your experience..."/>
                                    
                                    {/* MEDIA UPLOAD IN REVIEW */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><Camera size={14}/> Add Photo / Video</label>
                                        <div className="flex flex-wrap gap-3">
                                            {reviewMedia.map((url, idx) => (
                                                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                                    {url.match(/\.(mp4|webm|mov)$/i) ? <video src={url} className="w-full h-full object-cover"/> : <img src={url} className="w-full h-full object-cover"/>}
                                                    <button onClick={()=>setReviewMedia(reviewMedia.filter(x => x !== url))} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5"><X size={10}/></button>
                                                </div>
                                            ))}
                                            <div className="relative w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-black transition-colors flex flex-col items-center justify-center cursor-pointer bg-gray-50">
                                                {isUploadingMedia ? <RefreshCcw size={16} className="text-gray-400 animate-spin"/> : <><UploadCloud size={16} className="text-gray-400 mb-1"/><span className="text-[8px] font-bold text-gray-500 uppercase">Upload</span></>}
                                                <input type="file" accept="image/*,video/*" onChange={handleCustomerMediaUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploadingMedia}/>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={handleReviewSubmit} disabled={reviewStatus === 'submitting' || isUploadingMedia} className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-50">
                                        {reviewStatus === 'submitting' ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
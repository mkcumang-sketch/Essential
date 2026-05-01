"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Star, X } from 'lucide-react';

interface ReviewsProps {
  manualReview: any;
  setManualReview: (review: any) => void;
  handleAddManualReview: () => void;
  allReviews: any[];
  handleUpdateReviewStatus: (id: string, status: string) => void;
  handleDeleteReview: (id: string) => void;
  PremiumUploadNode: React.ComponentType<{ placeholder?: string; onUploadSuccess: (url: string) => void }>;
}

export default function Reviews({
  manualReview,
  setManualReview,
  handleAddManualReview,
  allReviews,
  handleUpdateReviewStatus,
  handleDeleteReview,
  PremiumUploadNode,
}: ReviewsProps) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} key="rev" className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full">
       <div className="lg:col-span-4 space-y-6 md:space-y-8 w-full">
         <div className="bg-[#111] p-6 md:p-8 rounded-[20px] md:rounded-[30px] border border-white/10">
              <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6 border-b border-white/10 pb-4">Inject Manual Feedback</h3>
              <div className="space-y-4">
                 <input value={manualReview.userName} onChange={e=>setManualReview({...manualReview, userName: e.target.value})} className="w-full min-h-[44px] bg-black border border-white/20 p-3 md:p-4 rounded-xl text-xs md:text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Client Alias" />
                 <select value={manualReview.rating} onChange={e=>setManualReview({...manualReview, rating: Number(e.target.value)})} className="w-full min-h-[44px] bg-black border border-white/20 p-3 md:p-4 rounded-xl text-xs md:text-sm text-[#D4AF37] outline-none focus:border-[#D4AF37] appearance-none"><option value={5}>Tier 5 - Flawless</option><option value={4}>Tier 4 - Acceptable</option></select>
                 <textarea value={manualReview.comment} onChange={e=>setManualReview({...manualReview, comment: e.target.value})} rows={4} className="w-full bg-black border border-white/20 p-3 md:p-4 rounded-xl text-xs md:text-sm text-white outline-none focus:border-[#D4AF37] custom-scrollbar" placeholder="Formulate feedback structure..." />
                 
                 <div>
                     <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Upload Evidence</label>
                     <div className="flex gap-2 md:gap-3 items-center flex-wrap">
                         {manualReview.media && manualReview.media.map((url: string, idx: number) => (
                             <div key={idx} className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/20 shadow-lg group">
                                 <img src={url} className="w-full h-full object-cover"/>
                                 <button onClick={()=>setManualReview({...manualReview, media: manualReview.media.filter((x: string) => x !== url)})} className="absolute inset-0 bg-red-600/80 flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                             </div>
                         ))}
                         {manualReview.media.length < 3 && (
                            <div className="scale-[0.65] md:scale-75 origin-left w-16 md:w-auto shrink-0">
                                 <PremiumUploadNode placeholder="Scan" onUploadSuccess={(url: string)=>setManualReview({...manualReview, media: [...(manualReview.media || []), url]})} />
                            </div>
                         )}
                     </div>
                 </div>
                 <button onClick={handleAddManualReview} className="w-full min-h-[44px] py-4 md:py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl text-[10px] md:text-xs hover:bg-white transition-all mt-4">Compile Entry</button>
              </div>
         </div>
       </div>
       
       <div className="lg:col-span-8 bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[30px] border border-white/10 w-full">
          <div className="flex justify-between items-center border-b border-white/10 pb-4 md:pb-6 mb-6 md:mb-8">
             <h3 className="text-xl md:text-2xl font-bold text-white">Feedback Stream</h3>
          </div>
          
          <div className="space-y-4 max-h-[500px] md:max-h-[700px] overflow-y-auto custom-scrollbar pr-2 md:pr-4 w-full">
             {allReviews.length === 0 ? <p className="text-center text-gray-600 font-bold uppercase tracking-widest py-10 text-[10px] md:text-xs">Stream Empty</p> : allReviews.map((rev:any, i:number) => (
               <div key={i} className={`bg-black border p-4 md:p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-4 md:gap-6 transition-all shadow-lg ${rev.visibility === 'pending' ? 'border-[#00F0FF]' : 'border-white/10 hover:border-[#D4AF37]/30'}`}>
                  <div className="flex-1 overflow-hidden">
                     <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                        <h4 className="font-bold text-white text-base md:text-lg truncate">{rev.userName}</h4>
                        <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest px-2 md:px-3 py-1 rounded border ${rev.visibility === 'public' ? 'bg-green-500/10 text-green-500 border-green-500/20' : rev.visibility === 'pending' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/20 animate-pulse' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>{rev.visibility || 'STANDBY'}</span>
                     </div>
                     <div className="flex gap-1 text-[#D4AF37] mb-3 md:mb-4">{[...Array(rev.rating)].map((_, idx)=><Star key={idx} size={12} className="md:w-[14px] md:h-[14px]" fill="currentColor"/>)}</div>
                     <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4 line-clamp-4">"{rev.comment}"</p>
                     {rev.media && rev.media.length > 0 && (
                        <div className="flex flex-wrap gap-2 md:gap-3">
                           {rev.media.map((m:string, idx:number) => m.match(/\.(mp4|webm|mov)$/i) ? <video key={idx} src={m} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border border-white/10" controls/> : <img key={idx} src={m} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border border-white/10"/>)}
                        </div>
                     )}
                  </div>
                  <div className={`flex flex-row md:flex-col gap-2 md:gap-3 justify-center w-full md:w-auto md:min-w-[140px] mt-4 md:mt-0`}>
                     <button onClick={()=>handleUpdateReviewStatus(rev._id, 'public')} className="flex-1 md:flex-none min-h-[44px] py-2 md:py-3 bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500 hover:text-black rounded-xl text-[9px] md:text-xs font-bold uppercase tracking-widest transition-all">Validate</button>
                     <button onClick={()=>handleUpdateReviewStatus(rev._id, 'rejected')} className="flex-1 md:flex-none min-h-[44px] py-2 md:py-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-black rounded-xl text-[9px] md:text-xs font-bold uppercase tracking-widest transition-all">Suppress</button>
                     <button onClick={()=>handleDeleteReview(rev._id)} className="flex-1 md:flex-none min-h-[44px] py-2 md:py-3 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[9px] md:text-xs font-bold uppercase tracking-widest transition-all mt-0 md:mt-auto flex items-center justify-center gap-1 md:gap-2"><Trash2 size={12} className="md:w-[14px] md:h-[14px]"/> Erase</button>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </motion.div>
  );
}
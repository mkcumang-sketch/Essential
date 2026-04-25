"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Save, Radar, ImageIcon } from 'lucide-react';

interface LegalPagesTabProps {
  legalPages: any[];
  setLegalPages: (pages: any[]) => void;
  activeLegalPageId: string;
  setActiveLegalPageId: (id: string) => void;
  corporateInfo: any;
  setCorporateInfo: (info: any) => void;
  handleSaveCMS: () => void;
  PremiumUploadNode: React.ComponentType<{ placeholder?: string; onUploadSuccess: (url: string) => void }>;
}

export default function LegalPagesTab({
  legalPages,
  setLegalPages,
  activeLegalPageId,
  setActiveLegalPageId,
  corporateInfo,
  setCorporateInfo,
  handleSaveCMS,
  PremiumUploadNode,
}: LegalPagesTabProps) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} key="legal" className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 pb-20 w-full">
       <div className="lg:col-span-4 space-y-6 md:space-y-8">
         <div className="bg-[#111] p-6 md:p-8 rounded-[20px] md:rounded-[30px] border border-white/10 w-full">
            <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-white/10 pb-4">
               <h3 className="text-base md:text-lg font-bold text-white">Policy pages</h3>
               <button 
                   onClick={() => {
                       const cinematicTemplate = `<h1>New page</h1>\n\n<p>Add your policy text for <strong>Essential Rush</strong> here.</p>\n\n<h2>Section one</h2>\n<p>Write clear, simple sentences your customers can understand.</p>`;
                       const newId = Date.now().toString();
                       setLegalPages([...legalPages, { id: newId, title: 'New policy', slug: 'new-policy', content: cinematicTemplate }]);
                       setActiveLegalPageId(newId);
                   }} 
                   className="text-[#D4AF37] min-h-[44px] text-[10px] md:text-xs font-bold uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors"
               >
                   + Add page
               </button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {legalPages.length === 0 ? <p className="text-gray-600 text-[10px] md:text-xs font-bold text-center uppercase tracking-widest py-4">No pages yet</p> : legalPages.map((page) => (
                  <div key={page.id} onClick={() => setActiveLegalPageId(page.id)} className={`p-3 md:p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${activeLegalPageId === page.id ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-black border-white/20 hover:border-gray-500'}`}>
                     <div className="overflow-hidden">
                        <h4 className={`font-bold text-xs md:text-sm truncate ${activeLegalPageId === page.id ? 'text-[#D4AF37]' : 'text-white'}`}>{page.title}</h4>
                        <p className="text-[9px] md:text-xs text-gray-500 mt-1 font-mono truncate">/policies/{page.slug}</p>
                     </div>
                     <button onClick={(e)=>{ e.stopPropagation(); setLegalPages(legalPages.filter(p=>p.id!==page.id)); if(activeLegalPageId===page.id) setActiveLegalPageId(legalPages[0]?.id||''); }} className="text-red-500 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-red-500/20 rounded-lg shrink-0"><Trash2 size={16}/></button>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-[#111] p-6 md:p-8 rounded-[20px] md:rounded-[30px] border border-white/10 w-full">
            <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6 border-b border-white/10 pb-4">Business details</h3>
            <div className="space-y-4">
               <input value={corporateInfo.companyName} onChange={e=>setCorporateInfo({...corporateInfo, companyName: e.target.value})} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Company name" />
               <textarea value={corporateInfo.address} onChange={e=>setCorporateInfo({...corporateInfo, address: e.target.value})} rows={2} className="w-full bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Address" />
               <input value={corporateInfo.phone1} onChange={e=>setCorporateInfo({...corporateInfo, phone1: e.target.value})} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Phone" />
               <input value={corporateInfo.email} onChange={e=>setCorporateInfo({...corporateInfo, email: e.target.value})} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="Email" />
            </div>
         </div>
       </div>

       <div className="lg:col-span-8 bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[30px] border border-white/10 w-full">
          {activeLegalPageId ? (
             <div className="space-y-6 flex flex-col h-full w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div>
                      <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Page title</label>
                      <input value={legalPages.find(p=>p.id===activeLegalPageId)?.title || ''} onChange={e=>{ const n=[...legalPages]; const idx=n.findIndex(p=>p.id===activeLegalPageId); if(idx>-1) n[idx].title=e.target.value; setLegalPages(n); }} className="w-full min-h-[44px] bg-black border border-white/20 p-3 md:p-4 rounded-xl text-sm md:text-lg text-white outline-none focus:border-[#D4AF37]" placeholder="e.g. Privacy policy"/>
                   </div>
                   <div>
                      <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">URL slug</label>
                      <input value={legalPages.find(p=>p.id===activeLegalPageId)?.slug || ''} onChange={e=>{ const n=[...legalPages]; const idx=n.findIndex(p=>p.id===activeLegalPageId); if(idx>-1) n[idx].slug=e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-'); setLegalPages(n); }} className="w-full min-h-[44px] bg-black border border-white/20 p-3 md:p-4 rounded-xl text-xs md:text-sm text-[#00F0FF] font-mono outline-none focus:border-[#D4AF37]" placeholder="e.g. privacy-policy"/>
                   </div>
                </div>
                
                <div className="flex-1 flex flex-col w-full">
                   <div className="flex flex-col md:flex-row justify-between md:items-end mb-3 gap-3 md:gap-0">
                      <label className="text-[10px] md:text-xs text-[#D4AF37] font-bold uppercase tracking-widest block">Page content (HTML)</label>
                      
                      <div className="flex items-center justify-between md:justify-start gap-3 bg-black border border-white/10 p-2 rounded-xl">
                          <span className="text-[9px] md:text-[10px] text-gray-500 uppercase font-bold ml-2">Add media:</span>
                          <div className="scale-[0.6] md:scale-75 origin-right h-10 md:h-12">
                              <PremiumUploadNode 
                                 placeholder="File" 
                                 onUploadSuccess={(url: string) => {
                                    const isVideo = url.match(/\.(mp4|webm|mov)$/i);
                                    const mediaTag = isVideo 
                                        ? `\n\n<video src="${url}" autoplay loop muted playsinline></video>\n\n` 
                                        : `\n\n<img src="${url}" alt="Policy image" />\n\n`;
                                    const n = [...legalPages];
                                    const idx = n.findIndex(p => p.id === activeLegalPageId);
                                    if (idx > -1) {
                                       n[idx].content = (n[idx].content || '') + mediaTag;
                                       setLegalPages(n);
                                    }
                                 }} 
                              />
                          </div>
                      </div>
                   </div>

                   <textarea 
                       value={legalPages.find(p=>p.id===activeLegalPageId)?.content || ''} 
                       onChange={e=>{ const n=[...legalPages]; const idx=n.findIndex(p=>p.id===activeLegalPageId); if(idx>-1) n[idx].content=e.target.value; setLegalPages(n); }} 
                       rows={14} 
                       className="w-full h-full min-h-[250px] bg-black border border-white/20 p-4 md:p-6 rounded-2xl text-xs md:text-sm text-[#b3b3b3] font-mono outline-none focus:border-[#D4AF37] custom-scrollbar leading-relaxed" 
                       placeholder="Construct layout parameters here..."
                   />
                </div>

                <div className="mt-6 md:mt-8 p-4 md:p-6 bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl w-full overflow-hidden">
                    <h4 className="text-[10px] md:text-xs text-[#D4AF37] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ImageIcon size={16} /> Asset Detection Stream
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {(() => {
                            const currentContent = legalPages.find(p=>p.id===activeLegalPageId)?.content || '';
                            const urls: string[] = [];
                            const regex = /src="(https?:\/\/[^"]+)"/g;
                            let match;
                            while ((match = regex.exec(currentContent)) !== null) {
                                urls.push(match[1]);
                            }

                            if (urls.length === 0) return <p className="text-[10px] md:text-xs text-gray-600 col-span-full uppercase font-bold tracking-widest text-center py-4">Stream Clear</p>;

                            return urls.map((url, idx) => (
                                <div key={idx} className="group relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-black">
                                    {url.match(/\.(mp4|webm|mov)$/i) ? (
                                        <video src={url} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={url} className="w-full h-full object-cover" />
                                    )}
                                    <button 
                                        onClick={() => {
                                            const n = [...legalPages];
                                            const pageIndex = n.findIndex(p => p.id === activeLegalPageId);
                                            if(pageIndex > -1) {
                                                const tagRegex = new RegExp(`<img[^>]*src="${url}"[^>]*>|<video[^>]*src="${url}"[^>]*>[^<]*</video>`, 'g');
                                                n[pageIndex].content = n[pageIndex].content.replace(tagRegex, '');
                                                setLegalPages(n);
                                            }
                                        }}
                                        className="absolute inset-0 bg-red-600/90 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 md:gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
                                    >
                                        <Trash2 size={16} className="md:w-[24px] md:h-[24px] mb-0 md:mb-1"/>
                                        Erase Target
                                    </button>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                <button onClick={handleSaveCMS} className="w-full min-h-[44px] py-4 md:py-5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all mt-4 flex justify-center items-center gap-2 text-[10px] md:text-xs"><Save size={18}/> Save site settings</button>
             </div>
          ) : (
             <div className="h-full flex items-center justify-center flex-col text-gray-500 py-20 md:py-32 border-2 border-dashed border-white/10 rounded-2xl w-full">
                <Radar size={40} className="md:w-[60px] md:h-[60px] mb-4 opacity-50 text-[#D4AF37]"/>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-center px-4">Choose a page to edit</p>
             </div>
          )}
       </div>
    </motion.div>
  );
}
"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Globe, ShieldAlert, CheckCircle, Smartphone } from 'lucide-react';

export default function SeoPanel({ entityData, setEntityData }: any) {
  const [seo, setSeo] = useState(entityData.seo || {
    metaTitle: '', metaDescription: '', focusKeyword: '', slug: entityData.slug || '', noindex: false
  });
  const [score, setScore] = useState(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // 🧠 SEO SCORE ENGINE
  useEffect(() => {
    let newScore = 100;
    if (seo.metaTitle.length < 30 || seo.metaTitle.length > 60) newScore -= 20;
    if (seo.metaDescription.length < 120 || seo.metaDescription.length > 160) newScore -= 20;
    if (!seo.focusKeyword) newScore -= 15;
    if (seo.focusKeyword && !seo.metaTitle.toLowerCase().includes(seo.focusKeyword.toLowerCase())) newScore -= 10;
    setScore(Math.max(0, newScore));
    
    // Pass updates back to parent form
    setEntityData({ ...entityData, seo });
  }, [seo]);

  // 🤖 AI SEO ASSISTANT MOCK API CALL
 // 🤖 REAL AI SEO ASSISTANT API CALL
  const generateAiSeo = async () => {
    setIsGeneratingAI(true);
    
    try {
        const res = await fetch('/api/seo/ai-generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: entityData.name || entityData.title,
                description: entityData.description || entityData.introContent,
                brand: entityData.brand || '',
                category: entityData.category || '',
                type: entityData.price ? 'product' : 'page'
            })
        });

        const data = await res.json();
        
        if (data.success) {
            // Auto-generate a clean slug if one doesn't exist
            const newSlug = seo.slug || data.data.metaTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            
            setSeo({
                ...seo,
                metaTitle: data.data.metaTitle,
                metaDescription: data.data.metaDescription,
                focusKeyword: data.data.focusKeyword,
                slug: newSlug
            });
        } else {
            alert("AI Error: " + data.error);
        }
    } catch (error) {
        console.error("Failed to connect to AI Engine", error);
        alert("Network error connecting to AI Engine.");
    } finally {
        setIsGeneratingAI(false);
    }
  };

  return (
    <div className="bg-[#111] p-8 rounded-[30px] border border-white/10 space-y-8">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <h3 className="text-2xl font-serif text-white flex items-center gap-3"><Globe className="text-[#00F0FF]"/> Search Engine Optimization</h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs ${score >= 80 ? 'bg-green-500/20 text-green-400' : score >= 50 ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
           SEO Score: {score}/100
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        
        {/* --- EDIT FIELDS --- */}
        <div className="space-y-6">
          <button onClick={generateAiSeo} disabled={isGeneratingAI} className="w-full py-4 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#00F0FF] hover:text-black transition-all flex justify-center items-center gap-2">
            {isGeneratingAI ? <span className="animate-pulse">Analyzing Content...</span> : <><Sparkles size={16}/> Auto-Generate with AI</>}
          </button>

          <div>
            <label className="text-xs text-gray-400 flex justify-between mb-2"><span>Meta Title</span> <span className={seo.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-500'}>{seo.metaTitle.length}/60</span></label>
            <input value={seo.metaTitle} onChange={e=>setSeo({...seo, metaTitle: e.target.value})} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm text-white outline-none focus:border-[#00F0FF]" placeholder="SEO Optimized Title"/>
          </div>

          <div>
            <label className="text-xs text-gray-400 flex justify-between mb-2"><span>Meta Description</span> <span className={seo.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-500'}>{seo.metaDescription.length}/160</span></label>
            <textarea value={seo.metaDescription} onChange={e=>setSeo({...seo, metaDescription: e.target.value})} rows={3} className="w-full bg-black border border-white/20 p-4 rounded-xl text-sm text-white outline-none focus:border-[#00F0FF] custom-scrollbar" placeholder="Compelling description for search results..."/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Focus Keyword</label>
              <input value={seo.focusKeyword} onChange={e=>setSeo({...seo, focusKeyword: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm text-white outline-none focus:border-[#00F0FF]" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">URL Slug</label>
              <input value={seo.slug} onChange={e=>setSeo({...seo, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-')})} className="w-full bg-black border border-white/20 p-3 rounded-lg text-sm text-blue-400 outline-none focus:border-[#00F0FF]" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-black border border-white/10 rounded-xl">
             <div><p className="text-sm font-bold text-white">Hide from Google (Noindex)</p><p className="text-[10px] text-gray-500">Prevent search engines from indexing this page.</p></div>
             <input type="checkbox" checked={seo.noindex} onChange={e=>setSeo({...seo, noindex: e.target.checked})} className="w-6 h-6 accent-red-500 cursor-pointer" />
          </div>
        </div>

        {/* --- LIVE PREVIEWS --- */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2"><Smartphone size={16}/> Live Search Preview</h4>
          
          {/* Google Preview */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-[12px] text-[#202124] mb-1 flex items-center gap-2"><span className="w-6 h-6 bg-gray-200 rounded-full inline-block"></span> essential.com › product › {seo.slug || 'slug'}</p>
            <h3 className="text-[20px] text-[#1a0dab] font-arial mb-1 hover:underline cursor-pointer truncate">{seo.metaTitle || 'Your Meta Title Will Appear Here'}</h3>
            <p className="text-[14px] text-[#4d5156] font-arial leading-snug line-clamp-2">{seo.metaDescription || 'Provide a compelling meta description to improve click-through rates from search engine results pages.'}</p>
          </div>

          {/* SEO Checker Checklist */}
          <div className="bg-black/50 p-6 rounded-2xl border border-white/10 space-y-3">
             <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 mb-4">Technical Checklist</h4>
             <p className={`text-xs flex items-center gap-2 ${seo.metaTitle.length >= 30 && seo.metaTitle.length <= 60 ? 'text-green-400' : 'text-red-400'}`}>{seo.metaTitle.length >= 30 && seo.metaTitle.length <= 60 ? <CheckCircle size={14}/> : <ShieldAlert size={14}/>} Title length (30-60 chars)</p>
             <p className={`text-xs flex items-center gap-2 ${seo.metaDescription.length >= 120 && seo.metaDescription.length <= 160 ? 'text-green-400' : 'text-red-400'}`}>{seo.metaDescription.length >= 120 && seo.metaDescription.length <= 160 ? <CheckCircle size={14}/> : <ShieldAlert size={14}/>} Description length (120-160 chars)</p>
             <p className={`text-xs flex items-center gap-2 ${seo.focusKeyword && seo.metaTitle.toLowerCase().includes(seo.focusKeyword.toLowerCase()) ? 'text-green-400' : 'text-red-400'}`}>{seo.focusKeyword && seo.metaTitle.toLowerCase().includes(seo.focusKeyword.toLowerCase()) ? <CheckCircle size={14}/> : <ShieldAlert size={14}/>} Keyword in Title</p>
          </div>
        </div>

      </div>
    </div>
  );
}
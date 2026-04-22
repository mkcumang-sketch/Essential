"use client";
import React from 'react';
import { Image as ImageIcon, CheckCircle, Zap } from 'lucide-react';

export default function ImageSeoPanel({ entityData, setEntityData }: any) {
  // Extract all images (Main image + gallery images)
  const allImages = [entityData.imageUrl, ...(entityData.images || [])].filter(Boolean);
  
  // Ensure SEO object and imageAltTexts map exists
  const seo = entityData.seo || {};
  const altTexts = seo.imageAltTexts || {};

  const handleAltChange = (url: string, newAlt: string) => {
    const updatedAltTexts = { ...altTexts, [url]: newAlt };
    setEntityData({
      ...entityData,
      seo: { ...seo, imageAltTexts: updatedAltTexts }
    });
  };

  const autoGenerateAlt = (url: string, index: number) => {
    // Basic auto-generation based on product name
    // You can also connect this to the Gemini Vision API later!
    const suffix = index === 0 ? 'Front View' : `Detail View ${index}`;
    const generatedAlt = `${entityData.name || 'Luxury Timepiece'} - ${suffix}`;
    handleAltChange(url, generatedAlt);
  };

  if (allImages.length === 0) {
      return <div className="p-8 text-center text-gray-500">No images uploaded yet. Please upload images in the general tab first.</div>;
  }

  return (
    <div className="bg-[#111] p-8 rounded-[30px] border border-white/10 space-y-8">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <h3 className="text-2xl font-serif text-white flex items-center gap-3"><ImageIcon className="text-[#00F0FF]"/> Image SEO & Alt Tags</h3>
        <p className="text-xs text-gray-400">Optimize for Google Image Search</p>
      </div>

      <div className="space-y-6">
        {allImages.map((imgUrl, index) => (
          <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-black p-4 rounded-2xl border border-white/10">
            {/* Image Thumbnail */}
            <div className="w-32 h-32 bg-white/5 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 border border-white/10">
                <img src={imgUrl} alt="Thumbnail" className="max-w-full max-h-full object-contain" />
            </div>

            {/* Input Field */}
            <div className="flex-1 w-full space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Alt Text (Description)</label>
                    {altTexts[imgUrl] && <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle size={12}/> Optimized</span>}
                </div>
                
                <input 
                    value={altTexts[imgUrl] || ''} 
                    onChange={(e) => handleAltChange(imgUrl, e.target.value)}
                    className="w-full bg-[#111] border border-white/20 p-4 rounded-xl text-sm text-white outline-none focus:border-[#00F0FF] transition-colors" 
                    placeholder="e.g. Essential Rolex Submariner Gold Edition Front View"
                />
                
                <div className="flex justify-between items-center mt-2">
                    <p className="text-[10px] text-gray-500">Improves accessibility and Google Image ranking.</p>
                    <button onClick={() => autoGenerateAlt(imgUrl, index)} className="text-[10px] font-bold text-[#00F0FF] flex items-center gap-1 hover:text-white transition-colors">
                        <Zap size={12}/> Auto-Fill
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded-xl mt-6">
          <p className="text-xs text-[#00F0FF] font-mono">⚡ Note: All uploaded images are automatically compressed and converted to next-gen WebP format by the CDN on the frontend.</p>
      </div>
    </div>
  );
}
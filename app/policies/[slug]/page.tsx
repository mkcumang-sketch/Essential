"use client";

import React, { useState } from 'react';
import { UploadCloud, Trash2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 🚨 TypeScript Types (Taki VS Code khush rahe)
interface PremiumMediaHandlerProps {
  onUpload?: (url: string) => void;
  onRemove?: () => void;
  currentUrl?: string;
  placeholderType?: string;
}

export default function PremiumMediaHandler({ 
  onUpload, 
  onRemove, 
  currentUrl, 
  placeholderType = "Photo" 
}: PremiumMediaHandlerProps) {
  
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");

  // 🚨 File param ko 'File' type diya
  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        setPreview(data.url);
        if (onUpload) onUpload(data.url); // Callback to save to DB
      } else {
        alert("Upload failed.");
      }
    } catch(e) {
      alert("Error: Check API connectivity.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMedia = () => {
    setPreview(""); // Clear internal preview
    if (onRemove) onRemove(); // Callback to delete from DB
  };

  const isVideo = preview && preview.match(/\.(mp4|webm|mov)$/i);

  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {/* State 1: Photo/Video Exists */}
        {preview ? (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="group relative rounded-3xl overflow-hidden border border-[#D4AF37]/20 shadow-xl bg-[#0a0a0a]">
            {/* The 'TAGDA' Remove Button */}
            <button 
                onClick={handleRemoveMedia} 
                className="absolute top-5 right-5 z-40 bg-red-600/90 text-white p-4 rounded-xl shadow-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-700 hover:scale-110 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                title="Remove Media"
            >
              <Trash2 size={18} /> Remove {placeholderType}
            </button>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {isVideo ? (
                <video src={preview} className="w-full h-full max-h-[70vh] object-cover" autoPlay muted loop playsInline />
            ) : (
                <img src={preview} alt="CMS Asset" className="w-full h-full max-h-[70vh] object-cover" />
            )}
          </motion.div>
        ) : (
          /* State 2: No Photo/Video (Drop Zone) */
          <motion.div 
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              // 🚨 Event (e) ko React.DragEvent type diya
              onDragOver={(e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e: React.DragEvent<HTMLDivElement>) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                setDragging(false); 
                if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]); 
              }}
              className={`w-full min-h-[30vh] md:min-h-[40vh] rounded-[30px] border-4 border-dashed transition-all flex flex-col items-center justify-center p-12 text-center relative group ${dragging ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5'}`}
          >
            {/* 🚨 Input event (e) typed implicitly, bas files ki existence check ki */}
            <input type="file" accept="image/*,video/*" onChange={(e)=> { if(e.target.files?.[0]) handleUpload(e.target.files[0]); }} className="hidden" id="asset-upload" />
            
            <label htmlFor="asset-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-6">
              {uploading ? (
                  <div className="flex flex-col items-center gap-6">
                      <RefreshCcw size={60} className="text-[#D4AF37] animate-spin opacity-80"/>
                      <p className="text-[#D4AF37] text-lg font-bold tracking-widest uppercase">Uploading...</p>
                  </div>
              ) : (
                  <>
                    <div className="p-8 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] border-2 border-[#D4AF37]/30 transition-transform group-hover:scale-105">
                        <UploadCloud size={60}/>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-bold text-white tracking-wide">Drop your Cinematic Media here</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest leading-loose">Accepts Images (.jpg, .png) or Videos (.mp4, .webm) up to 50MB.<br/>Or click to select a file manually.</p>
                    </div>
                  </>
              )}
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
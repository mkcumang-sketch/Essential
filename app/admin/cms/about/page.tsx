"use client";
import React, { useState, useEffect } from 'react';
import { updateAboutPage, getAboutData } from '@/app/actions/about';
import { Save, RefreshCw } from 'lucide-react';

export default function AboutCMS() {
  const [data, setData] = useState({ title: '', description: '', history: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAboutData().then(d => { if(d) setData(d); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    await updateAboutPage(data);
    alert("Story Published Live!");
    setLoading(false);
  };

  if (loading) return <div className="p-10 animate-pulse text-gray-400 font-black uppercase">Syncing Vault...</div>;

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm max-w-4xl space-y-8">
      <h2 className="text-3xl font-serif italic font-black">Edit Brand Story</h2>
      
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Title</label>
        <input value={data.title} onChange={e => setData({...data, title: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:bg-white focus:ring-1 ring-[#D4AF37]" />
        
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Short Description</label>
        <textarea value={data.description} onChange={e => setData({...data, description: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none h-32 focus:bg-white focus:ring-1 ring-[#D4AF37]" />
      </div>

      <button onClick={handleSave} className="flex items-center gap-3 px-10 py-5 bg-black text-[#D4AF37] rounded-2xl font-black uppercase tracking-widest hover:shadow-2xl transition-all">
        <Save size={18}/> Publish Changes
      </button>
    </div>
  );
}
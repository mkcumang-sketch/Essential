"use client";
import { useState } from "react";

export default function ConciergePage() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Sending...");
    const res = await fetch("/api/leads", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setStatus("Thank you. Our concierge will contact you shortly.");
      setFormData({ name: "", phone: "", email: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-serif pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-[0.5em] mb-4">Personalized Service</p>
        <h1 className="text-5xl md:text-7xl italic uppercase tracking-tighter mb-8">Private Concierge</h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto mb-16 leading-relaxed">
          Looking for a specific timepiece or need expert advice? Our private concierge service is dedicated to sourcing the world's most exclusive watches for you.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left bg-white p-10 shadow-2xl border border-gray-100">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border-b border-gray-300 py-2 focus:border-black outline-none transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
            <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="border-b border-gray-300 py-2 focus:border-black outline-none transition-colors" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border-b border-gray-300 py-2 focus:border-black outline-none transition-colors" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">How can we assist you?</label>
            <textarea rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="border-b border-gray-300 py-2 focus:border-black outline-none transition-colors resize-none" placeholder="Interested in a specific brand or model..." />
          </div>
          
          <div className="md:col-span-2 mt-4">
            <button className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-yellow-600 hover:text-black transition-all">
              Request Consultation
            </button>
            {status && <p className="mt-4 text-xs italic text-yellow-600 text-center">{status}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
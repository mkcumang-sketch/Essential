"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    siteName: "",
    footerDescription: "",
    contactEmail: "",
    instagramLink: "",
    twitterLink: "",
  });

  // Load existing settings
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setFormData(data.settings);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMsg("✅ Site Settings Updated Successfully!");
      setTimeout(() => setMsg(""), 3000);
    } else {
      setMsg("❌ Failed to update settings.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center">Loading Control Panel...</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-serif py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 shadow-xl border border-gray-200">
        
        <div className="flex justify-between items-center border-b pb-6 mb-8">
          <h1 className="text-3xl italic uppercase tracking-tighter">Site Control Center</h1>
          <Link href="/admin/products" className="text-xs font-bold underline hover:text-yellow-600">
             Back to Products
          </Link>
        </div>

        {msg && <div className="mb-6 p-3 bg-green-100 text-green-800 text-center text-xs font-bold uppercase">{msg}</div>}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-yellow-600 uppercase tracking-widest">General Identity</h3>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Website Name (Logo Text)</label>
              <input type="text" value={formData.siteName} onChange={(e) => setFormData({...formData, siteName: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Footer Description</label>
              <textarea rows={2} value={formData.footerDescription} onChange={(e) => setFormData({...formData, footerDescription: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black" />
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Connect</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Email</label>
                <input type="text" value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Instagram Link</label>
                <input type="text" value={formData.instagramLink} onChange={(e) => setFormData({...formData, instagramLink: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-yellow-600 hover:text-black transition-all">
            {saving ? "Updating System..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
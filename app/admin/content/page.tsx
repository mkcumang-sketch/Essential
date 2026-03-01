"use client";
import { useState, useEffect } from "react";

export default function AdminCMS() {
  const [content, setContent] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/site-content")
      .then(res => res.json())
      .then(data => {
        if (data.success) setContent(data.content);
        else setError("Database connect nahi hua. .env file check karein.");
      })
      .catch(() => setError("Server Error: API respond nahi kar rahi."));
  }, []);

  if (error) return <div className="p-10 text-red-500 bg-red-100/10 rounded-xl">{error}</div>;
  if (!content) return <div className="p-10 text-gold-500">⏳ CMS Load ho raha hai... (DB Check karein)</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold text-gold-500">Website Customizer</h1>
      
      {/* Hero Section Form */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h2 className="text-xl font-bold mb-4">Hero Section Settings</h2>
        <div className="space-y-4">
          <label className="block text-zinc-400">Main Heading</label>
          <input 
            className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white"
            value={content.about?.heading || ""}
            onChange={(e) => setContent({...content, about: {...content.about, heading: e.target.value}})}
          />
        </div>
      </div>

      <button className="w-full bg-gold-600 hover:bg-gold-700 text-black font-bold p-4 rounded-xl transition-all uppercase tracking-widest">
        Save All Changes 🚀
      </button>
    </div>
  );
}
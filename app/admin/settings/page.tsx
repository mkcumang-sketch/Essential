"use client";
import { useState, useEffect } from "react";
import { Save, Image as ImageIcon, Link as LinkIcon, Plus, Trash2, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [slides, setSlides] = useState([{ imageUrl: "", heading: "", subtext: "" }]);
  const [categories, setCategories] = useState([{ name: "", imageUrl: "", link: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.heroSlides && data.heroSlides.length > 0) setSlides(data.heroSlides);
        if (data.categories && data.categories.length > 0) setCategories(data.categories);
      })
      .catch(() => toast.error("Failed to load current settings"));
  }, []);

  const autoFetchLogo = (index: number, name: string) => {
    if (!name) return toast.error("Please enter a category/brand name first!");
    
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const genericTerms = ['mens', 'womens', 'sports', 'celebrity', 'couples'];
    
    let url = "";
    if (genericTerms.includes(cleanName) || cleanName.length < 3) {
      url = `https://ui-avatars.com/api/?name=${name}&background=001A33&color=fff&size=256&font-size=0.33`;
    } else {
      url = `https://logo.clearbit.com/${cleanName}.com`;
    }

    const newC = [...categories];
    newC[index].imageUrl = url;
    if (!newC[index].link) newC[index].link = `/collection/${cleanName}`;
    
    setCategories(newC);
    toast.success(`${name} logo generated!`);
  };

  // 🚀 THE FIX: Added Headers & Safe Parsing
  const saveSettings = async () => {
    setLoading(true);
    const toastId = toast.loading("Saving configuration...");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 👈 Ye missing tha
        },
        body: JSON.stringify({ heroSlides: slides, categories })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success("Frontend Updated Successfully!", { id: toastId });
      } else {
        toast.error(data.error || "Failed to save settings.", { id: toastId });
      }
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Network Error: Backend crashed. Check terminal.", { id: toastId });
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end border-b border-blue-50 pb-6">
        <div>
          <h1 className="text-3xl font-luxury italic text-[#001A33]">Frontend CMS</h1>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">Control your live website layout</p>
        </div>
        <button 
          onClick={saveSettings} 
          disabled={loading} 
          className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition shadow-lg ${loading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-[#001A33] hover:bg-blue-900 text-white'}`}
        >
          <Save size={14} /> {loading ? "Saving..." : "Publish Changes"}
        </button>
      </div>

      {/* Hero Sliders Control */}
      <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-blue-900 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={18}/> Hero Sliders</h2>
          <button onClick={() => setSlides([...slides, { imageUrl: "", heading: "", subtext: "" }])} className="text-xs font-bold text-blue-600 flex items-center gap-1"><Plus size={14}/> Add Slide</button>
        </div>
        <div className="space-y-6">
          {slides.map((slide, i) => (
            <div key={i} className="flex gap-4 items-center bg-blue-50/30 p-4 rounded-xl border border-blue-50">
              <input type="text" placeholder="Image URL" value={slide.imageUrl} onChange={(e) => { const newS = [...slides]; newS[i].imageUrl = e.target.value; setSlides(newS); }} className="flex-1 p-3 text-sm rounded-lg border border-blue-100" />
              <input type="text" placeholder="Heading (e.g. Elegance in Midnight.)" value={slide.heading} onChange={(e) => { const newS = [...slides]; newS[i].heading = e.target.value; setSlides(newS); }} className="flex-1 p-3 text-sm rounded-lg border border-blue-100" />
              <button onClick={() => setSlides(slides.filter((_, idx) => idx !== i))} className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>
      </div>

      {/* Category Logos Control */}
      <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-blue-900 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={18}/> Category Logos (Marquee)</h2>
          <button onClick={() => setCategories([...categories, { name: "", imageUrl: "", link: "" }])} className="text-xs font-bold text-blue-600 flex items-center gap-1"><Plus size={14}/> Add Category</button>
        </div>
        <div className="space-y-6">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 items-center bg-blue-50/30 p-4 rounded-xl border border-blue-50">
              <input type="text" placeholder="Brand/Category (e.g. Rolex)" value={cat.name} onChange={(e) => { const newC = [...categories]; newC[i].name = e.target.value; setCategories(newC); }} className="flex-1 p-3 text-sm rounded-lg border border-blue-100" />
              
              <div className="flex flex-1 gap-2 w-full">
                <input type="text" placeholder="Logo URL" value={cat.imageUrl} onChange={(e) => { const newC = [...categories]; newC[i].imageUrl = e.target.value; setCategories(newC); }} className="flex-1 p-3 text-sm rounded-lg border border-blue-100 bg-white" />
                <button 
                  onClick={() => autoFetchLogo(i, cat.name)} 
                  title="Auto Fetch Logo"
                  className="p-3 bg-[#001A33] text-white rounded-lg hover:bg-blue-900 transition flex items-center gap-1"
                >
                  <Wand2 size={16} />
                </button>
              </div>

              <input type="text" placeholder="Link (e.g. /collection/rolex)" value={cat.link} onChange={(e) => { const newC = [...categories]; newC[i].link = e.target.value; setCategories(newC); }} className="flex-1 p-3 text-sm rounded-lg border border-blue-100" />
              <button onClick={() => setCategories(categories.filter((_, idx) => idx !== i))} className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
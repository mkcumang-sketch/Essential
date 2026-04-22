"use client";
import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Trash2, RefreshCcw, ArrowRightLeft, ShieldAlert } from 'lucide-react';

export default function RedirectManager() {
    const [redirects, setRedirects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [form, setForm] = useState({ oldUrl: '', newUrl: '', isPermanent: true });

    const fetchRedirects = async () => {
        try {
            const res = await fetch('/api/seo/redirects');
            const json = await res.json();
            if (json.success) setRedirects(json.data);
        } catch (e) { console.error("Failed to load redirects"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRedirects(); }, []);

    const handleAdd = async () => {
        if (!form.oldUrl || !form.newUrl) return alert("Both URLs are required.");
        setIsSaving(true);
        try {
            const res = await fetch('/api/seo/redirects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setForm({ oldUrl: '', newUrl: '', isPermanent: true });
                fetchRedirects();
            } else { alert("Failed to add redirect. Old URL might already exist."); }
        } catch (e) { alert("Network error."); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this redirect rule?")) return;
        try {
            await fetch('/api/seo/redirects', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            setRedirects(redirects.filter(r => r._id !== id));
        } catch (e) { alert("Delete failed."); }
    };

    if (loading) return <div className="p-8 text-center text-[#00F0FF]"><RefreshCcw className="animate-spin inline" size={24}/></div>;

    return (
        <div className="bg-[#111] p-8 rounded-[30px] border border-white/10 mt-8 space-y-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h3 className="text-2xl font-serif text-white flex items-center gap-3"><ArrowRightLeft className="text-[#00F0FF]"/> 301 Redirect Engine</h3>
                    <p className="text-xs text-gray-400 mt-1">Preserve SEO ranking when deleting or renaming assets.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* 📝 ADD REDIRECT FORM */}
                <div className="md:col-span-4 bg-black p-6 rounded-2xl border border-white/5 h-max space-y-4">
                    <h4 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2">Create New Rule</h4>
                    
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Old Broken URL / Path</label>
                        <input value={form.oldUrl} onChange={e=>setForm({...form, oldUrl: e.target.value})} className="w-full bg-[#111] border border-red-500/30 p-3 rounded-lg text-sm text-red-400 outline-none focus:border-red-500" placeholder="/product/old-watch-name" />
                    </div>
                    
                    <div className="flex justify-center text-gray-600"><LinkIcon size={16}/></div>
                    
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">New Destination URL</label>
                        <input value={form.newUrl} onChange={e=>setForm({...form, newUrl: e.target.value})} className="w-full bg-[#111] border border-green-500/30 p-3 rounded-lg text-sm text-green-400 outline-none focus:border-green-500" placeholder="/product/new-watch-name" />
                    </div>

                    <div className="pt-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Redirect Type</label>
                        <select value={form.isPermanent ? '301' : '302'} onChange={e=>setForm({...form, isPermanent: e.target.value === '301'})} className="w-full bg-[#111] border border-white/20 p-3 rounded-lg text-sm text-white outline-none">
                            <option value="301">301 Permanent (Best for SEO)</option>
                            <option value="302">302 Temporary</option>
                        </select>
                    </div>

                    <button onClick={handleAdd} disabled={isSaving} className="w-full py-4 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-[#00F0FF] hover:text-black transition-all mt-4 disabled:opacity-50">
                        {isSaving ? 'Engaging...' : '+ Add Redirect Rule'}
                    </button>
                </div>

                {/* 📋 LIST OF ACTIVE REDIRECTS */}
                <div className="md:col-span-8">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {redirects.length === 0 ? (
                            <div className="p-10 border border-dashed border-white/20 rounded-2xl text-center text-gray-500 flex flex-col items-center">
                                <ShieldAlert size={30} className="mb-2 opacity-50"/>
                                <p className="text-sm font-bold">No active redirects.</p>
                                <p className="text-xs">Any deleted product will show a 404 error on Google.</p>
                            </div>
                        ) : redirects.map((r, i) => (
                            <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-black border border-white/10 rounded-xl hover:border-white/30 transition-colors gap-4">
                                <div className="flex-1 w-full flex items-center gap-4">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${r.isPermanent ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {r.isPermanent ? '301' : '302'}
                                    </span>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 items-center">
                                        <p className="text-sm text-red-400 truncate pr-2" title={r.oldUrl}>{r.oldUrl}</p>
                                        <div className="flex items-center gap-2">
                                            <ArrowRightLeft size={12} className="text-gray-600 hidden md:block shrink-0"/>
                                            <p className="text-sm text-green-400 truncate" title={r.newUrl}>{r.newUrl}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(r._id)} className="p-2 text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors shrink-0">
                                    <Trash2 size={14}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
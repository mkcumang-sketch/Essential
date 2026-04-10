"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, RefreshCw, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AbandonedCartsClient({ initialLeads }: { initialLeads: any[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // 🚀 GHOST KILLER: Hamesha fresh server data ke sath sync rakho
  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(l => 
      l.name?.toLowerCase().includes(q) || 
      l.email?.toLowerCase().includes(q) ||
      l.phone?.toLowerCase().includes(q)
    );
  }, [leads, query]);

  const onDelete = (id: string) => {
    const previousLeads = [...leads]; // Backup in case of error
    setDeletingId(id);
    
    // 🚀 INSTANT FRONTEND FIX: Delete dabate hi turant screen se hata do
    setLeads(prev => prev.filter(item => item._id !== id));
    
    startTransition(async () => {
      try {
        // Cache Buster URL to force Next.js to not use cached API
        const res = await fetch(`/api/admin/abandoned-carts/${id}?t=${Date.now()}`, { 
          method: 'DELETE',
          headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await res.json();
        
        if (data.success) {
          // 🚀 CACHE PURGE: Server ko naya data laane bolo
          router.refresh(); 
          notify("Cart Permanently Purged", "success");
        } else {
          // Error aane par data wapas le aao
          setLeads(previousLeads);
          notify(data.message || "Failed to purge cart.", "error");
        }
      } catch (error) {
        setLeads(previousLeads);
        notify("Network error during deletion", "error");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-8 relative">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-8 left-1/2 z-[200] border text-white px-6 py-4 rounded-full flex items-center gap-4 shadow-2xl backdrop-blur-md ${toast.type === 'success' ? 'bg-[#0A0A0A] border-[#D4AF37]/30' : 'bg-red-950 border-red-500/30'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} className="text-[#D4AF37]" /> : <AlertCircle size={18} className="text-red-500" />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-[#D4AF37] rounded-xl flex items-center justify-center font-bold shadow-lg">♞</div>
          <h1 className="text-2xl font-serif font-black tracking-tight">Abandoned Carts</h1>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full md:w-auto bg-white border border-gray-200 rounded-full pl-9 pr-4 py-3 text-xs font-bold outline-none focus:border-[#D4AF37] transition-all shadow-sm" placeholder="Search client..." />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.length > 0 ? filtered.map((lead) => (
            <motion.div key={lead._id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-gray-200 transition-all flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Client Profile</div>
                  <div className="text-xl font-serif font-black tracking-tight leading-tight">{lead.name || "Vault Client"}</div>
                  <div className="text-xs text-gray-500 mt-2 font-bold">{lead.email || "—"}</div>
                  <div className="text-xs text-gray-500 mt-1">{lead.phone || "—"}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">Abandoned</div>
                  <div className="text-xl font-black font-serif italic">₹{Number(lead.cartTotal || 0).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-50">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => onDelete(lead._id)} disabled={isPending && deletingId === lead._id}
                  className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-200 hover:bg-black hover:text-[#D4AF37] hover:border-black transition-colors flex items-center justify-center disabled:opacity-50">
                  {isPending && deletingId === lead._id ? <RefreshCw size={16} className="animate-spin text-gray-400" /> : <Trash2 size={16} />}
                </motion.button>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
               <h3 className="text-2xl font-serif italic text-gray-400 mb-2">No Abandoned Carts</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Your vault recovery queue is clear.</p>
            </div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
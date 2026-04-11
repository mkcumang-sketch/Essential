"use client";

import { useEffect, useMemo, useState, useTransition, useCallback } from "react";
import { deleteAbandonedCart } from "@/app/actions/abandonedCarts";
import { Trash2, RefreshCw, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Lead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cartTotal: number;
  createdAt?: string;
};

export default function AbandonedCartsAdminPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // Global VIP Notification System
  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1. 🚀 THE GHOST KILLER: Extracted fetch function with Cache Buster
  const fetchLeads = useCallback(async () => {
    try {
      // Date.now() ensures Next.js/Browser NEVER caches this request. It always gets fresh data.
      const r = await fetch(`/api/admin/abandoned-carts?t=${Date.now()}`, { cache: "no-store" });
      const j = await r.json();
      if (j?.success && Array.isArray(j.leads)) {
        setLeads(j.leads);
      }
    } catch (error) {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q)
    );
  }, [leads, query]);

  const onDelete = (id: string) => {
    setDeletingId(id);
    
    startTransition(async () => {
      try {
        const res = await deleteAbandonedCart(id);
        
        if (res?.success) {
          notify("Cart Permanently Purged", "success");
          // Background me ek baar aur fresh data sync karlo taaki koi discrepancy na rahe
          fetchLeads(); 
        } else {
          // Fail hua toh wapas purana data manga lo
          setLeads((l) => l.filter((x) => x._id !== id)); // Rollback optimistic update
          fetchLeads();
          notify("Failed to purge cart. Check backend logic.", "error");
        }
      } catch (error) {
        // Rollback optimistic update on network error
        setLeads((l) => l.filter((x) => x._id !== id));
        fetchLeads();
        notify("Network error during deletion", "error");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-8 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: "-50%" }} 
            animate={{ opacity: 1, y: 0, x: "-50%" }} 
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-8 left-1/2 z-[200] border text-white px-6 py-4 rounded-full flex items-center gap-4 shadow-2xl backdrop-blur-md ${toast.type === 'success' ? 'bg-[#0A0A0A] border-[#D4AF37]/30' : 'bg-red-950 border-red-500/30'}`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} className="text-[#D4AF37]" /> : <AlertCircle size={18} className="text-red-500" />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-[#D4AF37] rounded-xl flex items-center justify-center font-bold">♞</div>
          <h1 className="text-2xl font-serif font-black tracking-tight">Abandoned Carts</h1>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white border border-gray-200 rounded-full pl-9 pr-4 py-3 text-xs font-bold outline-none focus:border-[#D4AF37] transition-all shadow-sm"
            placeholder="Search name, email, phone"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 rounded-3xl border border-gray-100 bg-white animate-pulse space-y-4 shadow-sm">
              <div className="h-4 w-1/4 bg-gray-100 rounded-full" />
              <div className="h-6 w-1/2 bg-gray-100 rounded" />
              <div className="h-4 w-1/3 bg-gray-100 rounded" />
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-50">
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                <div className="h-10 w-10 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.length > 0 ? filtered.map((lead) => (
              <motion.div
                key={lead._id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-gray-200 transition-all flex flex-col justify-between"
              >
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
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(lead._id)}
                    disabled={isPending && deletingId === lead._id}
                    className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-200 hover:bg-black hover:text-[#D4AF37] hover:border-black transition-colors flex items-center justify-center disabled:opacity-50"
                  >
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
      )}
    </div>
  );
}
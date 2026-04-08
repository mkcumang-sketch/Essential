"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { deleteAbandonedCart } from "@/app/actions/abandonedCarts";
import { Trash2, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Lead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cartTotal: number;
  createdAt?: string;
};

export default function AbandonedCartsAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/admin/abandoned-carts", { cache: "no-store" });
        const j = await r.json();
        if (!alive) return;
        if (j?.success && Array.isArray(j.leads)) setLeads(j.leads);
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

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
    const prev = leads;
    setDeletingId(id);
    setLeads((l) => l.filter((x) => x._id !== id));
    startTransition(async () => {
      try {
        const res = await deleteAbandonedCart(id);
        if (!res?.success) setLeads(prev);
      } catch {
        setLeads(prev);
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="space-y-8">
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
            className="bg-white border border-gray-200 rounded-full pl-9 pr-3 py-2 text-sm outline-none focus:border-black"
            placeholder="Search name, email, phone"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-white animate-pulse space-y-4">
              <div className="h-6 w-1/3 bg-gray-100 rounded" />
              <div className="h-4 w-1/2 bg-gray-100 rounded" />
              <div className="h-4 w-1/4 bg-gray-100 rounded" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-8 w-24 bg-gray-100 rounded-full" />
                <div className="h-9 w-9 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((lead) => (
              <motion.div
                key={lead._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Client</div>
                    <div className="text-lg font-serif font-black tracking-tight">{lead.name || "Vault Client"}</div>
                    <div className="text-sm text-gray-500">{lead.email || "—"}</div>
                    <div className="text-sm text-gray-500">{lead.phone || "—"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</div>
                    <div className="text-xl font-black">₹{Number(lead.cartTotal || 0).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    onClick={() => onDelete(lead._id)}
                    disabled={isPending && deletingId === lead._id}
                    className="h-10 w-10 rounded-xl border border-gray-200 hover:bg-black hover:text-[#D4AF37] transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {isPending && deletingId === lead._id ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}


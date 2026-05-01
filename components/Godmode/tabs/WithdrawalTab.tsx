"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, CheckCircle, XCircle, Clock, Search, Wallet, IndianRupee } from 'lucide-react';

export default function WithdrawalTab() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/wallet/withdraw');
      const data = await res.json();
      if (data.success) setRequests(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) return;
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
        alert(`Request ${status}`);
      }
    } catch (e) { alert("Action failed"); }
  };

  const filteredRequests = requests.filter(r => r.status === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="bg-[#111] p-6 md:p-10 rounded-[30px] border border-yellow-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-yellow-500/20 rounded-2xl text-yellow-400"><Landmark size={30} /></div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">Financial Logistics</h3>
            <p className="text-sm text-gray-400">Manage reward withdrawals and treasury outflows.</p>
          </div>
        </div>
        <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
          {['PENDING', 'APPROVED', 'REJECTED'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === s ? 'bg-yellow-500 text-black' : 'text-gray-500 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="py-20 text-center text-gray-500 animate-pulse">Scanning Treasury Requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-20 text-center text-gray-600 font-bold uppercase tracking-widest">No {filter} Requests</div>
        ) : filteredRequests.map((r) => (
          <div key={r._id} className="p-6 bg-[#111] border border-white/10 rounded-2xl hover:border-yellow-500/50 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-black border border-white/20 flex items-center justify-center">
                  <Wallet className="text-gray-400" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{r.userId?.name || 'Unknown User'}</h4>
                  <p className="text-xs text-gray-500">{r.userId?.email}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center md:text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Withdrawal Amount</p>
                  <p className="text-2xl font-bold text-green-400">₹{r.amount.toLocaleString()}</p>
                </div>

                <div className="p-4 bg-black rounded-xl border border-white/5 min-w-[200px]">
                  <p className="text-[10px] text-gray-500 uppercase mb-1">{r.paymentMethod?.type} Details</p>
                  <p className="text-xs font-mono text-white break-all">{r.paymentMethod?.details}</p>
                </div>

                {r.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleAction(r._id, 'APPROVED')} className="p-4 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition-all border border-green-500/20">
                      <CheckCircle size={20} />
                    </button>
                    <button onClick={() => handleAction(r._id, 'REJECTED')} className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20">
                      <XCircle size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
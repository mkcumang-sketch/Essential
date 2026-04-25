"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Wallet, Package, AlertTriangle, ChevronRight, Terminal, Trash2 } from 'lucide-react';

interface DashboardTabProps {
  fullAnalytics: any;
  dashboardView: 'orders' | 'abandoned';
  setDashboardView: (view: 'orders' | 'abandoned') => void;
  leads: any[];
  orders: any[];
  dispatchVIPRecovery: (channel: "email" | "sms" | "whatsapp", lead: any) => void;
  vipDispatchingKey: string | null;
  handleDeleteLead: (id: string) => void;
  systemLogs: string[];
}

export default function DashboardTab({
  fullAnalytics,
  dashboardView,
  setDashboardView,
  leads,
  orders,
  dispatchVIPRecovery,
  vipDispatchingKey,
  handleDeleteLead,
  systemLogs,
}: DashboardTabProps) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} key="dash" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-[#111] border border-white/10 p-6 md:p-8 rounded-[20px] md:rounded-[30px] relative overflow-hidden group hover:border-[#D4AF37]/50 transition-colors">
          <div className="absolute -right-10 -top-10 text-[#D4AF37] opacity-5 group-hover:opacity-10 transition-opacity"><BarChart3 size={200}/></div>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase mb-4 flex items-center gap-2"><Wallet size={16}/> Total sales</p>
          <p className="text-3xl md:text-5xl font-bold text-white">₹{(fullAnalytics?.metrics?.totalRevenue || 0).toLocaleString('en-IN')}</p>
        </div>

        <div onClick={() => setDashboardView('orders')} className={`bg-[#111] border p-6 md:p-8 rounded-[20px] md:rounded-[30px] cursor-pointer transition-all flex flex-col justify-between hover:scale-[1.02] ${dashboardView === 'orders' ? 'border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'border-white/10 hover:border-white/30'}`}>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase flex items-center gap-2"><Package size={16}/> Total Orders</p>
          <div className="mt-4 md:mt-0">
            <p className="text-3xl md:text-4xl font-bold text-[#00F0FF]">{fullAnalytics?.metrics?.totalOrders || 0}</p>
            <p className="text-[9px] md:text-[10px] text-gray-500 uppercase mt-2 flex items-center gap-1">View Details <ChevronRight size={12}/></p>
          </div>
        </div>
        
        <div onClick={() => setDashboardView('abandoned')} className={`bg-[#111] border p-6 md:p-8 rounded-[20px] md:rounded-[30px] cursor-pointer transition-all flex flex-col justify-between hover:scale-[1.02] ${dashboardView === 'abandoned' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/10 hover:border-white/30'}`}>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase flex items-center gap-2"><AlertTriangle size={16} className={leads.length > 0 ? "text-red-500 animate-pulse" : ""}/> Abandoned Carts</p>
          <div className="mt-4 md:mt-0">
            <p className="text-3xl md:text-4xl font-bold text-red-500">{leads.length}</p>
            <p className="text-[9px] md:text-[10px] text-gray-500 uppercase mt-2 flex items-center gap-1">View Details <ChevronRight size={12}/></p>
          </div>
        </div>
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-[20px] md:rounded-[30px] p-6 md:p-8 min-h-[400px] w-full max-w-[100vw] overflow-x-hidden">
           <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <h3 className="text-lg md:text-xl font-bold text-white">
                 {dashboardView === 'orders' ? 'Recent orders' : 'Abandoned carts'}
              </h3>
           </div>

           <div className="space-y-4">
              {dashboardView === 'orders' && (
                 orders.length === 0 ? <p className="text-gray-600 text-[10px] md:text-sm uppercase tracking-widest text-center py-10 font-bold">No Records Found</p> :
                 orders.slice(0, 8).map((o: any, i: number) => (
                    <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-black border border-white/10 rounded-xl hover:border-[#D4AF37]/50 transition-colors gap-4">
                       <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                          <div className="w-10 h-10 bg-[#00F0FF]/10 text-[#00F0FF] rounded-lg flex items-center justify-center text-[10px] md:text-xs font-bold shrink-0">
                              #{o.orderId?.slice(-4) || 'UKN'}
                          </div>
                          <div className="overflow-hidden">
                             <p className="font-bold text-white text-xs md:text-sm truncate">{o.customer?.name || 'Guest User'}</p>
                             <p className="text-[10px] md:text-xs text-gray-500 truncate">{o.customer?.email || o.customer?.phone}</p>
                          </div>
                       </div>
                       <div className="text-left md:text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                          <p className="text-base md:text-lg font-bold text-green-400">₹{(o.totalAmount || 0).toLocaleString()}</p>
                          <span className="text-[8px] md:text-[10px] uppercase text-gray-400">{o.status}</span>
                       </div>
                    </div>
                 ))
              )}

              {dashboardView === 'abandoned' && (
                 leads.length === 0 ? (
                   <p className="text-gray-600 text-[10px] md:text-sm uppercase tracking-widest text-center py-10 font-bold">
                     No cart reminders pending
                   </p>
                 ) : (
                   leads.map((lead: any, i: number) => {
                     const leadId = lead?._id;
                     const contact = lead.phone || lead.email || "---";

                     const isEmailLoading = vipDispatchingKey === `email:${leadId}`;
                     const isSmsLoading = vipDispatchingKey === `sms:${leadId}`;
                     const isWaLoading = vipDispatchingKey === `whatsapp:${leadId}`;

                     return (
                       <div
                         key={i}
                         className="flex flex-col xl:flex-row justify-between xl:items-center p-4 md:p-5 bg-black/40 border border-[#D4AF37]/20 rounded-xl hover:border-[#D4AF37]/50 transition-colors gap-4 shadow-lg w-full"
                       >
                         <div className="flex items-center gap-3 md:gap-4">
                           <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D4AF37]/15 text-[#D4AF37] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(212,175,55,0.18)]">
                             <AlertTriangle size={18} />
                           </div>
                           <div className="overflow-hidden">
                             <p className="font-bold text-white text-sm md:text-base truncate">
                               {lead.name || "Client"}
                             </p>
                             <p className="text-[10px] md:text-xs text-[#D4AF37] font-mono mt-1 truncate">
                               ₹{lead.cartTotal?.toLocaleString() || "---"} <span className="mx-2 text-white/20">|</span> {contact}
                             </p>
                           </div>
                         </div>

                         <div className="flex flex-col gap-3 w-full xl:w-auto items-start xl:items-end">
                           <div className="flex flex-wrap gap-2 justify-start md:justify-end w-full">
                             <button
                               type="button"
                               onClick={() => dispatchVIPRecovery("email", lead)}
                               disabled={isEmailLoading}
                               className={`flex-1 md:flex-none px-4 py-3 min-h-[44px] rounded-lg border text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                                 isEmailLoading
                                   ? "bg-white/10 text-white/60 border-[#D4AF37]/20"
                                   : "bg-white/10 text-gray-200 border-white/10 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]"
                               }`}
                             >
                               ✉️ Email
                             </button>

                             <button
                               type="button"
                               onClick={() => dispatchVIPRecovery("sms", lead)}
                               disabled={isSmsLoading}
                               className={`flex-1 md:flex-none px-4 py-3 min-h-[44px] rounded-lg border text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                                 isSmsLoading
                                   ? "bg-white/10 text-white/60 border-[#D4AF37]/20"
                                   : "bg-white/10 text-gray-200 border-white/10 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37]"
                               }`}
                             >
                               📱 Text
                             </button>

                             <button
                               type="button"
                               onClick={() => dispatchVIPRecovery("whatsapp", lead)}
                               disabled={isWaLoading}
                               className={`w-full md:w-auto px-4 py-3 min-h-[44px] rounded-lg border text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                                 isWaLoading
                                   ? "bg-white/10 text-white/60 border-[#D4AF37]/20"
                                   : "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25 hover:bg-[#D4AF37]/20 hover:text-black"
                               }`}
                             >
                               💬 WhatsApp
                             </button>
                           </div>

                           <div className="text-right w-full">
                             <button
                               onClick={() => handleDeleteLead(lead._id)}
                               className="text-red-500/70 text-[9px] md:text-[10px] uppercase font-bold tracking-widest hover:text-red-500 transition-colors flex items-center justify-end gap-1 ml-auto p-2"
                             >
                               <Trash2 size={12} /> Remove
                             </button>
                           </div>
                         </div>
                       </div>
                     );
                   })
                 )
              )}
           </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-[20px] md:rounded-[30px] p-6 md:p-8 flex flex-col">
           <h3 className="text-xs md:text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><Terminal size={16}/> System Logs</h3>
           <div className="flex-1 overflow-hidden flex flex-col justify-end space-y-2">
               {systemLogs.map((log, i) => (
                   <div key={i} className="text-[10px] md:text-xs text-gray-500">
                       <span className="text-[#D4AF37] mr-2">[{new Date().toLocaleTimeString()}]</span> {log}
                   </div>
               ))}
           </div>
        </div>
     </div>
   </motion.div>
  );
}
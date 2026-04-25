"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Download, Package, MapPin, Eye, Trash2 } from 'lucide-react';

interface OrderTrackerTabProps {
  orders: any[];
  exportToCSV: () => void;
  handleUpdateOrderStatus: (id: string, newStatus: string) => void;
  handleUpdateTracking: (id: string, trackingId: string) => void;
  setSelectedOrder: (order: any) => void;
  handleDeleteOrder: (id: string) => void;
}

export default function OrderTrackerTab({
  orders,
  exportToCSV,
  handleUpdateOrderStatus,
  handleUpdateTracking,
  setSelectedOrder,
  handleDeleteOrder,
}: OrderTrackerTabProps) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} key="orders" className="space-y-8">
       <div className="bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[30px] border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="p-4 md:p-5 bg-blue-500/20 rounded-2xl text-blue-400"><Truck size={24} className="md:w-[30px] md:h-[30px]"/></div>
            <div>
               <h3 className="text-xl md:text-3xl font-bold text-white mb-1">Order Logistics</h3>
               <p className="text-[10px] md:text-sm text-gray-400">Track and fulfill global acquisitions.</p>
            </div>
          </div>
          <button onClick={exportToCSV} className="w-full md:w-auto min-h-[44px] bg-green-600 text-white px-6 py-3 md:py-4 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
               <Download size={18}/> Export Excel
          </button>
       </div>
       
       <div className="space-y-4">
         {orders.length === 0 ? <p className="text-center py-20 text-gray-600 font-bold tracking-widest uppercase text-xs md:text-sm">No Active Operations</p> : orders.map((o: any, i: number) => (
            <div key={i} className="p-4 md:p-6 bg-[#111] border border-white/10 rounded-[20px] flex flex-col gap-4 hover:border-blue-500/50 transition-colors shadow-lg w-full max-w-[100vw]">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
                   <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-black border border-white/20 flex items-center justify-center text-white font-bold text-xs md:text-sm shrink-0">#{o.orderId?.slice(-4) || 'UKN'}</div>
                      <div className="overflow-hidden">
                         <h4 className="font-bold text-base md:text-xl text-white mb-1 truncate">{o.customer?.name || 'Guest'}</h4>
                         <p className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1 md:gap-2 truncate"><MapPin size={10} className="md:w-3 md:h-3"/> {o.customer?.city || 'Unknown'} <span className="mx-1 md:mx-2 text-white/20">|</span> <Package size={10} className="md:w-3 md:h-3"/> {o.items?.length || 1} Unit(s)</p>
                      </div>
                   </div>
                   <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                       <div className="text-left md:text-right w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-center">
                        <p className="text-[10px] md:text-xs text-gray-500 mb-1">Clearance Value</p>
                        <p className="font-bold text-green-400 text-lg md:text-2xl">₹{(o.totalAmount || 0).toLocaleString()}</p>
                      </div>
                      <select value={o.status} onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)} className="w-full md:w-48 min-h-[44px] bg-black border border-white/30 text-white text-[10px] md:text-xs font-bold uppercase rounded-xl p-3 md:p-4 cursor-pointer hover:border-[#D4AF37] transition-colors appearance-none text-center">
                        <option value="PENDING">Clearance Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="DISPATCHED">In Transit</option>
                        <option className="text-green-500" value="DELIVERED">Secured Delivery</option>
                        <option className="text-red-500" value="CANCELLED">Aborted</option>
                      </select>
                      <div className="flex gap-2 w-full md:w-auto justify-end">
                         <button onClick={() => setSelectedOrder(o)} className="flex-1 md:flex-none p-3 md:p-4 min-h-[44px] bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-xl transition-all border border-white/10 flex justify-center items-center">
                             <Eye size={18}/>
                         </button>
                         <button onClick={() => handleDeleteOrder(o._id)} className="flex-1 md:flex-none p-3 md:p-4 min-h-[44px] bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex justify-center items-center">
                             <Trash2 size={18}/>
                         </button>
                      </div>
                   </div>
               </div>
            
               <div className="bg-black/50 p-3 md:p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-3 w-full items-center mt-2">
                   <input 
                       placeholder="Enter Tracking ID..." 
                       defaultValue={o.trackingId || ""} 
                       id={`track-${o._id}`}
                       className="w-full min-h-[44px] bg-black border border-white/20 px-3 md:px-4 py-3 md:py-4 rounded-xl text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white" 
                   />
                   <button onClick={() => handleUpdateTracking(o._id, (document.getElementById(`track-${o._id}`) as HTMLInputElement).value)} className="w-full md:w-auto min-h-[44px] bg-[#D4AF37] text-black px-6 py-3 md:py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-white transition-all whitespace-nowrap">
                       <Truck size={16}/> Save Tracking
                   </button>
               </div>
            </div>
         ))}
       </div>
     </motion.div>
  );
}
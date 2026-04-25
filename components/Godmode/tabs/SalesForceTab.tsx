"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2 } from 'lucide-react';

interface SalesForceTabProps {
  agents: any[];
  setIsAgentModalOpen: (open: boolean) => void;
  handleDeleteAffiliate: (id: string) => void;
}

export default function SalesForceTab({
  agents,
  setIsAgentModalOpen,
  handleDeleteAffiliate,
}: SalesForceTabProps) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} key="salesforce" className="space-y-6 md:space-y-8 w-full">
       <div className="bg-[#111] p-6 md:p-10 rounded-[20px] md:rounded-[40px] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 w-full">
          <div><h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Network Terminals</h3><p className="text-gray-400 text-xs md:text-sm">Oversee registered referral vectors.</p></div>
          <button onClick={() => setIsAgentModalOpen(true)} className="w-full md:w-auto min-h-[44px] bg-[#D4AF37] text-black px-6 md:px-8 py-4 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"><PlusCircle size={18}/> Provision Terminal</button>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
          <div className="bg-[#111] p-6 md:p-8 rounded-[20px] md:rounded-[30px] border border-white/10"><p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Active reps</p><h2 className="text-3xl md:text-4xl font-bold text-white">{agents.length}</h2></div>
          <div className="bg-[#111] p-6 md:p-8 rounded-[20px] md:rounded-[30px] border border-white/10"><p className="text-[#00F0FF] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Total Packets</p><h2 className="text-3xl md:text-4xl font-bold text-white">{agents.reduce((acc, a) => acc + (a.clicks || 0), 0).toLocaleString()}</h2></div>
          <div className="bg-[#111] p-6 md:p-8 rounded-[20px] md:rounded-[30px] border border-white/10"><p className="text-green-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">Total Output</p><h2 className="text-3xl md:text-4xl font-bold text-white">₹{agents.reduce((acc, a) => acc + (a.revenue || 0), 0).toLocaleString()}</h2></div>
       </div>

       <div className="bg-[#111] rounded-[20px] md:rounded-[30px] border border-white/10 overflow-hidden shadow-2xl w-full">
          <div className="p-6 md:p-8 border-b border-white/10"><h4 className="text-base md:text-lg font-bold text-white">Terminal Ledger</h4></div>
          <div className="overflow-x-auto w-full max-w-[100vw]">
              <table className="w-full text-left min-w-[600px]">
                 <thead className="bg-black/50 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-white/10">
                    <tr><th className="p-4 md:p-6 pl-6 md:pl-8">Identity</th><th className="p-4 md:p-6 text-center">Pings</th><th className="p-4 md:p-6 text-center">Conversions</th><th className="p-4 md:p-6 text-right">Yield</th><th className="p-4 md:p-6 text-center pr-6 md:pr-8">Actions</th></tr>
                 </thead>
                 <tbody>
                     {agents.length === 0 ? (
                        <tr><td colSpan={5} className="p-10 md:p-16 text-center text-gray-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">No Active Vectors.</td></tr>
                    ) : agents.map((agent, i) => (
                       <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 md:p-6 pl-6 md:pl-8">
                             <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-black border border-white/20 rounded-full flex items-center justify-center text-white font-bold shrink-0">{agent.name?.charAt(0) || 'U'}</div>
                                <div className="overflow-hidden">
                                  <p className="font-bold text-white text-xs md:text-sm truncate">{agent.name}</p>
                                  <div className="mt-1 flex flex-col gap-1">
                                    <p className="text-[8px] md:text-[10px] text-[#00F0FF] uppercase tracking-widest truncate">Code: {agent.code}</p>
                                    <button 
                                      onClick={() => {
                                        navigator.clipboard.writeText(window.location.origin + '/?ref=' + agent.code);
                                        alert('Link Copied!');
                                      }}
                                      className="w-fit px-2 py-1 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-[7px] md:text-[8px] font-bold uppercase tracking-tighter rounded border border-white/10 transition-all"
                                    >
                                      Copy Link
                                    </button>
                                  </div>
                                </div>
                             </div>
                          </td>
                          <td className="p-4 md:p-6 text-center text-gray-300 font-mono text-xs md:text-sm">{agent.clicks || 0}</td>
                          <td className="p-4 md:p-6 text-center font-bold text-green-400 font-mono text-xs md:text-sm">{agent.sales || 0}</td>
                          <td className="p-4 md:p-6 text-right font-bold text-white font-mono text-xs md:text-sm">₹{(agent.revenue || 0).toLocaleString()}</td>
                          <td className="p-4 md:p-6 text-center pr-6 md:pr-8"><button onClick={() => handleDeleteAffiliate(agent._id)} className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all mx-auto"><Trash2 size={16}/></button></td>
                       </tr>
                    ))}
                 </tbody>
              </table>
          </div>
       </div>
    </motion.div>
  );
}
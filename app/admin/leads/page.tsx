"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => {
        if(data.success) setLeads(data.leads);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-10 font-serif">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-3xl italic uppercase tracking-tighter">Inquiry Logs</h1>
          <Link href="/admin" className="text-xs font-bold underline">Dashboard</Link>
        </div>

        {loading ? <p className="text-center animate-pulse">Loading Logs...</p> : (
          <div className="grid gap-6">
            {leads.map((lead: any) => (
              <div key={lead._id} className="bg-white p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold uppercase">{lead.name}</h3>
                  <p className="text-xs text-yellow-600 font-bold">{lead.phone} | {lead.email}</p>
                  <p className="text-sm text-gray-500 mt-4 italic">"{lead.message}"</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase">{new Date(lead.createdAt).toLocaleString()}</p>
                  <div className="mt-4">
                     <a href={`tel:${lead.phone}`} className="bg-black text-white text-[9px] px-4 py-2 uppercase tracking-widest font-bold hover:bg-yellow-600 transition-colors">Call Now</a>
                  </div>
                </div>
              </div>
            ))}
            {leads.length === 0 && <p className="text-center text-gray-400 italic">No inquiries yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
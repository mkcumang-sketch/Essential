"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package, IndianRupee, TrendingUp, PlusCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ totalSales: 0, myEarnings: 0, activeProducts: 0 });

  useEffect(() => {
    if (status === "unauthenticated") router.push('/');
    if (session?.user?.role && session.user.role !== 'VENDOR' && session.user.role !== 'SUPER_ADMIN') {
      router.push('/account'); // Redirect normal users
    }
    // Fetch Vendor Specific Stats here...
  }, [session, status]);

  if (status === "loading") return <div className="h-screen bg-[#050505] text-[#D4AF37] flex items-center justify-center">Initializing Vendor OS...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#050505] font-sans selection:bg-[#D4AF37] selection:text-white">
      {/* VENDOR NAV */}
      <nav className="bg-[#050505] text-white py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-2xl text-[#D4AF37]">♞</div>
          <span className="text-xs font-black uppercase tracking-widest border-l border-white/20 pl-4">Partner Portal</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs text-gray-400">{session?.user?.name} (Vendor)</span>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-serif italic mb-2">Vendor Command Center</h1>
            <p className="text-gray-500 text-sm font-medium">Manage your portfolio and track earnings. The platform retains a 15% concierge fee.</p>
          </div>
          <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#050505] hover:text-white transition-all flex items-center gap-2 shadow-xl">
            <PlusCircle size={16}/> Inject New Asset
          </button>
        </header>

        {/* VENDOR ANALYTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5"><TrendingUp size={80}/></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Gross Sales</p>
              <h3 className="text-4xl font-black">₹0.00</h3>
           </div>
           
           <div className="bg-[#050505] p-8 rounded-[30px] shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-[#D4AF37]"><IndianRupee size={80}/></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Net Earnings (After 15% Cut)</p>
              <h3 className="text-4xl font-black text-[#D4AF37]">₹0.00</h3>
              <p className="text-xs mt-2 text-gray-400">Next payout scheduled on 1st of month.</p>
           </div>

           <div className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5"><Package size={80}/></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Active listings</p>
              <h3 className="text-4xl font-black">0</h3>
           </div>
        </div>

        {/* VENDOR PRODUCT LIST */}
        <div className="bg-white rounded-[30px] border border-gray-100 p-8 shadow-sm">
           <h3 className="text-lg font-bold mb-6">Your products</h3>
           <div className="border border-gray-100 rounded-2xl p-12 text-center text-gray-400 border-dashed">
              <Package size={40} className="mx-auto mb-4 opacity-50"/>
              <p className="text-xs font-black uppercase tracking-widest">You have not listed any products yet.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
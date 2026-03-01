"use client";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";

export default function Analytics({ orders, staff }: { orders: any[], staff: any[] }) {
  // 🛡️ Data calculations (Crash Proof)
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalSales = orders.length;
  const staffSales = orders.filter(o => o.referralCode).length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", val: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-gold-500" },
          { label: "Total Orders", val: totalSales, icon: ShoppingCart, color: "text-blue-500" },
          { label: "Staff Conversions", val: staffSales, icon: Users, color: "text-green-500" },
          { label: "Conversion Rate", val: "3.2%", icon: TrendingUp, color: "text-purple-500" },
        ].map((s, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl hover:border-white/20 transition-all">
            <s.icon className={`${s.color} mb-4`} size={24} />
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">{s.label}</p>
            <h3 className="text-3xl font-serif italic text-white">{s.val}</h3>
          </div>
        ))}
      </div>

      {/* 2. Visual Sales Graph (CSS-based Interactive Chart) */}
      <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-3xl">
        <h3 className="text-xl font-serif italic text-white mb-8">Performance Intelligence</h3>
        <div className="h-64 flex items-end gap-3 md:gap-6">
          {[45, 60, 40, 85, 55, 95, 70, 50, 80, 45, 65, 90].map((h, i) => (
            <div key={i} className="flex-1 group relative">
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                ₹{h * 10}k
              </div>
              {/* Bar */}
              <div 
                style={{ height: `${h}%` }} 
                className="w-full bg-white/5 group-hover:bg-gold-500 rounded-t-lg transition-all duration-500"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6 text-[9px] uppercase tracking-widest text-gray-600 font-bold">
          <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
        </div>
      </div>
    </div>
  );
}   
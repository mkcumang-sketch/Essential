"use client";
import { CreditCard, Package, BarChart3, ShieldCheck } from "lucide-react"; // Icons fixed

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "₹45,82,000", icon: CreditCard },
    { label: "Active Orders", value: "124", icon: Package },
    { label: "Site Visitors", value: "8,432", icon: BarChart3 },
  ];

  return (
    <div className="p-10 space-y-10 bg-[#FDFBF7] min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif italic underline decoration-[#C9A24D]/30">Command Center</h1>
        <div className="bg-white px-4 py-2 rounded-full border border-zinc-100 flex items-center gap-2">
           <ShieldCheck size={14} className="text-[#C9A24D]" />
           <span className="text-[10px] font-bold">LOCKED: us7081569@gmail.com</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-lg transition-all">
            <div className="p-3 bg-zinc-50 w-fit rounded-xl text-[#C9A24D] mb-6"><s.icon size={24} /></div>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
            <h3 className="text-3xl font-bold mt-1">{s.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, AlertCircle, ShoppingCart } from "lucide-react";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);

  // Auto-Insight Logic
  const getInsight = (stats: any) => {
    if (stats.traffic > 5000 && stats.conversion < 2) {
      return "Traffic is excellent but conversion is low. Check checkout flow.";
    }
    return "Referral performance is stable this month.";
  };

  return (
    <div className="p-10 space-y-10 bg-[#FDFBF7] min-h-screen">
      <h1 className="text-3xl font-serif italic text-blue-950">Enterprise Intelligence</h1>

      {/* Insight Banner */}
      <div className="bg-blue-900 text-white p-6 rounded-2xl flex items-center gap-4 shadow-xl">
        <AlertCircle className="text-blue-300" />
        <p className="text-sm font-medium tracking-wide italic">AI Insight: {data ? getInsight(data) : "Analyzing data..."}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Monthly Traffic Graph */}
        <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6">Traffic vs Conversions</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthly}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="#001A33" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sales" fill="#C9A24D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Abandoned Cart Leads */}
        <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm overflow-hidden">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-red-500">Lost Opportunities (Abandoned)</h3>
          <div className="space-y-4">
            {data?.abandonedLeads?.map((lead: any) => (
              <div key={lead._id} className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                <div>
                  <p className="font-bold text-sm">{lead.name}</p>
                  <p className="text-xs text-zinc-500">{lead.email}</p>
                </div>
                <button className="text-[10px] font-black uppercase bg-white px-4 py-2 rounded-lg border border-red-100">Contact</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
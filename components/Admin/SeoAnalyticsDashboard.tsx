"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Globe, AlertTriangle, CheckCircle, Image as ImageIcon, Type, Link as LinkIcon, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function SeoAnalyticsDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeoStats = async () => {
            try {
                const res = await fetch('/api/seo/analytics');
                const json = await res.json();
                if (json.success) setStats(json.data);
            } catch (err) {
                console.error("Failed to load SEO stats");
            } finally {
                setLoading(false);
            }
        };
        fetchSeoStats();
    }, []);

    if (loading) return (
        <div className="p-12 space-y-8 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-3">
                    <div className="h-10 bg-gray-100 rounded-xl w-64" />
                    <div className="h-4 bg-gray-50 rounded-lg w-48" />
                </div>
                <div className="h-20 bg-gray-50 rounded-3xl w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-gray-50 rounded-[2.5rem]" />)}
            </div>
        </div>
    );

    if (!stats) return (
        <div className="p-20 text-center bg-red-50 rounded-[3rem] border border-red-100">
            <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-2xl font-serif font-black italic text-red-900">Intelligence Offline</h3>
            <p className="text-red-600/60 text-sm mt-2 font-bold uppercase tracking-widest">Failed to load SEO Dashboard data</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h2 className="text-4xl font-serif font-black italic tracking-tighter text-black">SEO Command Center</h2>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mt-2">Real-time health of your search engine visibility.</p>
                </div>
                <div className={`p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl ${stats.avgScore >= 80 ? 'bg-white border border-green-100 shadow-green-100/20' : 'bg-white border border-orange-100 shadow-orange-100/20'}`}>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Site Health Score</p>
                        <p className={`text-4xl font-black font-mono mt-1 ${stats.avgScore >= 80 ? 'text-green-500' : 'text-orange-500'}`}>{stats.avgScore}/100</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stats.avgScore >= 80 ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                        {stats.avgScore >= 80 ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                    </div>
                </div>
            </div>

            {/* 📈 CRITICAL STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <SeoStatCard 
                    icon={<Globe size={24}/>} 
                    label="Indexed Pages" 
                    value={stats.totalIndexed} 
                    status="Visible to Google" 
                    color="bg-white border-gray-100 shadow-xl shadow-gray-100/50"
                    statusColor="text-green-500"
                />
                <SeoStatCard 
                    icon={<Type size={24}/>} 
                    label="Missing Meta Titles" 
                    value={stats.missingMetaTitle} 
                    status="Hurts CTR" 
                    color="bg-red-50/30 border-red-100 text-red-600"
                    statusColor="text-red-400"
                />
                <SeoStatCard 
                    icon={<LinkIcon size={24}/>} 
                    label="Missing Meta Desc" 
                    value={stats.missingMetaDesc} 
                    status="Reduces Rank" 
                    color="bg-orange-50/30 border-orange-100 text-orange-600"
                    statusColor="text-orange-400"
                />
                <SeoStatCard 
                    icon={<ImageIcon size={24}/>} 
                    label="Missing Alt Text" 
                    value={stats.missingAltText} 
                    status="Image Search Drop" 
                    color="bg-blue-50/30 border-blue-100 text-blue-600"
                    statusColor="text-blue-400"
                />
            </div>

            {/* 🚨 NEEDS ATTENTION LIST */}
            <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-2xl shadow-gray-100/50">
                <h3 className="text-xl font-serif font-black italic tracking-tighter text-black mb-10 flex items-center gap-3">
                    <AlertTriangle className="text-[#D4AF37]" size={24} /> Assets Needing Attention
                </h3>
                
                {stats.needsAttention.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                        <CheckCircle className="mx-auto mb-4 text-green-500" size={48}/>
                        <p className="text-gray-900 font-serif italic text-xl">All assets are fully optimized! Great job.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {stats.needsAttention.map((item: any, i: number) => (
                            <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50/30 hover:bg-white hover:shadow-xl hover:shadow-black/5 border border-gray-100 rounded-[2rem] gap-6 transition-all duration-500 group">
                                <div className="flex-1">
                                    <p className="text-sm font-black text-black mb-3 tracking-tight group-hover:text-[#D4AF37] transition-colors">{item.name}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.issues.title && <span className="px-3 py-1 bg-red-50 text-red-600 text-[9px] uppercase font-black tracking-widest rounded-full border border-red-100">No Title</span>}
                                        {item.issues.desc && <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[9px] uppercase font-black tracking-widest rounded-full border border-orange-100">No Desc</span>}
                                        {item.issues.alt && <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] uppercase font-black tracking-widest rounded-full border border-blue-100">No Alt Text</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="text-center">
                                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Health Score</p>
                                        <p className={`text-xl font-black font-mono mt-1 ${item.score >= 80 ? 'text-green-500' : 'text-red-500'}`}>{item.score}%</p>
                                    </div>
                                    <Link href={`/godmode/products/edit/${item.id}`} className="px-8 py-4 bg-black text-white hover:bg-[#D4AF37] hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-black/10">
                                        Optimize Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function SeoStatCard({ icon, label, value, status, color, statusColor }: any) {
    return (
        <div className={`${color} p-8 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500 hover:scale-[1.02]`}>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                {React.cloneElement(icon, { size: 120 })}
            </div>
            <div className="relative z-10">
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-4">{label}</p>
                <p className="text-5xl font-serif font-black italic tracking-tighter leading-none">{value}</p>
                <p className={`text-[9px] font-black uppercase tracking-widest mt-6 flex items-center gap-2 ${statusColor}`}>
                    <CheckCircle size={10}/> {status}
                </p>
            </div>
        </div>
    );
}
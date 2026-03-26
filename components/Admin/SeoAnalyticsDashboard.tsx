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

    if (loading) return <div className="p-10 flex justify-center items-center text-[#00F0FF]"><RefreshCcw className="animate-spin" size={30}/></div>;
    if (!stats) return <div className="p-10 text-red-500">Failed to load SEO Dashboard.</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-3xl font-serif text-white">SEO Command Center</h2>
                    <p className="text-gray-400 text-sm mt-1">Real-time health of your search engine visibility.</p>
                </div>
                <div className={`p-4 rounded-2xl flex items-center gap-4 ${stats.avgScore >= 80 ? 'bg-green-500/10 border border-green-500/30' : 'bg-orange-500/10 border border-orange-500/30'}`}>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">Site Health Score</p>
                        <p className={`text-3xl font-black font-mono ${stats.avgScore >= 80 ? 'text-green-400' : 'text-orange-400'}`}>{stats.avgScore}/100</p>
                    </div>
                </div>
            </div>

            {/* 📈 CRITICAL STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#111] border border-white/10 p-6 rounded-3xl relative overflow-hidden">
                    <Globe size={80} className="absolute -right-5 -bottom-5 text-white/5"/>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Indexed Pages</p>
                    <p className="text-4xl font-serif text-white">{stats.totalIndexed}</p>
                    <p className="text-[10px] text-green-400 mt-4 flex items-center gap-1"><CheckCircle size={10}/> Visible to Google</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl relative overflow-hidden">
                    <Type size={80} className="absolute -right-5 -bottom-5 text-red-500/5"/>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-red-400 mb-2">Missing Meta Titles</p>
                    <p className="text-4xl font-serif text-red-500">{stats.missingMetaTitle}</p>
                    <p className="text-[10px] text-red-400/60 mt-4 flex items-center gap-1"><AlertTriangle size={10}/> Hurts CTR</p>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-3xl relative overflow-hidden">
                    <LinkIcon size={80} className="absolute -right-5 -bottom-5 text-orange-500/5"/>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-orange-400 mb-2">Missing Meta Desc</p>
                    <p className="text-4xl font-serif text-orange-500">{stats.missingMetaDesc}</p>
                    <p className="text-[10px] text-orange-400/60 mt-4 flex items-center gap-1"><AlertTriangle size={10}/> Reduces Rank</p>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-3xl relative overflow-hidden">
                    <ImageIcon size={80} className="absolute -right-5 -bottom-5 text-blue-500/5"/>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-2">Missing Alt Text</p>
                    <p className="text-4xl font-serif text-blue-500">{stats.missingAltText}</p>
                    <p className="text-[10px] text-blue-400/60 mt-4 flex items-center gap-1"><AlertTriangle size={10}/> Image Search Drop</p>
                </div>
            </div>

            {/* 🚨 NEEDS ATTENTION LIST */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><AlertTriangle className="text-yellow-500"/> Assets Needing Attention</h3>
                
                {stats.needsAttention.length === 0 ? (
                    <div className="p-10 text-center text-green-400 bg-green-500/5 rounded-2xl border border-green-500/10">
                        <CheckCircle className="mx-auto mb-2" size={30}/>
                        <p>All assets are fully optimized! Great job.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {stats.needsAttention.map((item: any, i: number) => (
                            <div key={i} className="flex flex-col md:flex-row items-center justify-between p-4 bg-black border border-white/5 rounded-2xl gap-4">
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white mb-1">{item.name}</p>
                                    <div className="flex gap-2">
                                        {item.issues.title && <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[9px] uppercase font-bold tracking-widest rounded border border-red-500/20">No Title</span>}
                                        {item.issues.desc && <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[9px] uppercase font-bold tracking-widest rounded border border-orange-500/20">No Desc</span>}
                                        {item.issues.alt && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[9px] uppercase font-bold tracking-widest rounded border border-blue-500/20">No Alt Text</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Score</p>
                                        <p className={`font-mono font-bold ${item.score >= 80 ? 'text-green-400' : 'text-red-400'}`}>{item.score}/100</p>
                                    </div>
                                    <Link href={`/godmode/products/edit/${item.id}`} className="px-6 py-2 bg-[#00F0FF]/10 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-black border border-[#00F0FF]/30 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                                        Fix Now
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
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from "recharts";
import { 
    DollarSign, ShoppingBag, Users, Crown, AlertTriangle, RefreshCw 
} from "lucide-react";

const COLORS = ['#D4AF37', '#0A0A0A', '#666666', '#E5E4E2', '#B9F2FF'];

interface AnalyticsData {
    stats: {
        totalRevenue: number;
        totalOrders: number;
        deliveredOrders: number;
        pendingOrders: number;
        averageOrderValue: number;
    };
    monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
    categories: Array<{ name: string; revenue: number; orders: number }>;
    topReferrers: Array<{
        id: string;
        name: string;
        email: string;
        referralCode: string;
        totalReferrals: number;
        totalEarned: number;
    }>;
    orderStatus: Array<{ status: string; count: number }>;
    wallet: { totalPoints: number; totalEarned: number };
    fraud: { suspiciousOrders: number; blockedOrders: number; flaggedOrders: number };
}

export default function AdminAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/Godmode/analytics', { cache: 'no-store' });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                } else {
                    setError(json.error);
                }
            } catch (err) {
                setError('Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const formatCurrency = (value: number) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
        if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
        return `₹${value}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <RefreshCw className="animate-spin text-[#D4AF37]" size={32} />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center p-12 text-red-500">
                <AlertTriangle size={20} className="mr-2" />
                {error || 'No data available'}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-6 rounded-2xl text-white">
                    <DollarSign size={20} className="text-[#D4AF37] mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-serif font-black mt-1">{formatCurrency(data.stats.totalRevenue)}</p>
                    <p className="text-[9px] text-[#D4AF37] mt-2">{data.stats.totalOrders} orders</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-gray-100">
                    <ShoppingBag size={20} className="text-gray-400 mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Orders</p>
                    <p className="text-2xl font-serif font-black mt-1">{data.stats.totalOrders}</p>
                    <p className="text-[9px] text-green-600 mt-2">{data.stats.deliveredOrders} delivered</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl border border-gray-100">
                    <Users size={20} className="text-gray-400 mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Avg Order Value</p>
                    <p className="text-2xl font-serif font-black mt-1">{formatCurrency(data.stats.averageOrderValue)}</p>
                    <p className="text-[9px] text-[#D4AF37] mt-2">{data.stats.pendingOrders} pending</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl border border-gray-100">
                    <Crown size={20} className="text-[#D4AF37] mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Wallet Points</p>
                    <p className="text-2xl font-serif font-black mt-1">{data.wallet.totalPoints.toLocaleString()}</p>
                    <p className="text-[9px] text-gray-400 mt-2">₹{data.wallet.totalEarned.toLocaleString()} earned</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-serif font-black mb-6">Monthly Revenue</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} />
                                <YAxis tick={{ fontSize: 10 }} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(value: any) => [formatCurrency(value), 'Revenue']} />
                                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-serif font-black mb-6">Top Categories</h3>
                    <div className="h-64 flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.categories} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="revenue" nameKey="name">
                                    {data.categories.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 ml-4">
                            {data.categories.slice(0, 5).map((cat, i) => (
                                <div key={cat.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-[10px] font-bold truncate max-w-[120px]">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <Crown size={20} className="text-[#D4AF37]" />
                    <h3 className="text-lg font-serif font-black">Top Referrers</h3>
                </div>
                {data.topReferrers.length > 0 ? (
                    <div className="space-y-3">
                        {data.topReferrers.slice(0, 8).map((referrer, index) => (
                            <div key={referrer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${index === 0 ? 'bg-[#D4AF37] text-black' : index === 1 ? 'bg-gray-300 text-black' : index === 2 ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold">{referrer.name}</p>
                                        <p className="text-[10px] text-gray-400">{referrer.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-[#D4AF37]">{referrer.totalReferrals} referrals</p>
                                    <p className="text-[10px] text-gray-400">₹{referrer.totalEarned.toLocaleString()} earned</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">No referrers yet. Start the pyramid to see results.</div>
                )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className={`p-6 rounded-2xl border ${data.fraud?.flaggedOrders > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle size={20} className={data.fraud?.flaggedOrders > 0 ? 'text-red-600' : 'text-green-600'} />
                    <h3 className="text-lg font-serif font-black">Fraud Detection</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-black text-red-600">{data.fraud?.suspiciousOrders || 0}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Under Review</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-red-800">{data.fraud?.blockedOrders || 0}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Blocked</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-gray-600">{data.fraud?.flaggedOrders || 0}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Flagged</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
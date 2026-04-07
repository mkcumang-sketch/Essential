"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Crown, Users, TrendingUp, Package,
    Search, Edit2, Save, X, AlertCircle,
    ChevronDown, Check, Eye, EyeOff,
    DollarSign, ShoppingBag, ArrowUpRight
} from "lucide-react";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, topPerformer: "Rolex Daytona" });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ totalSpent: "", loyaltyTier: "" });
    const [toast, setToast] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated" && (session?.user as any)?.role !== "SUPER_ADMIN") {
            router.push("/account");
        } else if (status === "authenticated") {
            fetchDashboardData();
        }
    }, [status, session, router]);

    const fetchDashboardData = async () => {
        try {
            const usersRes = await fetch("/api/admin/users");
            const usersData = await usersRes.json();
            if (usersData.success) {
                setUsers(usersData.data.users || []);
                const revenue = usersData.data.users?.reduce((sum: number, u: any) => sum + (u.totalSpent || 0), 0) || 0;
                setStats(prev => ({
                    ...prev,
                    totalRevenue: revenue,
                    totalOrders: 142
                }));
            }
        } catch (error) {
            console.error("Dashboard Data Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(""), 3000);
    };

    const startEdit = (user: any) => {
        setEditingUser(user._id);
        setEditForm({
            totalSpent: user.totalSpent?.toString() || "",
            loyaltyTier: user.loyaltyTier || "Silver Vault"
        });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditForm({ totalSpent: "", loyaltyTier: "" });
    };

    const saveEdit = async (userId: string) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    totalSpent: parseFloat(editForm.totalSpent) || undefined,
                    loyaltyTier: editForm.loyaltyTier || undefined
                })
            });

            const data = await res.json();
            if (data.success) {
                showToast("Client profile updated successfully");
                setEditingUser(null);
                fetchDashboardData();
            }
        } catch (error) {
            showToast("Update failed");
        }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-black italic tracking-tighter">Vault Control</h1>
                    <p className="text-gray-500 text-sm mt-1">Global monitoring and client management.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <Shield size={20} />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Status</p>
                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Online & Secure</p>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${stats.totalRevenue.toLocaleString()}`} 
                    icon={<DollarSign size={24}/>} 
                    trend="+12.5%" 
                    color="bg-black text-[#D4AF37]"
                />
                <StatCard 
                    title="Vault Orders" 
                    value={stats.totalOrders.toString()} 
                    icon={<ShoppingBag size={24}/>} 
                    trend="+8.2%" 
                    color="bg-white text-black border border-gray-100"
                />
                <StatCard 
                    title="Top Asset" 
                    value={stats.topPerformer} 
                    icon={<Crown size={24}/>} 
                    trend="Trending" 
                    color="bg-white text-black border border-gray-100"
                />
            </div>

            {/* Client Management */}
            <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h3 className="text-xl font-serif font-black italic tracking-tighter">Client Registry</h3>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by identity or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-2xl text-sm outline-none focus:border-black transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <tr>
                                <th className="px-8 py-5">Client</th>
                                <th className="px-8 py-5">Tier</th>
                                <th className="px-8 py-5">Investment</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-500">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-black">{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {editingUser === user._id ? (
                                            <select 
                                                value={editForm.loyaltyTier}
                                                onChange={(e) => setEditForm({...editForm, loyaltyTier: e.target.value})}
                                                className="bg-white border border-gray-200 p-2 rounded-lg text-xs font-bold outline-none"
                                            >
                                                <option value="Silver Vault">Silver Vault</option>
                                                <option value="Gold Vault">Gold Vault</option>
                                                <option value="Platinum Vault">Platinum Vault</option>
                                                <option value="The Founder's Circle">The Founder's Circle</option>
                                            </select>
                                        ) : (
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                                                {user.loyaltyTier || "Silver Vault"}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        {editingUser === user._id ? (
                                            <input 
                                                type="number"
                                                value={editForm.totalSpent}
                                                onChange={(e) => setEditForm({...editForm, totalSpent: e.target.value})}
                                                className="w-32 bg-white border border-gray-200 p-2 rounded-lg text-xs font-bold outline-none"
                                            />
                                        ) : (
                                            <p className="text-sm font-bold text-black font-mono">₹{(user.totalSpent || 0).toLocaleString()}</p>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'SUPER_ADMIN' ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                                            {user.role || "USER"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {editingUser === user._id ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => saveEdit(user._id)} className="p-2 bg-black text-white rounded-lg hover:bg-[#D4AF37] transition-all">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={cancelEdit} className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-gray-200 transition-all">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => startEdit(user)}
                                                className="p-2 text-gray-300 hover:text-black hover:bg-white rounded-lg transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 right-10 bg-black text-[#D4AF37] px-8 py-4 rounded-2xl shadow-2xl font-bold uppercase tracking-widest text-xs z-50 border border-[#D4AF37]/20"
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ title, value, icon, trend, color }: any) {
    return (
        <div className={`${color} p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{title}</p>
                    <span className="flex items-center gap-1 text-[8px] font-black bg-white/10 px-2 py-0.5 rounded text-green-400">
                        <ArrowUpRight size={10} /> {trend}
                    </span>
                </div>
                <h3 className="text-3xl font-serif font-black italic tracking-tighter">{value}</h3>
            </div>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Shield, Crown, Users, TrendingUp, Package,
    Search, Edit2, Save, X, AlertCircle,
    ChevronDown, Check, Eye, EyeOff
} from "lucide-react";
import mongoose from "mongoose";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const fetchUsers = async () => {
    try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success) setUsers(data.data);
    } catch (error) {
        console.error("User fetch failed", error);
    }
};
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, topPerformer: "Loading..." });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ totalSpent: "", loyaltyTier: "" });
    const [toast, setToast] = useState("");

    // Check admin access and fetch data
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
            // 1. Fetch Users
            const usersRes = await fetch("/api/admin/users");
            const usersData = await usersRes.json();
            if (usersData.success) {
                setUsers(usersData.data.users || []);
            }

            // 2. Fetch Stats (In-component calc or dedicated API)
            // For now calculating from user totals as a fallback, but real orders are better
            const revenue = usersData.data.users?.reduce((sum: number, u: any) => sum + (u.totalSpent || 0), 0) || 0;
            setStats({
                totalRevenue: revenue,
                totalOrders: 142, // Mock for now until /api/admin/stats is ready
                topPerformer: "Rolex Daytona"
            });

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
                showToast("User updated successfully!");
                fetchUsers();
                cancelEdit();
            } else {
                showToast(data.error || "Failed to update user");
            }
        } catch (error) {
            showToast("Error updating user");
        }
    };

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
    );

    // 🚨 CONDITIONAL RETURNS AFTER ALL HOOKS
    
    // Loading state
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 2 }} 
                    className="text-5xl text-[#D4AF37]"
                >
                    ♞
                </motion.div>
            </div>
        );
    }

    // Unauthenticated or not admin
    if (!session || (session?.user as any)?.role !== "SUPER_ADMIN") {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
                    >
                        <p className="text-sm font-medium text-gray-900">{toast}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Shield className="text-[#D4AF37]" size={32} />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-500">Manage users and loyalty programs</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                                <p className="text-xs text-[#D4AF37] font-black uppercase tracking-widest">Super Admin</p>
                            </div>
                            <button
                                onClick={() => router.push("/account")}
                                className="text-sm text-gray-500 hover:text-[#D4AF37] transition-colors"
                            >
                                Back to Account
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* 🚀 ELITE QUICK STATS 🚀 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-[30px] p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-10" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Revenue</p>
                        <p className="text-3xl font-bold font-serif">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                        <TrendingUp size={20} className="text-green-500 mt-4" />
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-gray-200 rounded-[30px] p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Orders</p>
                        <p className="text-3xl font-bold font-serif">{stats.totalOrders}</p>
                        <Package size={20} className="text-blue-500 mt-4" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-gray-200 rounded-[30px] p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-10" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Active Collectors</p>
                        <p className="text-3xl font-bold font-serif">{users.length}</p>
                        <Users size={20} className="text-purple-500 mt-4" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-gray-200 rounded-[30px] p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Top Performer</p>
                        <p className="text-xl font-bold font-serif line-clamp-1">{stats.topPerformer}</p>
                        <TrendingUp size={20} className="text-amber-500 mt-4" />
                    </motion.div>
                </div>

                {/* Search Bar */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Search className="text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Total Spent</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Member level</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Wallet</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.name || "—"}</p>
                                                <p className="text-xs text-gray-500">ID: {user._id.slice(-8)}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm text-gray-900">{user.email || "—"}</p>
                                                <p className="text-xs text-gray-500">{user.phone || "—"}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingUser === user._id ? (
                                                <input
                                                    type="number"
                                                    value={editForm.totalSpent}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, totalSpent: e.target.value }))}
                                                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:border-[#D4AF37] outline-none"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium text-gray-900">₹{(user.totalSpent || 0).toLocaleString()}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingUser === user._id ? (
                                                <select
                                                    value={editForm.loyaltyTier}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, loyaltyTier: e.target.value }))}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:border-[#D4AF37] outline-none"
                                                >
                                                    <option value="Silver Vault">Silver</option>
                                                    <option value="Gold Vault">Gold</option>
                                                </select>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    {user.loyaltyTier === "Gold Vault" ? (
                                                        <Crown className="text-[#D4AF37]" size={16} />
                                                    ) : (
                                                        <Shield className="text-gray-400" size={16} />
                                                    )}
                                                    <span className="text-sm font-medium text-gray-900">{user.loyaltyTier === "Gold Vault" ? "Gold" : user.loyaltyTier === "Silver Vault" ? "Silver" : user.loyaltyTier || "Silver"}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">₹{(user.walletPoints || 0).toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {editingUser === user._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => saveEdit(user._id)}
                                                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="p-1 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
                            <p className="text-gray-500">No users found matching your search.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
"use client";

import React, { useState } from "react";
import { Search, Edit2, Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface User {
    _id: string;
    name: string;
    email: string;
    loyaltyTier?: string;
    totalSpent?: number;
    role?: string;
}

interface ClientRegistryProps {
    initialUsers: User[];
}

export default function ClientRegistry({ initialUsers }: ClientRegistryProps) {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ totalSpent: "", loyaltyTier: "" });
    const [toast, setToast] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(""), 3000);
    };

    const startEdit = (user: User) => {
        setEditingUser(user._id);
        setEditForm({
            totalSpent: user.totalSpent?.toString() || "0",
            loyaltyTier: user.loyaltyTier || "Silver Vault"
        });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditForm({ totalSpent: "", loyaltyTier: "" });
    };

    const saveEdit = async (userId: string) => {
        setIsSaving(true);
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

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            if (data.success) {
                showToast("Client profile updated successfully");
                setEditingUser(null);
                // Refresh the data from the server
                router.refresh();
                // Local update for immediate feedback
                setUsers(prev => prev.map(u => u._id === userId ? {
                    ...u,
                    totalSpent: parseFloat(editForm.totalSpent),
                    loyaltyTier: editForm.loyaltyTier
                } : u));
            }
        } catch (error) {
            showToast("Update failed");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h3 className="text-2xl font-serif font-black italic tracking-tighter">Client Registry</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">Manage Elite Members</p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by identity or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50/50 border border-gray-100 p-5 pl-14 rounded-[1.5rem] text-sm outline-none focus:border-black focus:bg-white transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/30 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                        <tr>
                            <th className="px-10 py-6">Client Identity</th>
                            <th className="px-10 py-6">Tier Status</th>
                            <th className="px-10 py-6">Total Investment</th>
                            <th className="px-10 py-6">Role</th>
                            <th className="px-10 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="group hover:bg-gray-50/20 transition-all duration-300">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-black/5 group-hover:scale-110 transition-transform">
                                            {user.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-black tracking-tight">{user.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    {editingUser === user._id ? (
                                        <select 
                                            value={editForm.loyaltyTier}
                                            onChange={(e) => setEditForm({...editForm, loyaltyTier: e.target.value})}
                                            className="bg-white border border-gray-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-black transition-all"
                                        >
                                            <option value="Silver Vault">Silver Vault</option>
                                            <option value="Gold Vault">Gold Vault</option>
                                            <option value="Platinum Vault">Platinum Vault</option>
                                            <option value="The Founder's Circle">The Founder's Circle</option>
                                        </select>
                                    ) : (
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${
                                            user.loyaltyTier === "The Founder's Circle" ? 'bg-black text-[#D4AF37] border-black' : 'bg-gray-50 text-gray-600 border-gray-100'
                                        }`}>
                                            {user.loyaltyTier || "Silver Vault"}
                                        </span>
                                    )}
                                </td>
                                <td className="px-10 py-8">
                                    {editingUser === user._id ? (
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                                            <input 
                                                type="number"
                                                value={editForm.totalSpent}
                                                onChange={(e) => setEditForm({...editForm, totalSpent: e.target.value})}
                                                className="w-36 bg-white border border-gray-200 p-3 pl-7 rounded-xl text-xs font-bold outline-none focus:border-black transition-all"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-sm font-black text-black font-mono tracking-tighter">₹{(user.totalSpent || 0).toLocaleString()}</p>
                                    )}
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'SUPER_ADMIN' ? 'text-[#D4AF37] bg-[#D4AF37]/5 px-3 py-1 rounded-lg' : 'text-gray-400'}`}>
                                        {user.role || "USER"}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    {editingUser === user._id ? (
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => saveEdit(user._id)} 
                                                disabled={isSaving}
                                                className="p-3 bg-black text-white rounded-xl hover:bg-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all disabled:opacity-50"
                                            >
                                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                            </button>
                                            <button 
                                                onClick={cancelEdit} 
                                                disabled={isSaving}
                                                className="p-3 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => startEdit(user)}
                                            className="p-3 text-gray-300 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

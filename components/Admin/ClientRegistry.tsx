"use client";

import React, { useState } from "react";
import { Search, Edit2, Check, X } from "lucide-react";
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
        }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
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

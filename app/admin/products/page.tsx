"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, Package, Search, Filter } from "lucide-react"; //

export default function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-luxury italic text-[#001A33]">Inventory Master</h1>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">Manage your luxury timepieces</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#001A33] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-900 transition-all shadow-lg"
        >
          <Plus size={14} /> Add New Watch
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4 bg-white p-4 rounded-2xl border border-blue-50">
        <div className="flex-1 flex items-center gap-3 px-4 bg-blue-50/50 rounded-xl">
          <Search size={16} className="text-blue-900" />
          <input placeholder="Search products..." className="bg-transparent border-none text-sm w-full focus:ring-0 py-3" />
        </div>
        <button className="px-6 py-3 border border-blue-100 rounded-xl flex items-center gap-2 text-xs font-bold text-blue-900 hover:bg-blue-50 transition">
          <Filter size={14} /> Filters
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-blue-50 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#001A33] text-white text-[10px] uppercase tracking-widest">
            <tr>
              <th className="p-6">Product</th>
              <th className="p-6">Price</th>
              <th className="p-6">Stock</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50 text-sm">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-blue-50/30 transition">
                <td className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Package size={20} className="text-blue-900" />
                  </div>
                  <span className="font-bold text-blue-900">Midnight Diver 00{i}</span>
                </td>
                <td className="p-6 font-bold">₹1,45,000</td>
                <td className="p-6 text-zinc-500 font-medium">24 units</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 uppercase">Live</span>
                </td>
                <td className="p-6 text-right">
                  <button className="p-2 text-blue-400 hover:text-blue-900 transition"><Edit2 size={16}/></button>
                  <button className="p-2 text-red-300 hover:text-red-600 transition ml-2"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
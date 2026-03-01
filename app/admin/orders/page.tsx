"use client";
import { useState } from "react";
import { 
  Package, Truck, CheckCircle, XCircle, 
  MapPin, CreditCard, ExternalLink 
} from "lucide-react"; // FIX: All icons defined
import toast from "react-hot-toast"; // FIX: Toaster functional

export default function AdminOrders() {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setLoading(true);
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      body: JSON.stringify({ orderId, status: newStatus })
    });
    if (res.ok) {
      toast.success(`Order marked as ${newStatus}`); //
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-blue-50 pb-6">
        <div>
          <h1 className="text-3xl font-luxury italic text-[#001A33]">Fulfillment Center</h1>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">Manage global shipping & warehouse</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-blue-50 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#001A33] text-white text-[10px] uppercase tracking-widest">
            <tr>
              <th className="p-6">Order ID & Date</th>
              <th className="p-6">Customer</th>
              <th className="p-6">Warehouse</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {[1, 2].map((i) => (
              <tr key={i} className="hover:bg-blue-50/20 transition">
                <td className="p-6">
                  <p className="font-bold text-blue-900">#ER-2026-00{i}</p>
                  <p className="text-[10px] text-zinc-400">Feb 26, 2026</p>
                </td>
                <td className="p-6">
                  <p className="font-medium text-sm">Umang Kumar</p>
                  <p className="text-[10px] text-zinc-400 italic">Referral: TEAM123</p>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <MapPin size={12} className="text-[#C9A24D]" />
                    Lucknow Hub
                  </div>
                </td>
                <td className="p-6">
                  <p className="font-bold">₹85,000</p>
                  <span className="text-[9px] font-black text-green-600 uppercase">Paid</span>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                    i === 1 ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {i === 1 ? 'Shipped' : 'Delivered'}
                  </span>
                </td>
                <td className="p-6 text-right space-x-2">
                  <button onClick={() => updateStatus('id', 'Shipped')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-900 hover:text-white transition shadow-sm" title="Mark Shipped">
                    <Truck size={16} />
                  </button>
                  <button onClick={() => updateStatus('id', 'Delivered')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition shadow-sm" title="Mark Delivered">
                    <CheckCircle size={16} />
                  </button>
                  <button onClick={() => updateStatus('id', 'Cancelled')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm" title="Cancel Order">
                    <XCircle size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
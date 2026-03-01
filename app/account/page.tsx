"use client";
import { User, Package, MapPin, LogOut } from "lucide-react";
export const dynamic = 'force-dynamic';
import { useState } from "react";

export default function Account() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="bg-[#FAFAFA] min-h-screen pt-32 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* 👤 SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full font-bold text-lg">AS</div>
              <div>
                <h3 className="font-bold uppercase text-sm">Aryan Sharma</h3>
                <p className="text-xs text-gray-400">Elite Member</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <TabButton active={activeTab === "orders"} onClick={() => setActiveTab("orders")} icon={<Package size={16}/>} label="My Orders" />
              <TabButton active={activeTab === "addresses"} onClick={() => setActiveTab("addresses")} icon={<MapPin size={16}/>} label="Addresses" />
              <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User size={16}/>} label="Profile Settings" />
              <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors rounded-sm mt-4">
                <LogOut size={16} /> Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* 📦 MAIN CONTENT AREA */}
        <main className="lg:col-span-3">
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Order History</h2>
              
              {/* Fake Order 1 */}
              <div className="bg-white border border-gray-100 p-6 rounded-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Order Placed</span>
                    <span className="font-bold text-sm">Feb 21, 2026</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Total</span>
                    <span className="font-bold text-sm">₹1,45,000</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-sm overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm">Rolex Submariner</h4>
                    <span className="inline-block bg-green-100 text-green-700 text-[10px] font-bold uppercase px-2 py-1 rounded-sm mt-2">Delivered</span>
                  </div>
                  <button className="ml-auto border border-gray-200 px-4 py-2 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">
                    View Invoice
                  </button>
                </div>
              </div>

               {/* Fake Order 2 */}
               <div className="bg-white border border-gray-100 p-6 rounded-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Order Placed</span>
                    <span className="font-bold text-sm">Jan 10, 2026</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Total</span>
                    <span className="font-bold text-sm">₹55,000</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-sm overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1619134778706-c734062f8546?w=200" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm">Seiko Prospex</h4>
                    <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-bold uppercase px-2 py-1 rounded-sm mt-2">In Transit</span>
                  </div>
                  <button className="ml-auto border border-gray-200 px-4 py-2 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">
                    Track Item
                  </button>
                </div>
              </div>

            </div>
          )}
        </main>

      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all rounded-sm ${active ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50 hover:text-black"}`}
    >
      {icon} {label}
    </button>
  );
}
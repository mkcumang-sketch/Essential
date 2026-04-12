"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, ShoppingBag, Users, ShoppingCart, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const MENU_ITEMS = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Timepieces", icon: ShoppingBag, href: "/admin/products" },
    { name: "VIP Clients", icon: Users, href: "/admin/users" },
    { name: "Vault Carts", icon: ShoppingCart, href: "/admin/abandoned-carts" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-[280px] bg-white border-r border-gray-100 shadow-[0_0_40px_rgba(0,0,0,0.02)] z-50 flex flex-col justify-between hidden lg:flex">
      
      <div>
        {/* Luxury Brand Logo Area */}
        <div className="h-28 flex items-center px-8 border-b border-gray-50 bg-gradient-to-b from-gray-50/50 to-white">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#0A0A0A] text-[#D4AF37] rounded-xl flex items-center justify-center font-black group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-500 shadow-md">
              ♞
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#050505]">Essential</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-[#D4AF37]">Admin Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-6 space-y-2">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-2">Management</p>
          
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href} className="block relative group">
                {isActive && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#0A0A0A] rounded-2xl shadow-lg" />
                )}
                <div className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-10 
                  ${isActive ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}>
                  <Icon size={16} className={isActive ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-black'} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Area */}
      <div className="p-6 border-t border-gray-50">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-4">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-serif italic font-black text-lg">A</div>
            <div>
                <p className="text-xs font-black uppercase tracking-widest">Admin</p>
<p className="text-[9px] font-bold text-gray-400">System Owner</p>     
       </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })} 
          className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <LogOut size={16} /> Secure Logout
        </button>
      </div>
    </aside>
  );
}
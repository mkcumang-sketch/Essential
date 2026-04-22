"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Settings, 
  ShoppingBag,
  Users,
  LogOut,
  PackageSearch
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/Godmode', short: 'Home' },
    { name: 'Products', icon: PackageSearch, href: '/Godmode/products', short: 'Inventory' },
    { name: 'Customers', icon: Users, href: '/Godmode/users', short: 'Clients' },
    { name: 'Vault Carts', icon: ShoppingBag, href: '/Godmode/abandoned-carts', short: 'Carts' },
    { name: 'Settings', icon: Settings, href: '/Godmode/settings', short: 'Config' },
  ];

  const mobileNavItems = [
    menuItems[0],
    menuItems[1],
    menuItems[2],
    menuItems[4],
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-[#F9FAFB] text-[#050505] flex font-sans overflow-x-hidden relative">
      
      {/* 📱 MOBILE TOP HEADER */}
      <div 
        className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between px-4 pb-4 bg-white/95 backdrop-blur-xl z-[100] shadow-sm border-b border-gray-100"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        <div className="w-10 h-10 bg-black text-[#D4AF37] rounded-xl flex items-center justify-center font-bold shadow-lg shrink-0">♞</div>
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-black transition-colors border border-gray-200"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* 💻 DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-72 fixed left-0 top-0 h-[100dvh] z-50 bg-white border-r border-gray-100 shadow-[0_0_40px_rgba(0,0,0,0.02)]">
        <div className="flex p-8 items-center gap-4 border-b border-gray-50 h-28 shrink-0">
          <div className="w-12 h-12 bg-black text-[#D4AF37] rounded-2xl flex items-center justify-center font-bold text-xl shadow-xl">♞</div>
          <div>
              <span className="font-serif font-black tracking-tighter uppercase text-lg italic block leading-none">Vault</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-4 p-4 min-h-[44px] rounded-2xl transition-all duration-500 relative ${
                  isActive ? 'bg-[#0A0A0A] text-white shadow-xl scale-[1.02]' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-[#D4AF37]' : ''} />
                <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                {isActive && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-50 shrink-0">
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center justify-center gap-3 p-4 min-h-[44px] rounded-2xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all text-[10px] font-black uppercase tracking-widest border border-gray-100">
            <LogOut size={16} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* 🔥 MAIN CONTENT AREA */}
      <main 
        className="flex-1 w-full min-w-0 max-w-[100vw] md:ml-72 relative overflow-x-hidden"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 90px)', 
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 110px)'
        }}
      >
        <div className="w-full min-w-0 max-w-7xl mx-auto p-4 sm:p-6 md:p-10 overflow-x-hidden md:!pt-8 md:!pb-8">
          {children}
        </div>
      </main>

      {/* 📱 MOBILE BOTTOM NAVIGATION */}
      <nav 
        className="flex md:hidden fixed bottom-0 left-0 w-full justify-around items-center gap-2 border-t border-gray-100 bg-white/95 px-3 pt-3 backdrop-blur-2xl z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
      >
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-all ${isActive ? "text-[#D4AF37]" : "text-gray-400 hover:text-black"}`}>
              <item.icon size={20} className={isActive ? "text-[#D4AF37]" : ""} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.short}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
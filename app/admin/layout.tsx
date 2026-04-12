"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Settings, 
  ShieldCheck,
  ShoppingBag,
  Users,
  LogOut,
  PackageSearch
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 💎 Unified Menu Items
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin', short: 'Home' },
    { name: 'Products', icon: PackageSearch, href: '/admin/products', short: 'Inventory' },
    { name: 'Customers', icon: Users, href: '/admin/users', short: 'Clients' },
    { name: 'Vault Carts', icon: ShoppingBag, href: '/admin/abandoned-carts', short: 'Carts' },
    { name: 'Settings', icon: Settings, href: '/admin/settings', short: 'Config' },
  ];

  return (
    <div 
      className="min-h-[100dvh] w-full bg-[#F9FAFB] text-[#050505] flex font-sans overflow-x-hidden"
      style={{ 
        paddingTop: 'calc(env(safe-area-inset-top) + 0px)',
        paddingLeft: 'calc(env(safe-area-inset-left) + 0px)',
        paddingRight: 'calc(env(safe-area-inset-right) + 0px)'
      }}
    >
      
      {/* =========================================
          📱 MOBILE ONLY: TOP HEADER (Like Account Page)
          ========================================= */}
      <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-white/95 backdrop-blur-xl z-[60] shadow-lg border-b border-gray-100"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}
      >
        <div className="w-10 h-10 bg-black text-[#D4AF37] rounded-xl flex items-center justify-center font-bold shadow-lg">♞</div>
        
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-6 py-4 min-h-[44px] bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-black transition-colors border border-gray-100"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* =========================================
          💻 DESKTOP ONLY: SIDEBAR (Hidden on Mobile)
          ========================================= */}
      <aside className="hidden md:flex flex-col w-72 fixed h-full z-50 bg-white border-r border-gray-100 shadow-[0_0_40px_rgba(0,0,0,0.02)]">
        <div className="flex p-8 items-center gap-4 border-b border-gray-50 h-28">
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
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 relative ${
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

        <div className="p-6 border-t border-gray-50">
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center justify-center gap-3 p-4 min-h-[44px] rounded-2xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all text-[10px] font-black uppercase tracking-widest border border-gray-100">
            <LogOut size={16} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* =========================================
          🔥 MAIN CONTENT AREA
          ========================================= */}
      <main className="flex-1 w-full min-w-0 max-w-[100vw] md:ml-72 pt-20 md:pt-0 pb-28 md:pb-0 relative overflow-x-hidden">
        <div className="w-full min-w-0 max-w-7xl mx-auto p-4 sm:p-6 md:p-10 overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* =========================================
          📱 MOBILE ONLY: BOTTOM NAVIGATION
          ========================================= */}
      <nav 
        className="flex md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-gray-100 p-4 justify-around items-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] gap-4 pb-[env(safe-area-inset-bottom)]"
      >
        {menuItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center gap-2 p-4 min-h-[44px] min-w-[44px] rounded-xl transition-all ${isActive ? "text-[#D4AF37]" : "text-gray-400 hover:text-black"}`}>
              <item.icon size={20} className={isActive ? "fill-[#D4AF37]/20" : ""} />
              <span className="text-xs font-black uppercase tracking-widest">{item.short}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  ShieldCheck,
  Menu,
  X,
  Info,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) setIsSidebarOpen(false);
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin', short: 'Home' },
    { name: 'Policies CMS', icon: FileText, href: '/admin/cms/policies', short: 'Policies' },
    { name: 'About CMS', icon: Info, href: '/admin/cms/about', short: 'About' },
    { name: 'Vault Carts', icon: ShoppingBag, href: '/admin/abandoned-carts', short: 'Carts' },
    { name: 'VIP SEO', icon: ShieldCheck, href: '/admin/seo', short: 'SEO' },
    { name: 'Settings', icon: Settings, href: '/admin/settings', short: 'Config' },
  ];

  return (
    // 🚀 FIX 1: max-w-[100vw] and relative positioning added to root to completely cage the layout
    <div className="relative min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-[#F9FAFB] text-[#050505] flex flex-col md:flex-row font-sans pb-28 md:pb-0">
      
      {/* Mobile Header Toggle */}
      <div className="md:hidden flex w-full items-center justify-between p-5 sm:p-6 bg-white border-b border-gray-100 sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-[#D4AF37] rounded-xl flex items-center justify-center font-bold shadow-lg">♞</div>
          <span className="font-serif font-black tracking-tighter uppercase text-base">Vault Admin</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-gray-50 rounded-2xl text-black active:scale-90 transition-transform"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 md:w-28'
        } bg-white border-r border-gray-100 transition-all duration-500 ease-[0.16, 1, 0.3, 1] flex flex-col fixed h-full z-50 md:sticky top-0 shadow-[0_0_40px_rgba(0,0,0,0.02)]`}
      >
        <div className="hidden md:flex p-8 items-center justify-between border-b border-gray-50 h-28">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-black text-[#D4AF37] rounded-2xl flex items-center justify-center font-bold text-xl shadow-xl">♞</div>
              <div>
                 <span className="font-serif font-black tracking-tighter uppercase text-lg italic block leading-none">Vault</span>
                 <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Admin Portal</span>
              </div>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-3 hover:bg-gray-50 rounded-2xl transition-all duration-300 group ${!isSidebarOpen && 'mx-auto'}`}
          >
            {isSidebarOpen ? <X size={20} className="text-gray-300 group-hover:text-black" /> : <Menu size={20} className="text-gray-400 group-hover:text-black" />}
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-3 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group relative ${
                  isActive 
                    ? 'bg-[#0A0A0A] text-white shadow-xl shadow-black/10 scale-[1.02]' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                } ${!isSidebarOpen && 'justify-center'}`}
              >
                <item.icon size={20} className={`${isActive ? 'text-[#D4AF37]' : 'group-hover:scale-110 transition-transform'}`} />
                
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isSidebarOpen && isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <div className={`flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 transition-all ${!isSidebarOpen && 'justify-center'}`}>
            <ShieldCheck size={20} className="text-[#D4AF37] flex-shrink-0" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }} 
                  animate={{ opacity: 1, width: 'auto' }} 
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col overflow-hidden whitespace-nowrap"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black">Secure Node</span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-gray-400">v0.1.5-alpha</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 🚀 FIX 2: min-w-0 prevents flexbox from stretching. w-full locks it to screen size */}
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        <div className="w-full max-w-[100vw] md:max-w-7xl mx-auto p-4 sm:p-6 md:p-10 overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* 🚀 FIX 3: w-full and max-w-[100vw] explicitly locks the bottom nav so it doesn't float away */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 w-full max-w-[100vw] bg-white/95 backdrop-blur-2xl border-t border-gray-100 p-2 flex justify-around items-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
      >
        {menuItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${isActive ? "text-[#D4AF37]" : "text-gray-400 hover:text-black"}`}>
              <item.icon size={20} className={isActive ? "fill-[#D4AF37]/20" : ""} />
              <span className="text-[8px] font-black uppercase tracking-widest">{item.short}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
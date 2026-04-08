"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  ChevronRight, 
  ShieldCheck,
  Menu,
  X,
  Info,
  ShoppingCart,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Policies CMS', icon: FileText, href: '/admin/cms/policies' },
    { name: 'About Page CMS', icon: Info, href: '/admin/cms/about' },
    { name: 'Abandoned Carts', icon: ShoppingBag, href: '/admin/abandoned-carts' },
    { name: 'VIP SEO', icon: ShieldCheck, href: '/admin/seo' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row font-sans">
      {/* Mobile Header Toggle */}
      <div className="md:hidden flex items-center justify-between p-6 bg-white border-b border-gray-100 sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-[#D4AF37] rounded-xl flex items-center justify-center font-bold shadow-lg">♞</div>
          <span className="font-serif font-black tracking-tighter uppercase text-base">Vault Admin</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-gray-50 rounded-2xl text-black active:scale-90 transition-transform"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 md:w-24'
        } bg-white border-r border-gray-100 transition-all duration-500 ease-[0.16, 1, 0.3, 1] flex flex-col fixed h-full z-50 md:sticky top-0`}
      >
        <div className="hidden md:flex p-10 items-center justify-between border-b border-gray-50">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-black text-[#D4AF37] rounded-2xl flex items-center justify-center font-bold text-xl shadow-2xl shadow-black/20">♞</div>
              <span className="font-serif font-black tracking-tighter uppercase text-lg italic">Vault</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 hover:bg-gray-50 rounded-2xl transition-all duration-300 group"
          >
            {isSidebarOpen ? <X size={20} className="text-gray-300 group-hover:text-black" /> : <Menu size={20} className="text-gray-300 group-hover:text-black" />}
          </button>
        </div>

        <nav className="flex-1 p-8 space-y-4 mt-6 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => { if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                className={`flex items-center gap-5 p-5 rounded-[1.5rem] transition-all duration-500 group ${
                  isActive 
                    ? 'bg-black text-white shadow-2xl shadow-black/20 scale-[1.02]' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <item.icon size={24} className={`${isActive ? 'text-[#D4AF37]' : 'group-hover:scale-110 transition-transform'}`} />
                {(isSidebarOpen || window.innerWidth < 768) && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] font-black uppercase tracking-[0.25em]"
                  >
                    {item.name}
                  </motion.span>
                )}
                {isSidebarOpen && isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-gray-50">
          <div className={`flex items-center gap-4 p-5 rounded-[1.5rem] bg-gray-50/50 text-gray-400 transition-all ${(!isSidebarOpen && window.innerWidth >= 768) && 'justify-center'}`}>
            <ShieldCheck size={22} className="text-[#D4AF37]" />
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Secure Node</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-gray-400">v0.1.5-alpha</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}

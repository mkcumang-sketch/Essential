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
  ShoppingCart
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Policies CMS', icon: FileText, href: '/admin/cms/policies' },
    { name: 'About Page CMS', icon: Info, href: '/admin/cms/about' },
    { name: 'Abandoned Carts', icon: ShoppingCart, href: '/admin/abandoned-carts' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 flex flex-col md:flex-row">
      {/* Mobile Header Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black text-[#D4AF37] rounded-lg flex items-center justify-center font-bold">♞</div>
          <span className="font-serif font-black tracking-tighter uppercase text-sm">Vault Admin</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-gray-50 rounded-lg text-black"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-50 md:sticky top-0`}
      >
        <div className="hidden md:flex p-6 items-center justify-between border-b border-gray-100">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black text-[#D4AF37] rounded-lg flex items-center justify-center font-bold">♞</div>
              <span className="font-serif font-black tracking-tighter uppercase text-sm">Vault Admin</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => { if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-black text-white shadow-lg' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <item.icon size={20} />
                {(isSidebarOpen || window.innerWidth < 768) && <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>}
                {isSidebarOpen && isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-400 ${(!isSidebarOpen && window.innerWidth >= 768) && 'justify-center'}`}>
            <ShieldCheck size={20} />
            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Secure Node</span>}
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

"use client";
import { 
  LayoutDashboard, Package, CreditCard, BarChart3, 
  Users, Settings, FileText, LogOut 
} from "lucide-react"; // FIX: All icons imported
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Products", icon: Package, href: "/admin/products" },
    { name: "Orders", icon: CreditCard, href: "/admin/orders" },
    { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { name: "Team", icon: Users, href: "/admin/team" },
    { name: "Blogs", icon: FileText, href: "/admin/blogs" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      {/* Sidebar UI */}
      <aside className="w-64 bg-white border-r border-zinc-100 flex flex-col p-6 sticky top-0 h-screen">
        <h2 className="text-[#9C815E] font-serif font-bold text-xl mb-10 italic">Essential Admin</h2>
        
        <nav className="flex-1 space-y-2">
          {menu.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-[#F9F7F2] hover:text-[#9C815E] rounded-xl transition-all">
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
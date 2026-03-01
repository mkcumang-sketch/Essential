"use client";
import { signOut, useSession } from "next-auth/react";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link"; // Link import karna zaroori hai

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === "admin@gmail.com";

  return (
    <nav className="flex justify-between p-6 bg-white border-b border-[#F5F2ED]">
      <div className="text-xl font-bold font-luxury italic text-[#001A33]">ESSENTIAL RUSH</div>
      
      <div className="flex gap-6 items-center">
        {session ? (
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                <LayoutDashboard size={14} /> Command Center
              </Link>
            )}
            <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-red-500 text-xs font-bold">
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          /* Ab seedha hamare banaye huye login page par jayega */
          <Link href="/login" className="flex items-center gap-2 bg-[#F0F4F8] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100 hover:bg-[#001A33] hover:text-white transition-all text-[#001A33]">
            <User size={14} /> Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
}
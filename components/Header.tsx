"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import SearchOverlay from "./SearchOverlay";
import { useCartStore } from "@/store/cartStore";
import { Search, ShoppingBag, User, LogOut, Menu, X } from "lucide-react"; // ✅ Premium Icons
import { AnimatePresence, motion } from "framer-motion"; // ✅ Smooth Mobile Menu

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
const cartItems = useCartStore((state) => state.items);  
  // ✅ TERA LOGIC: Admin access is driven by NextAuth session role.
  const isAdmin = (session?.user as any)?.role === "SUPER_ADMIN";

  const [siteName, setSiteName] = useState("EssentialRush");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ✅ Mobile Menu state

  // ✅ TERA LOGIC: Safe Logout
  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // Ignore storage errors (private browsing, etc.)
    }

    // Ensure in-memory Zustand state is cleared too.
    try {
      useCartStore.getState().clearCart();
    } catch (e) {}

    await signOut({ callbackUrl: "/" });
    window.location.reload(); // Hard reload to eliminate any stale session UI.
  };

  // ✅ TERA LOGIC: Site Name Load Karna
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.siteName) {
          setSiteName(data.settings.siteName);
        }
      });
  }, []);

  // ✅ TERA LOGIC: AUTO REDIRECT LOGIC
  useEffect(() => {
    if (session && isAdmin && window.location.pathname === "/") {
       // router.push("/admin"); // Is line ko uncomment karein agar seedha bhejna ho
    }
  }, [session, isAdmin, router]);

  return (
    <>
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] py-4 px-6 md:px-12 flex justify-between items-center font-serif text-white transition-all duration-500">
        
        {/* 1. Logo Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl md:text-3xl font-bold italic tracking-tighter hover:text-[#D4AF37] transition-colors">
            {siteName}
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/70 items-center">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <Link href="/collection" className="hover:text-[#D4AF37] transition-colors">Collection</Link>
            
            {/* 🚨 TERA LOGIC: SMART MENU */}
            {isAdmin && (
              <Link href="/admin" className="text-[#D4AF37] hover:text-white border-b border-[#D4AF37] pb-1">Admin Panel</Link>
            )}

            {/* 🚨 TERA LOGIC: SALES PARTNER */}
            {session && !isAdmin && (
               <Link href="/sales" className="text-white/70 hover:text-[#D4AF37]">Sales Dashboard</Link>
            )}
          </div>
        </div>

        {/* 2. Action Icons Section */}
        <div className="flex items-center gap-5 md:gap-7">
          
          {/* ✅ Search Trigger (Icon + Text on hover) */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-white/70 hover:text-[#D4AF37] transition-colors flex items-center gap-2 group"
          >
            <span className="hidden group-hover:block transition-all text-[9px] font-bold uppercase tracking-widest">Search</span>
            <Search size={20} strokeWidth={1.5} />
          </button>

          {/* ✅ Cart Indicator with Gold Counter */}
          <Link href="/cart" className="relative text-white/70 hover:text-[#D4AF37] transition-transform hover:scale-110">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* ✅ Auth & Desktop Account Section */}
          <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-7">
            {session ? (
              <>
                <Link href="/account" className="flex items-center gap-3 text-white/70 hover:text-[#D4AF37] transition-all group">
                  {/* TERA LOGIC: User Image preserved, fallback to Icon */}
                  {session.user?.image ? (
                    <img src={session.user.image} alt="User" className="w-7 h-7 rounded-full border border-white/15 group-hover:border-[#D4AF37]" title={`Logged in as ${session.user.name}`} />
                  ) : (
                    <User size={18} strokeWidth={1.5} />
                  )}
                  <span className="text-[9px] font-black uppercase tracking-[3px]">The Vault</span>
                </Link>
                
                <button 
                  onClick={handleLogout} 
                  className="text-white/40 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <button 
                onClick={() => signIn("google")} 
                className="bg-[#050505] text-white border border-[#D4AF37]/30 text-[9px] uppercase tracking-widest font-bold py-2 px-6 rounded-full hover:bg-[#D4AF37] hover:text-black transition-colors shadow-[0_0_0_1px_rgba(212,175,55,0.15)]"
              >
                Login
              </button>
            )}
          </div>

          {/* ✅ Mobile Menu Trigger */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-white/70 hover:text-[#D4AF37] p-2">
            {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* ✅ 3. Luxury Mobile Menu Overlay (New Feature added without losing old ones) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl p-10 pt-32 flex flex-col gap-8 text-center font-sans"
          >
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-white hover:text-[#D4AF37]">Home</Link>
            <Link href="/collection" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-white hover:text-[#D4AF37]">Collection</Link>
            
            {isAdmin && (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-[#D4AF37]">Admin Panel</Link>
            )}
            {session && !isAdmin && (
              <Link href="/sales" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-white hover:text-[#D4AF37]">Sales Dashboard</Link>
            )}

            <div className="w-12 h-[1px] bg-white/20 mx-auto my-4"></div>

            {session ? (
              <>
                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-[#D4AF37] uppercase tracking-[4px] text-[12px] font-bold">The Vault (Account)</Link>
                <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="text-red-500 uppercase tracking-[4px] text-[12px] font-bold">Sign Out</button>
              </>
            ) : (
              <button onClick={() => { setIsMobileMenuOpen(false); signIn("google"); }} className="text-[#D4AF37] uppercase tracking-[4px] text-[12px] font-bold">Login</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TERA LOGIC: Search Overlay */}
      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
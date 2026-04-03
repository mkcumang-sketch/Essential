"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 🚨 Redirect ke liye
import SearchOverlay from "./SearchOverlay";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Admin access is driven by NextAuth session role.
  // (Your NextAuth callbacks set `session.user.role` from DB user.role / SUPER_ADMIN.)
  const isAdmin = (session?.user as any)?.role === "SUPER_ADMIN";

  const [siteName, setSiteName] = useState("EssentialRush");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  // Site Name Load Karna
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.siteName) {
          setSiteName(data.settings.siteName);
        }
      });
  }, []);

  // 🚨 AUTO REDIRECT LOGIC (Optional: Agar Admin login kare to seedha Dashboard bhejo)
  useEffect(() => {
    if (session && isAdmin && window.location.pathname === "/") {
       // Agar Admin login karke Home par hai, toh usko Admin Panel option highlight ho jayega
       // router.push("/admin"); // Is line ko uncomment karein agar seedha bhejna ho
    }
  }, [session, isAdmin, router]);

  return (
    <>
      <nav className="fixed top-0 w-full bg-black/70 backdrop-blur-md border-b border-white/10 z-50 py-4 px-6 md:px-12 flex justify-between items-center font-serif text-white">
        
        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-bold italic tracking-tighter hover:text-[#D4AF37] transition-colors">
          {siteName}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/70 items-center">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <Link href="/collection" className="hover:text-[#D4AF37] transition-colors">Collection</Link>
          
          {/* 🚨 SMART MENU: Sirf Admin ko ye dikhega */}
          {isAdmin && (
            <>
              <Link href="/admin" className="text-[#D4AF37] hover:text-white border-b border-[#D4AF37] pb-1">Admin Panel</Link>
            </>
          )}

          {/* 🚨 SALES PARTNER: Agar Admin nahi hai, lekin login hai (Sales Person) */}
          {session && !isAdmin && (
             <Link href="/sales" className="text-white/70 hover:text-[#D4AF37]">Sales Dashboard</Link>
          )}

          {/* Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-white/70 hover:text-[#D4AF37] transition-colors ml-6 flex items-center gap-2 group"
          >
            <span className="hidden group-hover:block transition-all text-[9px] font-bold">SEARCH</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>

        {/* Auth & Mobile */}
        <div className="flex items-center gap-4">
          
          <button onClick={() => setIsSearchOpen(true)} className="md:hidden text-white/70 hover:text-[#D4AF37] p-2">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>

          {session ? (
            <div className="flex items-center gap-4">
               {/* User Image */}
               <img src={session.user?.image || ""} alt="User" className="w-8 h-8 rounded-full border border-white/15" title={`Logged in as ${session.user?.name}`} />
               
               {/* Sign Out */}
              <button 
                onClick={() => handleLogout()} 
                className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] hover:text-black border border-[#D4AF37]/30 hover:bg-[#D4AF37] px-3 py-1 rounded-sm hidden sm:block transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* 🚨 GENERIC LOGIN BUTTON (Ab "Admin" nahi likha hai) */
            <button 
              onClick={() => signIn("google")} 
              className="bg-[#050505] text-white border border-[#D4AF37]/30 text-[9px] uppercase tracking-widest font-bold py-2 px-6 hover:bg-[#D4AF37] hover:text-black transition-colors shadow-[0_0_0_1px_rgba(212,175,55,0.15)]"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
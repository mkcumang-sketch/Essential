"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 🚨 Redirect ke liye
import SearchOverlay from "./SearchOverlay";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // 👑 ADMIN EMAIL (Yahan apni email set karein)
  const adminEmail = "us7081569@gmail.com"; 
  
  // Check Access Level
  const isAdmin = session?.user?.email === adminEmail;

  const [siteName, setSiteName] = useState("EssentialRush");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 py-4 px-6 md:px-12 flex justify-between items-center font-serif text-black">
        
        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-bold italic tracking-tighter hover:text-yellow-600 transition-colors">
          {siteName}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-500 items-center">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/collection" className="hover:text-black transition-colors">Collection</Link>
          
          {/* 🚨 SMART MENU: Sirf Admin ko ye dikhega */}
          {isAdmin && (
            <>
              <Link href="/admin" className="text-yellow-600 hover:text-black border-b border-yellow-600 pb-1">Admin Panel</Link>
            </>
          )}

          {/* 🚨 SALES PARTNER: Agar Admin nahi hai, lekin login hai (Sales Person) */}
          {session && !isAdmin && (
             <Link href="/sales" className="text-blue-600 hover:text-black">Sales Dashboard</Link>
          )}

          {/* Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-yellow-600 transition-colors ml-6 flex items-center gap-2 group"
          >
            <span className="hidden group-hover:block transition-all text-[9px] font-bold">SEARCH</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>

        {/* Auth & Mobile */}
        <div className="flex items-center gap-4">
          
          <button onClick={() => setIsSearchOpen(true)} className="md:hidden hover:text-yellow-600 p-2">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>

          {session ? (
            <div className="flex items-center gap-4">
               {/* User Image */}
               <img src={session.user?.image || ""} alt="User" className="w-8 h-8 rounded-full border border-gray-200" title={`Logged in as ${session.user?.name}`} />
               
               {/* Sign Out */}
              <button 
                onClick={() => signOut({ callbackUrl: "/" })} 
                className="text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-sm hidden sm:block"
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* 🚨 GENERIC LOGIN BUTTON (Ab "Admin" nahi likha hai) */
            <button 
              onClick={() => signIn("google")} 
              className="bg-black text-white text-[9px] uppercase tracking-widest font-bold py-2 px-6 hover:bg-yellow-600 hover:text-black transition-colors"
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
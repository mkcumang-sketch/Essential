"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Youtube, Twitter, ShieldCheck } from 'lucide-react';
import { useToast } from "@/context/ToastContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [legalPages, setLegalPages] = useState<any[]>([]);
  const [corporateInfo, setCorporateInfo] = useState<any>(null);
  const { showToast } = useToast();

  useEffect(() => {
    // 🚀 Fetch dynamic legal pages and corporate info from CMS
    const fetchCMS = async () => {
      try {
        const res = await fetch('/api/cms');
        const json = await res.json();
        if (json.success) {
          if (json.data.legalPages) setLegalPages(json.data.legalPages);
          if (json.data.corporateInfo) setCorporateInfo(json.data.corporateInfo);
        }
      } catch (err) {
        console.error("Footer CMS fetch failed:", err);
      }
    };
    fetchCMS();
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || isSubmitting) return;

      setIsSubmitting(true);
      try {
          const res = await fetch('/api/newsletter', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: email.trim() })
          });
          const data = await res.json();

          if (data.success) {
              showToast(data.message || "Welcome to the inner circle.", "success");
              setEmail("");
          } else {
              showToast(data.error || "Subscription failed.", "error");
          }
      } catch (err) {
          showToast("Connection failed. Try again.", "error");
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        
        {/* Newsletter Section */}
        <div className="md:col-span-2">
            <h2 className="text-4xl font-serif text-white mb-4 italic">Stay Updated.</h2>
            <p className="text-gray-500 mb-8 uppercase tracking-widest text-[10px]">Sign up for new watches and exclusive sales.</p>
            <form onSubmit={handleNewsletter} className="flex border-b border-white/20 pb-2 max-w-md">
                <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="bg-transparent flex-1 outline-none text-sm text-white" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="text-[10px] font-black tracking-[3px] uppercase text-white hover:text-[#D4AF37] transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? "..." : "Sign Up"}
                </button>
            </form>
            <div className="flex gap-6 mt-10">
                <Link href="https://instagram.com/essentialrush" target="_blank" className="text-gray-500 hover:text-[#D4AF37] transition-colors"><Instagram size={18}/></Link>
                <Link href="https://facebook.com/essentialrush" target="_blank" className="text-gray-500 hover:text-[#D4AF37] transition-colors"><Facebook size={18}/></Link>
                <Link href="https://youtube.com/essentialrush" target="_blank" className="text-gray-500 hover:text-[#D4AF37] transition-colors"><Youtube size={18}/></Link>
                <Link href="https://twitter.com/essentialrush" target="_blank" className="text-gray-500 hover:text-[#D4AF37] transition-colors"><Twitter size={18}/></Link>
            </div>
        </div>
        
        {/* Navigation & Trust */}
        <div className="grid grid-cols-2 gap-8">
            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[4px] text-gray-500 mb-8">Vault</h4>
                <div className="flex flex-col gap-4 text-sm font-medium">
                    <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">Collection</Link>
                    <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Concierge</Link>
                    <Link href="/account" className="text-gray-400 hover:text-white transition-colors">My Account</Link>
                    <Link href="/track-order" className="text-gray-400 hover:text-white transition-colors">Track Order</Link>
                </div>
            </div>
            <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[4px] text-gray-500 mb-8">Legal</h4>
                <div className="flex flex-col gap-4 text-sm font-medium">
                    {legalPages.length > 0 ? (
                        legalPages.map((page) => (
                            <Link 
                                key={page.id} 
                                href={`/policies/${page.slug}`} 
                                className="text-gray-400 hover:text-white transition-colors capitalize"
                            >
                                {page.title.toLowerCase()}
                            </Link>
                        ))
                    ) : (
                        <>
                            <Link href="/policies/terms-of-service" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
                            <Link href="/policies/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
                            <Link href="/policies/refund-policy" className="text-gray-400 hover:text-white transition-colors">Returns</Link>
                        </>
                    )}
                </div>
            </div>
        </div>

        {/* Contact & Badge */}
        <div className="col-span-2 md:col-span-1">
            <h4 className="text-[10px] font-bold uppercase tracking-[4px] text-gray-500 mb-8">Verification</h4>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <ShieldCheck className="text-[#D4AF37]" size={24} />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Verified Luxury Dealer</p>
                        <p className="text-[8px] text-gray-500 uppercase tracking-widest">Global Authentication ID: ER-9921-X</p>
                    </div>
                </div>

                {corporateInfo && (
                    <div className="space-y-3">
                        {corporateInfo.address && (
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest leading-relaxed">
                                <div dangerouslySetInnerHTML={{ __html: corporateInfo.address }} />
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            {corporateInfo.phone1 && <p className="text-[10px] text-white font-bold">{corporateInfo.phone1}</p>}
                            {corporateInfo.email && <p className="text-[10px] text-[#D4AF37] font-medium">{corporateInfo.email}</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>
      <div className="text-center border-t border-white/5 pt-8 text-[9px] text-gray-600 tracking-[5px] uppercase">
        © 2026 Essential Rush. All Rights Reserved.
      </div>
    </footer>
  );
}
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
    const [cmsData, setCmsData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/cms')
            .then(res => res.json())
            .then(json => { if (json.success) setCmsData(json.data); })
            .catch(err => console.error("Failed to load footer links"));
    }, []);

    const legalPages = cmsData?.legalPages || [];
    const categories = cmsData?.categories || [];
    const corporateInfo = cmsData?.corporateInfo || {};
    const socialLinks = cmsData?.socialLinks || {};

    {/* 🚨 Check karein ki href exact yahi ho */}
<Link href="/policies/privacy-policy" className="hover:text-[#D4AF37] transition-colors">
  Privacy Policy
</Link>

    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t-[10px] border-[#D4AF37]">
         <div className="max-w-[1800px] mx-auto px-6 md:px-16">
            
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-16 mb-16 gap-10">
                <div className="text-center md:text-left">
                    <h3 className="text-sm font-black uppercase tracking-[5px] text-white/50 mb-2">Subscribe to our</h3>
                    <h2 className="text-5xl md:text-6xl font-serif italic font-black text-white tracking-tighter">Newsletter</h2>
                    <p className="text-sm text-gray-400 mt-4 max-w-sm">Stay updated with the latest offers, trends and launches. Get exclusive invite to private sales and much more.</p>
                </div>
                <div className="flex w-full md:w-auto">
                    <input type="email" placeholder="Your email address" className="bg-transparent border-b border-white/20 p-4 text-white outline-none focus:border-[#D4AF37] w-full md:w-80 font-mono text-sm" />
                    <button className="bg-red-600 text-white font-black uppercase tracking-widest text-xs px-8 py-4 ml-4 hover:bg-red-700 transition-colors">Subscribe</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
                <div className="space-y-6">
                    <h4 className="text-lg font-black uppercase tracking-widest text-white mb-8">Online Shopping</h4>
                    <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link></li>
                        {categories.slice(0,5).map((cat:string, i:number) => (
                           <li key={i}><Link href={`/#ourcollection`} className="hover:text-[#D4AF37] transition-colors text-left">{cat}</Link></li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-lg font-black uppercase tracking-widest text-white mb-8">Customer Policies</h4>
                    <ul className="space-y-4 text-sm font-bold text-gray-400">
                        {/* 🌟 THE FIX: Validates slug before rendering Link 🌟 */}
                        {legalPages.filter((p:any) => p.slug).map((page:any, i:number) => (
                           <li key={i}>
                               <Link href={`/policies/${page.slug}`} className="hover:text-[#D4AF37] transition-colors">
                                   {page.title || 'Policy'}
                               </Link>
                           </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-lg font-black uppercase tracking-widest text-white mb-8">Useful Links</h4>
                    <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link href="/account" className="hover:text-[#D4AF37] transition-colors">My Account</Link></li>
                        <li><Link href="/#ourstory" className="hover:text-[#D4AF37] transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link></li>
                        <li><Link href="/godmode" className="hover:text-[#D4AF37] transition-colors">Admin Dashboard</Link></li>
                    </ul>
                </div>

                <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
                    <h4 className="text-lg font-black uppercase tracking-widest text-white mb-8">Corporate Address</h4>
                    <div className="space-y-4 text-sm font-bold text-gray-400 flex flex-col items-center md:items-start">
                        <p className="text-white">{corporateInfo.companyName || 'Essential Rush Pvt Ltd'}</p>
                        <p className="flex items-center gap-3 text-center md:text-left"><MapPin size={16} className="text-red-500 shrink-0"/> {corporateInfo.address || 'India'}</p>
                        {corporateInfo.phone1 && <p className="flex items-center gap-3"><Phone size={16} className="text-green-500 shrink-0"/> {corporateInfo.phone1}</p>}
                        <p className="flex items-center gap-3"><Mail size={16} className="text-white shrink-0"/> {corporateInfo.email || 'support@essentialrush.com'}</p>
                    </div>
                    <div className="flex gap-3 mt-8">
                        {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" className="w-10 h-10 rounded bg-[#E1306C] flex items-center justify-center hover:opacity-80"><Instagram size={18}/></a>}
                        {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" className="w-10 h-10 rounded bg-[#FF0000] flex items-center justify-center hover:opacity-80"><Youtube size={18}/></a>}
                    </div>
                </div>
            </div>
         </div>
         <div className="text-center border-t border-white/10 mt-10 pt-6">
            <p className="text-[10px] font-black uppercase tracking-[5px] text-gray-600">© {new Date().getFullYear()} Essential Rush Enterprise. All Rights Reserved.</p>
         </div>
      </footer>
    );
}
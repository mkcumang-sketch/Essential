"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Footer() {
    const [cmsData, setCmsData] = useState<any>(null);

    useEffect(() => {
        // Fetch categories and legal pages from CMS
        fetch('/api/cms')
            .then(res => res.json())
            .then(json => {
                if (json.success) setCmsData(json.data);
            })
            .catch(err => console.error("Failed to load footer links"));
    }, []);

    return (
        <footer className="bg-black text-white pt-20 pb-10 px-6 md:px-12 font-sans border-t border-white/10">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                
                {/* ONLINE SHOPPING (Dynamic Categories) */}
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-6">Online Shopping</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                        {cmsData?.categories?.length > 0 ? (
                            cmsData.categories.map((cat: string, i: number) => (
                                <li key={i}><Link href={`/#${cat.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition-colors">{cat}</Link></li>
                            ))
                        ) : (
                            <li><span className="text-gray-600">Loading Collections...</span></li>
                        )}
                    </ul>
                </div>

                {/* CUSTOMER POLICIES (Dynamic Legal Pages) */}
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-6">Customer Policies</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        {/* Static Links if any */}
                        <li><Link href="/policies/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                        
                        {/* Dynamic Links from Admin */}
                        {cmsData?.legalPages?.map((page: any) => (
                            <li key={page.id}>
                                <Link href={`/policies/${page.slug}`} className="hover:text-white transition-colors">
                                    {page.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* USEFUL LINKS */}
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-6">Useful Links</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
                        <li><Link href="/#about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        <li><Link href="/godmode" className="hover:text-[#D4AF37] transition-colors">Admin Dashboard</Link></li>
                    </ul>
                </div>

                {/* CORPORATE ADDRESS */}
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-6">Corporate Address</h4>
                    <ul className="space-y-4 text-sm text-gray-400 leading-relaxed">
                        <li className="font-bold text-white">{cmsData?.corporateInfo?.companyName || 'Essential Rush Pvt Ltd'}</li>
                        <li>{cmsData?.corporateInfo?.address || 'Premium Corporate Hub, India'}</li>
                        <li>📞 {cmsData?.corporateInfo?.phone1 || 'Support Line'}</li>
                        <li>✉️ {cmsData?.corporateInfo?.email || 'support@domain.com'}</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                <p>&copy; {new Date().getFullYear()} {cmsData?.corporateInfo?.companyName || 'Essential'}. All rights reserved.</p>
                <p className="mt-4 md:mt-0 tracking-[4px] uppercase font-mono text-[8px]">Uncompromising Excellence</p>
            </div>
        </footer>
    );
}
"use client";
import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[60vh] relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1585123334904-845d60e97b29?q=80&w=2070" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-7xl font-serif tracking-tighter">Our Heritage</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-24 px-6 text-center space-y-12">
        <span className="text-[#D4AF37] text-xs font-bold tracking-[.4em] uppercase">Since 2026</span>
        <h2 className="text-4xl font-serif leading-snug">Essential Rush was born from a singular obsession: the pursuit of horological perfection.</h2>
        <p className="text-gray-500 leading-relaxed">We don't just sell watches; we secure legacies. Every timepiece that passes through our vault is scrutinized by generational masters, ensuring that when you wear an Essential Rush piece, you wear history.</p>
        <div className="pt-12 border-t border-gray-100">
          <Link href="/" className="text-sm font-bold border-b-2 border-black pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
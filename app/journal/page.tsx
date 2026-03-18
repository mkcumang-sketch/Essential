"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, ShoppingBag, ArrowRight, Clock, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CinematicFade = ({ children, delay = 0, className = "" }: any) => (
  <motion.div initial={{ y: 50, opacity: 0, filter: "blur(5px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }} className={className}>{children}</motion.div>
);

export default function ImperialJournalNode() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const mockArticles = [
          { _id: "1", title: "The Anatomy of a Perpetual Calendar", category: "HOROLOGY", date: "MARCH 12, 2026", readTime: "8 MIN READ", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200", excerpt: "Understanding the zenith of mechanical complexity...", featured: true },
          { _id: "2", title: "Geneva: The Beating Heart", category: "HERITAGE", date: "FEBRUARY 28, 2026", readTime: "5 MIN READ", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1200", excerpt: "Explore the cobblestone streets and hidden ateliers..." }
        ];
        setArticles(mockArticles);
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchJournal();
  }, []);

  const featuredArticle = articles.find(a => a.featured) || articles[0];
  const gridArticles = articles.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#050505] font-sans selection:bg-[#D4AF37]">
      <nav className="h-28 bg-white/90 backdrop-blur-2xl border-b border-gray-100 flex items-center justify-between px-6 md:px-20 sticky top-0 z-[100]">
        <Link href="/" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[4px] hover:text-[#D4AF37]"><ArrowLeft size={20}/> <span className="hidden sm:inline">Imperial Home</span></Link>
      </nav>

      <main className="max-w-[2000px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="text-center mb-24 md:mb-32">
           <CinematicFade><p className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[15px] md:tracking-[20px] mb-8">The Imperial Journal</p></CinematicFade>
           <CinematicFade delay={0.2}><h1 className="text-6xl md:text-9xl lg:text-[120px] font-serif italic tracking-tighter leading-none mb-10">Stories of Time.</h1></CinematicFade>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex justify-center items-center h-64"><div className="animate-spin text-[#D4AF37]"><Clock size={40}/></div></div>
          ) : (
            <div className="space-y-24 md:space-y-40">
              {featuredArticle && (
                <CinematicFade delay={0.4}>
                  <Link href={`/journal/${featuredArticle._id}`} className="group block">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                       <div className="order-2 lg:order-1 lg:pr-12">
                          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic tracking-tighter leading-[1.1] mb-8 group-hover:text-[#D4AF37] transition-colors">{featuredArticle.title}</h2>
                       </div>
                       <div className="order-1 lg:order-2 aspect-square lg:aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl relative"><motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 1.5, ease: "easeOut" }} src={featuredArticle.image} className="w-full h-full object-cover" /></div>
                    </div>
                  </Link>
                </CinematicFade>
              )}

              <div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                    {gridArticles.map((article, i) => (
                      <CinematicFade key={article._id} delay={i * 0.1}>
                        {/* 🚨 FIXED: Removed the word 'block' to fix the CSS conflict warning */}
                        <Link href={`/journal/${article._id}`} className="group flex flex-col h-full">
                           <div className="aspect-[4/3] rounded-[30px] md:rounded-[40px] overflow-hidden mb-8 shadow-lg relative"><motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 1 }} src={article.image} className="w-full h-full object-cover" /></div>
                           <h4 className="text-2xl md:text-3xl font-serif italic tracking-tighter mb-4 group-hover:text-[#D4AF37] transition-colors leading-tight line-clamp-2">{article.title}</h4>
                        </Link>
                      </CinematicFade>
                    ))}
                 </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
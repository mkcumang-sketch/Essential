"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

const ProductCard = ({ watch, addToCart }: { watch: any, addToCart: any }) => {
  const { data: session } = useSession();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    if (session?.user?.id && watch._id) {
      checkWishlistStatus();
    }
  }, [session, watch._id]);

  const checkWishlistStatus = async () => {
    try {
      const res = await fetch('/api/user/wishlist');
      const data = await res.json();
      if (data.success) {
        const inWishlist = data.data.wishlist.some((item: any) => item._id === watch._id);
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      // Redirect to login or show login prompt
      window.location.href = '/login';
      return;
    }

    setIsWishlistLoading(true);
    try {
      const method = isInWishlist ? 'DELETE' : 'POST';
      const res = await fetch('/api/user/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: watch._id })
      });
      
      const data = await res.json();
      if (data.success) {
        setIsInWishlist(!isInWishlist);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group bg-white p-10 rounded-[60px] border border-gray-100 hover:shadow-xl transition-all relative flex flex-col h-full">
      {/* Wishlist Heart Icon */}
      <button 
        onClick={toggleWishlist}
        disabled={isWishlistLoading}
        className="absolute top-6 right-6 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 hover:border-[#D4AF37] transition-all shadow-sm disabled:opacity-50"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart 
            size={20} 
            className={`transition-colors ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </motion.div>
      </button>

      <Link href={`/product/${watch.slug || watch._id}`} className="flex aspect-[4/5] bg-[#FDFDFD] rounded-[45px] overflow-hidden mb-10 items-center justify-center p-12">
        <motion.img whileHover={{ scale: 1.1 }} src={watch.imageUrl || (watch.images && watch.images[0])} className="w-full h-full object-contain" />
      </Link>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[5px] italic">{watch.brand}</p>
          <h4 className="text-3xl font-serif text-[#050505] leading-tight mb-8 tracking-tighter">{watch.name || watch.title}</h4>
        </div>
        <div className="flex justify-between items-center mt-auto pt-8 border-t border-gray-50">
          <p className="text-3xl text-[#002B19] font-black tracking-tighter font-serif">₹{Number(watch.offerPrice || watch.price).toLocaleString('en-IN')}</p>
          <button 
            disabled={watch.stock <= 0}
            onClick={(e) => { e.preventDefault(); if (watch.stock > 0) addToCart(watch); }} 
            className={`p-5 rounded-3xl transition-all shadow-xl ${watch.stock <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#050505] text-white hover:bg-[#D4AF37]'}`}
          >
            <motion.div whileHover={watch.stock > 0 ? { scale: 1.1 } : {}} whileTap={watch.stock > 0 ? { scale: 0.9 } : {}}>
              {watch.stock <= 0 ? (
                <span className="text-[10px] font-black uppercase tracking-widest px-2">Sold Out</span>
              ) : (
                <Plus size={24}/>
              )}
            </motion.div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
"use client";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Trash2, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#F9F9F9] pt-32">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-gray-300">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Save items you love here to track their availability.</p>
        <Link href="/products" className="bg-[#111] text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-[#D32F2F] transition-colors">
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-20">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-12 border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            My Wishlist <span className="text-[#D32F2F]">({wishlist.length})</span>
          </h1>
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#D32F2F] hover:border-[#D32F2F] transition-all">
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id} 
              className="group border border-gray-100 rounded-sm hover:shadow-xl transition-all duration-300 relative bg-white"
            >
              {/* Remove Button */}
              <button 
                onClick={() => toggleWishlist(item)}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-sm text-gray-400 hover:text-[#D32F2F] z-10 transition-colors"
                title="Remove from Wishlist"
              >
                <Trash2 size={16} />
              </button>

              <div className="h-64 overflow-hidden p-6 bg-gray-50">
                <img src={item.img} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="p-6">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-1 tracking-widest">{item.brand || "Luxury"}</p>
                <h3 className="text-sm font-bold uppercase mb-3 line-clamp-1">{item.name}</h3>
                <p className="text-lg font-black text-[#D32F2F] mb-4">₹{item.price.toLocaleString()}</p>
                
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#D32F2F] transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} /> Move to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
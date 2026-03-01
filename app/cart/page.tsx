"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Minus, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Final Bill (Total) calculate karne ka automatic math
  const subtotal = cart.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
  const finalTotal = subtotal; // Luxury watches mein shipping humesha free hoti hai!

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-300">
      
      {/* 1. HEADER SECTION */}
      <div className="w-full bg-gray-50 dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-900 py-12">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white mb-4">
            Your Selection
          </h1>
          <Link href="/#collection" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Continue Exploring
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* AGAR CART KHALI HAI */}
        {cart.length === 0 ? (
          <div className="text-center py-20 border border-gray-100 dark:border-gray-900">
            <p className="text-sm font-bold tracking-[0.2em] uppercase text-black dark:text-white mb-4">Your Cart is Empty</p>
            <Link href="/#collection" className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 text-xs font-extrabold uppercase tracking-widest hover:opacity-80 transition-opacity">
              Discover Masterpieces
            </Link>
          </div>
        ) : (
          
          /* AGAR CART MEIN WATCHES HAIN */
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* LEFT SIDE: Watches ki List */}
            <div className="w-full lg:w-[65%] space-y-8">
              
              {/* Table ki Heading (Mobile pe chup jayegi) */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 text-xs font-bold tracking-widest uppercase text-gray-400">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {/* Asli Watches ki List */}
              {cart.map((item: any) => (
                <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-gray-100 dark:border-gray-900">
                  
                  {/* Photo aur Naam */}
                  <div className="col-span-6 flex items-center space-x-6">
                    <div className="w-24 h-32 bg-gray-50 dark:bg-[#111] relative overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wide text-black dark:text-white mb-2">{item.title}</h3>
                      <p className="text-xs text-gray-500 font-bold tracking-widest">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  {/* Quantity (+ / -) Button */}
                  <div className="col-span-3 flex justify-center items-center space-x-4 my-4 md:my-0">
                    <button onClick={() => updateQuantity(item._id, "decrease")} className="p-2 border border-gray-200 dark:border-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-black w-4 text-center text-black dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, "increase")} className="p-2 border border-gray-200 dark:border-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price aur Delete Button */}
                  <div className="col-span-3 flex justify-between md:justify-end items-center space-x-6">
                    <span className="text-sm font-black text-black dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                    <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* RIGHT SIDE: Final Bill (Order Summary) */}
            <div className="w-full lg:w-[35%]">
              <div className="bg-gray-50 dark:bg-[#0a0a0a] p-8 border border-gray-200 dark:border-gray-900 sticky top-32">
                <h2 className="text-lg font-black uppercase tracking-widest text-black dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-4 text-sm mb-8">
                  <div className="flex justify-between text-gray-500 font-semibold tracking-wide">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-semibold tracking-wide">
                    <span>Insured Shipping</span>
                    <span className="text-green-600 uppercase text-xs tracking-widest font-bold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-semibold tracking-wide">
                    <span>Taxes</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total</span>
                    <span className="text-3xl font-black text-black dark:text-white">₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button className="w-full bg-black text-white dark:bg-white dark:text-black py-5 text-sm font-extrabold tracking-[0.2em] uppercase hover:opacity-80 transition-opacity flex items-center justify-center mb-6">
                  Proceed to Checkout
                </button>

                <div className="flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Secure 256-bit Encryption
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
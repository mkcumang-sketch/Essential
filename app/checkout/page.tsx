"use client";
import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Logic for Order POST API will go here
    setTimeout(() => {
      alert("Order Placed Successfully! 🎉 Welcome to the Elite Club.");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white min-h-screen text-black py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left: Shipping Form */}
        <div className="space-y-8">
          <h2 className="text-3xl font-light uppercase tracking-widest border-b pb-4">Shipping Information</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="First Name" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded focus:border-black outline-none" required />
              <input placeholder="Last Name" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded focus:border-black outline-none" required />
            </div>
            <input placeholder="Email Address" type="email" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded focus:border-black outline-none" required />
            <input placeholder="Full Address" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded focus:border-black outline-none" required />
            <div className="grid grid-cols-3 gap-4">
              <input placeholder="City" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded focus:border-black outline-none" required />
              <input placeholder="State" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded focus:border-black outline-none" required />
              <input placeholder="PIN Code" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded focus:border-black outline-none" required />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-gold-700 text-white py-5 rounded font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg"
            >
              {loading ? "Processing Order..." : "Confirm & Pay (COD)"}
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-zinc-50 p-10 rounded-xl h-fit border border-zinc-100">
          <h3 className="text-xl font-bold mb-6 border-b pb-4 tracking-tighter uppercase">Order Summary</h3>
          <div className="space-y-4 text-sm font-medium text-zinc-600">
            <div className="flex justify-between italic"><span>Subtotal</span> <span>₹2,50,000</span></div>
            <div className="flex justify-between italic"><span>Shipping</span> <span className="text-green-600 font-bold uppercase text-[10px]">Free</span></div>
            <div className="flex justify-between italic"><span>GST (Included)</span> <span>₹0</span></div>
            <div className="border-t pt-4 flex justify-between text-xl font-black text-black">
              <span>TOTAL</span>
              <span>₹2,50,000</span>
            </div>
          </div>
          <div className="mt-8 p-4 border border-gold-600/20 bg-gold-600/5 rounded text-[10px] text-gold-800 font-bold uppercase tracking-widest leading-loose">
            🛡️ Titan Trust: 100% Genuine product and manufacturer warranty included.
          </div>
        </div>
      </div>
    </div>
  );
}
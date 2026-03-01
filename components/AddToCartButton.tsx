"use client";
import { useState } from "react";
import { ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }: { product: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ Cart mein save karne ki logic
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item._id === product._id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    // Custom event taaki Navbar/Drawer ko pata chale ki cart update hua hai
    window.dispatchEvent(new Event("storage"));
    alert("Masterpiece added to your selection! ✨");
  };

  // ✅ Buy Now: Pehle cart mein daalo, phir Checkout pe bhago
  const handleBuyNow = () => {
    setLoading(true);
    addToCart();
    router.push("/checkout"); // Seedha Checkout Page par
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* ADD TO CART */}
      <button 
        onClick={addToCart}
        className="flex-1 border-2 border-black py-5 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500 group"
      >
        <ShoppingBag className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" />
        Add to Cart
      </button>

      {/* BUY NOW */}
      <button 
        onClick={handleBuyNow}
        disabled={loading}
        className="flex-1 bg-black text-white py-5 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all duration-500 shadow-xl"
      >
        <Zap className="w-4 h-4 mr-3 fill-current" />
        {loading ? "Authenticating..." : "Buy Now"}
      </button>
    </div>
  );
}
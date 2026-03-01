"use client"; // 👈 Ye hook chalane ke liye zaroori hai

import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function CartWrapper() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQty } = useCart();
  
  return (
    <CartDrawer 
      isOpen={isCartOpen} 
      onClose={() => setIsCartOpen(false)} 
      cartItems={cartItems} 
      updateQty={updateQty} 
    />
  );
}
"use client";
import { useCart } from "@/context/CartContext"; //
import CartDrawer from "./CartDrawer";

export default function ClientHelper() {
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
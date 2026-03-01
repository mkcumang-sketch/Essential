"use client";

import { useCart } from "@/context/CartContext"; // Correct import
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";

export default function ClientComponents() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQty } = useCart();

  return (
    <>
      {/* Dynamic Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        updateQty={updateQty} 
      />
      
      {/* Luxury Search Overlay */}
      <SearchOverlay />
    </>
  );
}
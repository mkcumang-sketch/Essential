"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  offerPrice?: number;
  qty: number;
  image?: string;
  imageUrl?: string;
  images?: string[];
  brand?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  updateQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  isSyncing: boolean;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { status } = useSession();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Hydration: LocalStorage -> State
  useEffect(() => {
    const saved = localStorage.getItem("luxury_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCartItems(parsed);
      } catch (e) {
        console.error("Cart hydration failed:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Auth Hydration: MongoDB -> State (Merge with LocalStorage)
  useEffect(() => {
    if (status === "authenticated" && isInitialized) {
      const fetchDBCart = async () => {
        try {
          // 🚀 FIX: Add cache bypass headers
          const res = await fetch("/api/cart/sync", {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
          });
          
          const textContent = await res.text();
          
          if (!textContent) {
            return; 
          }

          const data = JSON.parse(textContent);

          if (data.success && data.items) {
            // 🛡️ GHOST CART FIX: If DB returns empty cart, it MUST clear localStorage
            if (data.items.length === 0) {
              setCartItems([]);
              localStorage.setItem("luxury_cart", "[]");
              return;
            }

            // Merge logic: DB takes precedence for quantity
            setCartItems(() => {
              const dbItems = data.items as CartItem[];
              const merged = [...dbItems];
              // Only keep local items that are NOT in DB if we want to preserve guest items,
              // but for a strict sync, DB should be the source of truth.
              return merged;
            });
          }
        } catch (err) {
          console.error("Failed to fetch DB cart:", err);
        }
      };
      fetchDBCart();
    }
  }, [status, isInitialized]);

  // 3. Intelligent Sync: State -> LocalStorage & MongoDB (Debounced)
  useEffect(() => {
    if (!isInitialized) return;

    // Always sync to LocalStorage immediately for snappy UI
    localStorage.setItem("luxury_cart", JSON.stringify(cartItems));

    // Debounced sync to MongoDB
    if (status === "authenticated") {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      
      syncTimeoutRef.current = setTimeout(async () => {
        setIsSyncing(true);
        try {
          const total = cartItems.reduce((acc, item) => acc + (item.offerPrice || item.price) * item.qty, 0);
          await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cartItems, totalAmount: total })
          });
        } catch (err) {
          console.error("Cart DB sync failed:", err);
        } finally {
          setIsSyncing(false);
        }
      }, 1500); // 1.5s debounce to prevent API spam during rapid qty changes
    }

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [cartItems, status, isInitialized]);

  const addToCart = useCallback((product: any) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === (product._id || product.id));
      if (exists) {
        return prev.map((item) =>
          item._id === (product._id || product.id) ? { ...item, qty: item.qty + 1 } : item
        );
      }
      const newItem: CartItem = {
        _id: product._id || product.id,
        name: product.name || product.title,
        price: product.price,
        offerPrice: product.offerPrice,
        qty: 1,
        image: product.imageUrl || (product.images && product.images[0]) || product.img,
        brand: product.brand
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => {
      const newCart = prev.filter((item) => item._id !== id);
      
      // 🚀 FIX: Instant Delete Sync - Don't wait for debounce if removing!
      if (status === "authenticated") {
        const total = newCart.reduce((acc, item) => acc + (item.offerPrice || item.price) * item.qty, 0);
        fetch("/api/cart/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: newCart, totalAmount: total }),
          keepalive: true // Force browser to complete request even if user logs out or closes tab
        }).catch(e => console.error("Instant sync failed", e));
      }
      
      return newCart;
    });
  }, [status]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.offerPrice || item.price) * item.qty, 0);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.setItem("luxury_cart", "[]");
    
    if (status === "authenticated") {
      fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [], totalAmount: 0 }),
        keepalive: true
      }).catch(e => console.error("Clear cart sync failed", e));
    }
  }, [status]);

  return (
    <CartContext.Provider value={{ 
        cart: cartItems, 
        cartItems, 
        addToCart, 
        updateQty, 
        removeFromCart, 
        clearCart,
        isCartOpen, 
        setIsCartOpen,
        cartTotal,
        isSyncing,
        openCart,
        closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
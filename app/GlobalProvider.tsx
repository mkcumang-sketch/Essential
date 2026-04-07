"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
// Agar aur koi providers hain toh unhe bhi import karo

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* 🚨 YAHAN CartProvider MISSING HOGA TERE CODE MEIN */}
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
}
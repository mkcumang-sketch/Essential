"use client";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartBadge() {
  const { cart } = useCart();
  
  // Cart mein total kitni watches hain calculate karein
  const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="relative inline-flex items-center p-2 text-black dark:text-white hover:text-gray-500 transition-colors">
      <ShoppingBag className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
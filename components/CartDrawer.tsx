"use client";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose, cartItems, updateQty }: any) {
  const total = cartItems.reduce((acc: number, item: any) => acc + item.price * item.qty, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight uppercase">Your Shopping Bag ({cartItems.length})</h2>
          <X className="cursor-pointer hover:rotate-90 transition" onClick={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-zinc-200 mb-4" />
              <p className="text-zinc-500 uppercase text-xs tracking-widest font-bold">Your bag is empty</p>
            </div>
          ) : (
            cartItems.map((item: any) => (
              <div key={item._id} className="flex gap-4 border-b pb-6">
                <img src={item.images[0]} className="w-20 h-20 object-contain bg-zinc-50 border" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold uppercase truncate">{item.title}</h3>
                  <p className="text-zinc-500 text-xs mb-2">{item.brand}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border rounded">
                      <button className="p-1 hover:bg-zinc-100" onClick={() => updateQty(item._id, -1)}><Minus size={14}/></button>
                      <span className="px-3 text-sm font-bold">{item.qty}</span>
                      <button className="p-1 hover:bg-zinc-100" onClick={() => updateQty(item._id, 1)}><Plus size={14}/></button>
                    </div>
                    <span className="font-bold text-sm">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t bg-zinc-50">
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-widest text-center italic">Shipping & taxes calculated at checkout</p>
            <Link href="/checkout" onClick={onClose}>
              <button className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition shadow-xl">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
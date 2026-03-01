"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // API se products fetch karo
    fetch("/api/products").then(res => res.json()).then(data => {
      if(data.success) setProducts(data.products.slice(0, 10)); // Top 10 Newest
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 font-serif">
      <h1 className="text-5xl text-center italic font-bold mb-12 uppercase">New Arrivals</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-[1600px] mx-auto">
        {products.map((watch: any) => (
          <Link href={`/product/${watch._id}`} key={watch._id} className="group cursor-pointer">
             <div className="bg-gray-50 p-6 h-[300px] flex items-center justify-center mb-4 relative overflow-hidden">
                <img src={watch.images[0]} className="h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
                <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">New</span>
             </div>
             <div className="text-center">
               <h3 className="font-bold text-lg">{watch.title}</h3>
               <p className="text-yellow-600 font-bold">₹{watch.price.toLocaleString("en-IN")}</p>
             </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
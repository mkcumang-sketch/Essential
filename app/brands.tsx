"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch("/api/site-content").then(res => res.json()).then(data => {
      if(data.success) setBrands(data.brands);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 font-serif">
      <h1 className="text-5xl text-center italic font-bold mb-16 uppercase">Our Brands</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
        {brands.map((brand: any) => (
          <Link href={`/collection?brand=${brand.name}`} key={brand._id} className="group flex flex-col items-center justify-center p-12 border border-gray-100 hover:shadow-xl transition-all rounded-lg">
             <img src={brand.logoUrl} className="h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
             <p className="mt-6 text-sm font-bold uppercase tracking-widest group-hover:text-yellow-600">{brand.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
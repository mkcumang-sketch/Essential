"use client";
import { useState } from "react";

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    title: "", price: "", brand: "", images: "", category: "", description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        images: [formData.images] // Array format fix
      }),
    });
    
    if (res.ok) {
      alert("Watch Added Successfully! ⌚🔥");
      setFormData({ title: "", price: "", brand: "", images: "", category: "", description: "" });
    }
  };

  return (
    <div className="max-w-2xl bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-gold-500">List a New Timepiece</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <input className="w-full p-3 rounded" placeholder="Watch Title (e.g. Rolex Daytona)" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
        <div className="grid grid-cols-2 gap-4">
          <input className="w-full p-3 rounded" placeholder="Price (₹)" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <input className="w-full p-3 rounded" placeholder="Brand Name" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} required />
        </div>
        <input className="w-full p-3 rounded" placeholder="Image URL" value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} required />
        <textarea className="w-full p-3 rounded h-32" placeholder="Description..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        <button className="w-full bg-gold-600 p-4 rounded-lg font-bold hover:bg-gold-700 transition uppercase tracking-widest text-black">Add to Inventory</button>
      </form>
    </div>
  );
}
import Navbar from "@/components/Navbar";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";

export default async function Collection() {
  await connectDB();
  
  // Direct Database Fetching (Server-Side)
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .lean() as any[];

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="pt-32 px-6 max-w-[1800px] mx-auto">
        <h2 className="text-3xl font-serif italic text-gold-500 mb-8">Watches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products && products.length > 0 ? products.map((p: any) => (
             <Link href={`/product/${p._id}`} key={p._id.toString()} className="group block bg-[#0a0a0a] border border-white/10 p-4 rounded-xl">
                <div className="aspect-[3/4] overflow-hidden mb-4 rounded-lg bg-white relative">
                   <img src={p.images?.[0]} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt={p.title || p.name}/>
                </div>
                <h3 className="text-white font-bold text-sm uppercase">{p.title || p.name}</h3>
                <p className="text-gold-500 font-serif italic">₹{Number(p.price).toLocaleString()}</p>
             </Link>
          )) : (
            <div className="col-span-full py-40 text-center">
              <p className="text-gray-500 italic font-serif text-xl">The vault is currently empty. Check back soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

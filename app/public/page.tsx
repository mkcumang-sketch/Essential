import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  await connectDB(); // Database connect
  
  // Admin ne jo products daale hain, wahi yahan dikhenge
  const products = await Product.find({ status: "active" }).sort({ createdAt: -1 });

  return (
    <div className="bg-[#F8F6F2]">
      {/* Hero Section (Same as before) */}
      
      <section className="py-24 px-10 grid grid-cols-4 gap-10">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </section>
    </div>
  );
}
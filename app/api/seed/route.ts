import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { SiteContent } from "@/models/SiteContent";

export async function GET() {
  try {
    await connectDB();

    // 1. Purana data saaf karo
    await Product.deleteMany({});
    await SiteContent.deleteMany({});

    // 2. Naye Products dalo
    await Product.create([
      {
        title: "Rolex Daytona Panda",
        price: 2500000,
        brand: "Rolex",
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80"],
        category: "Chronograph",
        condition: "New",
        stock: 5,
        description: "The legendary Daytona with ceramic bezel."
      },
      {
        title: "Patek Philippe Nautilus",
        price: 8500000,
        brand: "Patek Philippe",
        images: ["https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=800&q=80"],
        category: "Sport",
        condition: "Used",
        stock: 2,
        description: "Desired steel sports watch."
      }
    ]);

    // 3. Site Content dalo
    await SiteContent.create({
      brands: [{ name: "Rolex", logo: "" }, { name: "Omega", logo: "" }],
      about: { heading: "Essential Rush", story: "Luxury Defined." }
    });

    return NextResponse.json({ success: true, message: "Store Filled Successfully! 🚀" });
  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
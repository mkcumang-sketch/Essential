import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";
import ShopClient from "@/components/ShopClient";

export default async function ShopPage() {
    await connectDB();
    const products = await Product.find({})
        .sort({ createdAt: -1 })
        .lean() as any[];
    const serializedProducts = products.map(p => ({
        ...p,
        _id: p._id.toString()
    }));
    return <ShopClient initialProducts={serializedProducts} />;
}

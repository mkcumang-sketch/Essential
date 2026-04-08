import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";
import NewArrivalsClient from "@/components/NewArrivalsClient";

export default async function NewArrivalsPage() {
    await connectDB();
    const products = await Product.find({})
        .sort({ createdAt: -1 })
        .limit(20)
        .lean() as any[];
    const serializedProducts = products.map(p => ({
        ...p,
        _id: p._id.toString()
    }));
    return <NewArrivalsClient initialLiveWatches={serializedProducts} />;
}

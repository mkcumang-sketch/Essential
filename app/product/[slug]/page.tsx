import { Metadata } from 'next';
import ProductClientPage from './ProductClientPage';
import { Product } from "@/models/Product";
import Connectdb from "@/lib/db"; // Ensure this matches the function call below
import mongoose from 'mongoose';

// 🛡️ 1. DYNAMIC METADATA (SEO)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    
    // FIXED: Changed dbConnect() to Connectdb() to match the import
    await Connectdb();

    // Check if slug is a valid ID or a string slug
    const query = mongoose.Types.ObjectId.isValid(slug) ? { _id: slug } : { slug: slug };
    const product = await Product.findOne(query).lean() as any;

    if (!product) return { title: "Timepiece Not Found | Essential" };

    const title = `${product.brand} ${product.name || product.title} | Essential Fine Horology`;
    const description = product.description?.slice(0, 160) || "Explore this curated luxury timepiece.";
    const image = product.images?.[0] || product.imageUrl;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: image ? [{ url: image }] : [],
            type: 'website',
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: image ? [image] : [],
        }
    };
}

// 🌟 2. GOOGLE RICH SNIPPETS (JSON-LD)
const JsonLdSchema = ({ product, slug }: { product: any, slug: string }) => {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://essentialrush.store';
    
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name || product.title,
        "image": [product.imageUrl, ...(product.images || [])].filter(Boolean),
        "description": product.description,
        "brand": { "@type": "Brand", "name": product.brand || "Essential" },
        "offers": {
            "@type": "Offer",
            "url": `${baseUrl}/product/${slug}`,
            "priceCurrency": "INR",
            "price": product.offerPrice || product.price,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        }
    };

    return (
        <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// 🏛️ 3. MAIN SERVER COMPONENT
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // FIXED: Changed dbConnect() to Connectdb() to match the import
    await Connectdb();
    
    const query = mongoose.Types.ObjectId.isValid(slug) ? { _id: slug } : { slug: slug };
    const productData = await Product.findOne(query).lean() as any;

    if (!productData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#D4AF37] font-serif">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Timepiece Not Found</h1>
                    <p className="text-gray-500 mb-8 italic">The requested asset has left our vault or never existed.</p>
                    <a href="/shop" className="text-xs font-black uppercase tracking-widest border-b border-[#D4AF37] pb-1">Return to Collection</a>
                </div>
            </div>
        );
    }

    // Serialize data for Client Component
    const serializedProduct = JSON.parse(JSON.stringify(productData));

    return (
        <>
            <JsonLdSchema product={serializedProduct} slug={slug} />
            <ProductClientPage product={serializedProduct} />
        </>
    );
}
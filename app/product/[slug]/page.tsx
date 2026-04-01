import { Metadata, ResolvingMetadata } from 'next';
import ProductClientPage from './ProductClientPage';
import mongoose from 'mongoose';

// 🌟 1. DIRECT DATABASE CONNECTION (Bypasses Vercel Fetch Bugs)
const connectDB = async () => {
    if (mongoose.connection.readyState < 1) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }
};

const getProductData = async (slug: string) => {
    try {
        await connectDB();
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        
        // 🚀 Fetch all products directly from Database
        const products = await Product.find({}).lean();
        
        // 🧠 SMART SLUG MATCHER
        const foundProduct = products.find((p: any) => {
            const generatedSlug = p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
            return (
                p._id?.toString() === slug || 
                p.slug === slug || 
                p.seo?.slug === slug ||
                p.seo?.urlSlug === slug ||
                generatedSlug === slug
            );
        });

        // 🚨 TYPESCRIPT FIX
        if (foundProduct && (foundProduct as any)._id) {
            (foundProduct as any)._id = String((foundProduct as any)._id); 
        }
        
        return foundProduct;
        
    } catch (error) { // 🚨 YE WALA CATCH MISSING THA TERE CODE MEIN
        console.error("DB Fetch Error:", error);
        return null;
    }
};

// 🌟 2. DYNAMIC SEO METADATA GENERATOR
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProductData(params.slug);

  if (!product) return { title: 'Asset Not Found | Essential Vault' };

  const baseUrl = process.env.NEXTAUTH_URL || 'https://essential-ivory.vercel.app';
  const seoTitle = product.seo?.metaTitle || `${product.name} | Essential Fine Horology`;
  const seoDesc = product.seo?.metaDescription || product.description?.substring(0, 155) || 'Discover luxury timepieces.';
  const canonical = product.seo?.canonicalUrl || `${baseUrl}/product/${params.slug}`;
  const ogImage = product.seo?.ogImage || product.imageUrl || (product.images && product.images[0]);

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: product.seo?.focusKeyword || product.brand || 'Luxury Watch',
    alternates: { canonical: canonical },
    robots: { index: !product.seo?.noindex, follow: !product.seo?.noindex },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: canonical,
      siteName: 'Essential',
      images: [{ url: ogImage, width: 1200, height: 630, alt: seoTitle }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
      images: [ogImage],
    },
  };
}

// 🌟 3. GOOGLE RICH SNIPPETS (JSON-LD SCHEMA)
const JsonLdSchema = ({ product, slug }: { product: any, slug: string }) => {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://essential-ivory.vercel.app';
  const schema = product.seo?.customSchema ? JSON.parse(product.seo.customSchema) : {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.imageUrl, ...(product.images || [])].filter(Boolean),
    "description": product.description,
    "brand": { "@type": "Brand", "name": product.brand },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/product/${slug}`,
      "priceCurrency": "INR",
      "price": product.offerPrice || product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    }
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

// 🌟 4. MAIN PAGE RENDERER
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductData(params.slug);

  if (!product) {
      return <div className="h-screen bg-[#050505] text-[#D4AF37] flex items-center justify-center font-serif text-2xl">Vault Asset Unreachable</div>;
  }

  return (
    <>
      <JsonLdSchema product={product} slug={params.slug} />
      <ProductClientPage initialProduct={product} slug={params.slug} />
    </>
  );
}
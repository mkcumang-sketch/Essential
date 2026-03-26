import { Metadata, ResolvingMetadata } from 'next';
import ProductClientPage from './ProductClientPage';

// 1. 🚀 DYNAMIC SEO METADATA GENERATOR
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://essential-steel.vercel.app';
  
  // Fetch product securely from backend
  const res = await fetch(`${baseUrl}/api/products?slug=${params.slug}`, { next: { revalidate: 60 } });
  const data = await res.json();
  const product = data.data?.find((p: any) => p.slug === params.slug || p._id === params.slug);

  if (!product) return { title: 'Asset Not Found | Essential Vault' };

  const seoTitle = product.seo?.metaTitle || `${product.name} | Essential Fine Horology`;
  const seoDesc = product.seo?.metaDescription || product.description?.substring(0, 155) || 'Discover luxury timepieces.';
  const canonical = product.seo?.canonicalUrl || `${baseUrl}/product/${product.slug || product._id}`;
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

// 2. 🧠 GOOGLE RICH SNIPPETS (JSON-LD SCHEMA)
const JsonLdSchema = ({ product }: { product: any }) => {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://essential-steel.vercel.app';
  const schema = product.seo?.customSchema ? JSON.parse(product.seo.customSchema) : {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.imageUrl, ...(product.images || [])].filter(Boolean),
    "description": product.description,
    "brand": { "@type": "Brand", "name": product.brand },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/product/${product.slug || product._id}`,
      "priceCurrency": "INR",
      "price": product.offerPrice || product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    }
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

// 3. 🖥️ MAIN PAGE RENDERER
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://essential-steel.vercel.app';
  const res = await fetch(`${baseUrl}/api/products?slug=${params.slug}`, { cache: 'no-store' });
  const data = await res.json();
  const product = data.data?.find((p: any) => p.slug === params.slug || p._id === params.slug);

  if (!product) {
      return <div className="h-screen bg-[#050505] text-[#D4AF37] flex items-center justify-center font-serif text-2xl">Vault Asset Unreachable</div>;
  }

  return (
    <>
      <JsonLdSchema product={product} />
      <ProductClientPage initialProduct={product} slug={params.slug} />
    </>
  );
}
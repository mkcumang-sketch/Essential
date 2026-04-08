import { Metadata } from "next";
import mongoose from "mongoose";
import ProductClientPage from "./ProductClientPage";
import { Product } from "@/models/Product";
import { connectDB } from "@/lib/db";

// 🛡️ 1. DYNAMIC METADATA (SEO) - Next.js 15 Pattern
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>; // 🚨 Fixed: params is now a Promise
}): Promise<Metadata> {
  const { slug } = await params; // 🚨 Fixed: Must await params

  await connectDB();

  try {
    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { _id: slug }
      : { slug };

    // Cast as any to avoid FlattenMaps type errors
    const product = await Product.findOne(query).lean() as any;

    if (!product) {
      return {
        title: "Timepiece Not Found | Essential",
        description: "This product does not exist.",
      };
    }

    const title = `${product.brand} ${
      product.name || product.title
    } | Essential Fine Horology`;

    const description =
      product.description?.slice(0, 160) ||
      "Explore this curated luxury timepiece.";

    const image = product.images?.[0] || product.imageUrl;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : [],
      },
    };
  } catch (error) {
    console.error("Metadata Error:", error);
    return {
      title: "Error | Essential",
    };
  }
}

// 🌟 2. GOOGLE RICH SNIPPETS (JSON-LD)
const JsonLdSchema = ({
  product,
  slug,
}: {
  product: any;
  slug: string;
}) => {
  const baseUrl = process.env.NEXTAUTH_URL || "https://essentialrush.store";

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name || product.title,
    image: [product.imageUrl, ...(product.images || [])].filter(Boolean),
    description: product.description,
    sku: product.sku || product._id,
    mpn: product.sku || product._id,
    brand: {
      "@type": "Brand",
      name: product.brand || "Essential",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${slug}`,
      priceCurrency: "INR",
      price: product.offerPrice || product.price,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "INR"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: "0",
            maxValue: "1",
            unitCode: "DAY"
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: "1",
            maxValue: "3",
            unitCode: "DAY"
          }
        }
      }
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": `${baseUrl}/shop`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.brand,
        "item": `${baseUrl}/shop?brand=${encodeURIComponent(product.brand)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.name,
        "item": `${baseUrl}/product/${slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
};

// 🏛️ 3. MAIN SERVER COMPONENT
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>; // 🚨 Fixed: params is now a Promise
}) {
  const { slug } = await params; // 🚨 Fixed: Must await params

  await connectDB();

  try {
    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { _id: slug }
      : { slug };

    const productData = await Product.findOne(query).lean() as any;

    if (!productData) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#D4AF37] font-serif">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Timepiece Not Found
            </h1>
            <p className="text-gray-500 mb-8 italic">
              The requested asset has left our vault or never existed.
            </p>
            <a
              href="/shop"
              className="text-xs font-black uppercase tracking-widest border-b border-[#D4AF37] pb-1"
            >
              Return to Collection
            </a>
          </div>
        </div>
      );
    }

    // ✅ Serialize safely for client component
    const serializedProduct = JSON.parse(
      JSON.stringify(productData)
    );

    return (
      <>
        <JsonLdSchema product={serializedProduct} slug={slug} />
// Props ke naam wahi rakho jo component mang raha hai
return <ProductClientPage initialProduct={serializedProduct} slug={slug} />;     
 </>
    );
  } catch (error) {
    console.error("Product Page Error:", error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Something went wrong. Please try again later.</p>
      </div>
    );
  }
}
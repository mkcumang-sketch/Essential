// Centralized Enterprise Data Layer
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getProductBySlug(slug: string) {
  try {
    // 🚨 ENTERPRISE CACHING: ISR (Revalidates cache every 1 hour)
    // Pura page millisecond mein load hoga!
    const res = await fetch(`${API_URL}/api/products/slug/${slug}`, {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
}

export async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products?featured=true`, {
      next: { revalidate: 1800 } // Revalidate every 30 mins
    });
    return await res.json();
  } catch (error) {
    return [];
  }
}
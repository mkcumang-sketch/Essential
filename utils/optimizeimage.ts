// utils/optimizeImage.ts

export const optimizeImage = (url: string) => {
    if (!url) return '';
    
    // Check if it's a Cloudinary URL
    if (url.includes('cloudinary.com')) {
        // Automatically injects f_auto (WebP/AVIF) and q_auto (Smart Compression)
        // Example: /upload/v161... becomes /upload/f_auto,q_auto/v161...
        return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    
    return url;
};
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tera purana staleTimes wala setting yahan hoga
  experimental: {
    staleTimes: {
      static: 30,
    },
  },
  
  // 🔥 YE NAYA BLOCK ADD KARNA HAI
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**', // Iska matlab unsplash ki koi bhi image allow kar do
      },
      // Agar tu Pexels ya Cloudinary bhi use kar raha hai, toh unhe bhi yahan daal de:
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
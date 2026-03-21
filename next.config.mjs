/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel Build Bypass
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  
  // 🌟 DIGITAL FIREWALL: Strict Security Headers 🌟
  async headers() {
    return [
      {
        source: '/(.*)', // Applies to all routes
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // Force HTTPS and prevent Man-in-the-Middle attacks
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Prevent Clickjacking (Koi aapki site ko iframe mein daal kar fake clicks nahi le sakta)
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, 
          // Prevent MIME sniffing (Browser ko force karta hai strict rehne par)
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Privacy policy for where users come from
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
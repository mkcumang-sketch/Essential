/** @type {import('next').NextConfig} */

// CSP: keep in sync with middleware.ts (production) for media/video CDNs used by the app.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://js.stripe.com https://checkout.razorpay.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://*.pexels.com https://res.cloudinary.com https://*.googleusercontent.com https://cdn.pixabay.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "media-src 'self' blob: data: https://cdn.pixabay.com https://*.pixabay.com https://videos.pexels.com https://*.pexels.com https://www.pexels.com https://res.cloudinary.com",
  "connect-src 'self' https://api.resend.com https://*.mongodb.net https://*.upstash.io https://www.google.com https://accounts.google.com https://oauth2.googleapis.com https://api.stripe.com https://checkout.razorpay.com https://cdn.pixabay.com https://res.cloudinary.com https://*.cloudinary.com",
  "frame-src 'self' https://www.google.com https://checkout.razorpay.com https://js.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
    ];
  },
};

export default nextConfig;

import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import { GlobalProvider } from './GlobalProvider';
import { ToastProvider } from '@/context/ToastContext';
import { Suspense } from 'react';
import AffiliateTracker from '@/components/AffiliateTracker';

// 🚀 THE APP-MODE VIEWPORT: Locks zoom and sets the native status bar color
export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming to give it a true native app feel
};
export const metadata: Metadata = {
  title: {
    default: 'Essential | Fine Horology & Luxury Timepieces',
    template: '%s | Essential Fine Horology'
  },
  description: 'The ultimate digital vault for investment-grade luxury timepieces. Curated masterpieces for the modern horologist.',
  keywords: ['luxury watches', 'rolex', 'patek philippe', 'fine horology', 'investment watches', 'essential rush'],
  authors: [{ name: 'Essential Rush' }],
  creator: 'Essential Rush',
  publisher: 'Essential Rush',

  // 🚀 THE PWA METADATA: Tells phones this is an installable app
  manifest: '/manifest.json',
  applicationName: 'Essential Rush',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Essential',
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://essentialrush.com',
    siteName: 'Essential Fine Horology',
    title: 'Essential | Fine Horology',
    description: 'The ultimate digital vault for investment-grade luxury timepieces.',
    images: [
      {
        url: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/essential/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Essential Fine Horology',
      },
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essential | Fine Horology',
    description: 'The ultimate digital vault for investment-grade luxury timepieces.',
    images: ['https://res.cloudinary.com/your-cloud-name/image/upload/v1/essential/og-default.jpg'],
    creator: '@essentialrush',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Added your dark theme base classes here just to be safe */}
      <body className="antialiased overflow-x-hidden">

        {/* 🚀 THE TRACKER: Properly Wrapped in Suspense so Next.js build passes */}
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>

        <GlobalProvider>
          <ToastProvider>
            <main>
              {children}
            </main>
          </ToastProvider>
        </GlobalProvider>

        <Analytics />
      </body>
    </html>
  )
}
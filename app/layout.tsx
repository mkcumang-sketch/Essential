import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import { Providers } from './providers'; // (Agar file small 'p' se hai)
export const metadata: Metadata = {
  title: 'Essential | Fine Horology',
  description: 'The ultimate vault for luxury timepieces.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFA] text-gray-900">
        
        {/* 🌟 2. WRAP EVERYTHING INSIDE PROVIDERS 🌟 */}
        <Providers>
          {children}
          <Analytics />
        </Providers>

      </body>
    </html>
  )
}
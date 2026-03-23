import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import { Providers } from './providers';
import Navbar from '@/components/Navbar'; // 🌟 1. IMPORT NAVBAR HERE

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
      <body className="bg-[#FAFAFA] text-gray-900 antialiased">
        
        <Providers>
          {/* 🌟 2. INJECT NAVBAR GLOBALLY HERE */}
          <Navbar /> 
          
          {/* Main content goes below the navbar */}
          <main className="pt-24"> 
            {children}
          </main>
          
          <Analytics />
        </Providers>

      </body>
    </html>
  )
}
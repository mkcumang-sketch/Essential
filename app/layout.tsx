import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import Navbar from '@/components/Navbar';
import { GlobalProvider } from './GlobalProvider'; // 🌟 1. NAYA IMPORT

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
        
        {/* 🌟 2. NAYA WRAPPER */}
        <GlobalProvider>
          <Navbar /> 
          
          <main className="pt-24"> 
            {children}
          </main>
          
          <Analytics />
        </GlobalProvider>

      </body>
    </html>
  )
}
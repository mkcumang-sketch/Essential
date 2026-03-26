import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import { GlobalProvider } from './GlobalProvider';

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
      <body className="bg-[#FAFAFA] text-gray-900 antialiased overflow-x-hidden">
        
        {/* 🌟 GLOBAL WRAPPER: Handles Auth and Cart States */}
        <GlobalProvider>
          
          {/* ❌ Removed <Navbar /> from here because home page already has a premium header.
              This prevents the "Double Header" glitch. 
          */}
          
          <main> 
             {/* ❌ Removed pt-24 (padding top). 
                Now your Hero section will stick perfectly to the top.
             */}
            {children}
          </main>
          
          {/* Vercel Analytics for tracking traffic */}
          <Analytics />
          
        </GlobalProvider>

      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'; // <--- 1. Import it here

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
        
        {/* Your existing providers and children go here */}
        {children}

        {/* 🌟 2. INJECT THE ANALYTICS TRACKER HERE 🌟 */}
        <Analytics />
        
      </body>
    </html>
  )
}
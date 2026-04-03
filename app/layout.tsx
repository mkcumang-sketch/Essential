import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import { GlobalProvider } from './GlobalProvider';
import { ToastProvider } from '@/context/ToastContext';

// 🚨 DEBUG LOG: Track layout rendering
console.log("🚀 Layout.tsx: Starting layout rendering");

export const metadata: Metadata = {
  title: 'Essential | Fine Horology',
  description: 'The ultimate vault for luxury timepieces.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("🚀 Layout.tsx: Layout component rendering");
  
  return (
    <html lang="en">
      <body className="bg-[#FAFAFA] text-gray-900 antialiased overflow-x-hidden">
        <div id="debug-layout" style={{position: 'fixed', top: 0, left: 0, background: 'red', color: 'white', padding: '4px', zIndex: 99999, fontSize: '12px'}}>
          LAYOUT RENDERED
        </div>
        
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
import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import { GlobalProvider } from './GlobalProvider';
import { ToastProvider } from '@/context/ToastContext'; // 👈 Naya Import
import AppAnalytics from '@/components/Analytics';

export const metadata: Metadata = {
  title: 'Essential | Fine Horology',
  description: 'The ultimate vault for luxury timepieces.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFA] text-gray-900 antialiased overflow-x-hidden">
        
        <GlobalProvider>
          {/* 🌟 TOAST PROVIDER SE POORI APP KO WRAP KIYA 🌟 */}
          <ToastProvider>
            <main> 
              {children}
            </main>
          </ToastProvider>
          <Analytics />
          <AppAnalytics />
        </GlobalProvider>

      </body>
    </html>
  )
}
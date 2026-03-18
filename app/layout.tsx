import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import GlobalBanner from "@/components/GlobalBanner"; // 🚨 Naya Banner Import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Essential Rush | Curators of Time",
  description: "The ultimate horological destination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {/* Yahan humne Global Banner lagaya hai */}
          <GlobalBanner />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
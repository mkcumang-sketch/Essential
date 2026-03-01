import "./globals.css";
import { CombinedProviders } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import ClientLogicWrapper from "@/components/ClientLogicWrapper";

export const metadata = {
  title: "Essential Rush | Luxury Blue Edition",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Sabse pehle Providers aayenge taaki useCart null na ho */}
        <CombinedProviders>
          <Navbar />
          {/* Ye wrapper ensure karega ki hooks Provider ke andar hain */}
          <ClientLogicWrapper /> 
          <main className="min-h-screen">
            {children}
          </main>
        </CombinedProviders>
      </body>
    </html>
  );
}
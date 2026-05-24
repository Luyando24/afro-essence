import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { AuthProvider } from "@/components/AuthContext";
import { CurrencyProvider } from "@/components/CurrencyContext";
import { StoreSettingsProvider } from "@/components/StoreSettingsContext";
import NewsletterPopup from "@/components/NewsletterPopup";

export const metadata: Metadata = {
  title: "Afro Essence | Premium Hair Extensions",
  description: "Luxury hair extensions for Afro-textured beauty. 100% Kanekalon, ethically sourced.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`antialiased font-sans min-h-screen flex flex-col`}
      >
        <StoreSettingsProvider>
          <AuthProvider>
            <CurrencyProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
                <ChatWidget />
                <CartDrawer />
                <NewsletterPopup />
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </StoreSettingsProvider>
      </body>
    </html>
  );
}

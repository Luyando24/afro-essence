import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: "Afro-Essence | Premium Hair Extensions",
  description: "Luxury hair extensions for Afro-textured beauty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`antialiased font-sans min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <ChatWidget />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

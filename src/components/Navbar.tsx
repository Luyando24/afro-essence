"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, Search, User as UserIcon } from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useCurrency, Currency } from "./CurrencyContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user, signOut } = useAuth();
  const { currency, setCurrency } = useCurrency();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-primary/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-serif text-2xl font-bold text-primary tracking-wider">
              AFRO ESSENCE
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/shop" className="text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors font-medium">
              Shop
            </Link>
            <Link href="/about" className="text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Currency Switcher */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-300 outline-none cursor-pointer hover:text-primary transition-colors border-none"
            >
              <option value="NGN">NGN ₦</option>
              <option value="AUD">AUD $</option>
            </select>

            <button className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
              <Search className="h-6 w-6" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-zinc-700 pl-4">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 max-w-[120px] truncate" title={user.email}>
                  {user.email?.split("@")[0]}
                </span>
                <button
                  onClick={signOut}
                  className="text-xs text-red-500 hover:text-red-700 font-bold border border-red-200 dark:border-red-900/30 px-2.5 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors text-sm font-semibold flex items-center space-x-1 border-l border-gray-200 dark:border-zinc-700 pl-4"
              >
                <UserIcon className="h-5 w-5 mr-1 text-gray-500" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu and cart button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Currency Switcher */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-300 outline-none cursor-pointer border-none"
            >
              <option value="NGN">NGN ₦</option>
              <option value="AUD">AUD $</option>
            </select>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors relative"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 dark:text-gray-100 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Auth */}
            <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 pb-2">
              {user ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-semibold px-3">Logged in as {user.email}</p>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-955 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-semibold text-primary hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

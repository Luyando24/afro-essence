"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Search } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
              <Search className="h-6 w-6" />
            </button>
            <button className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors relative">
              <ShoppingBag className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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
          </div>
        </div>
      )}
    </nav>
  );
}

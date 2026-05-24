"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User as UserIcon, ChevronDown } from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useCurrency, Currency } from "./CurrencyContext";
import { useStoreSettings } from "./StoreSettingsContext";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user, signOut } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { settings } = useStoreSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/wholesale", label: "Wholesale" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: "#000000",
        boxShadow: scrolled
          ? "0 2px 20px rgba(0,0,0,0.4)"
          : "0 1px 0 rgba(201,168,76,0.2)",
      }}
    >
      {/* Top accent line */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #C9A84C 30%, #E8C96A 50%, #C9A84C 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18" style={{ height: "72px" }}>
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-[0.15em] flex items-center gap-2"
              style={{ color: "#C9A84C" }}
            >
              {settings?.logo_url ? (
                <div className="relative h-12 w-44 sm:w-52">
                  <Image
                    src={settings.logo_url}
                    alt="Afro Essence Logo"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <span className="gold-shimmer text-xl font-serif font-bold tracking-widest">
                  AFRO ESSENCE
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium transition-all duration-200 group"
                style={{
                  color: isActive(link.href) ? "#C9A84C" : "#E0D9CF",
                }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#C9A84C",
                    width: isActive(link.href) ? "70%" : "0%",
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Currency Switcher */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="appearance-none text-xs font-semibold bg-transparent pr-5 pl-2 py-1 rounded border cursor-pointer transition-colors focus:outline-none"
                style={{
                  color: "#C9A84C",
                  borderColor: "rgba(201,168,76,0.3)",
                }}
              >
                <option value="NGN" style={{ color: "#111", backgroundColor: "#fff" }}>NGN ₦</option>
                <option value="AUD" style={{ color: "#111", backgroundColor: "#fff" }}>AUD $</option>
              </select>
              <ChevronDown
                className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none"
                style={{ color: "#C9A84C" }}
              />
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-white/10"
              style={{ color: "#E0D9CF" }}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center text-black"
                  style={{ backgroundColor: "#C9A84C" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-2 border-l pl-4" style={{ borderColor: "rgba(201,168,76,0.2)" }}>
                <span className="text-xs font-medium max-w-[100px] truncate" style={{ color: "#A0A0A0" }}>
                  {user.email?.split("@")[0]}
                </span>
                <button
                  onClick={signOut}
                  className="text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 border"
                  style={{
                    color: "#ef4444",
                    borderColor: "rgba(239,68,68,0.3)",
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:text-black ml-1"
                style={{ color: "#C9A84C", borderColor: "rgba(201,168,76,0.4)" }}
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="md:hidden flex items-center space-x-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="appearance-none text-xs font-semibold bg-transparent border-none cursor-pointer focus:outline-none"
              style={{ color: "#C9A84C" }}
            >
              <option value="NGN" style={{ color: "#111", backgroundColor: "#fff" }}>₦</option>
              <option value="AUD" style={{ color: "#111", backgroundColor: "#fff" }}>$</option>
            </select>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all hover:bg-white/10"
              style={{ color: "#E0D9CF" }}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center text-black"
                  style={{ backgroundColor: "#C9A84C" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:bg-white/10"
              style={{ color: "#E0D9CF" }}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 border-t"
        style={{
          maxHeight: isOpen ? "400px" : "0",
          borderColor: "rgba(201,168,76,0.15)",
          backgroundColor: "#050505",
        }}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: isActive(link.href) ? "#C9A84C" : "#C0B8AD",
                backgroundColor: isActive(link.href)
                  ? "rgba(201,168,76,0.08)"
                  : "transparent",
              }}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#C9A84C" }}
                />
              )}
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
            {user ? (
              <div className="space-y-2">
                <p className="text-xs px-4" style={{ color: "#666" }}>
                  Signed in as{" "}
                  <span style={{ color: "#C9A84C" }}>{user.email}</span>
                </p>
                <button
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="flex items-center px-4 py-3 w-full text-sm font-bold rounded-lg transition-all"
                  style={{ color: "#ef4444" }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-lg transition-all"
                style={{ color: "#C9A84C" }}
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="h-4 w-4" />
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

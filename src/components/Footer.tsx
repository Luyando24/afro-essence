"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { useStoreSettings } from "./StoreSettingsContext";
import Image from "next/image";

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useStoreSettings();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer style={{ backgroundColor: "#0A0A0A", color: "#fff" }}>
      {/* Top gold bar */}
      <div
        className="h-[3px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #C9A84C 30%, #E8C96A 50%, #C9A84C 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            {settings?.logo_url ? (
              <div className="relative h-14 w-52 mb-4">
                <Image
                  src={settings.logo_url}
                  alt="Afro Essence Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            ) : (
              <h3 className="font-serif text-2xl font-bold tracking-widest" style={{ color: "#C9A84C" }}>
                AFRO ESSENCE
              </h3>
            )}
            <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
              Premium hair extensions designed to celebrate and enhance your natural beauty. 
              Ethically sourced and crafted with love.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href={settings?.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                style={{ borderColor: "#333", color: "#888" }}
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={settings?.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                style={{ borderColor: "#333", color: "#888" }}
              >
                <Facebook className="h-4 w-4" />
              </a>
              {settings?.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 hover:border-[#C9A84C] hover:text-[#C9A84C] text-base font-bold"
                  style={{ borderColor: "#333", color: "#888", fontFamily: "monospace" }}
                >
                  t
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-[0.12em] mb-6" style={{ color: "#C9A84C" }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/wholesale", label: "Wholesale" },
                { href: "/about", label: "Our Story" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center text-sm group transition-colors duration-200"
                    style={{ color: "#888" }}
                  >
                    <ArrowRight
                      className="h-3 w-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      style={{ color: "#C9A84C" }}
                    />
                    <span className="group-hover:text-white transition-colors">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-[0.12em] mb-6" style={{ color: "#C9A84C" }}>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
                <span className="text-sm whitespace-pre-line" style={{ color: "#888" }}>
                  {settings?.address || "No. 88, Hair Avenue\nGuangzhou, China"}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: "#C9A84C" }} />
                <span className="text-sm" style={{ color: "#888" }}>
                  {settings?.phone || "+86 151 1033 5070"}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: "#C9A84C" }} />
                <span className="text-sm" style={{ color: "#888" }}>
                  {settings?.email || "hello@afroessence.com"}
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-[0.12em] mb-6" style={{ color: "#C9A84C" }}>
              Stay Updated
            </h4>
            <p className="text-sm mb-4" style={{ color: "#888" }}>
              Subscribe for exclusive offers, new collections, and hair care tips.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none transition-all"
                style={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  color: "#fff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                onBlur={(e) => (e.target.style.borderColor = "#333")}
              />
              <button
                type="submit"
                className="w-full py-2.5 text-sm font-bold rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "#C9A84C", color: "#000" }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t"
          style={{ borderColor: "#1a1a1a" }}
        >
          <p className="text-xs" style={{ color: "#444" }}>
            © {new Date().getFullYear()} Afro Essence. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs" style={{ color: "#444" }}>
            <Link href="/contact" className="hover:text-[#C9A84C] transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-[#C9A84C] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Loader2, SlidersHorizontal, Search } from "lucide-react";
import { products as fallbackProducts } from "@/data/products";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/components/CurrencyContext";

interface DBProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews_count?: number;
  reviews?: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Featured");
  const [searchQuery, setSearchQuery] = useState("");
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        if (data) {
          const mapped = data.map((item: any) => ({
            ...item,
            reviews: item.reviews_count || item.reviews || 0,
            price: Number(item.price),
            rating: Number(item.rating),
          }));
          setProducts(mapped);
        } else {
          setProducts(fallbackProducts as any);
        }
      } catch (err) {
        console.error("Error loading products from Supabase:", err);
        setProducts(fallbackProducts as any);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const categories = ["All Categories", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products
    .filter((p) => selectedCategory === "All Categories" || p.category === selectedCategory)
    .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Newest") return b.id.localeCompare(a.id);
    if (sortBy === "Top Rated") return b.rating - a.rating;
    return 0;
  });

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh" }}>
      {/* Page Header */}
      <div
        className="py-16 px-4 text-center border-b"
        style={{ backgroundColor: "#fff", borderColor: "#E8E2D9" }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#C9A84C" }}>
          Our Collection
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-3" style={{ color: "#1A1A1A" }}>
          Shop All Extensions
        </h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: "#888" }}>
          Explore our complete collection of premium Kanekalon hair extensions.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters & Sort Bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 sm:p-5 rounded-2xl border"
          style={{ backgroundColor: "#fff", borderColor: "#E8E2D9" }}
        >
          {/* Left: Search + Category filters */}
          <div className="flex flex-col gap-3 w-full sm:flex-1">
            {/* Search */}
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#C9A84C" }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition-all"
                style={{ borderColor: "#E8E2D9", backgroundColor: "#FAFAF8", color: "#1A1A1A" }}
                onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                onBlur={(e) => (e.target.style.borderColor = "#E8E2D9")}
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#999" }}>
                <SlidersHorizontal className="h-3.5 w-3.5" style={{ color: "#C9A84C" }} /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
                  style={{
                    backgroundColor: selectedCategory === cat ? "#C9A84C" : "#FAFAF8",
                    color: selectedCategory === cat ? "#000" : "#666",
                    borderColor: selectedCategory === cat ? "#C9A84C" : "#E8E2D9",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium whitespace-nowrap" style={{ color: "#999" }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border rounded-xl px-3 py-2 outline-none transition-all cursor-pointer"
              style={{ borderColor: "#E8E2D9", backgroundColor: "#FAFAF8", color: "#1A1A1A" }}
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-xs mb-6" style={{ color: "#999" }}>
            Showing <strong style={{ color: "#1A1A1A" }}>{sortedProducts.length}</strong> products
            {selectedCategory !== "All Categories" && ` in "${selectedCategory}"`}
          </p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#C9A84C" }} />
            <p className="text-sm font-medium" style={{ color: "#999" }}>Unveiling our collection...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div
            className="text-center py-24 rounded-2xl border"
            style={{ borderColor: "#E8E2D9", backgroundColor: "#fff" }}
          >
            <p className="font-serif text-lg mb-2" style={{ color: "#555" }}>No products found.</p>
            <p className="text-sm" style={{ color: "#999" }}>
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {sortedProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <div
                  className="rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{ backgroundColor: "#fff", border: "1px solid #E8E2D9" }}
                >
                  <div
                    className="aspect-[4/5] relative overflow-hidden"
                    style={{ backgroundColor: "#F0EBE4" }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700"
                      style={{ transition: "transform 0.7s ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    {/* Quick View overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        className="w-full py-2.5 rounded-xl text-xs font-bold"
                        style={{ backgroundColor: "rgba(0,0,0,0.85)", color: "#C9A84C", backdropFilter: "blur(8px)" }}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1"
                      style={{ color: "#C9A84C" }}
                    >
                      {product.category}
                    </p>
                    <h3
                      className="font-serif text-sm font-semibold mb-3 line-clamp-1 transition-colors group-hover:text-[#C9A84C]"
                      style={{ color: "#1A1A1A" }}
                    >
                      {product.name}
                    </h3>
                    <div
                      className="mt-auto pt-3 border-t flex justify-between items-center"
                      style={{ borderColor: "#F0EBE4" }}
                    >
                      <span className="font-bold text-base" style={{ color: "#1A1A1A" }}>
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-current" style={{ color: "#C9A84C" }} />
                        <span className="text-xs font-medium" style={{ color: "#999" }}>
                          {product.rating ? product.rating.toFixed(1) : "5.0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

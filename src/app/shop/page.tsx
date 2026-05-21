"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Loader2, SlidersHorizontal } from "lucide-react";
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
  reviews?: number; // compat
}

export default function ShopPage() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Featured");
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          // Map reviews_count to reviews for compatibility
          const mapped = data.map((item: any) => ({
            ...item,
            reviews: item.reviews_count || item.reviews || 0,
            price: Number(item.price),
            rating: Number(item.rating)
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

  // Extract unique categories dynamically from the loaded products
  const categories = ["All Categories", ...Array.from(new Set(products.map((p) => p.category)))];

  // Filtering
  const filteredProducts = products.filter(
    (product) => selectedCategory === "All Categories" || product.category === selectedCategory
  );

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") {
      return a.price - b.price;
    }
    if (sortBy === "Price: High to Low") {
      return b.price - a.price;
    }
    if (sortBy === "Newest") {
      // If we don't have created_at, default to standard order
      return b.id.localeCompare(a.id);
    }
    // Default / "Featured" (keep original loaded order)
    return 0;
  });

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">Shop All</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Explore our complete collection of premium hair extensions.
          </p>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-primary/10">
          <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-0 w-full sm:w-auto">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Filter by:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 ${
                    selectedCategory === cat
                      ? "bg-primary text-white border-primary"
                      : "bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:border-primary/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 p-1.5 focus:ring-primary focus:border-primary text-gray-800 dark:text-gray-200 outline-none"
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-gray-500 font-medium">Unveiling our collections...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
            {sortedProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-zinc-800 hover:border-primary/20">
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Quick View Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button className="w-full bg-white/95 dark:bg-black/95 text-gray-900 dark:text-white py-2 rounded shadow-lg font-medium hover:bg-primary hover:text-white transition-colors">
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs text-primary font-semibold tracking-wider uppercase mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50 dark:border-zinc-800">
                      <span className="text-gray-950 dark:text-gray-50 font-bold text-lg">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span className="ml-1 text-gray-600 dark:text-gray-400 font-medium">
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

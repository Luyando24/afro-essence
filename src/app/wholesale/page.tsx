"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Loader2, SlidersHorizontal, Info } from "lucide-react";
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
  is_wholesale?: boolean;
  moq_price?: number;
  moq_quantity?: number;
}

export default function WholesalePage() {
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
          .eq("is_wholesale", true)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data) {
          const mapped = data.map((item: any) => ({
            ...item,
            reviews: item.reviews_count || item.reviews || 0,
            price: Number(item.price),
            rating: Number(item.rating),
            moq_price: item.moq_price ? Number(item.moq_price) : undefined,
            moq_quantity: item.moq_quantity ? Number(item.moq_quantity) : undefined
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Error loading wholesale products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = ["All Categories", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter(
    (product) => selectedCategory === "All Categories" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.moq_price || a.price;
    const bPrice = b.moq_price || b.price;
    if (sortBy === "Price: Low to High") {
      return aPrice - bPrice;
    }
    if (sortBy === "Price: High to Low") {
      return bPrice - aPrice;
    }
    if (sortBy === "Newest") {
      return b.id.localeCompare(a.id);
    }
    return 0;
  });

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wholesale Header Banner */}
        <div className="bg-zinc-900 text-white rounded-2xl p-8 md:p-12 mb-12 border border-primary/20 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Afro Essence Wholesale
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Premium Wholesale Catalog
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Scale your salon, beauty supply shop, or brand with Afro Essence virgin hair extensions. Enjoy discounted prices with minimum order quantity (MOQ) limits per item. Place your wholesale orders directly through our standard checkout.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Info className="h-4 w-4 text-primary" /> Special MOQ wholesale pricing per unit</span>
            </div>
          </div>
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
            <p className="text-gray-500 font-medium">Unveiling our wholesale collections...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-150 dark:border-zinc-800">
            <p className="text-gray-500 text-lg font-serif">No wholesale products available currently.</p>
            <p className="text-gray-400 text-sm mt-2">Please check back later or contact our admin support.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
            {sortedProducts.map((product) => {
              const wholesalePrice = product.moq_price || product.price;
              const hasDiscount = product.moq_price && product.moq_price < product.price;
              
              return (
                <Link href={`/products/${product.id}`} key={product.id} className="group">
                  <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-zinc-800 hover:border-primary/20">
                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-200">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Wholesale Badge Overlay */}
                      <div className="absolute top-3 left-3 bg-zinc-950/80 text-primary text-[10px] font-extrabold px-2.5 py-1 rounded border border-primary/20 backdrop-blur-xs uppercase tracking-wider">
                        MOQ: {product.moq_quantity || 10} Units
                      </div>

                      {/* Quick View Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button className="w-full bg-white/95 dark:bg-black/95 text-gray-900 dark:text-white py-2 rounded shadow-lg font-medium hover:bg-primary hover:text-white transition-colors">
                          View Deal Details
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
                      
                      <div className="mt-auto pt-3 border-t border-gray-55 dark:border-zinc-800">
                        <div className="flex justify-between items-baseline">
                          <span className="text-gray-400 text-xs font-semibold">Wholesale Price:</span>
                          <span className="text-primary font-extrabold text-lg">
                            {formatPrice(wholesalePrice)}
                          </span>
                        </div>
                        {hasDiscount && (
                          <div className="flex justify-between items-center text-[10px] text-gray-450 mt-1">
                            <span>Retail Value:</span>
                            <span className="line-through">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[10px] text-gray-450 mt-1">
                          <span>Min Order:</span>
                          <span className="font-bold text-gray-700 dark:text-gray-300">
                            {product.moq_quantity || 10} pcs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, Share2, Loader2, MessageSquare, Plus, Minus, Check, Info } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/components/CurrencyContext";
import { products as fallbackProducts } from "@/data/products";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  category: string;
  rating: number;
  reviews_count?: number;
  stock_quantity?: number;
  is_wholesale?: boolean;
  moq_price?: number;
  moq_quantity?: number;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Interface State
  const [selectedLength, setSelectedLength] = useState('18"');
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const lengths = ['12"', '14"', '16"', '18"', '20"', '22"', '24"'];

  useEffect(() => {
    if (!id) return;

    async function loadProductData() {
      try {
        setLoading(true);
        // 1. Fetch Product Detail
        const { data: dbProduct, error: prodError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        let currentProduct: Product;

        if (prodError || !dbProduct) {
          const isNotFoundError = prodError?.code === 'PGRST116';
          const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
            process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

          if (isNotFoundError || isSupabaseConfigured) {
            router.push("/404");
            return;
          }

          // Attempt to search fallback
          const foundFallback = fallbackProducts.find((p) => p.id === id);
          if (foundFallback) {
            currentProduct = {
              ...foundFallback,
              price: Number(foundFallback.price),
              rating: Number(foundFallback.rating)
            };
          } else {
            router.push("/404");
            return;
          }
        } else {
          currentProduct = {
            ...dbProduct,
            price: Number(dbProduct.price),
            rating: Number(dbProduct.rating),
            is_wholesale: dbProduct.is_wholesale || false,
            moq_price: dbProduct.moq_price ? Number(dbProduct.moq_price) : undefined,
            moq_quantity: dbProduct.moq_quantity ? Number(dbProduct.moq_quantity) : undefined
          };
        }

        setProduct(currentProduct);
        setSelectedImage(currentProduct.image);
        if (currentProduct.is_wholesale && currentProduct.moq_quantity) {
          setQuantity(currentProduct.moq_quantity);
        }

        // 2. Fetch Product Reviews
        const { data: dbReviews } = await supabase
          .from("product_reviews")
          .select("*")
          .eq("product_id", currentProduct.id)
          .order("created_at", { ascending: false });

        if (dbReviews) {
          setReviews(dbReviews);
        }

        // 3. Fetch Related Products (same category, excluding current)
        const { data: dbRelated } = await supabase
          .from("products")
          .select("*")
          .eq("category", currentProduct.category)
          .neq("id", currentProduct.id)
          .limit(4);

        const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

        if (dbRelated && (dbRelated.length > 0 || isSupabaseConfigured)) {
          setRelatedProducts((dbRelated || []).map((p: any) => ({
            ...p,
            price: Number(p.price),
            rating: Number(p.rating)
          })));
        } else {
          // fallback related
          const fallbacks = fallbackProducts
            .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
            .slice(0, 4)
            .map((p) => ({
              ...p,
              price: Number(p.price),
              rating: Number(p.rating)
            }));
          setRelatedProducts(fallbacks);
        }

      } catch (err) {
        console.error("Failed to retrieve product metadata:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [id, router]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewName.trim() || !reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      setReviewMessage("");

      const { data, error } = await supabase
        .from("product_reviews")
        .insert({
          product_id: product.id,
          name: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setReviews((prev) => [data, ...prev]);
        setReviewName("");
        setReviewComment("");
        setReviewRating(5);
        setReviewMessage("Thank you for your beautiful review!");

        // Optionally recalculate aggregate rating locally
        setProduct((prevProd) => {
          if (!prevProd) return null;
          const currentCount = reviews.length;
          const currentSum = reviews.reduce((sum, r) => sum + r.rating, 0);
          const newSum = currentSum + reviewRating;
          const newCount = currentCount + 1;
          return {
            ...prevProd,
            rating: Number((newSum / newCount).toFixed(1)),
            reviews_count: newCount
          };
        });
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      setReviewMessage("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 bg-white dark:bg-zinc-950 min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-500 font-serif text-lg">Revealing your premium extensions...</p>
      </div>
    );
  }

  if (!product) return null;

  // Render ratings summary
  const displayRating = product.rating || 5.0;
  const displayReviewsCount = reviews.length > 0 ? reviews.length : (product.reviews_count || 12);

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image Gallery */}
          <div className="product-image-gallery space-y-4">
            <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-md">
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-5 gap-3">
                <div 
                  onClick={() => setSelectedImage(product.image)}
                  className={`aspect-square relative rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-900 cursor-pointer border transition-all ${
                    (selectedImage || product.image) === product.image 
                      ? 'ring-2 ring-primary border-transparent scale-95 shadow-sm' 
                      : 'border-gray-200 dark:border-zinc-800 hover:opacity-75'
                  }`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {product.images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square relative rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-900 cursor-pointer border transition-all ${
                      selectedImage === img 
                        ? 'ring-2 ring-primary border-transparent scale-95 shadow-sm' 
                        : 'border-gray-200 dark:border-zinc-800 hover:opacity-75'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Thumbnails (Mockup Fallback) */
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedImage(product.image)}
                    className={`aspect-square relative rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-900 cursor-pointer border ${i === 0 ? 'ring-2 ring-primary border-transparent' : 'border-gray-200 dark:border-zinc-800 hover:opacity-75'}`}
                  >
                    <Image
                      src={product.image}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0 flex flex-col">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-1">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
              {product.name}
            </h1>
            
             <div className="mt-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div>
                {product.is_wholesale ? (
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl text-primary font-extrabold tracking-tight">
                        {formatPrice(product.moq_price || product.price)}
                      </span>
                      <span className="text-xs bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 font-extrabold px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/30 uppercase tracking-widest">
                        Wholesale Deal
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Retail Price: <span className="line-through">{formatPrice(product.price)}</span> (Save {(100 - (((product.moq_price || product.price) / product.price) * 100)).toFixed(0)}%)
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl text-primary font-bold tracking-tight">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                 <button className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 dark:bg-zinc-900 rounded-full border border-gray-100 dark:border-zinc-800">
                   <Heart className="h-5 w-5" />
                 </button>
                 <button 
                   onClick={handleShare}
                   className="text-gray-400 hover:text-primary transition-colors p-2 bg-gray-50 dark:bg-zinc-900 rounded-full border border-gray-100 dark:border-zinc-800 relative"
                 >
                   {isCopied ? <Check className="h-5 w-5 text-green-500 animate-bounce" /> : <Share2 className="h-5 w-5" />}
                 </button>
              </div>
            </div>

            {/* Ratings / Star Header */}
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-5 w-5 flex-shrink-0 ${
                      displayRating > rating ? 'text-[#D4AF37] fill-current' : 'text-gray-300 dark:text-zinc-700'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="sr-only">{displayRating} out of 5 stars</p>
              <a href="#reviews" className="ml-3 text-sm font-medium text-primary hover:text-secondary border-b border-primary/20">
                {displayReviewsCount} verified reviews
              </a>
            </div>

            {/* Stock Level Badge */}
            <div className="mt-4">
              {(product.stock_quantity ?? 0) > 0 ? (
                <span className="inline-flex items-center text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-900/30">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse inline-block"></span>
                  In Stock ({product.stock_quantity} available)
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-bold text-red-655 dark:text-red-400 bg-red-50 dark:bg-red-955 px-3 py-1.5 rounded-full border border-red-100 dark:border-red-900/30 animate-pulse">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 inline-block"></span>
                  Out of Stock
                </span>
              )}
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-750 dark:text-gray-300 space-y-6 leading-relaxed">
                <p>{product.description}</p>
                <p>
                  Experience the luxury of Afro Essence. Our extensions are carefully processed to ensure 
                  the cuticles are aligned, minimizing tangling and shedding. Treat it like your own hair—wash, deep condition, curl, or dye as desired.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 dark:border-zinc-800 pt-8">
               {/* Length Options */}
               <div className="mb-6">
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-3 tracking-wider">Length</h4>
                 <div className="flex flex-wrap gap-2.5">
                   {lengths.map((length) => (
                     <button
                       key={length}
                       onClick={() => setSelectedLength(length)}
                       className={`px-4 py-2.5 border rounded-md text-sm font-bold transition-all duration-200 ${
                         selectedLength === length
                           ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                           : 'border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-zinc-800'
                       }`}
                     >
                       {length}
                     </button>
                   ))}
                 </div>
               </div>

                {product.is_wholesale && (
                  <p className="text-xs text-amber-600 dark:text-amber-500 font-bold mb-4 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded border border-amber-200 dark:border-amber-900/30">
                    <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Wholesale Item: Minimum Order Quantity (MOQ) of {product.moq_quantity || 10} units is required.</span>
                  </p>
                )}

                {/* Quantity & Cart Button */}
                <div className="flex items-center space-x-4 mb-8">
                  {(product.stock_quantity ?? 0) > 0 ? (
                    <>
                      <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 shadow-sm">
                        <button 
                          onClick={() => setQuantity((q) => Math.max(product.is_wholesale ? (product.moq_quantity || 10) : 1, q - 1))}
                          className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 font-bold transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-4 py-2 text-gray-900 dark:text-white font-bold text-sm border-l border-r border-gray-300 dark:border-zinc-700 w-12 text-center">
                          {quantity}
                        </span>
                        <button 
                          onClick={() => setQuantity((q) => Math.min(product.stock_quantity ?? 99, q + 1))}
                          className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 font-bold transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product, selectedLength, quantity)}
                        className="flex-1 bg-primary border border-transparent rounded-md py-3.5 px-8 flex items-center justify-center text-base font-bold text-white hover:bg-secondary hover:shadow-lg transition-all duration-300 focus:outline-none"
                      >
                        Add to Cart
                      </button>
                    </>
                  ) : (
                    <button 
                      disabled
                      className="w-full bg-red-50 dark:bg-red-955 text-red-655 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-md py-3.5 px-8 flex items-center justify-center text-base font-bold cursor-not-allowed uppercase tracking-wider"
                    >
                      Sold Out
                    </button>
                  )}
                </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 pt-6 mt-auto">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                <span>Free Shipping over $200</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                <span>30-Day Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Reviews Section */}
        <section id="reviews" className="mt-24 border-t border-gray-200 dark:border-zinc-800 pt-16 scroll-mt-24">
          <div className="lg:grid lg:grid-cols-3 lg:gap-x-12">
            
            {/* Reviews Summary & Leave a Review Form */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                  Customer Stories
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${displayRating > i ? 'fill-current' : 'text-gray-300 dark:text-zinc-700'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-sm">
                    {displayRating} out of 5 stars
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Based on {displayReviewsCount} reviews</p>
              </div>

              {/* Review Form */}
              <div className="bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-lg border border-primary/10 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Share Your Glow
                </h3>
                <form onSubmit={handleAddReview} className="space-y-4">
                  {reviewMessage && (
                    <div className="p-3 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded text-center">
                      {reviewMessage}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-[#D4AF37] focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-6 w-6 ${reviewRating >= star ? 'fill-current' : 'text-gray-300 dark:text-zinc-700'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Sandra M."
                      className="w-full text-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded p-2.5 outline-none focus:ring-1 focus:ring-primary text-gray-950 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Review
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Tell us about the texture, length, and how it blended!"
                      className="w-full text-sm border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded p-2.5 outline-none focus:ring-1 focus:ring-primary text-gray-950 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-primary text-white py-2.5 rounded font-bold hover:bg-secondary transition-colors text-sm shadow-md flex items-center justify-center space-x-1"
                  >
                    {submittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Submit Review</span>}
                  </button>
                </form>
              </div>
            </div>

            {/* Reviews Feed */}
            <div className="lg:col-span-2 mt-12 lg:mt-0 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 dark:bg-zinc-900/10 border border-dashed border-gray-250 dark:border-zinc-800 rounded-lg flex flex-col items-center justify-center space-y-3">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">No reviews yet</h4>
                    <p className="text-sm text-gray-500 max-w-xs mt-1">Be the first to share your experience with this beautiful bundle!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {reviews.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="bg-gray-50/50 dark:bg-zinc-900/30 p-5 rounded-lg border border-gray-150 dark:border-zinc-800 flex flex-col space-y-2 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-gray-950 dark:text-white">{rev.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(rev.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex text-[#D4AF37]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${rev.rating > i ? 'fill-current' : 'text-gray-300 dark:text-zinc-700'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-350 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-200 dark:border-zinc-800 pt-16">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {relatedProducts.map((p) => (
                <Link href={`/products/${p.id}`} key={p.id} className="group">
                  <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-zinc-800">
                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-200">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors truncate">
                        {p.name}
                      </h3>
                      <p className="text-primary font-bold">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

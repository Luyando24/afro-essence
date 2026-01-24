import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, Share2 } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Find related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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
            <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnails (Mockup since we only have one image per product) */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`aspect-square relative rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-900 cursor-pointer ${i === 0 ? 'ring-2 ring-primary' : 'hover:opacity-75'}`}>
                  <Image
                    src={product.image}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
              {product.name}
            </h1>
            
            <div className="mt-3 flex items-center justify-between">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-primary font-medium tracking-tight">
                ${product.price}
              </p>
              
              <div className="flex items-center space-x-4">
                 <button className="text-gray-400 hover:text-red-500 transition-colors">
                   <Heart className="h-6 w-6" />
                 </button>
                 <button className="text-gray-400 hover:text-primary transition-colors">
                   <Share2 className="h-6 w-6" />
                 </button>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-5 w-5 flex-shrink-0 ${
                        product.rating > rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
                <a href="#reviews" className="ml-3 text-sm font-medium text-primary hover:text-secondary">
                  {product.reviews} reviews
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 dark:text-gray-300 space-y-6">
                <p>{product.description}</p>
                <p>
                  Experience the luxury of Afro Essence. Our extensions are carefully processed to ensure 
                  the cuticles are aligned, minimizing tangling and shedding. Treat it like your own hair!
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 dark:border-zinc-800 pt-8">
               {/* Options (Mockup) */}
               <div className="mb-6">
                 <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Length</h4>
                 <div className="flex flex-wrap gap-3">
                   {['12"', '14"', '16"', '18"', '20"', '22"', '24"'].map((length) => (
                     <button
                       key={length}
                       className="px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-800"
                     >
                       {length}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="flex items-center space-x-4 mb-8">
                 <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-md">
                    <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 font-medium">-</button>
                    <span className="px-4 py-2 text-gray-900 dark:text-white font-medium border-l border-r border-gray-300 dark:border-zinc-700">1</span>
                    <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 font-medium">+</button>
                 </div>
                 <button className="flex-1 bg-primary border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-white hover:text-primary hover:border-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                   Add to Cart
                 </button>
               </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
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
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-200 dark:border-zinc-800 pt-16">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {relatedProducts.map((p) => (
                <Link href={`/products/${p.id}`} key={p.id} className="group">
                  <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-200">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg font-medium text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-primary font-semibold">${p.price}</p>
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

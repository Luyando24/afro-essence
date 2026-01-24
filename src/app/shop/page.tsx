import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { Star } from "lucide-react";

export default function ShopPage() {
  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">Shop All</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Explore our complete collection of premium hair extensions.
          </p>
        </div>

        {/* Filters & Sort (Mockup) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
            <select className="text-sm border-gray-300 dark:border-zinc-700 rounded-md bg-transparent focus:ring-primary focus:border-primary">
              <option>All Categories</option>
              <option>Bundles</option>
              <option>Wigs</option>
              <option>Clip-ins</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <select className="text-sm border-gray-300 dark:border-zinc-700 rounded-md bg-transparent focus:ring-primary focus:border-primary">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
          {products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group">
              <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white py-2 rounded shadow-lg font-medium hover:bg-primary hover:text-white transition-colors">
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-sm text-primary mb-1">{product.category}</p>
                  <h3 className="font-serif text-lg font-medium text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex justify-between items-center pt-2">
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">
                      ${product.price}
                    </span>
                    <div className="flex items-center text-yellow-500 text-sm">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-gray-500 dark:text-gray-400">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

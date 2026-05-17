import Image from "next/image";
import Link from "next/link";
import { products as fallbackProducts } from "@/data/products";
import { ArrowRight, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  // Fetch products from Supabase
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  const activeProducts = dbProducts && dbProducts.length > 0 ? dbProducts : fallbackProducts;
  const featuredProducts = activeProducts.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-secondary text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
              Embrace Your <span className="text-primary">Natural Essence</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
              Discover premium hair extensions designed to celebrate the beauty of Afro-textured hair. 
              Classy, sophisticated, and authentically you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-primary transition-colors duration-300 inline-flex items-center"
              >
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-secondary transition-colors duration-300"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Image/Element (Optional) */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2">
           {/* Placeholder for Hero Image - using a product image for now if no specific hero asset */}
           <Image
             src={activeProducts[0]?.image || fallbackProducts[0].image}
             alt="Model with beautiful hair"
             fill
             className="object-cover"
             priority
           />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary dark:text-primary mb-6">
              Redefining Afro-Textured Beauty
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              At Afro Essence, we believe that your hair is your crown. Our mission is to provide 
              high-quality, ethically sourced hair extensions that perfectly match your unique texture. 
              Whether you're looking for length, volume, or a protective style, we have something special for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">100% Virgin Human Hair that lasts.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-serif">4C</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Texture Match</h3>
              <p className="text-gray-600 dark:text-gray-400">Designed to blend seamlessly with your natural hair.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Ethically Sourced</h3>
              <p className="text-gray-600 dark:text-gray-400">We care about where our hair comes from.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary dark:text-primary mb-2">
                Featured Collection
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Our most loved styles, curated just for you.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center text-primary font-medium hover:text-secondary transition-colors">
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
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
                  <div className="p-4">
                    <p className="text-sm text-primary mb-1">{product.category}</p>
                    <h3 className="font-serif text-lg font-medium text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
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
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/shop" className="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors">
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
           <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Join the Afro Essence Family</h2>
           <p className="text-lg text-gray-300 mb-8">
             Be the first to know about new drops, exclusive sales, and hair care tips.
           </p>
           <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
             <input
               type="email"
               placeholder="Enter your email address"
               className="flex-1 px-6 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
             />
             <button className="px-8 py-3 bg-primary text-white font-bold rounded-md hover:bg-white hover:text-primary transition-colors duration-300">
               Subscribe
             </button>
           </form>
         </div>
      </section>
    </div>
  );
}

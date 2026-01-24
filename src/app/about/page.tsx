import Image from "next/image";
import { products } from "@/data/products";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Story</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-200">
            Founded with a passion for celebrating natural beauty and providing the highest quality hair extensions for women of color.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
               <Image
                 src={products[1].image} // Using a product image as a placeholder for founder/brand image
                 alt="Afro Essence Founder"
                 fill
                 className="object-cover"
               />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-secondary dark:text-primary">The Afro Essence Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Afro Essence was born out of a need for premium, authentic hair extensions that cater specifically to Afro-textured hair. We noticed a gap in the market for textures that seamlessly blend with 3B to 4C hair types, and we set out to fill it.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our mission is simple: to empower women to embrace their versatility. Whether you want to add volume to your natural twist-out or rock a sleek protective style, we provide the canvas for your masterpiece.
              </p>
              <div className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-secondary dark:text-white">Why Choose Us?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">✓</span>
                    <span className="text-gray-600 dark:text-gray-300">100% Ethically Sourced Virgin Human Hair</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">✓</span>
                    <span className="text-gray-600 dark:text-gray-300">Textures matched to natural hair patterns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-0.5">✓</span>
                    <span className="text-gray-600 dark:text-gray-300">Rigorous quality control for longevity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-secondary dark:text-primary mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Authenticity</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We stay true to our roots and celebrate the authentic beauty of our community.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We never compromise on quality. Our customers deserve the absolute best.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Empowerment</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We aim to uplift and inspire confidence through our products and platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

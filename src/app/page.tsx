import Image from "next/image";
import Link from "next/link";
import { products as fallbackProducts } from "@/data/products";
import { ArrowRight, Star, Sparkles, Shield, Truck, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import PriceDisplay from "@/components/PriceDisplay";
import NewsletterForm from "@/components/NewsletterForm";
import MarqueeBanner from "@/components/MarqueeBanner";

export default async function Home() {
  let dbProducts = null;
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) {
      dbProducts = data;
    }
  } catch (err) {
    console.warn("Could not query Supabase products table during pre-rendering, falling back to local dataset.", err);
  }

  const activeProducts = dbProducts !== null ? dbProducts : fallbackProducts;
  const retailProducts = activeProducts.filter((p: any) => !p.is_wholesale);
  const wholesaleProducts = activeProducts.filter((p: any) => p.is_wholesale).slice(0, 4);
  const featuredProducts = retailProducts.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FAFAF8" }}>
      
      {/* ── Hero Section ── */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: "88vh" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full z-0"
          style={{ objectFit: "cover", objectPosition: "center center" }}
        >
          <source src="/newhero.mp4" type="video/mp4" />
        </video>

        {/* Rich overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Hero Content */}
        <div
          className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
          style={{ minHeight: "88vh" }}
        >
          <div className="max-w-4xl space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <span
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full border"
                style={{ borderColor: "rgba(201,168,76,0.5)", color: "#C9A84C", backgroundColor: "rgba(201,168,76,0.08)" }}
              >
                <Sparkles className="h-3 w-3" /> Premium Afro-Textured Extensions
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif font-bold leading-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
              Your Crown,{" "}
              <span style={{ color: "#C9A84C" }}>Elevated.</span>
            </h1>

            <p className="text-lg md:text-xl font-light max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.8" }}>
              Discover premium Kanekalon extensions perfectly matched to 3B–4C hair textures. 
              Ethically sourced. Beautifully crafted.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-10 py-4 font-bold text-sm rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: "#C9A84C", color: "#000" }}
              >
                Shop Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-10 py-4 font-semibold text-sm rounded-full border transition-all duration-300 hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
              >
                Our Story
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-8 pt-4">
              {[
                { value: "10K+", label: "Happy Customers" },
                { value: "4.9★", label: "Average Rating" },
                { value: "100%", label: "Kanekalon" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold font-serif" style={{ color: "#C9A84C" }}>{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <div
            className="w-[1px] h-12 animate-pulse"
            style={{ backgroundColor: "rgba(201,168,76,0.5)" }}
          />
        </div>
      </section>

      {/* ── Marquee Ticker ── */}
      <MarqueeBanner />

      {/* ── Value Props ── */}
      <section className="py-20" style={{ backgroundColor: "#fff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#C9A84C" }}>
              Why Afro Essence
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-5" style={{ color: "#1A1A1A" }}>
              Redefining Afro-Textured Beauty
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "#666" }}>
              At Afro Essence, we believe that your hair is your crown. Every product is curated 
              to celebrate your unique texture and empower your style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="h-6 w-6" />,
                title: "Premium Quality",
                desc: "100% Kanekalon fibers that look, feel, and move like natural hair. Built to last.",
              },
              {
                icon: (
                  <span className="text-2xl font-serif font-black">4C</span>
                ),
                title: "Texture Match",
                desc: "Engineered to blend seamlessly with 3B to 4C curl patterns. Zero blending drama.",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Ethically Sourced",
                desc: "Responsible sourcing, transparent supply chain, and commitment to our community.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{ borderColor: "#E8E2D9", backgroundColor: "#FAFAF8" }}
              >
                {/* Gold accent top bar */}
                <div
                  className="absolute top-0 left-8 right-8 h-[2px] rounded-full transition-all duration-300 group-hover:left-4 group-hover:right-4"
                  style={{ backgroundColor: "#C9A84C" }}
                />
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: "rgba(201,168,76,0.1)", color: "#C9A84C" }}
                >
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold mb-3" style={{ color: "#1A1A1A" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#777" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Collection ── */}
      <section className="py-20" style={{ backgroundColor: "#F5F2EE" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#C9A84C" }}>
                Handpicked For You
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mt-2" style={{ color: "#1A1A1A" }}>
                Featured Collection
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#888" }}>
                Our most loved styles, curated just for you.
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold pb-1 border-b transition-all hover:gap-3"
              style={{ color: "#4B3621", borderColor: "#C9A84C" }}
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  style={{ backgroundColor: "#fff", border: "1px solid #E8E2D9" }}
                >
                  <div className="aspect-[4/5] relative overflow-hidden" style={{ backgroundColor: "#F0EBE4" }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                      style={{ transition: "transform 0.7s ease" }}
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <button
                        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                        style={{ backgroundColor: "rgba(0,0,0,0.85)", color: "#C9A84C", backdropFilter: "blur(8px)" }}
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: "#C9A84C" }}>
                      {product.category}
                    </p>
                    <h3
                      className="font-serif text-base font-semibold mb-3 group-hover:text-[#C9A84C] transition-colors line-clamp-1"
                      style={{ color: "#1A1A1A" }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <PriceDisplay
                        amount={product.price}
                        className="font-bold text-base"
                        style={{ color: "#1A1A1A" }}
                      />
                      <div className="flex items-center gap-1" style={{ color: "#C9A84C" }}>
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-xs font-semibold" style={{ color: "#888" }}>
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold pb-1 border-b"
              style={{ color: "#4B3621", borderColor: "#C9A84C" }}
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Banner / Lifestyle strip ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4B3621 0%, #2D2010 60%, #1A0F06 100%)",
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "#C9A84C" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: "#C9A84C" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#C9A84C" }}>
                Who We Are
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
                Born from a Love for{" "}
                <span style={{ color: "#C9A84C" }}>Natural Beauty</span>
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                Afro Essence was created to fill a gap — premium extensions that truly match Afro-textured hair. 
                Every bundle is our promise to empower your versatility.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-3.5 font-bold text-sm rounded-full border transition-all hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:text-black"
                  style={{ borderColor: "rgba(201,168,76,0.5)", color: "#C9A84C" }}
                >
                  Read Our Story <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/wholesale"
                  className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-sm rounded-full border transition-all hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  Wholesale Deals
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Years in Business", value: "5+" },
                { label: "Hair Textures", value: "30+" },
                { label: "Countries Shipped", value: "12+" },
                { label: "Satisfied Clients", value: "10K+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl border text-center"
                  style={{ borderColor: "rgba(201,168,76,0.2)", backgroundColor: "rgba(201,168,76,0.05)" }}
                >
                  <div className="font-serif text-3xl font-bold mb-2" style={{ color: "#C9A84C" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Wholesale Section ── */}
      {wholesaleProducts.length > 0 && (
        <section className="py-20" style={{ backgroundColor: "#fff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#C9A84C" }}>
                  Bulk Purchases
                </span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold mt-2" style={{ color: "#1A1A1A" }}>
                  Wholesale Opportunities
                </h2>
                <p className="mt-2 text-sm" style={{ color: "#888" }}>
                  Premium bundles at special MOQ prices.
                </p>
              </div>
              <Link
                href="/wholesale"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold pb-1 border-b transition-all hover:gap-3"
                style={{ color: "#4B3621", borderColor: "#C9A84C" }}
              >
                View Catalog <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {wholesaleProducts.map((product) => {
                const wholesalePrice = product.moq_price || product.price;
                return (
                  <Link href={`/products/${product.id}`} key={product.id} className="group">
                    <div
                      className="rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      style={{ backgroundColor: "#FAFAF8", border: "1px solid #E8E2D9" }}
                    >
                      <div className="aspect-[4/5] relative overflow-hidden" style={{ backgroundColor: "#F0EBE4" }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div
                          className="absolute top-3 left-3 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider"
                          style={{ backgroundColor: "rgba(0,0,0,0.85)", color: "#C9A84C" }}
                        >
                          MOQ: {product.moq_quantity || 10} Units
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: "#C9A84C" }}>
                          {product.category}
                        </p>
                        <h3
                          className="font-serif text-sm font-bold mb-3 group-hover:text-[#C9A84C] transition-colors line-clamp-1"
                          style={{ color: "#1A1A1A" }}
                        >
                          {product.name}
                        </h3>
                        <div
                          className="mt-auto pt-3 border-t flex justify-between items-baseline"
                          style={{ borderColor: "#E8E2D9" }}
                        >
                          <span className="text-xs" style={{ color: "#999" }}>Wholesale</span>
                          <PriceDisplay
                            amount={wholesalePrice}
                            className="font-extrabold text-base"
                            style={{ color: "#C9A84C" }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Trust Badges ── */}
      <section className="py-12 border-y" style={{ backgroundColor: "#F5F2EE", borderColor: "#E8E2D9" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Truck className="h-6 w-6" />, label: "Fast Shipping" },
              { icon: <Shield className="h-6 w-6" />, label: "30-Day Returns" },
              { icon: <Award className="h-6 w-6" />, label: "Premium Quality" },
              { icon: <Star className="h-6 w-6 fill-current" />, label: "4.9★ Rated" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(201,168,76,0.12)", color: "#C9A84C" }}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#4B3621" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4B3621 0%, #2D2010 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10 space-y-6">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border" style={{ color: "#C9A84C", borderColor: "rgba(201,168,76,0.3)" }}>
            Exclusive Access
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
            Join the Afro Essence Family
          </h2>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            Be the first to know about new drops, exclusive sales, and hair care tips.
          </p>
          <div className="pt-4">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}

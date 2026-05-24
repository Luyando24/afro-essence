import Image from "next/image";
import { CheckCircle, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh" }}>
      
      {/* Hero */}
      <section
        className="relative py-28 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4B3621 0%, #2D2010 60%, #1A0F06 100%)",
        }}
      >
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: "#C9A84C" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full border mb-6" style={{ borderColor: "rgba(201,168,76,0.3)", color: "#C9A84C" }}>
            <Sparkles className="h-3 w-3" /> Our Journey
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
            Our Story
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
            Founded with a passion for celebrating natural beauty and providing the highest quality 
            hair extensions for women of color.
          </p>
        </div>
      </section>

      {/* Mission Content */}
      <section className="py-24" style={{ backgroundColor: "#fff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-3xl overflow-hidden">
                <Image
                  src="/story.png"
                  alt="Afro Essence Founder"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating accent */}
              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-3xl border-4 z-10"
                style={{ borderColor: "#C9A84C", backgroundColor: "#fff" }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="font-serif text-3xl font-bold" style={{ color: "#C9A84C" }}>4C</span>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#4B3621" }}>Match</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#C9A84C" }}>
                  Our Mission
                </span>
                <h2 className="font-serif text-4xl font-bold mt-3 mb-6" style={{ color: "#1A1A1A" }}>
                  The Afro Essence Mission
                </h2>
              </div>

              <p className="text-base leading-relaxed" style={{ color: "#666" }}>
                Afro Essence was born out of a need for premium, authentic hair extensions that cater 
                specifically to Afro-textured hair. We noticed a gap in the market for textures that 
                seamlessly blend with 3B to 4C hair types, and we set out to fill it.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "#666" }}>
                Our mission is simple: to empower women to embrace their versatility. Whether you want 
                to add volume to your natural twist-out or rock a sleek protective style, we provide 
                the canvas for your masterpiece.
              </p>

              <div className="space-y-4 pt-4">
                <h3 className="font-serif text-xl font-bold" style={{ color: "#1A1A1A" }}>Why Choose Us?</h3>
                {[
                  "100% Ethically Sourced Kanekalon",
                  "Textures matched to natural hair patterns",
                  "Rigorous quality control for longevity",
                  "Globally trusted by 10,000+ customers",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(201,168,76,0.12)" }}
                    >
                      <CheckCircle className="h-4 w-4" style={{ color: "#C9A84C" }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#555" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24" style={{ backgroundColor: "#F5F2EE" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#C9A84C" }}>
            What We Stand For
          </span>
          <h2 className="font-serif text-4xl font-bold mt-3 mb-16" style={{ color: "#1A1A1A" }}>
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: "✨",
                title: "Authenticity",
                desc: "We stay true to our roots and celebrate the authentic beauty of our community. No compromises.",
              },
              {
                emoji: "🏆",
                title: "Quality",
                desc: "We never compromise on quality. Our customers deserve the absolute best in every strand.",
              },
              {
                emoji: "💪",
                title: "Empowerment",
                desc: "We aim to uplift and inspire confidence through our products and platform. Every day.",
              },
            ].map((val, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ backgroundColor: "#fff", borderColor: "#E8E2D9" }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl"
                  style={{ backgroundColor: "rgba(201,168,76,0.1)" }}
                >
                  {val.emoji}
                </div>
                <h3 className="font-serif text-xl font-bold mb-4" style={{ color: "#1A1A1A" }}>
                  {val.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#777" }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 text-center"
        style={{
          background: "linear-gradient(135deg, #4B3621 0%, #2D2010 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <Heart className="h-8 w-8 mx-auto" style={{ color: "#C9A84C" }} />
          <h2 className="font-serif text-3xl font-bold text-white">
            Ready to Crown Yourself?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)" }}>
            Discover our collection and find the perfect match for your unique texture.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 font-bold text-sm rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: "#C9A84C", color: "#000" }}
          >
            Shop the Collection
          </a>
        </div>
      </section>
    </div>
  );
}

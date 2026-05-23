const items = [
  { label: "Virgin Hair Extensions", icon: "✦" },
  { label: "4C Texture Match", icon: "✦" },
  { label: "Kinky Curly Bundles", icon: "✦" },
  { label: "HD Lace Wigs", icon: "✦" },
  { label: "Clip-In Extensions", icon: "✦" },
  { label: "Afro Twist Braids", icon: "✦" },
  { label: "Free Shipping $200+", icon: "✦" },
  { label: "Ethically Sourced", icon: "✦" },
  { label: "30-Day Returns", icon: "✦" },
  { label: "Premium Quality", icon: "✦" },
  { label: "French Curls", icon: "✦" },
  { label: "Pre-Stretched", icon: "✦" },
  { label: "Afro Essence Kinky Braids", icon: "✦" },
  { label: "Single Braids Extension", icon: "✦" },
  { label: "Hair Bonnets", icon: "✦" },
  { label: "Hair Bands", icon: "✦" },
  { label: "Scarfs", icon: "✦" },
];

export default function MarqueeBanner() {
  // Duplicate for seamless infinite loop
  const doubled = [...items, ...items];

  return (
    <div className="relative bg-[#121212] border-y border-[#D4AF37]/20 py-3.5 overflow-hidden">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #121212, transparent)" }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #121212, transparent)" }} />

      <div
        className="flex gap-0 whitespace-nowrap"
        style={{
          animation: "marquee 30s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6">
            <span className="text-[#D4AF37] text-[10px]">{item.icon}</span>
            <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
              {item.label}
            </span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

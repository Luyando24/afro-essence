import { supabase } from "@/lib/supabase";

const fallbackItems = [
  { label: "Virgin Hair Extensions", icon: "✦" },
  { label: "4C Texture Match", icon: "✦" },
  { label: "Kinky Curly Bundles", icon: "✦" },
  { label: "HD Lace Wigs", icon: "✦" },
  { label: "Clip-In Extensions", icon: "✦" },
  { label: "Afro Twist Braids", icon: "✦" },
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

export default async function MarqueeBanner() {
  let items = fallbackItems;

  try {
    const { data, error } = await supabase
      .from("marquee_items")
      .select("label, icon")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      items = data;
    }
  } catch (err) {
    console.error("Failed to fetch marquee items:", err);
  }

  // Duplicate for seamless infinite loop
  const doubled = [...items, ...items];

  return (
    <div
      className="relative py-3.5 overflow-hidden border-y"
      style={{
        backgroundColor: "#0A0A0A",
        borderColor: "rgba(201,168,76,0.25)",
      }}
    >
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #0A0A0A, transparent)" }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #0A0A0A, transparent)" }}
      />

      <div
        className="flex gap-0 whitespace-nowrap"
        style={{
          animation: "marquee 35s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6">
            <span className="text-[10px]" style={{ color: "#C9A84C" }}>{item.icon}</span>
            <span
              className="text-xs font-semibold tracking-[0.15em] uppercase"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
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

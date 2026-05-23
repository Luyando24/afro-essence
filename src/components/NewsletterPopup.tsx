"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Mail, Sparkles, CheckCircle, Loader2, ArrowRight } from "lucide-react";

const DISMISSED_KEY = "ae_newsletter_dismissed";
const SUBSCRIBED_KEY = "ae_newsletter_subscribed";
const DELAY_MS = 5000; // show after 5 seconds

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    const subscribed = localStorage.getItem(SUBSCRIBED_KEY);
    if (dismissed || subscribed) return;

    const timer = setTimeout(() => {
      setVisible(true);
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(DISMISSED_KEY, "1");
    }, 350);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          setStatus("duplicate");
          localStorage.setItem(SUBSCRIBED_KEY, "1");
        } else {
          throw error;
        }
      } else {
        setStatus("success");
        localStorage.setItem(SUBSCRIBED_KEY, "1");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-350"
        style={{ opacity: animateIn ? 1 : 0 }}
      />

      {/* Modal */}
      <div
        className="fixed z-[100] inset-0 flex items-end sm:items-center justify-center px-4 sm:px-0 pointer-events-none"
      >
        <div
          className="relative w-full max-w-lg bg-[#121212] rounded-2xl overflow-hidden shadow-2xl pointer-events-auto transition-all duration-350"
          style={{
            transform: animateIn ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
            opacity: animateIn ? 1 : 0,
          }}
        >
          {/* Gold top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#f5d98c] to-[#D4AF37]" />

          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 z-10 p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col sm:flex-row min-h-[340px]">

            {/* Left decorative panel */}
            <div
              className="hidden sm:flex flex-col items-center justify-center w-48 shrink-0 relative overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #1a1a1a 0%, #2a2010 60%, #1a1a1a 100%)",
              }}
            >
              {/* Gold ring decoration */}
              <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full border border-[#D4AF37]/20" />
              <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full border border-[#D4AF37]/15" />
              <div className="relative flex flex-col items-center gap-3 px-4 text-center">
                <div className="h-14 w-14 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <p className="text-[#D4AF37] font-serif text-sm font-bold leading-snug">
                  Exclusive Offers Await
                </p>
                <p className="text-gray-500 text-[10px] leading-relaxed">
                  New drops & member-only deals
                </p>
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 p-7 flex flex-col justify-center">

              {status === "success" || status === "duplicate" ? (
                /* Success State */
                <div className="flex flex-col items-center text-center gap-4 py-4 animate-in fade-in duration-300">
                  <div className="h-16 w-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-white font-serif text-xl font-bold mb-1">
                      {status === "duplicate" ? "Already subscribed!" : "Welcome to the family!"}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {status === "duplicate"
                        ? "You're already on our list. We'll keep you updated!"
                        : "You'll be the first to know about exclusive offers and new collections."}
                    </p>
                  </div>
                  <button
                    onClick={dismiss}
                    className="mt-2 px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-sm rounded-lg hover:bg-[#f0cc5c] transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                /* Subscription Form */
                <>
                  {/* Mobile sparkle icon */}
                  <div className="sm:hidden mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">Exclusive Offers</span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-white mb-2 leading-tight">
                    Join the <span className="text-[#D4AF37]">Afro Essence</span> Family
                  </h2>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Be the first to know about new drops, exclusive sales, and hair care tips. No spam, ever.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        disabled={status === "loading"}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all disabled:opacity-50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3 bg-[#D4AF37] text-black font-bold text-sm rounded-xl hover:bg-[#f0cc5c] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-[#D4AF37]/20"
                    >
                      {status === "loading" ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</>
                      ) : (
                        <>Subscribe Now <ArrowRight className="h-4 w-4" /></>
                      )}
                    </button>

                    {status === "error" && (
                      <p className="text-red-400 text-xs text-center">{errorMsg}</p>
                    )}

                    <p className="text-gray-600 text-[11px] text-center">
                      No spam. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
        // Postgres unique violation code
        if (error.code === "23505") {
          setStatus("duplicate");
        } else {
          throw error;
        }
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch (err: any) {
      console.error("Newsletter subscription error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-4 animate-in fade-in duration-300">
        <div className="h-14 w-14 bg-primary/20 rounded-full flex items-center justify-center">
          <CheckCircle className="h-7 w-7 text-primary" />
        </div>
        <p className="text-white font-semibold text-lg">You&apos;re in! Welcome to the family 🎉</p>
        <p className="text-gray-300 text-sm">Expect exclusive offers and new drops straight to your inbox.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          disabled={status === "loading"}
          className="w-full pl-11 pr-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="px-8 py-3 font-bold rounded-xl transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap hover:opacity-90 hover:shadow-lg"
        style={{ backgroundColor: "#C9A84C", color: "#000" }}
      >
        {status === "loading" ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</>
        ) : (
          "Subscribe"
        )}
      </button>

      {(status === "duplicate" || status === "error") && (
        <p className="w-full text-center text-sm font-medium text-amber-300 mt-2 sm:absolute sm:bottom-[-28px] sm:left-0">
          {status === "duplicate"
            ? "✓ You're already subscribed — we'll keep you posted!"
            : errorMsg}
        </p>
      )}
    </form>
  );
}

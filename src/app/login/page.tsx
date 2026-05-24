"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, Sparkles, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/shop";

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      setLoading(true);
      setMessage("");
      setIsSuccess(false);

      if (isRegistering) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });

        if (error) throw error;

        if (data?.user && data.session === null) {
          setIsSuccess(true);
          setMessage("Crown Created! Please check your email to verify your account.");
        } else if (data?.user) {
          setIsSuccess(true);
          setMessage("Welcome! Your account has been created successfully.");
          const finalRedirect = email.trim().toLowerCase().includes('admin') ? '/admin' : redirectTo;
          setTimeout(() => router.push(finalRedirect), 1500);
        }

      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        if (data?.user) {
          setIsSuccess(true);
          setMessage("Signed in successfully! Welcome back.");
          const finalRedirect = email.trim().toLowerCase().includes('admin') ? '/admin' : redirectTo;
          setTimeout(() => router.push(finalRedirect), 1500);
        }
      }
    } catch (err: any) {
      console.error("Auth action failed:", err);
      setMessage(err.message || "An authentication error occurred. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#FAFAF8", minHeight: "100vh" }} className="py-24 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full rounded-3xl border shadow-xl overflow-hidden relative" style={{ backgroundColor: "#fff", borderColor: "#E8E2D9" }}>
        
        {/* Gold accent top bar */}
        <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, transparent 0%, #C9A84C 30%, #E8C96A 50%, #C9A84C 70%, transparent 100%)" }} />
        
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold tracking-wider flex items-center justify-center gap-1.5" style={{ color: "#1A1A1A" }}>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" /> AFRO ESSENCE
            </h1>
            <p className="text-sm mt-2" style={{ color: "#888" }}>
              {isRegistering 
                ? "Join our club of luxurious natural crowns" 
                : "Welcome back! Access your orders and saved products"}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl" style={{ backgroundColor: "#F5F2EE" }}>
            <button
              onClick={() => {
                setIsRegistering(false);
                setMessage("");
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                !isRegistering
                  ? "bg-white shadow-sm"
                  : "hover:text-gray-700"
              }`}
              style={{ color: !isRegistering ? "#C9A84C" : "#999" }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsRegistering(true);
                setMessage("");
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                isRegistering
                  ? "bg-white shadow-sm"
                  : "hover:text-gray-700"
              }`}
              style={{ color: isRegistering ? "#C9A84C" : "#999" }}
            >
              Register
            </button>
          </div>

          {message && (
            <div 
              className={`p-3.5 border text-xs font-semibold rounded text-center leading-relaxed ${
                isSuccess 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#555" }}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-sm rounded-xl p-3 pl-10 outline-none transition-all border"
                  style={{ borderColor: "#E8E2D9", backgroundColor: "#FAFAF8", color: "#1A1A1A" }}
                  onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8E2D9")}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#555" }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm rounded-xl p-3 pl-10 outline-none transition-all border"
                  style={{ borderColor: "#E8E2D9", backgroundColor: "#FAFAF8", color: "#1A1A1A" }}
                  onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                  onBlur={(e) => (e.target.style.borderColor = "#E8E2D9")}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-1.5 transition-all hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: "#C9A84C", color: "#000" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isRegistering ? (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Continue as Guest Divider */}
          <div className="border-t border-gray-100 dark:border-zinc-800 pt-6 mt-6 flex flex-col items-center">
            <span className="text-xs text-gray-400 mb-3">Or continue as guest</span>
            <Link
              href={redirectTo}
              className="text-sm font-bold hover:underline inline-flex items-center"
              style={{ color: "#C9A84C" }}
            >
              Shop Without Login <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-40 bg-gray-50 dark:bg-zinc-950 min-h-screen">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

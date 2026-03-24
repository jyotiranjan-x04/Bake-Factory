"use client";

import { motion } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch(mode === "signup" ? "/api/auth/signup" : "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.get("fullName"),
        phoneNumber: formData.get("phoneNumber"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || (mode === "signup" ? "Signup failed" : "Login failed"));
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen bg-[color:var(--surface)]">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 overflow-hidden md:grid-cols-2"
      >
        <aside className="relative hidden md:block">
          <div className="absolute inset-0 bg-[color:var(--primary)]/20" />
          <Image
            alt="Artisanal bakery scene"
            src="/assets/stitch/images/stitch-008.png"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute bottom-12 left-12">
            <span className="font-display text-2xl italic text-white/90">Since 1984</span>
            <h2 className="font-display mt-2 text-4xl font-bold text-white">Handcrafted with flour & soul.</h2>
          </div>
        </aside>
        <section className="flex items-center justify-center bg-[color:var(--surface-low)] px-6 py-12">
          <div className="w-full max-w-md">
            <div className="clay-card p-8">
              <div className="mb-8 text-center md:text-left">
                <div className="mb-4">
                  <BackButton fallbackHref="/" />
                </div>
                <Link href="/" className="text-sm font-semibold text-[color:var(--primary)]">Demo Bakery</Link>
                <h1 className="font-display text-3xl font-bold text-[color:var(--primary)]">
                  {mode === "signup" ? "Create your bakery admin" : "Welcome Back"}
                </h1>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {mode === "signup"
                    ? "Create the first owner account to manage your bakery."
                    : "Enter your details to access your fresh batches."}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button type="button" className="clay-inset flex items-center justify-center gap-3 py-3 text-sm font-semibold">
                  Continue with Google
                </button>
                <button type="button" className="clay-inset flex items-center justify-center gap-3 py-3 text-sm font-semibold">
                  Continue with Apple
                </button>
              </div>

              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                <span className="h-px flex-1 bg-[color:var(--surface-highest)]" />
                Or email
                <span className="h-px flex-1 bg-[color:var(--surface-highest)]" />
              </div>

              {mode === "signup" ? (
                <div className="space-y-3">
                  <input name="fullName" placeholder="Full name" className="clay-input w-full px-4 py-3" required />
                  <input name="phoneNumber" placeholder="Phone number" className="clay-input w-full px-4 py-3" required />
                </div>
              ) : null}

              <div className="mt-3 space-y-3">
                <input name="email" type="email" placeholder="Email address" className="clay-input w-full px-4 py-3" required />
                <input name="password" type="password" placeholder="Password" className="clay-input w-full px-4 py-3" required />
                <div className="text-right">
                  <Link href="/track-order" className="text-xs font-semibold text-[color:var(--primary)]">Forgot password?</Link>
                </div>
              </div>

              {error ? <p className="feedback-error mt-3 text-sm">{error}</p> : null}

              <button className="mt-6 w-full rounded-xl bg-primary-gradient py-3 text-sm font-semibold text-white" type="submit" disabled={loading}>
                {loading ? (mode === "signup" ? "Creating account..." : "Signing in...") : mode === "signup" ? "Create owner account" : "Sign In"}
              </button>

              <p className="mt-6 text-center text-xs text-[color:var(--muted)]">
                {mode === "signup" ? "Already have an account?" : "New to the bakery?"}
                <button
                  type="button"
                  className="ml-2 font-semibold text-[color:var(--primary)]"
                  onClick={() => router.push(mode === "signup" ? "/login" : "/login?mode=signup")}
                >
                  {mode === "signup" ? "Login" : "Create an account"}
                </button>
              </p>
            </div>
            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
              © 2024 Demo Bakery. Crafted with flour and soul.
            </p>
          </div>
        </section>
      </motion.form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="section-wrap py-10 text-sm text-[color:var(--muted)]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

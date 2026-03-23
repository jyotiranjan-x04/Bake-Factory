"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Login failed");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <main className="section-wrap py-10">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="clay-card mx-auto grid max-w-4xl gap-6 overflow-hidden p-0 md:grid-cols-[1.1fr_1fr]"
      >
        <div className="hidden min-h-[380px] bg-[url('/assets/images/bakery/hero-1.jpg')] bg-cover bg-center md:block" />
        <div className="space-y-4 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Admin Access</p>
          <h1 className="font-display text-3xl font-bold">Demo Bakery Admin</h1>
          <p className="text-sm text-[color:var(--muted)]">Login to manage orders, products, content, and analytics.</p>

          <input name="email" type="email" placeholder="Owner email" className="clay-input w-full px-4 py-3" required />
          <input name="password" type="password" placeholder="Password" className="clay-input w-full px-4 py-3" required />

          {error ? <p className="feedback-error text-sm">{error}</p> : null}

          <button className="clay-button w-full px-5 py-3 font-semibold" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </motion.form>
    </main>
  );
}

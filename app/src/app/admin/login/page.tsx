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
        className="clay-card mx-auto max-w-xl space-y-4 p-6"
      >
        <h1 className="text-3xl font-bold">Bake Factory Admin</h1>
        <p className="text-sm text-[#5f4a3a]">Login to manage orders, products, content, and analytics.</p>

        <input name="email" type="email" placeholder="Owner email" className="clay-input w-full px-4 py-3" required />
        <input name="password" type="password" placeholder="Password" className="clay-input w-full px-4 py-3" required />

        {error ? <p className="feedback-error text-sm">{error}</p> : null}

        <button className="clay-button px-5 py-3 font-semibold" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </motion.form>
    </main>
  );
}

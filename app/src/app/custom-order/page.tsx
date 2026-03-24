"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BackButton } from "@/components/BackButton";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

export default function CustomOrderPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/public/custom-orders", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Failed to submit custom order");
      return;
    }

    setMessage(`Custom request submitted successfully. Track order: ${data.orderNumber}`);
    event.currentTarget.reset();
  };

  return (
    <main className="pb-10">
      <SiteHeader />
      <section className="section-wrap grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <div className="md:col-span-2">
          <BackButton fallbackHref="/" />
        </div>
        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="clay-card space-y-4 p-6"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Custom Studio</p>
            <h1 className="font-display text-3xl font-bold">Custom Cake Order</h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">Upload inspiration, describe your design, and receive a tailored quote.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input name="customerName" placeholder="Your name" className="clay-input w-full px-4 py-3" required />
            <input name="customerPhone" placeholder="WhatsApp number" className="clay-input w-full px-4 py-3" required />
            <input name="customerEmail" type="email" placeholder="Email (optional)" className="clay-input w-full px-4 py-3 sm:col-span-2" />
          </div>
          <textarea name="description" placeholder="Describe your custom cake design" rows={5} className="clay-input w-full px-4 py-3" required />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="budget" type="number" min={0} placeholder="Budget (optional)" className="clay-input w-full px-4 py-3" />
            <input name="image" type="file" accept="image/*" className="clay-input w-full px-4 py-3" required />
          </div>

          {error ? <p className="feedback-error text-sm">{error}</p> : null}
          {message ? <p className="feedback-success text-sm">{message}</p> : null}

          <button type="submit" className="clay-button px-5 py-3 font-semibold">
            Send Custom Request
          </button>
        </motion.form>

        <aside className="clay-card space-y-4 p-6">
          <h2 className="font-display text-xl font-bold">How it works</h2>
          <div className="space-y-3 text-sm text-[color:var(--muted)]">
            <p>1. Share inspiration and serving size.</p>
            <p>2. Our pastry chef confirms the quote.</p>
            <p>3. Approve the design and track your bake.</p>
          </div>
          <div className="clay-inset p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Tip</p>
            <p className="mt-2 text-sm">Add flavor preferences and any dietary notes for the best match.</p>
          </div>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}

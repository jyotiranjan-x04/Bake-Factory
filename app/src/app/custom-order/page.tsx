"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
      <section className="section-wrap">
        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="clay-card space-y-4 p-6"
        >
          <h1 className="text-3xl font-bold">Custom Cake Order</h1>
          <p className="text-sm text-[#5f4a3a]">Upload inspiration, describe your design, and receive a tailored quote.</p>

          <input name="customerName" placeholder="Your name" className="clay-input w-full px-4 py-3" required />
          <input name="customerPhone" placeholder="WhatsApp number" className="clay-input w-full px-4 py-3" required />
          <input name="customerEmail" type="email" placeholder="Email (optional)" className="clay-input w-full px-4 py-3" />
          <textarea name="description" placeholder="Describe your custom cake design" rows={5} className="clay-input w-full px-4 py-3" required />
          <input name="budget" type="number" min={0} placeholder="Budget (optional)" className="clay-input w-full px-4 py-3" />
          <input name="image" type="file" accept="image/*" className="clay-input w-full px-4 py-3" required />

          {error ? <p className="feedback-error text-sm">{error}</p> : null}
          {message ? <p className="feedback-success text-sm">{message}</p> : null}

          <button type="submit" className="clay-button px-5 py-3 font-semibold">
            Send Custom Request
          </button>
        </motion.form>
      </section>
      <SiteFooter />
    </main>
  );
}

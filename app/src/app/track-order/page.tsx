"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function TrackOrderLookupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const orderId = String(formData.get("orderId") || "").trim();

    if (!orderId) {
      setError("Order ID is required");
      return;
    }

    router.push(`/track-order/${orderId}`);
  };

  return (
    <main className="pb-10">
      <SiteHeader />
      <section className="section-wrap">
        <form onSubmit={submit} className="clay-card space-y-4 p-6">
          <h1 className="text-3xl font-bold">Track Your Order</h1>
          <input name="orderId" placeholder="Enter your order ID" className="clay-input w-full px-4 py-3" required />
          {error ? <p className="feedback-error text-sm">{error}</p> : null}
          <button type="submit" className="clay-button px-5 py-3 font-semibold">
            Track
          </button>
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}

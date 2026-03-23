"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/components/Providers";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const [error, setError] = useState<string | null>(null);

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Cart is empty");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/public/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: formData.get("customerName"),
        customerPhone: formData.get("customerPhone"),
        customerEmail: formData.get("customerEmail") || undefined,
        customerAddress: formData.get("customerAddress") || undefined,
        notes: formData.get("notes") || undefined,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not place order");
      return;
    }

    clear();
    router.push(`/track-order/${data.orderId}`);
  };

  return (
    <main className="pb-8 sm:pb-10">
      <SiteHeader />
      <section className="section-wrap grid gap-5 sm:gap-6 md:grid-cols-[1fr_360px]">
        <form onSubmit={placeOrder} className="clay-card space-y-4 p-5 sm:p-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
          <input name="customerName" placeholder="Full name" className="clay-input w-full px-4 py-3" required />
          <input name="customerPhone" placeholder="WhatsApp number" className="clay-input w-full px-4 py-3" required />
          <input name="customerEmail" type="email" placeholder="Email (optional)" className="clay-input w-full px-4 py-3" />
          <textarea name="customerAddress" rows={3} placeholder="Address" className="clay-input w-full px-4 py-3" />
          <textarea name="notes" rows={3} placeholder="Notes for bakery" className="clay-input w-full px-4 py-3" />
          {error ? <p className="feedback-error text-sm">{error}</p> : null}
          <button type="submit" className="clay-button px-5 py-3 font-semibold">Place Order</button>
        </form>

        <aside className="clay-card h-fit p-5 sm:p-6">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-[#d7c5af] pt-4 text-lg font-bold">Total: ₹{total}</div>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}

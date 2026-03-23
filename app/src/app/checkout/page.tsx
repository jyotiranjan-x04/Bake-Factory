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
  const [isGift, setIsGift] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const deliveryFee = total > 1500 ? 0 : 80;
  const taxAmount = Math.round(total * 0.05);
  const grandTotal = Math.max(0, total + deliveryFee + taxAmount);

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
      <section className="section-wrap space-y-4">
        <div className="clay-card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Checkout</p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Finalize your order</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--muted)]">
            <span className="status-chip px-3 py-1">Cart</span>
            <span className="status-chip-strong px-3 py-1">Details</span>
            <span className="status-chip px-3 py-1">Payment</span>
            <span className="status-chip px-3 py-1">Review</span>
          </div>
        </div>
      </section>

      <section className="section-wrap grid gap-5 sm:gap-6 md:grid-cols-[1fr_360px]">
        <form onSubmit={placeOrder} className="clay-card space-y-4 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="customerName" placeholder="Full name" className="clay-input w-full px-4 py-3" required />
            <input name="customerPhone" placeholder="WhatsApp number" className="clay-input w-full px-4 py-3" required />
            <input name="customerEmail" type="email" placeholder="Email (optional)" className="clay-input w-full px-4 py-3" />
            <input name="deliveryDate" type="date" className="clay-input w-full px-4 py-3" />
            <input name="deliverySlot" placeholder="Delivery time (e.g., 4-6 PM)" className="clay-input w-full px-4 py-3 sm:col-span-2" />
          </div>
          <textarea name="customerAddress" rows={3} placeholder="Delivery address" className="clay-input w-full px-4 py-3" />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isGift} onChange={(event) => setIsGift(event.target.checked)} />
            This is a gift
          </label>

          {isGift ? (
            <textarea name="notes" rows={2} placeholder="Gift message" className="clay-input w-full px-4 py-3" />
          ) : (
            <textarea name="notes" rows={2} placeholder="Notes for bakery" className="clay-input w-full px-4 py-3" />
          )}

          <div className="space-y-2">
            <p className="text-sm font-semibold text-[color:var(--foreground)]">Payment Method</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { value: "card", label: "Card" },
                { value: "upi", label: "UPI" },
                { value: "cod", label: "Cash" },
              ].map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={paymentMethod === option.value ? "clay-button px-3 py-2 text-xs" : "clay-inset px-3 py-2 text-xs"}
                  onClick={() => setPaymentMethod(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="feedback-error text-sm">{error}</p> : null}
          <button type="submit" className="clay-button px-5 py-3 font-semibold">Place Order</button>
        </form>

        <aside className="clay-card h-fit p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span></div>
            <div className="flex items-center justify-between"><span>Taxes</span><span>₹{taxAmount}</span></div>
          </div>
          <div className="mt-5 border-t border-[color:var(--line)] pt-4 text-lg font-bold">Total: ₹{grandTotal}</div>
          <p className="mt-3 text-xs text-[color:var(--muted)]">Secure payment · Freshly baked on demand</p>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}

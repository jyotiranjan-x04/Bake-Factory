"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { StitchTopNav } from "@/components/StitchTopNav";
import { BackButton } from "@/components/BackButton";
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
    <main className="pb-12">
      <StitchTopNav active="cakes" />
      <section className="section-wrap pt-8">
        <div className="mb-4">
          <BackButton fallbackHref="/cart" />
        </div>
        <div className="mx-auto mb-10 max-w-2xl overflow-x-auto">
          <div className="flex min-w-max items-center justify-between gap-6 px-1">
            {["Cart", "Details", "Payment", "Review"].map((step, index) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    index === 1 ? "bg-[color:var(--primary)] text-white" : "bg-[color:var(--surface-high)] text-[color:var(--muted)]"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${index === 1 ? "text-[color:var(--primary)]" : "text-[color:var(--muted)]"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap grid gap-10 lg:grid-cols-12">
        <form onSubmit={placeOrder} className="lg:col-span-8 space-y-8">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-3xl font-bold">Delivery Address</h2>
              <button type="button" className="text-sm font-semibold text-[color:var(--primary)]">Add New</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="clay-card p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Home</p>
                <p className="mt-2 text-sm font-semibold">{items[0]?.name ? "Demo Bakery Guest" : "Jane Doe"}</p>
                <p className="mt-2 text-xs text-[color:var(--muted)]">123 Bake Street, Demo City</p>
              </div>
              <div className="clay-card p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Office</p>
                <p className="mt-2 text-sm font-semibold">Demo Bakery HQ</p>
                <p className="mt-2 text-xs text-[color:var(--muted)]">456 Pastry Plaza, Suite 200</p>
              </div>
            </div>
          </section>

          <section className="clay-card p-6">
            <h2 className="font-display text-2xl font-bold">Preferred Delivery</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Select Date</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {["Oct 24", "Oct 25", "Oct 26"].map((date) => (
                    <button key={date} type="button" className="rounded-2xl bg-[color:var(--surface-card)] px-4 py-3 text-xs font-bold">
                      {date}
                    </button>
                  ))}
                </div>
                <input name="deliveryDate" type="date" className="clay-input mt-4 w-full px-4 py-3" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Select Time Slot</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    "08:00 - 10:00 AM",
                    "10:00 - 12:00 PM",
                    "02:00 - 04:00 PM",
                    "04:00 - 06:00 PM",
                  ].map((slot) => (
                    <button key={slot} type="button" className="rounded-full bg-[color:var(--surface-card)] px-3 py-2 text-xs font-semibold">
                      {slot}
                    </button>
                  ))}
                </div>
                <input name="deliverySlot" placeholder="Preferred delivery slot" className="clay-input mt-4 w-full px-4 py-3" />
              </div>
            </div>
          </section>

          <section className="clay-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[color:var(--primary)]">featured_seasonal_and_gifts</span>
                <h2 className="font-display text-2xl font-bold">Gift Message</h2>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[color:var(--muted)]">
                <input type="checkbox" checked={isGift} onChange={(event) => setIsGift(event.target.checked)} />
                This is a gift
              </label>
            </div>
            <textarea
              name="notes"
              rows={3}
              placeholder={isGift ? "Write a thoughtful note to include with your treats..." : "Notes for bakery"}
              className="clay-input w-full px-4 py-3"
            />
          </section>

          <section className="clay-card p-6">
            <h2 className="font-display text-2xl font-bold">Contact Information</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input name="customerName" placeholder="Full name" className="clay-input w-full px-4 py-3" required />
              <input name="customerPhone" placeholder="Phone number" className="clay-input w-full px-4 py-3" required />
              <input name="customerEmail" type="email" placeholder="Email (optional)" className="clay-input w-full px-4 py-3" />
              <input name="customerAddress" placeholder="Delivery address" className="clay-input w-full px-4 py-3" />
            </div>
          </section>

          <section className="clay-card p-6">
            <p className="text-sm font-semibold">Payment Method</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
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
            {error ? <p className="feedback-error mt-4 text-sm">{error}</p> : null}
            <button type="submit" className="clay-button mt-6 px-6 py-4 text-sm font-semibold">
              Complete Purchase
            </button>
          </section>
        </form>

        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="clay-card overflow-hidden">
            <div className="border-b border-[color:var(--surface-high)] p-6">
              <h3 className="font-display text-xl font-bold">Order Summary</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span></div>
                <div className="flex justify-between"><span>Taxes</span><span>₹{taxAmount}</span></div>
              </div>
              <div className="mt-6 border-t border-[color:var(--surface-high)] pt-4 text-lg font-bold">Total: ₹{grandTotal}</div>
              <p className="mt-4 text-xs text-[color:var(--muted)]">Secure payment · Freshly baked on demand</p>
            </div>
          </div>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}

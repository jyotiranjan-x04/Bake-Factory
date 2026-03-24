"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { StitchTopNav } from "@/components/StitchTopNav";
import { BackButton } from "@/components/BackButton";
import { useCart } from "@/components/Providers";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);
  const deliveryFee = total > 1500 ? 0 : 80;
  const taxAmount = Math.round(total * 0.05);
  const discountAmount = Math.round(total * (promoDiscountPercent / 100));
  const grandTotal = Math.max(0, total + deliveryFee + taxAmount - discountAmount);

  return (
    <main className="pb-12">
      <StitchTopNav active="cakes" />
      <section className="section-wrap pt-10">
        <header className="mb-10">
          <BackButton fallbackHref="/catalog" />
          <h1 className="font-display text-4xl font-bold">Your Basket</h1>
          <p className="text-sm text-[color:var(--muted)]">Review your hand-picked artisanal selections.</p>
        </header>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-5">
            {items.length === 0 ? (
              <div className="clay-card p-6 text-sm text-[color:var(--muted)]">
                Your cart is empty. Explore the catalog to add cakes.
                <div className="mt-3 flex gap-3">
                  <Link href="/catalog" className="clay-button px-4 py-2 text-xs font-semibold">Browse Catalog</Link>
                  <Link href="/" className="clay-inset px-4 py-2 text-xs font-semibold">Back Home</Link>
                </div>
              </div>
            ) : null}
            {items.map((item) => (
              <article key={item.productId} className="clay-card flex flex-col gap-6 p-6 md:flex-row">
                <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-[color:var(--surface-low)]">
                  <Image
                    src={item.imageUrl || "/assets/stitch/images/stitch-007.png"}
                    alt={item.name}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-bold sm:text-xl">{item.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Freshly baked</p>
                    </div>
                    <span className="text-lg font-bold text-[color:var(--primary)] sm:text-xl">₹{item.price}</span>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-full bg-[color:var(--surface-low)] px-2 py-1">
                      <button className="rounded-full p-2 text-[color:var(--primary)]" onClick={() => updateQty(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <span className="material-symbols-outlined text-base">remove</span>
                      </button>
                      <span className="px-4 font-bold">{item.quantity}</span>
                      <button className="rounded-full p-2 text-[color:var(--primary)]" onClick={() => updateQty(item.productId, item.quantity + 1)}>
                        <span className="material-symbols-outlined text-base">add</span>
                      </button>
                    </div>
                    <button className="rounded-full p-2 text-[color:var(--muted)]" onClick={() => removeItem(item.productId)}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
            <div className="clay-card p-6">
              <h2 className="font-display text-2xl font-bold">Order Summary</h2>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-[color:var(--muted)]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[color:var(--foreground)]">₹{total}</span>
                </div>
                <div className="flex justify-between text-[color:var(--muted)]">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[color:var(--foreground)]">{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-[color:var(--muted)]">
                  <span>Taxes</span>
                  <span className="font-bold text-[color:var(--foreground)]">₹{taxAmount}</span>
                </div>
                {discountAmount > 0 ? (
                  <div className="flex justify-between text-[color:var(--primary)]">
                    <span>Promo discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                ) : null}
                <div className="border-t border-[color:var(--surface-highest)] pt-4">
                  <div className="flex justify-between">
                    <span className="font-display text-lg font-bold">Total</span>
                    <span className="font-display text-2xl font-bold text-[color:var(--primary)]">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Promo Code</label>
                <div className="mt-2 flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value)}
                    placeholder="FRESH20"
                    className="clay-input w-full px-3 py-3 text-sm"
                  />
                  <button
                    className="clay-inset px-4 py-3 text-xs font-semibold"
                    type="button"
                    onClick={async () => {
                      setPromoMessage(null);
                      const code = promoCode.trim();
                      if (!code) {
                        setPromoMessage("Enter a promo code first.");
                        return;
                      }

                      const response = await fetch("/api/public/promo/validate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code, subtotal: total }),
                      });
                      const data = await response.json();
                      if (!response.ok) {
                        setAppliedPromo(null);
                        setPromoDiscountPercent(0);
                        setPromoMessage(data.error || "Promo code invalid.");
                        return;
                      }

                      setAppliedPromo(data.code);
                      setPromoDiscountPercent(data.discountPercent || 0);
                      setPromoMessage(data.description || "Promo code applied.");
                    }}
                  >
                    Apply
                  </button>
                </div>
                {promoMessage ? <p className="mt-2 text-xs text-[color:var(--muted)]">{promoMessage}</p> : null}
                {appliedPromo ? <p className="mt-1 text-xs text-[color:var(--primary)]">Applied code: {appliedPromo}</p> : null}
              </div>

              <Link href="/checkout" className="clay-button mt-6 block px-6 py-4 text-center text-sm font-semibold">
                Proceed to Checkout
              </Link>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[color:var(--primary)]/10 py-3 text-xs font-bold text-[color:var(--primary)]">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                Arriving Tomorrow by 10:00 AM
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "bakery_dining", label: "Freshly Baked" },
                { icon: "verified_user", label: "Secure Payment" },
                { icon: "eco", label: "Eco-Packaging" },
              ].map((item) => (
                <div key={item.label} className="clay-card flex flex-col items-center gap-2 p-3 text-center">
                  <span className="material-symbols-outlined text-[color:var(--primary)]">{item.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">{item.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

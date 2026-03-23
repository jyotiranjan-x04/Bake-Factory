"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/components/Providers";
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
    <main className="pb-10">
      <SiteHeader />
      <section className="section-wrap grid gap-5 md:grid-cols-[1.2fr_360px]">
        <article className="clay-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold">Your Basket</h1>
              <p className="mt-1 text-sm text-[color:var(--muted)]">Curate your perfect bakery haul.</p>
            </div>
            <Link href="/catalog" className="clay-inset px-4 py-2 text-sm">Continue shopping</Link>
          </div>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <article key={item.productId} className="clay-inset flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-[color:var(--muted)]">₹{item.price} each</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button className="clay-inset px-3 py-1" onClick={() => updateQty(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>
                    -
                  </button>
                  <span className="min-w-[24px] text-center">{item.quantity}</span>
                  <button className="clay-inset px-3 py-1" onClick={() => updateQty(item.productId, item.quantity + 1)}>
                    +
                  </button>
                  <button className="clay-danger ml-2 text-sm" onClick={() => removeItem(item.productId)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          {items.length === 0 ? (
            <p className="mt-6 text-sm text-[color:var(--muted)]">Your cart is empty. Explore the catalog to add cakes.</p>
          ) : null}
        </article>

        <aside className="clay-card h-fit p-6">
          <h2 className="font-display text-xl font-bold">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Taxes</span>
              <span>₹{taxAmount}</span>
            </div>
            {discountAmount > 0 ? (
              <div className="flex items-center justify-between text-[color:var(--accent-strong)]">
                <span>Promo discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-4">
            <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Promo code</label>
            <div className="mt-2 flex gap-2">
              <input
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="SWEET10"
                className="clay-input w-full px-3 py-2 text-sm"
              />
              <button
                className="clay-inset px-4 py-2 text-xs font-semibold"
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
            {promoMessage ? (
              <p className="mt-2 text-xs text-[color:var(--muted)]">{promoMessage}</p>
            ) : null}
            {appliedPromo ? (
              <p className="mt-1 text-xs text-[color:var(--accent-strong)]">Applied code: {appliedPromo}</p>
            ) : null}
          </div>

          <div className="mt-5 border-t border-[color:var(--line)] pt-4 text-lg font-bold">Total: ₹{grandTotal}</div>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/checkout" className="clay-button px-5 py-3 text-center font-semibold">
              Proceed to checkout
            </Link>
            <p className="text-xs text-[color:var(--muted)]">Secure payment · Freshly baked on demand</p>
          </div>
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}

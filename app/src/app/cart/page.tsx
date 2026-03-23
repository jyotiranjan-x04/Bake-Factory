"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/components/Providers";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart();

  return (
    <main className="pb-10">
      <SiteHeader />
      <section className="section-wrap clay-card p-6">
        <h1 className="text-3xl font-bold">Cart & Checkout</h1>

        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <article key={item.productId} className="clay-inset flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-[#5f4a3a]">₹{item.price} each</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="clay-button px-3 py-1" onClick={() => updateQty(item.productId, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button className="clay-button px-3 py-1" onClick={() => updateQty(item.productId, item.quantity + 1)}>
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
          <p className="mt-6 text-sm text-[#5f4a3a]">Your cart is empty. Explore the catalog to add cakes.</p>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xl font-bold">Total: ₹{total}</p>
            <Link href="/checkout" className="clay-button px-5 py-3 font-semibold">
              Continue to checkout
            </Link>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}

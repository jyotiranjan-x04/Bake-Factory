"use client";

import { useCart } from "@/components/Providers";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductPurchasePanelProps = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
  };
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState("Standard Loaf");

  const adjust = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Size Variant</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {["Standard Loaf", "Large Boule", "Petit Batard"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setVariant(option)}
              className={
                variant === option
                  ? "bg-[color:var(--primary)] text-white px-6 py-3 rounded-full text-xs font-bold shadow-[0_12px_32px_rgba(59,42,30,0.08)]"
                  : "bg-[color:var(--surface-high)] text-[color:var(--muted)] px-6 py-3 rounded-full text-xs font-semibold"
              }
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Quantity</p>
        <div className="flex w-fit items-center rounded-full bg-[color:var(--surface-low)] px-2 py-1">
          <button type="button" className="p-2 text-[color:var(--primary)]" onClick={() => adjust(-1)}>
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="w-10 text-center text-lg font-bold">{quantity}</span>
          <button type="button" className="p-2 text-[color:var(--primary)]" onClick={() => adjust(1)}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="clay-button px-6 py-4 text-sm font-semibold"
          onClick={() => addItem({ productId: product.id, name: `${product.name} · ${variant}`, price: product.price, imageUrl: product.imageUrl, quantity })}
        >
          Add to Cart
        </button>
        <button
          type="button"
          className="clay-inset px-6 py-4 text-sm font-semibold"
          onClick={() => {
            addItem({ productId: product.id, name: `${product.name} · ${variant}`, price: product.price, imageUrl: product.imageUrl, quantity });
            router.push("/checkout");
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

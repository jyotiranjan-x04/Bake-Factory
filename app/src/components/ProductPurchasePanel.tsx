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

  const adjust = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-[color:var(--muted)]">Quantity</span>
        <div className="flex items-center gap-2">
          <button type="button" className="clay-inset px-3 py-1.5 text-sm" onClick={() => adjust(-1)}>
            -
          </button>
          <span className="min-w-[24px] text-center text-sm font-semibold">{quantity}</span>
          <button type="button" className="clay-inset px-3 py-1.5 text-sm" onClick={() => adjust(1)}>
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="clay-button px-5 py-2.5 text-xs font-semibold sm:text-sm"
          onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, quantity })}
        >
          Add to cart
        </button>
        <button
          type="button"
          className="clay-inset px-5 py-2.5 text-xs font-semibold sm:text-sm"
          onClick={() => {
            addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, quantity });
            router.push("/checkout");
          }}
        >
          Buy now
        </button>
      </div>
    </div>
  );
}

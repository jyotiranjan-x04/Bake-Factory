"use client";

import { useCart } from "@/components/Providers";

type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl })}
      className="clay-button px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm"
    >
      Add to cart
    </button>
  );
}

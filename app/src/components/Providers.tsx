"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("bf-cart");
      if (raw) {
        setItems(JSON.parse(raw) as CartItem[]);
      }
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem("bf-cart", JSON.stringify(items));
  }, [isHydrated, items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (item) => {
        const quantityToAdd = Math.max(1, item.quantity ?? 1);
        setItems((prev) => {
          const existing = prev.find((entry) => entry.productId === item.productId);
          if (!existing) {
            return [...prev, { ...item, quantity: quantityToAdd }];
          }

          return prev.map((entry) =>
            entry.productId === item.productId ? { ...entry, quantity: entry.quantity + quantityToAdd } : entry,
          );
        });
      },
      updateQty: (productId, quantity) => {
        setItems((prev) =>
          prev
            .map((entry) => (entry.productId === productId ? { ...entry, quantity } : entry))
            .filter((entry) => entry.quantity > 0),
        );
      },
      removeItem: (productId) => {
        setItems((prev) => prev.filter((entry) => entry.productId !== productId));
      },
      clear: () => setItems([]),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within Providers");
  }

  return context;
}

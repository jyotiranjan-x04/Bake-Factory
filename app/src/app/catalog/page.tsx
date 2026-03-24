"use client";

import { SiteFooter } from "@/components/SiteFooter";
import { StitchTopNav } from "@/components/StitchTopNav";
import { BackButton } from "@/components/BackButton";
import { catalogFallbackImages } from "@/lib/bakery-images";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/Providers";

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  category?: { name: string; slug: string } | null;
};

function CatalogContent() {
  const { addItem } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string>("featured");
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();
  const categoryParam = (searchParams.get("category") || "").toLowerCase();
  const currentCategory = categoryParam || activeCategory;

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/public/catalog");
      const data = await response.json();
      setCategories(data.categories || []);
      setProducts(data.products || []);
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    let next = currentCategory === "all" ? products : products.filter((product) => product.category?.slug === currentCategory);

    if (query) {
      next = next.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query),
      );
    }

    if (sortKey === "price-asc") {
      next = [...next].sort((a, b) => a.price - b.price);
    } else if (sortKey === "price-desc") {
      next = [...next].sort((a, b) => b.price - a.price);
    }

    return next;
  }, [currentCategory, products, query, sortKey]);

  const iconForCategory = (slug: string) => {
    const mapping: Record<string, string> = {
      breads: "bakery_dining",
      pastries: "icecream",
      cakes: "cake",
      savory: "egg",
      "gluten-free": "eco",
    };
    return mapping[slug] || "bakery_dining";
  };

  return (
    <main className="pb-10">
      <StitchTopNav active="breads" />
      <section className="section-wrap grid gap-8 pt-8 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-28 rounded-2xl bg-[color:var(--surface-low)] p-6">
            <h3 className="font-display text-xl font-bold text-[color:var(--primary)]">Categories</h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">Freshly baked daily</p>
            <nav className="mt-6 space-y-2">
              <button
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                  currentCategory === "all"
                    ? "bg-[color:var(--primary)] text-white"
                    : "text-[color:var(--foreground)] hover:bg-[color:var(--surface-high)]"
                }`}
                onClick={() => setActiveCategory("all")}
              >
                <span className="material-symbols-outlined">bakery_dining</span>
                All Bakes
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                    currentCategory === category.slug
                      ? "bg-[color:var(--primary)] text-white"
                      : "text-[color:var(--foreground)] hover:bg-[color:var(--surface-high)]"
                  }`}
                  onClick={() => setActiveCategory(category.slug)}
                >
                  <span className="material-symbols-outlined">{iconForCategory(category.slug)}</span>
                  {category.name}
                </button>
              ))}
            </nav>
            <div className="mt-8 border-t border-[color:var(--surface-highest)] pt-6">
              <p className="text-sm font-semibold">Price Range</p>
              <input className="mt-4 w-full accent-[color:var(--primary)]" type="range" min={0} max={100} />
              <div className="mt-2 flex justify-between text-xs text-[color:var(--muted)]">
                <span>₹0</span>
                <span>₹5000</span>
              </div>
            </div>
          </div>
        </aside>
        <section>
          <div className="mb-4">
            <BackButton fallbackHref="/" />
          </div>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Artisan Collection</h1>
              <p className="text-sm text-[color:var(--muted)]">{filtered.length} bakes found in this collection</p>
            </div>
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Sort by</label>
              <select
                className="clay-inset w-full px-4 py-2 text-sm sm:w-auto"
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value)}
              >
                <option value="featured">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mb-6 -mx-1 overflow-x-auto pb-1 md:hidden">
            <div className="flex min-w-max gap-2 px-1">
              <button
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  currentCategory === "all" ? "bg-[color:var(--primary)] text-white" : "bg-[color:var(--surface-low)] text-[color:var(--foreground)]"
                }`}
                onClick={() => setActiveCategory("all")}
              >
                All Bakes
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    currentCategory === category.slug ? "bg-[color:var(--primary)] text-white" : "bg-[color:var(--surface-low)] text-[color:var(--foreground)]"
                  }`}
                  onClick={() => setActiveCategory(category.slug)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, index) => (
              <article key={product.id} className="clay-card p-4">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={product.imageUrl || catalogFallbackImages[index % catalogFallbackImages.length]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 280px"
                    className="object-cover"
                  />
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-[color:var(--surface-high)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Best Seller
                  </span>
                  <div className="flex items-center gap-1 text-[color:var(--primary)]">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="text-xs font-bold">4.8</span>
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold">{product.name}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">₹{product.price}</span>
                  <button
                    type="button"
                    onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl })}
                    className="clay-button px-4 py-2 text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
                <Link href={`/product/${product.slug}`} className="mt-3 inline-block text-xs font-semibold text-[color:var(--primary)]">
                  View Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="section-wrap py-10 text-sm text-[color:var(--muted)]">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

"use client";

import { AddToCartButton } from "@/components/AddToCartButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { catalogFallbackImages } from "@/lib/bakery-images";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string>("featured");
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();

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
    let next = activeCategory === "all" ? products : products.filter((product) => product.category?.slug === activeCategory);

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
  }, [activeCategory, products, query, sortKey]);

  return (
    <main className="pb-8 sm:pb-10">
      <SiteHeader />
      <section className="section-wrap clay-card p-5 sm:p-6">
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Cake Catalog</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">Explore birthday, wedding, and custom-worthy masterpieces.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button className={`clay-inset px-4 py-2 text-sm ${activeCategory === "all" ? "font-bold" : ""}`} onClick={() => setActiveCategory("all")}>
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`clay-inset px-4 py-2 text-sm ${activeCategory === category.slug ? "font-bold" : ""}`}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="clay-inset px-3 py-2 text-sm"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value)}
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      <section className="section-wrap mt-5 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, index) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="clay-card p-4 sm:p-5"
          >
            <Image
              src={product.imageUrl || catalogFallbackImages[index % catalogFallbackImages.length]}
              alt={product.name}
              width={640}
              height={360}
              className="mb-4 h-36 w-full rounded-xl border border-[color:var(--line)] object-cover sm:h-40"
            />
            <h3 className="font-display text-lg font-bold">{product.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-[color:var(--muted)]">{product.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="font-semibold">₹{product.price}</p>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Link href={`/product/${product.slug}`} className="clay-inset px-3 py-1.5 text-xs sm:text-sm">
                  Details
                </Link>
                <AddToCartButton product={product} />
              </div>
            </div>
          </motion.article>
        ))}
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

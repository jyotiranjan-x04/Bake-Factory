"use client";

import { AddToCartButton } from "@/components/AddToCartButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { catalogFallbackImages } from "@/lib/bakery-images";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

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
    if (activeCategory === "all") {
      return products;
    }

    return products.filter((product) => product.category?.slug === activeCategory);
  }, [activeCategory, products]);

  return (
    <main className="pb-8 sm:pb-10">
      <SiteHeader />
      <section className="section-wrap clay-card p-5 sm:p-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Cake Catalog</h1>
        <p className="mt-2 text-sm text-[#5f4a3a]">Explore birthday, wedding, and custom-worthy masterpieces.</p>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
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
              className="mb-4 h-36 w-full rounded-xl border border-[#d7c5af] object-cover sm:h-40"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-[#5f4a3a]">{product.description}</p>
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

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/components/Providers";

export function SiteHeader() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-2 z-40 section-wrap mb-5 sm:top-3 sm:mb-6"
    >
      <div className="overflow-hidden rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface)]/95 shadow-[0_10px_28px_rgba(59,42,30,0.12)] backdrop-blur">
        <div className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-2 text-[11px] text-[color:var(--muted)] sm:px-5 sm:text-xs">
          <p>Freshly baked daily · Demo Bakery</p>
          <p className="hidden sm:block">Mon-Sat · 10:00 AM - 8:00 PM</p>
        </div>
        <div className="flex flex-col gap-4 px-4 py-3 sm:px-5 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="font-display text-[1.65rem] font-black tracking-[0.06em] text-[color:var(--foreground)] sm:text-2xl">BAKERY</Link>
            <form action="/catalog" className="hidden w-full max-w-[420px] items-center gap-2 sm:flex">
              <input
                name="q"
                placeholder="Search croissants, cakes, pastries..."
                className="clay-input w-full px-4 py-2 text-sm"
              />
              <button className="clay-button px-4 py-2 text-xs font-semibold" type="submit">Search</button>
            </form>
          </div>

          <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold tracking-wide text-[color:var(--foreground)] sm:text-sm md:gap-x-6">
            <Link href="/" className="leading-none">Home</Link>
            <Link href="/store" className="leading-none">Store</Link>
            <Link href="/catalog" className="leading-none">Menu</Link>
            <Link href="/#about" className="leading-none">About</Link>
            <Link href="/#faq" className="leading-none">FAQ</Link>
            <Link href="/custom-order" className="leading-none">Custom</Link>
            <Link href="/track-order" className="leading-none">Track</Link>
            <Link href="/login" className="clay-inset px-3 py-2 text-[11px] sm:text-xs">Login</Link>
            <Link href="/signup" className="clay-inset px-3 py-2 text-[11px] sm:text-xs">Signup</Link>
            <Link href="/cart" className="clay-button px-4 py-2 text-[11px] sm:text-xs">Order Now ({itemCount})</Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

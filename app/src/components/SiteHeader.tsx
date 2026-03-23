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
      <div className="overflow-hidden rounded-[22px] border border-[#d7c5af] bg-[#f8f1e7]/95 shadow-[0_8px_24px_rgba(70,48,34,0.12)] backdrop-blur">
        <div className="flex items-center justify-between border-b border-[#dfd0be] px-4 py-2 text-[11px] text-[#6d5848] sm:px-5 sm:text-xs">
          <p>Freshly baked daily · Bake Factory</p>
          <p className="hidden sm:block">Mon-Sat · 10:00 AM - 8:00 PM</p>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3 sm:px-5 sm:py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-[1.65rem] font-black tracking-[0.08em] text-[#20120f] sm:text-2xl">BAKERY</Link>
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold tracking-wide text-[#2f2018] sm:text-sm md:gap-x-6">
            <Link href="/" className="leading-none">Home</Link>
            <Link href="/catalog" className="leading-none">Menu</Link>
            <Link href="/" className="leading-none">About</Link>
            <Link href="/" className="leading-none">FAQ</Link>
            <Link href="/custom-order" className="leading-none">Custom</Link>
            <Link href="/track-order" className="leading-none">Track</Link>
            <Link href="/cart" className="clay-button ml-0 px-4 py-2 text-[11px] sm:ml-1 sm:text-xs">Order Now ({itemCount})</Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

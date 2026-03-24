"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/components/Providers";
import { useState } from "react";

export function SiteHeader() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  const navItems = [
    { label: "Cakes", href: "/catalog" },
    { label: "Pastries", href: "/catalog?category=pastries" },
    { label: "Breads", href: "/catalog?category=breads" },
    { label: "Gifts", href: "/catalog?category=gifts" },
    { label: "Seasonal", href: "/catalog?category=seasonal" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-2 z-50 w-full px-2 sm:px-3"
    >
      <div className="section-wrap flex flex-col gap-3 rounded-2xl border border-[color:var(--surface-highest)]/65 py-3 shadow-[0_12px_32px_rgba(59,42,30,0.06)] glass-nav sm:gap-4 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight text-[color:var(--primary)]">
            Demo Bakery
          </Link>
          <form action="/catalog" className="hidden flex-1 items-center gap-3 md:flex md:max-w-md">
            <input
              name="q"
              placeholder="Search for delicacies..."
              className="clay-input w-full px-5 py-2.5 text-sm"
            />
            <button className="clay-button px-4 py-2 text-xs font-semibold" type="submit">
              Search
            </button>
          </form>
          <div className="flex items-center gap-2 text-[color:var(--primary)] sm:gap-4">
            <Link href="/cart" className="relative rounded-full p-2 transition-colors hover:bg-[color:var(--surface-high)]/70" aria-label="Open cart">
              <span className="material-symbols-outlined">shopping_cart</span>
              {itemCount > 0 ? (
                <span className="absolute -top-2 -right-2 rounded-full bg-[color:var(--primary)] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            <Link href="/login" className="rounded-full p-2 transition-colors hover:bg-[color:var(--surface-high)]/70" aria-label="Open login">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((previous) => !previous)}
              className="rounded-full p-2 transition-colors hover:bg-[color:var(--surface-high)]/70 md:hidden"
            >
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="space-y-3 border-t border-[color:var(--surface-highest)]/65 pt-3 md:hidden">
            <form action="/catalog" className="flex items-center gap-2">
              <input
                name="q"
                placeholder="Search for delicacies..."
                className="clay-input w-full px-4 py-2.5 text-sm"
              />
              <button className="clay-button px-4 py-2 text-xs font-semibold" type="submit">
                Search
              </button>
            </form>
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="clay-inset px-4 py-2 text-center text-xs font-semibold text-[color:var(--muted)] transition-colors hover:text-[color:var(--primary)]"
                >
                  {item.label}
                </Link>
              ))}
              <Link onClick={closeMobileMenu} href="/custom-order" className="clay-inset px-4 py-2 text-center text-xs font-semibold text-[color:var(--muted)] transition-colors hover:text-[color:var(--primary)]">
                Custom
              </Link>
              <Link onClick={closeMobileMenu} href="/cart" className="clay-button px-4 py-2 text-center text-xs font-semibold">
                Order Now
              </Link>
            </nav>
          </div>
        ) : null}

        <nav className="hidden flex-wrap items-center justify-between gap-4 md:flex">
          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[color:var(--muted)] transition-colors hover:text-[color:var(--primary)]"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/custom-order" className="text-[color:var(--muted)] transition-colors hover:text-[color:var(--primary)]">
              Custom
            </Link>
          </div>
          <Link href="/cart" className="clay-button px-5 py-2 text-xs font-semibold">
            Order Now
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}

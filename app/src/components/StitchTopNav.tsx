"use client";

import Link from "next/link";
import { useState } from "react";

type StitchTopNavProps = {
  active?: "cakes" | "pastries" | "breads" | "gifts" | "seasonal";
  overlay?: boolean;
};

export function StitchTopNav({ active = "cakes", overlay = false }: StitchTopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  const activeClass = "border-b-2 border-[#B07B4A] pb-1 font-bold text-[#B07B4A] whitespace-nowrap";
  const idleClass = "whitespace-nowrap text-[color:var(--muted)] hover:text-[#B07B4A]";

  return (
    <header className={`${overlay ? "absolute left-0 right-0 top-2" : "sticky top-2"} z-50 w-full px-2 sm:px-3`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 rounded-2xl border border-[#D9C7B4]/55 bg-[#F5EEE6]/85 px-4 py-3 shadow-[0_12px_32px_rgba(59,42,30,0.06)] backdrop-blur-xl sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-8">
          <Link className="truncate text-xl font-bold tracking-tight text-[#B07B4A] sm:text-2xl" href="/">
            Demo Bakery
          </Link>

          <div className="relative hidden max-w-md flex-1 md:flex">
            <input
              suppressHydrationWarning
              className="w-full rounded-full bg-[color:var(--surface-low)] px-6 py-2.5 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted)]"
              placeholder="Search for delicacies..."
              type="text"
            />
            <button suppressHydrationWarning className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" type="button">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[#B07B4A] sm:gap-4">
            <Link
              aria-label="Open cart"
              className="relative rounded-full p-2 transition-transform duration-300 hover:scale-105 hover:bg-[#E8D9C8]/60"
              href="/cart"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
            </Link>
            <Link
              aria-label="Open login"
              className="rounded-full p-2 transition-transform duration-300 hover:scale-105 hover:bg-[#E8D9C8]/60"
              href="/login"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((previous) => !previous)}
              className="rounded-full p-2 text-[#B07B4A] hover:bg-[#E8D9C8]/60 md:hidden"
            >
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="space-y-3 border-t border-[#D9C7B4]/55 pt-3 md:hidden">
            <form action="/catalog" className="relative">
              <input
                suppressHydrationWarning
                className="w-full rounded-full bg-[color:var(--surface-low)] px-5 py-2.5 pr-12 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted)]"
                placeholder="Search for delicacies..."
                name="q"
                type="text"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" type="submit">
                <span className="material-symbols-outlined">search</span>
              </button>
            </form>
            <nav className="grid grid-cols-2 gap-2">
              <Link onClick={closeMobileMenu} className={active === "cakes" ? "clay-button px-4 py-2 text-xs font-semibold" : "clay-inset px-4 py-2 text-xs font-semibold text-center"} href="/catalog?category=cakes">Cakes</Link>
              <Link onClick={closeMobileMenu} className={active === "pastries" ? "clay-button px-4 py-2 text-xs font-semibold" : "clay-inset px-4 py-2 text-xs font-semibold text-center"} href="/catalog?category=pastries">Pastries</Link>
              <Link onClick={closeMobileMenu} className={active === "breads" ? "clay-button px-4 py-2 text-xs font-semibold" : "clay-inset px-4 py-2 text-xs font-semibold text-center"} href="/catalog?category=breads">Breads</Link>
              <Link onClick={closeMobileMenu} className={active === "gifts" ? "clay-button px-4 py-2 text-xs font-semibold" : "clay-inset px-4 py-2 text-xs font-semibold text-center"} href="/catalog?category=gifts">Gifts</Link>
              <Link onClick={closeMobileMenu} className={active === "seasonal" ? "clay-button col-span-2 px-4 py-2 text-xs font-semibold" : "clay-inset col-span-2 px-4 py-2 text-xs font-semibold text-center"} href="/catalog?category=seasonal">Seasonal</Link>
            </nav>
          </div>
        ) : null}

        <nav className="hidden w-full overflow-x-auto py-1 md:block">
          <div className="flex min-w-max items-center justify-start gap-6 pl-1 pr-3 sm:gap-8 md:justify-center md:gap-12">
            <Link className={active === "cakes" ? activeClass : idleClass} href="/catalog?category=cakes">
              Cakes
            </Link>
            <Link className={active === "pastries" ? activeClass : idleClass} href="/catalog?category=pastries">
              Pastries
            </Link>
            <Link className={active === "breads" ? activeClass : idleClass} href="/catalog?category=breads">
              Breads
            </Link>
            <Link className={active === "gifts" ? activeClass : idleClass} href="/catalog?category=gifts">
              Gifts
            </Link>
            <Link className={active === "seasonal" ? activeClass : idleClass} href="/catalog?category=seasonal">
              Seasonal
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function SiteFooter() {
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    if (!email) {
      setMessage("Please enter an email address.");
      return;
    }

    const response = await fetch("/api/public/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "footer" }),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Subscription failed. Try again.");
      return;
    }

    setMessage("Thanks for subscribing. We will send the freshest updates soon.");
    event.currentTarget.reset();
  };

  return (
    <footer className="mt-16 border-t border-[color:var(--surface-highest)]/70 bg-[color:var(--surface-low)]">
      <div className="section-wrap py-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Spreading the #SweetDemo Love</p>
          <h2 className="font-display mt-3 text-3xl font-bold text-[color:var(--foreground)]">Demo Bakery</h2>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            Join our mailing list for weekly secret recipes and early access to seasonal launches.
          </p>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              name="email"
              type="email"
              placeholder="Enter email address"
              className="clay-input w-full flex-1 px-4 py-3 text-sm"
              suppressHydrationWarning
            />
            <button className="clay-button w-full px-6 py-3 text-xs font-semibold sm:w-auto" type="submit" suppressHydrationWarning>
              Subscribe
            </button>
          </form>
          {message ? <p className="mt-2 text-xs text-[color:var(--muted)]">{message}</p> : null}

          <div className="mt-8 grid grid-cols-2 gap-6 text-sm text-[color:var(--muted)] sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--primary)]">Shop</p>
              <Link className="mt-3 block hover:text-[color:var(--primary)]" href="/our-story">Our Story</Link>
              <Link className="mt-2 block hover:text-[color:var(--primary)]" href="/ingredients">Ingredients</Link>
              <Link className="mt-2 block hover:text-[color:var(--primary)]" href="/shipping">Shipping</Link>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--primary)]">Support</p>
              <Link className="mt-3 block hover:text-[color:var(--primary)]" href="/contact">Contact Us</Link>
              <Link className="mt-2 block hover:text-[color:var(--primary)]" href="/privacy-policy">Privacy Policy</Link>
              <Link className="mt-2 block hover:text-[color:var(--primary)]" href="/faqs">FAQs</Link>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--primary)]">Follow Us</p>
              <a className="mt-3 block hover:text-[color:var(--primary)]" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a className="mt-2 block hover:text-[color:var(--primary)]" href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a>
              <a className="mt-2 block hover:text-[color:var(--primary)]" href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[color:var(--surface-highest)]/40 py-4 text-center text-xs text-[color:var(--muted)]">
        © 2024 Demo Bakery. Crafted with Decadence.
      </div>
    </footer>
  );
}

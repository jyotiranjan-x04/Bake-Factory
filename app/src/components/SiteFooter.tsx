"use client";

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
    <footer className="section-wrap mt-14 pb-10">
      <div className="clay-card grid gap-6 px-6 py-6 text-sm text-[color:var(--muted)] md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-display text-lg font-bold tracking-wide text-[color:var(--foreground)]">Demo Bakery</p>
          <p className="mt-2">Premium handcrafted cakes · WhatsApp order updates · Real-time tracking</p>
          <p className="mt-3">123 Bake Street, Demo City · Open daily 10 AM - 8 PM</p>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-[color:var(--foreground)]">Join the tasting list</p>
          <form onSubmit={submit} className="flex flex-wrap gap-2">
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="clay-input flex-1 px-4 py-2 text-sm"
            />
            <button className="clay-button px-4 py-2 text-xs font-semibold" type="submit">
              Subscribe
            </button>
          </form>
          {message ? <p className="text-xs text-[color:var(--accent-strong)]">{message}</p> : null}
        </div>
      </div>
    </footer>
  );
}

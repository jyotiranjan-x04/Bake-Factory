import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";

export default function StoreIndexPage() {
  return (
    <main className="pb-10">
      <SiteHeader />
      <section className="section-wrap clay-card p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Storefront</p>
        <h1 className="font-display text-3xl font-bold">Welcome to Demo Bakery</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">Browse our curated bakes or track an existing order.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/catalog" className="clay-button px-5 py-2.5 text-xs font-semibold">Browse Catalog</Link>
          <Link href="/track-order" className="clay-inset px-5 py-2.5 text-xs font-semibold">Track Order</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

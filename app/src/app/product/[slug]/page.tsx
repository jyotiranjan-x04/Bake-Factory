import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { SiteFooter } from "@/components/SiteFooter";
import { StitchTopNav } from "@/components/StitchTopNav";
import { BackButton } from "@/components/BackButton";
import { catalogFallbackImages } from "@/lib/bakery-images";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.isActive) {
    notFound();
  }

  const detailImages = Array.from(new Set([product.imageUrl, ...catalogFallbackImages].filter((value): value is string => Boolean(value))));

  return (
    <main className="pb-12">
      <StitchTopNav active="breads" />
      <section className="section-wrap pt-10">
        <div className="mb-4">
          <BackButton fallbackHref="/catalog" />
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)] sm:tracking-[0.24em]">
          <span>Shop</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span>Artisanal Breads</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[color:var(--foreground)]">{product.name}</span>
        </nav>
      </section>

      <section className="section-wrap mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6 space-y-6">
          <div className="relative overflow-hidden rounded-full bg-[color:var(--surface-low)] p-6 shadow-[0_20px_40px_rgba(59,42,30,0.08)]">
            <div className="relative aspect-square overflow-hidden rounded-full border-[12px] border-[color:var(--surface-card)]">
              <Image
                src={product.imageUrl || detailImages[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, 520px"
                className="object-cover"
              />
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-[color:var(--primary)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white sm:right-10 sm:top-10 sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
              Freshly baked
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {detailImages.slice(0, 4).map((image) => (
              <div key={image} className="h-20 w-20 overflow-hidden rounded-2xl bg-[color:var(--surface-low)]">
                <Image src={image} alt="Detail" width={80} height={80} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <h1 className="font-display text-4xl font-black leading-tight md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 text-[color:var(--primary)]">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
              <span className="text-xs text-[color:var(--muted)]">(128 reviews)</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">SKU: DB-STR-001</span>
          </div>
          <p className="mt-6 text-3xl font-bold text-[color:var(--foreground)]">₹{product.price}</p>
          <p className="mt-3 text-sm text-[color:var(--muted)]">{product.description}</p>
          <div className="mt-8">
            <ProductPurchasePanel product={product} />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: "local_shipping", label: "Same Day", text: "Order by 9AM" },
              { icon: "bakery_dining", label: "Hand-Folded", text: "Organic flour" },
              { icon: "eco", label: "Zero Waste", text: "Plastic free" },
            ].map((item) => (
              <div key={item.label} className="clay-card flex flex-col items-center gap-2 p-4 text-center">
                <span className="material-symbols-outlined text-3xl text-[color:var(--primary)]">{item.icon}</span>
                <p className="text-xs font-bold uppercase tracking-[0.2em]">{item.label}</p>
                <p className="text-[10px] text-[color:var(--muted)]">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 space-y-4">
            <div className="clay-card p-5">
              <h3 className="font-display text-lg font-bold">Ingredients & Allergens</h3>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                Wild yeast sourdough starter, organic wheat flour, filtered water, seasonal fruit, sea salt.
              </p>
            </div>
            <div className="clay-card p-5">
              <h3 className="font-display text-lg font-bold">Delivery Details</h3>
              <p className="mt-3 text-sm text-[color:var(--muted)]">Same-day delivery available before 2 PM.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap mt-16">
        <h2 className="font-display text-3xl font-bold text-center">Tasted & Approved</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            "The crumb is perfect and the crust has that incredible crunch.",
            "Subtle sweetness with a gorgeous finish.",
            "Delivered warm and boxed beautifully.",
          ].map((quote) => (
            <div key={quote} className="clay-card p-6">
              <div className="mb-4 flex items-center gap-1 text-[color:var(--primary)]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
              <p className="text-sm italic text-[color:var(--muted)]">&ldquo;{quote}&rdquo;</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--primary)]">— Demo Bakery Guest</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

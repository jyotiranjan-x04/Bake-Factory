import { ImageCarousel } from "@/components/ImageCarousel";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { catalogFallbackImages } from "@/lib/bakery-images";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
};

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.isActive) {
    notFound();
  }

  const detailImages = Array.from(new Set([product.imageUrl, ...catalogFallbackImages].filter((value): value is string => Boolean(value))));
  const related: RelatedProduct[] = await prisma.product.findMany({
    where: { isActive: true, id: { not: product.id } },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="pb-8 sm:pb-10">
      <SiteHeader />
      <section className="section-wrap grid gap-5 sm:gap-6 md:grid-cols-2">
        <article className="clay-card p-5 sm:p-6">
          <ImageCarousel
            images={detailImages}
            altPrefix={product.name}
            className="h-[260px] sm:h-[320px] md:h-[340px]"
          />
        </article>

        <article className="clay-card p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)] sm:tracking-[0.2em]">Bake Factory Signature</p>
          <h1 className="font-display mt-2 text-2xl font-extrabold sm:text-3xl">{product.name}</h1>
          <p className="mt-3 text-sm text-[color:var(--muted)] sm:mt-4 sm:text-base">{product.description}</p>
          <p className="mt-5 text-xl font-bold sm:mt-6 sm:text-2xl">₹{product.price}</p>
          <div className="mt-5 sm:mt-6">
            <ProductPurchasePanel product={product} />
          </div>
        </article>
      </section>

      <section className="section-wrap mt-6 grid gap-4 sm:mt-8 md:grid-cols-[1.2fr_1fr]">
        <article className="clay-card space-y-4 p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold">Ingredients & Allergens</h2>
          <p className="text-sm text-[color:var(--muted)]">Flour, fresh butter, seasonal fruit, artisan cocoa, and premium cream. Contains gluten and dairy.</p>
          <h3 className="font-display text-lg font-bold">Delivery Details</h3>
          <p className="text-sm text-[color:var(--muted)]">Same-day delivery available before 2 PM. All orders are packed in temperature-safe boxes.</p>
        </article>
        <article className="clay-card space-y-4 p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold">Review Highlights</h2>
          <div className="clay-inset space-y-2 p-4">
            <p className="text-sm font-semibold text-[color:var(--foreground)]">“Soft crumb, rich filling, and stunning finish.”</p>
            <p className="text-xs text-[color:var(--muted)]">— 4.9/5 from 128 reviews</p>
          </div>
          <div className="clay-inset space-y-2 p-4">
            <p className="text-sm font-semibold text-[color:var(--foreground)]">“Delivered warm and perfectly boxed.”</p>
            <p className="text-xs text-[color:var(--muted)]">— 96% repeat customers</p>
          </div>
        </article>
      </section>

      <section className="section-wrap mt-6 sm:mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Related Picks</h2>
          <Link href="/catalog" className="clay-link text-sm">View all</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, index) => (
            <article key={item.id} className="clay-card p-4">
              <Image
                src={item.imageUrl || catalogFallbackImages[index % catalogFallbackImages.length]}
                alt={item.name}
                width={320}
                height={220}
                className="mb-3 h-28 w-full rounded-xl border border-[color:var(--line)] object-cover"
              />
              <p className="font-display text-base font-bold">{item.name}</p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">₹{item.price}</p>
              <Link href={`/product/${item.slug}`} className="clay-button mt-3 inline-block px-4 py-2 text-xs font-semibold">View</Link>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

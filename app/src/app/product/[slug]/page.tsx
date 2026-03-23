import { AddToCartButton } from "@/components/AddToCartButton";
import { ImageCarousel } from "@/components/ImageCarousel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { catalogFallbackImages } from "@/lib/bakery-images";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.isActive) {
    notFound();
  }

  const detailImages = Array.from(new Set([product.imageUrl, ...catalogFallbackImages].filter((value): value is string => Boolean(value))));

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
          <p className="text-xs uppercase tracking-[0.18em] text-[#6d5848] sm:tracking-[0.2em]">Bake Factory Signature</p>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{product.name}</h1>
          <p className="mt-3 text-sm text-[#5f4a3a] sm:mt-4 sm:text-base">{product.description}</p>
          <p className="mt-5 text-xl font-bold sm:mt-6 sm:text-2xl">₹{product.price}</p>
          <div className="mt-5 sm:mt-6">
            <AddToCartButton product={product} />
          </div>
        </article>
      </section>
      <SiteFooter />
    </main>
  );
}

import { ClayCakeHero } from "@/components/ClayCakeHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { bottomShowcaseImages, featuredFallbackImages, highlightImages, visitCollageImages } from "@/lib/bakery-images";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [bakery, featuredProducts, highlights] = await Promise.all([
    prisma.bakeryProfile.findUnique({ where: { id: "main" } }),
    prisma.product.findMany({ where: { isFeatured: true, isActive: true }, take: 3, orderBy: { createdAt: "desc" } }),
    prisma.contentBlock.findMany({ orderBy: { sortOrder: "asc" }, take: 3 }),
  ]);

  return (
    <main className="pb-8 sm:pb-10">
      <SiteHeader />
      <ClayCakeHero
        title={bakery?.heroTitle || "Bake Factory"}
        subtitle={bakery?.heroSubtitle || "Premium handcrafted cakes for every celebration."}
        ctaLabel={bakery?.heroCtaLabel || "Order Now"}
      />

      <section className="section-wrap mt-8 sm:mt-10">
        <div className="mb-5 text-center sm:mb-6">
          <p className="text-xs uppercase tracking-[0.26em] text-[#7e6853]">Why Choose Us</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#25150f] sm:text-3xl">Handcrafted With Love</h2>
        </div>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {featuredProducts.map((product, index) => (
          <article key={product.id} className="overflow-hidden rounded-[12px] border border-[#d8c8b2] bg-[#f6eee2] text-center shadow-[0_8px_18px_rgba(78,55,39,0.08)]">
            <Image
              src={product.imageUrl || featuredFallbackImages[index % featuredFallbackImages.length]}
              alt={product.name}
              width={640}
              height={360}
              className="h-44 w-full border-b border-[#dbc7b0] object-cover sm:h-48"
            />
            <div className="p-4 sm:p-5">
              <h3 className="mt-1 text-2xl font-extrabold text-[#24140f]">{product.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-[#5f4a3a]">{product.description}</p>
              <p className="mt-3 text-sm font-semibold text-[#2e1d14]">₹{product.price}</p>
              <Link href={`/product/${product.slug}`} className="clay-button mt-4 inline-block shrink-0 px-5 py-2 text-xs font-bold tracking-wide">
                View Bakery
              </Link>
            </div>
          </article>
        ))}
        </div>
      </section>

      <section className="section-wrap mt-10 sm:mt-12">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <article className="clay-card p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#7d654f]">Visit Us Today</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#22130e] sm:text-3xl">Bake Factory</h2>
            <p className="mt-4 text-sm text-[#5f4a3a]">
              {bakery?.locationAddress || "123 Bake Street, Demo City"}
            </p>
            <p className="mt-2 text-sm text-[#5f4a3a]">Call/WhatsApp: {bakery?.whatsappNumber || bakery?.phoneNumber || "9999999999"}</p>
            <div className="mt-6">
              <Link href="/catalog" className="clay-button inline-block px-6 py-3 text-xs font-bold tracking-wide">
                Visit Us Today
              </Link>
            </div>
          </article>

          <article className="clay-card grid h-[220px] grid-cols-2 grid-rows-2 gap-2 overflow-hidden p-2 sm:h-[260px]">
            <Image
              src={visitCollageImages[0]}
              alt="Bakery snacks"
              width={420}
              height={320}
              className="row-span-2 h-full w-full rounded-xl object-cover"
            />
            <Image
              src={visitCollageImages[1]}
              alt="Fresh pastries"
              width={420}
              height={150}
              className="h-full w-full rounded-xl object-cover"
            />
            <Image
              src={visitCollageImages[2]}
              alt="Bakery sweets"
              width={420}
              height={150}
              className="h-full w-full rounded-xl object-cover"
            />
          </article>
        </div>
      </section>

      <section className="section-wrap mt-8 sm:mt-10">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {highlights.map((item, index) => (
            <article key={item.id} className="clay-card overflow-hidden p-0">
              <Image
                src={bottomShowcaseImages[index % bottomShowcaseImages.length] || highlightImages[index % highlightImages.length]}
                alt={item.title || `Bake highlight ${index + 1}`}
                width={520}
                height={300}
                className="h-40 w-full object-cover sm:h-48"
              />
              <div className="p-4 sm:p-5">
                <h3 className="text-base font-extrabold text-[#25150f] sm:text-lg">{item.title || `Bake Highlight ${index + 1}`}</h3>
                <p className="mt-2 text-sm text-[#5f4a3a]">{item.content}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

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

  const featureCards = featuredProducts.length > 0 ? featuredProducts : featuredFallbackImages.map((image, index) => ({
    id: `fallback-${index}`,
    name: "Signature Bake",
    description: "Flaky layers, golden crusts, and the warm comfort of a premium bake.",
    price: 799,
    imageUrl: image,
    slug: "catalog",
    fallback: true,
  }));

  const benefits = [
    {
      title: "Artisan Breads",
      description: "Slow-proofed doughs, baked in small batches for a golden crust.",
      image: highlightImages[0],
    },
    {
      title: "Sweet Pastries",
      description: "Layered, buttery, and filled with seasonal fruit and cream.",
      image: highlightImages[1],
    },
    {
      title: "Custom Cakes",
      description: "Hand-decorated celebration cakes designed to your story.",
      image: highlightImages[2],
    },
  ];

  return (
    <main className="pb-8 sm:pb-10">
      <SiteHeader />
      <ClayCakeHero
        title={bakery?.heroTitle || "Bake Factory"}
        subtitle={bakery?.heroSubtitle || "Premium handcrafted cakes for every celebration."}
        ctaLabel={bakery?.heroCtaLabel || "Order Now"}
      />

      <section id="menu" className="section-wrap mt-8 sm:mt-10">
        <div className="mb-5 text-center sm:mb-6">
          <p className="text-xs uppercase tracking-[0.26em] text-[color:var(--muted)]">Featured</p>
          <h2 className="font-display mt-2 text-2xl font-extrabold text-[color:var(--foreground)] sm:text-3xl">Freshly Baked Highlights</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Curated favorites for today’s cravings.</p>
        </div>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {featureCards.map((product, index) => (
          <article key={product.id} className="overflow-hidden rounded-[16px] border border-[color:var(--line)] bg-[color:var(--surface)] text-center shadow-[0_8px_18px_rgba(59,42,30,0.08)]">
            <Image
              src={product.imageUrl || featuredFallbackImages[index % featuredFallbackImages.length]}
              alt={product.name}
              width={640}
              height={360}
              className="h-44 w-full border-b border-[color:var(--line)] object-cover sm:h-48"
            />
            <div className="p-4 sm:p-5">
              <h3 className="font-display mt-1 text-2xl font-extrabold text-[color:var(--foreground)]">{product.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-[color:var(--muted)]">{product.description}</p>
              <p className="mt-3 text-sm font-semibold text-[color:var(--foreground)]">₹{product.price}</p>
              <Link href={"fallback" in product ? "/catalog" : `/product/${product.slug}`} className="clay-button mt-4 inline-block shrink-0 px-5 py-2 text-xs font-bold tracking-wide">
                View Bakery
              </Link>
            </div>
          </article>
        ))}
        </div>
      </section>

      <section className="section-wrap mt-8 sm:mt-10">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-[1.4fr_1fr]">
          <article className="clay-card p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">Morning Special</p>
            <h2 className="font-display mt-2 text-2xl font-extrabold text-[color:var(--foreground)] sm:text-3xl">Golden Pastry Pairings</h2>
            <p className="mt-3 text-sm text-[color:var(--muted)]">Try our seasonal croissant duo with a caramel glaze and creamy espresso finish.</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link href="/catalog" className="clay-button px-5 py-2 text-xs font-semibold sm:text-sm">Browse Menu</Link>
              <Link href="/custom-order" className="clay-inset px-4 py-2 text-xs font-semibold sm:text-sm">Custom Request</Link>
            </div>
          </article>
          <article className="clay-card overflow-hidden p-0">
            <Image
              src={featuredFallbackImages[0]}
              alt="Morning special"
              width={640}
              height={420}
              className="h-full w-full object-cover"
            />
          </article>
        </div>
      </section>

      <section id="about" className="section-wrap mt-10 sm:mt-12">
        <div className="mb-5 text-center sm:mb-6">
          <p className="text-xs uppercase tracking-[0.26em] text-[color:var(--muted)]">Why Choose Us</p>
          <h2 className="font-display mt-2 text-2xl font-extrabold text-[color:var(--foreground)] sm:text-3xl">Handcrafted With Love</h2>
        </div>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="overflow-hidden rounded-[16px] border border-[color:var(--line)] bg-[color:var(--surface)] text-center shadow-[0_8px_18px_rgba(59,42,30,0.08)]">
              <Image
                src={benefit.image}
                alt={benefit.title}
                width={640}
                height={360}
                className="h-44 w-full border-b border-[color:var(--line)] object-cover sm:h-48"
              />
              <div className="p-4 sm:p-5">
                <h3 className="font-display mt-1 text-xl font-extrabold text-[color:var(--foreground)]">{benefit.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{benefit.description}</p>
                <Link href="/catalog" className="clay-button mt-4 inline-block shrink-0 px-5 py-2 text-xs font-bold tracking-wide">
                  Learn More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section-wrap mt-10 sm:mt-12">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <article className="clay-card p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">Visit Us Today</p>
            <h2 className="font-display mt-2 text-2xl font-extrabold text-[color:var(--foreground)] sm:text-3xl">Demo Bakery</h2>
            <p className="mt-4 text-sm text-[color:var(--muted)]">
              {bakery?.locationAddress || "123 Bake Street, Demo City"}
            </p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">Call/WhatsApp: {bakery?.whatsappNumber || bakery?.phoneNumber || "9999999999"}</p>
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
                <h3 className="font-display text-base font-extrabold text-[color:var(--foreground)] sm:text-lg">{item.title || `Bake Highlight ${index + 1}`}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{item.content}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="section-wrap mt-10 sm:mt-12">
        <div className="clay-card p-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">FAQ</p>
            <h2 className="font-display mt-2 text-2xl font-extrabold text-[color:var(--foreground)]">Your Sweet Questions</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="clay-inset p-4">
              <p className="font-semibold text-[color:var(--foreground)]">How early should I place a custom order?</p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">We recommend 48-72 hours for classic customs and 5+ days for elaborate designs.</p>
            </div>
            <div className="clay-inset p-4">
              <p className="font-semibold text-[color:var(--foreground)]">Do you offer same-day delivery?</p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Yes, on select items before 2 PM. Use Track to see availability.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

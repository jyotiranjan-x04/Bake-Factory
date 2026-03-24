import { SiteFooter } from "@/components/SiteFooter";
import { StitchTopNav } from "@/components/StitchTopNav";
import { ImageCarousel } from "@/components/ImageCarousel";
import { FadeIn, SlideInLeft, SlideInRight, SlideInUp, ScaleIn, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import { DemoOne } from "@/components/ui/demo";
import { featuredFallbackImages } from "@/lib/bakery-images";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const waitFor = (durationMs: number) => new Promise((resolve) => setTimeout(resolve, durationMs));

const isTransientDbError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Can't reach database server at") || message.includes("code: 'P1001'");
};

async function fetchHomeData() {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await prisma.$transaction([
        prisma.bakeryProfile.findUnique({ where: { id: "main" } }),
        prisma.product.findMany({ where: { isFeatured: true, isActive: true }, take: 3, orderBy: { createdAt: "desc" } }),
      ]);
    } catch (error) {
      lastError = error;

      if (!isTransientDbError(error) || attempt === 3) {
        throw error;
      }

      await waitFor(250 * attempt);
    }
  }

  throw lastError;
}

export default async function Home() {
  const [bakery, featuredProducts] = await fetchHomeData();

  const bestsellers = featuredProducts.length > 0
    ? featuredProducts.map((product, index) => ({
        id: product.id,
        name: product.name,
        description: product.description || "Signature bake from our artisan kitchen.",
        price: product.price,
        imageUrl: product.imageUrl || featuredFallbackImages[index % featuredFallbackImages.length],
        slug: product.slug,
      }))
    : [
        {
          id: "velvet-red",
          name: "Velvet Red Dream",
          description: "Our signature cocoa-beetroot sponge.",
          price: 899,
          imageUrl: "/assets/stitch/images/stitch-028.png",
          slug: "catalog",
        },
        {
          id: "artisan-croissant",
          name: "Artisan Croissant",
          description: "72-hour fermented sourdough pastry.",
          price: 320,
          imageUrl: "/assets/stitch/images/stitch-004.png",
          slug: "catalog",
        },
        {
          id: "parisian-macarons",
          name: "Parisian Macarons",
          description: "Box of 12 assorted seasonal flavors.",
          price: 690,
          imageUrl: "/assets/stitch/images/stitch-011.png",
          slug: "catalog",
        },
        {
          id: "holiday-panettone",
          name: "Holiday Panettone",
          description: "Citrus peel and golden raisin brioche.",
          price: 520,
          imageUrl: "/assets/stitch/images/stitch-038.png",
          slug: "catalog",
        },
      ];

  const categories = [
    { label: "Cakes", icon: "cake", href: "/catalog?category=cakes" },
    { label: "Pastries", icon: "bakery_dining", href: "/catalog?category=pastries" },
    { label: "Breads", icon: "breakfast_dining", href: "/catalog?category=breads" },
    { label: "Seasonal", icon: "featured_seasonal_and_gifts", href: "/catalog?category=seasonal" },
    { label: "Gift Boxes", icon: "card_giftcard", href: "/catalog?category=gifts" },
  ];

  return (
    <main className="pb-8 sm:pb-10">
      <section className="relative">
        <div className="relative flex min-h-[85vh] w-full flex-col overflow-hidden bg-[#3b2a1e] text-white shadow-[0_24px_48px_rgba(59,42,30,0.12)]">
          <StitchTopNav active="cakes" overlay />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/assets/videoplayback.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 flex flex-1 flex-col justify-center px-4 pb-12 pt-[160px] sm:px-6 sm:pt-[180px] lg:px-12 lg:pt-[220px]">
            <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <SlideInLeft>
                <div className="inline-flex animate-pulse items-center gap-2 rounded-full border border-[#f7e8d0]/50 bg-gradient-to-r from-[#d9af62]/90 to-[#B07B4A]/90 px-4 py-1.5 text-xs font-black uppercase tracking-[0.15em] text-white shadow-[0_0_20px_rgba(217,175,98,0.5)] backdrop-blur-md">
                  <span className="material-symbols-outlined text-sm">local_activity</span>
                  Special Offer — 20% OFF
                </div>
                <h1 className="font-display mt-6 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  {bakery?.heroTitle || "Decadent Caramel Bliss!"}
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
                  {bakery?.heroSubtitle || "Experience the silkiness of our signature caramel ganache cake, baked fresh at dawn."}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/catalog" className="clay-button px-8 py-4 text-sm font-semibold">
                    Order Now
                  </Link>
                  <Link href="/catalog" className="clay-inset px-8 py-4 text-sm font-semibold">
                    View Menu
                  </Link>
                </div>
              </SlideInLeft>
              
              <SlideInRight className="relative mx-auto mt-8 w-full max-w-[320px] sm:max-w-[380px] lg:mt-0 xl:max-w-[420px]">
                {/* Designer Frame Backdrops */}
                <div className="absolute -inset-6 z-0 rotate-3 rounded-[32px] border border-[#d9af62]/30 bg-white/5 backdrop-blur-md transition-transform duration-700 hover:rotate-6 sm:-inset-8 sm:rounded-[40px]"></div>
                <div className="absolute -inset-3 z-0 -rotate-2 rounded-[28px] bg-gradient-to-tr from-[#3b2a1e]/80 to-[#d9af62]/40 shadow-2xl sm:-inset-4 sm:rounded-[36px]"></div>
                
                {/* Main Carousel Container */}
                <div className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-[24px] border-[6px] border-[#f5eee6]/20 bg-[#1a120c] shadow-[0_0_40px_rgba(0,0,0,0.6)] sm:rounded-[32px]">
                  <ImageCarousel
                    images={[
                      "/assets/cakes/chocolate.jpg",
                      "/assets/cakes/vanilla.jpg",
                      "/assets/cakes/wedding.jpg",
                    ]}
                    altPrefix="Bake Factory hero cake"
                    className="h-full w-full object-cover"
                    prioritizeFirst
                    autoPlayMs={3800}
                  />
                </div>

                {/* Floating Designer Badge */}
                <ScaleIn delay={0.4} className="absolute -right-4 -top-8 z-20 flex h-[90px] w-[90px] items-center justify-center rounded-full border-2 border-[#f5eee6]/40 bg-[#B07B4A] p-2 text-center text-[10px] font-black uppercase leading-tight tracking-widest text-[#f5eee6] shadow-xl sm:-right-8 sm:-top-10 sm:h-[110px] sm:w-[110px] sm:text-xs">
                  Artisan<br/>Baked
                </ScaleIn>
              </SlideInRight>
            </div>
          </div>
        </div>
      </section>

      {/* Nice Typographic Marquee Banner */}
      <section className="relative flex min-h-[60px] w-full items-center overflow-hidden bg-[color:var(--foreground)] py-3 text-[#d9af62]">
        <div className="flex w-max animate-marquee space-x-8 text-sm font-bold uppercase tracking-[0.25em] md:text-base">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-8 whitespace-nowrap">
              <span>Freshly Baked Everyday</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span>Handcrafted With Love</span>
              <span className="material-symbols-outlined text-xs">star</span>
              <span>100% Organic Ingredients</span>
              <span className="material-symbols-outlined text-xs">star</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-wrap mt-14">
        <FadeIn className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold">Browse Our Pantry</h2>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[color:var(--primary)]" />
        </FadeIn>
        <StaggerContainer className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <StaggerItem key={category.label}>
              <Link
                href={category.href}
                className="flex items-center gap-2 rounded-full bg-[color:var(--surface-low)] px-6 py-3 text-sm font-semibold text-[color:var(--muted)] transition-colors hover:bg-[color:var(--surface-high)]"
              >
                <span className="material-symbols-outlined text-base">{category.icon}</span>
                {category.label}
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="section-wrap mt-16">
        <FadeIn className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold">Our Bestsellers</h2>
            <p className="text-sm text-[color:var(--muted)]">The flavors our community loves most.</p>
          </div>
          <Link href="/catalog" className="clay-link text-sm font-semibold">
            View All
          </Link>
        </FadeIn>
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((product) => (
            <StaggerItem key={product.id}>
              <article className="clay-card h-full p-5 flex flex-col">
                <div className="relative mb-5 aspect-square overflow-hidden rounded-2xl w-full">
                  <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 90vw, 280px" className="object-cover" />
                </div>
                <div className="mb-3 flex items-center gap-1 text-[color:var(--primary)]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                  <span className="text-xs text-[color:var(--muted)]">(124)</span>
                </div>
                <h3 className="font-display text-lg font-bold">{product.name}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)] flex-1">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-[color:var(--primary)]">₹{product.price}</span>
                  <Link href={`/product/${product.slug}`} className="clay-button px-4 py-2 text-xs font-semibold">
                    Add
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="section-wrap mt-16">
        <StaggerContainer className="grid gap-6 lg:grid-cols-4">
          {[
            { icon: "eco", title: "Organic Ingredients", text: "Sourced from local farms with zero chemicals." },
            { icon: "pan_tool", title: "Handcrafted", text: "Each loaf and pastry is artisan-crafted." },
            { icon: "local_shipping", title: "Local Delivery", text: "Freshly delivered within hours of baking." },
            { icon: "psychology_alt", title: "Sustainable", text: "Eco-friendly packaging and fair trade." },
          ].map((item) => (
            <StaggerItem key={item.title} className="clay-card p-6 text-center h-full">
              <span className="material-symbols-outlined text-3xl text-[color:var(--primary)]">{item.icon}</span>
              <h3 className="mt-3 font-display text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{item.text}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="section-wrap mt-16">
        <SlideInUp className="clay-card grid gap-6 p-6 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-center">
            <p className="flex items-center gap-1 text-xs uppercase tracking-[0.28em] font-bold text-[#d9af62]">
              <span className="material-symbols-outlined text-sm">stars</span>
              Golden Ticket Weekend
            </p>
            <h2 className="font-display mt-3 text-2xl font-bold leading-relaxed sm:text-3xl">
              Use code <span className="mx-1 inline-flex -rotate-2 items-center gap-1.5 rounded-lg border-2 border-dashed border-[#B07B4A] bg-[#fdf8f5] px-3 py-1 font-mono text-xl text-[#B07B4A] shadow-md transition-transform hover:rotate-0 sm:text-2xl"><span className="material-symbols-outlined text-base">content_cut</span>SWEET25</span> for 25% off your first order.
            </h2>
            <p className="mt-4 text-sm text-[color:var(--muted)]">Claim your discount and join our community of sweet seekers.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/cart" className="clay-button px-6 py-3 text-sm font-semibold">Claim My Discount</Link>
              <Link href="/custom-order" className="clay-inset px-6 py-3 text-sm font-semibold">Join Our Community</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              "/assets/stitch/images/stitch-033.png",
              "/assets/stitch/images/stitch-041.png",
              "/assets/images/bakery/gallery-3.jpg",
              "/assets/stitch/images/stitch-003.png",
            ].map((src, idx) => (
              <ScaleIn key={src} delay={idx * 0.1} className="h-full">
                <Image src={src} alt="Bakery moment" width={260} height={220} className="h-full w-full rounded-2xl object-cover min-h-[140px]" />
              </ScaleIn>
            ))}
          </div>
        </SlideInUp>
      </section>

      <section className="section-wrap mt-16">
        <DemoOne />
      </section>

      <SiteFooter />
    </main>
  );
}

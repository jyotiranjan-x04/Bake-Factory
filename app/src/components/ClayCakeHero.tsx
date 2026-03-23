"use client";

import { motion } from "framer-motion";
import { heroCarouselImages } from "@/lib/bakery-images";
import { ImageCarousel } from "@/components/ImageCarousel";
import Link from "next/link";

type ClayCakeHeroProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
};

export function ClayCakeHero({ title, subtitle, ctaLabel }: ClayCakeHeroProps) {
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden border-y border-[#d7c5af] bg-[#f2e9dc]"
      >
        <div className="relative h-[340px] sm:h-[440px] md:h-[540px]">
          <ImageCarousel
            images={heroCarouselImages}
            altPrefix="Bake Factory hero"
            className="h-full rounded-none border-0"
            prioritizeFirst
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a1713]/40 via-[#2a1713]/12 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-[760px] rounded-[18px] border border-[#e1cfb8]/80 bg-[#f8f1e6]/88 px-5 py-5 text-center shadow-[0_10px_28px_rgba(52,34,23,0.22)] backdrop-blur sm:px-8 sm:py-7">
              <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[#7d644f] sm:text-xs">Freshly Baked Every Day</p>
              <h1 className="text-[2.2rem] font-extrabold leading-[1.05] text-[#24140f] sm:text-5xl md:text-6xl">
                Freshly Baked,<br />Just for You!
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#5f4a3a] sm:text-base">{subtitle || title}</p>
              <div className="mt-5 flex items-center justify-center gap-2.5 sm:gap-3">
                <Link href="/catalog" className="clay-button px-5 py-2.5 text-xs font-bold tracking-wide sm:px-6 sm:py-3 sm:text-sm">{ctaLabel}</Link>
                <Link href="/custom-order" className="clay-inset px-4 py-2.5 text-xs font-semibold text-[#3f2c21] sm:px-5 sm:py-3 sm:text-sm">Custom Design</Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

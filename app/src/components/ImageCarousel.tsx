"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type ImageCarouselProps = {
  images: string[];
  altPrefix: string;
  className?: string;
  autoPlayMs?: number;
  prioritizeFirst?: boolean;
};

export function ImageCarousel({ images, altPrefix, className, autoPlayMs = 4200, prioritizeFirst = false }: ImageCarouselProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (safeImages.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeImages.length);
    }, autoPlayMs);

    return () => clearInterval(timer);
  }, [autoPlayMs, safeImages.length]);

  if (safeImages.length === 0) {
    return (
      <div className={`clay-inset flex items-center justify-center text-sm text-[#5f4a3a] ${className || ""}`}>
        Images coming soon
      </div>
    );
  }

  const previous = () => setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  const next = () => setActiveIndex((prev) => (prev + 1) % safeImages.length);

  return (
    <div className={`relative overflow-hidden rounded-[18px] bg-[color:var(--surface-card)] shadow-[0_20px_40px_rgba(59,42,30,0.08)] ${className || ""}`}>
      <Image
        src={safeImages[activeIndex]}
        alt={`${altPrefix} ${activeIndex + 1}`}
        fill
        sizes="(max-width: 640px) 94vw, (max-width: 1024px) 92vw, 1200px"
        loading={prioritizeFirst ? "eager" : "lazy"}
        priority={prioritizeFirst}
        unoptimized
        className="object-cover"
      />

      {safeImages.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={previous}
            suppressHydrationWarning
            className="clay-inset absolute left-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 text-xs font-bold sm:left-3 sm:px-3"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            suppressHydrationWarning
            className="clay-inset absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 text-xs font-bold sm:right-3 sm:px-3"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {safeImages.map((_, index) => (
              <button
                key={`${altPrefix}-${index}`}
                type="button"
                aria-label={`Go to image ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                suppressHydrationWarning
                className={`h-2.5 w-2.5 rounded-full ${index === activeIndex ? "bg-[color:var(--primary)]" : "bg-[color:var(--surface-highest)]"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

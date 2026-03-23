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
    <div className={`relative overflow-hidden rounded-[18px] border border-[#d7c5af] bg-[#f6eadb] ${className || ""}`}>
      <Image
        src={safeImages[activeIndex]}
        alt={`${altPrefix} ${activeIndex + 1}`}
        fill
        sizes="(max-width: 640px) 94vw, (max-width: 1024px) 92vw, 1200px"
        loading={prioritizeFirst && activeIndex === 0 ? "eager" : "lazy"}
        priority={prioritizeFirst && activeIndex === 0}
        unoptimized
        className="object-cover"
      />

      {safeImages.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={previous}
            className="clay-inset absolute left-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 text-xs font-bold sm:left-3 sm:px-3"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
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
                className={`h-2.5 w-2.5 rounded-full border border-[#c8b299] ${index === activeIndex ? "bg-[#8a583a]" : "bg-[#f8f1e7]"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

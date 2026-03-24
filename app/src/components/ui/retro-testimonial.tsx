"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image, { ImageProps } from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface iTestimonial {
  name: string;
  designation: string;
  description: string;
  profileImage: string;
  rating?: number;
}

interface iCarouselProps {
  items: React.ReactElement<{
    testimonial: iTestimonial;
    index: number;
    layout?: boolean;
    onCardClose?: () => void;
  }>[];
  initialScroll?: number;
}

const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  onOutsideClick: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      onOutsideClick();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, onOutsideClick]);
};

const Carousel = ({ items }: iCarouselProps) => {
  return (
    <div className="relative mt-10 w-full overflow-hidden pause-on-hover py-5">
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-gradient-to-r from-[color:var(--surface-card)] to-transparent sm:w-20" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-gradient-to-l from-[color:var(--surface-card)] to-transparent sm:w-20" />
      
      <div className="flex w-max animate-marquee space-x-6">
        {[...items, ...items].map((item, index) => (
          <div
            key={`card-${index}`}
            className="flex-shrink-0"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialCard = ({
  testimonial,
  index,
  layout = false,
  onCardClose = () => {},
  backgroundImage = "https://images.unsplash.com/photo-1528458965990-428de4b1cb0d?q=80&w=3129&auto=format&fit=crop",
}: {
  testimonial: iTestimonial;
  index: number;
  layout?: boolean;
  onCardClose?: () => void;
  backgroundImage?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const handleExpand = () => {
    return setIsExpanded(true);
  };
  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
    onCardClose();
  }, [onCardClose]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCollapse();
      }
    };

    if (isExpanded) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo({ top: scrollY, behavior: "auto" });
    }

    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isExpanded, handleCollapse]);

  useOutsideClick(containerRef, handleCollapse);

  return (
    <>
      {mounted && createPortal(
        <AnimatePresence>
          {isExpanded && (
            <div className="fixed inset-0 z-50 h-[100dvh] w-screen overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 h-full w-full bg-[#1a120c]/70 backdrop-blur-lg"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                ref={containerRef}
                layoutId={layout ? `card-${testimonial.name}` : undefined}
                className="relative z-[60] mx-auto flex h-full max-h-[85vh] max-w-[95vw] flex-col overflow-y-auto rounded-3xl bg-gradient-to-b from-[color:var(--surface)] to-[color:var(--surface-card)] p-6 md:mt-10 md:max-w-5xl md:p-10"
              >
                <button
                  suppressHydrationWarning
                  className="sticky right-0 top-0 ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--foreground)] text-[color:var(--surface)] shadow-lg"
                  onClick={handleCollapse}
                  aria-label="Close testimonial"
                >
                  <X className="absolute h-6 w-6" />
                </button>
                <motion.p
                  layoutId={layout ? `category-${testimonial.name}` : undefined}
                  className="px-0 text-lg font-light text-[color:var(--muted)] underline underline-offset-8 md:px-20"
                >
                  {testimonial.designation}
                </motion.p>
                <motion.p
                  layoutId={layout ? `title-${testimonial.name}` : undefined}
                  className="mt-4 px-0 text-xl italic text-[color:var(--foreground)] sm:text-2xl md:px-20 md:text-4xl"
                >
                  {testimonial.name}
                </motion.p>
                <div className="px-0 py-6 text-xl font-light leading-snug tracking-wide text-[color:var(--foreground)] sm:py-8 sm:text-2xl md:px-20 md:text-3xl">
                  <Quote className="h-6 w-6 text-[color:var(--muted)]" />
                  {testimonial.rating && (
                    <div className="mb-2 mt-4 flex items-center text-[#B07B4A]">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 break-words">
                    {testimonial.description}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
      <motion.button
        suppressHydrationWarning
        layoutId={layout ? `card-${testimonial.name}` : undefined}
        onClick={handleExpand}
        whileHover={{
          rotateX: 2,
          rotateY: 2,
          rotate: 1,
          scale: 1.02,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
      >
        <div
          className={`${index % 2 === 0 ? "rotate-0" : "-rotate-0"} relative z-10 flex h-[420px] w-72 flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-[color:var(--surface)] to-[color:var(--surface-card)] shadow-[0_12px_32px_rgba(59,42,30,0.12)] md:h-[500px] md:w-80 lg:w-96`}
        >
          <div className="absolute opacity-30" style={{ inset: "-1px 0 0" }}>
            <div className="absolute inset-0">
              <Image
                className="block h-full w-full object-cover object-center"
                src={backgroundImage}
                alt="Background layer"
                fill
                sizes="(max-width: 768px) 320px, 384px"
              />
            </div>
          </div>
          <ProfileImage src={testimonial.profileImage} alt={testimonial.name} />
          <motion.p
            layoutId={layout ? `title-${testimonial.name}` : undefined}
            className="mt-4 px-3 text-center text-2xl font-normal lowercase text-[rgba(31,27,29,0.7)] [text-wrap:balance] md:text-2xl"
          >
            {testimonial.rating && (
              <span className="mb-2 mt-2 flex justify-center text-[#B07B4A]">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[1rem]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </span>
            )}
            {testimonial.description.length > 100
              ? `${testimonial.description.slice(0, 100)}...`
              : testimonial.description}
          </motion.p>
          <motion.p
            layoutId={layout ? `category-${testimonial.name}` : undefined}
            className="mt-5 text-center text-xl font-thin italic lowercase text-[rgba(31,27,29,0.7)] md:text-2xl"
          >
            {testimonial.name}.
          </motion.p>
          <motion.p
            layoutId={layout ? `category-${testimonial.name}` : undefined}
            className="mt-1 text-center text-base font-thin italic lowercase text-[rgba(31,27,29,0.7)] underline decoration-1 underline-offset-8 md:text-base"
          >
            {testimonial.designation.length > 25
              ? `${testimonial.designation.slice(0, 25)}...`
              : testimonial.designation}
          </motion.p>
        </div>
      </motion.button>
    </>
  );
};

const ProfileImage = ({ src, alt, ...rest }: ImageProps) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="relative flex aspect-[1/1] h-[90px] w-[90px] flex-none overflow-hidden rounded-[1000px] border-[3px] border-solid border-[rgba(59,59,59,0.6)] opacity-80 saturate-[0.2] sepia-[0.46] md:h-[150px] md:w-[150px]">
      <Image
        className={cn(
          "absolute inset-0 z-50 rounded-inherit object-cover transition duration-300",
          isLoading ? "blur-sm" : "blur-0",
        )}
        onLoad={() => {
          setLoading(false);
        }}
        src={src}
        width={150}
        height={150}
        loading="lazy"
        decoding="async"
        blurDataURL={typeof src === "string" ? src : undefined}
        alt={alt || "Profile image"}
        {...rest}
      />
    </div>
  );
};

export { Carousel, TestimonialCard, ProfileImage };

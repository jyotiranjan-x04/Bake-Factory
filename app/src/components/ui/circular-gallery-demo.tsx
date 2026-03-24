"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CircularGallery, GalleryItem } from "@/components/ui/circular-gallery";

const galleryData: GalleryItem[] = [
  {
    common: "Caramel Bliss Cake",
    binomial: "Salted Caramel Layer",
    photo: {
      url: "/assets/stitch/images/stitch-013.png",
      text: "Caramel bliss cake",
      pos: "center",
      by: "Demo Bakery",
    },
  },
  {
    common: "Velvet Red Dream",
    binomial: "Cocoa Beet Sponge",
    photo: {
      url: "/assets/stitch/images/stitch-028.png",
      text: "Velvet red cake",
      by: "Demo Bakery",
    },
  },
  {
    common: "Parisian Macarons",
    binomial: "Seasonal Assortment",
    photo: {
      url: "/assets/stitch/images/stitch-011.png",
      text: "Macaron assortment",
      by: "Demo Bakery",
    },
  },
  {
    common: "Holiday Panettone",
    binomial: "Citrus Raisin Brioche",
    photo: {
      url: "/assets/stitch/images/stitch-038.png",
      text: "Holiday panettone",
      by: "Demo Bakery",
    },
  },
  {
    common: "Artisan Croissant",
    binomial: "72hr Fermented Pastry",
    photo: {
      url: "/assets/stitch/images/stitch-004.png",
      text: "Croissant",
      by: "Demo Bakery",
    },
  },
  {
    common: "Signature Chocolate",
    binomial: "Triple Ganache",
    photo: {
      url: "/assets/stitch/images/stitch-019.png",
      text: "Chocolate cake",
      by: "Demo Bakery",
    },
  },
  {
    common: "Golden Citrus Tart",
    binomial: "Buttery Cream Swirl",
    photo: {
      url: "/assets/stitch/images/stitch-033.png",
      text: "Golden citrus tart",
      by: "Demo Bakery",
    },
  },
  {
    common: "Berry Whipped Delight",
    binomial: "Fresh Fruit Chantilly",
    photo: {
      url: "/assets/stitch/images/stitch-041.png",
      text: "Berry whipped cake",
      by: "Demo Bakery",
    },
  },
  {
    common: "Midnight Cocoa Slice",
    binomial: "Dark Glaze Finish",
    photo: {
      url: "/assets/stitch/images/stitch-003.png",
      text: "Midnight cocoa slice",
      by: "Demo Bakery",
    },
  },
];

const CircularGalleryDemo = () => {
  const [viewportWidth, setViewportWidth] = useState<number>(1280);

  useEffect(() => {
    const syncViewport = () => setViewportWidth(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const tuning = useMemo(() => {
    if (viewportWidth >= 1536) {
      return { radius: 420, speed: 0.02, scale: "scale-[1.03]" };
    }
    if (viewportWidth >= 1280) {
      return { radius: 360, speed: 0.022, scale: "scale-100" };
    }
    if (viewportWidth >= 1024) {
      return { radius: 320, speed: 0.024, scale: "scale-95" };
    }
    if (viewportWidth >= 768) {
      return { radius: 220, speed: 0.026, scale: "scale-[0.84]" };
    }
    return { radius: 150, speed: 0.028, scale: "scale-[0.74]" };
  }, [viewportWidth]);

  return (
    <div className={`h-full w-full origin-center transition-transform duration-500 ${tuning.scale}`}>
      <CircularGallery items={galleryData} radius={tuning.radius} autoRotateSpeed={tuning.speed} />
    </div>
  );
};

export default CircularGalleryDemo;

"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
  className?: string;
};

export function BackButton({ fallbackHref = "/", label = "Back", className }: BackButtonProps) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className={className || "clay-inset inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold"}
      aria-label="Go back"
    >
      <span className="material-symbols-outlined text-base">arrow_back</span>
      {label}
    </button>
  );
}

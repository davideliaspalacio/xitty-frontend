"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface HorizontalCarouselProps {
  children: React.ReactNode;
  className?: string;
}

export function HorizontalCarousel({ children, className }: HorizontalCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  function update() {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scrollBy(dir: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className={cn("group relative -mx-2", className)}>
      <div
        ref={ref}
        className={cn(
          "flex gap-4 overflow-x-auto px-2 pb-2 snap-x snap-mandatory",
          "scroll-pl-2 [&>*]:snap-start",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Anterior"
        onClick={() => scrollBy(-1)}
        disabled={!canPrev}
        className={cn(
          "hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-2)] z-10 transition-opacity",
          canPrev ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Siguiente"
        onClick={() => scrollBy(1)}
        disabled={!canNext}
        className={cn(
          "hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-2)] z-10 transition-opacity",
          canNext ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

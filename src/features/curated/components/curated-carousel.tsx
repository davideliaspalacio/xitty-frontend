"use client";

import { HorizontalCarousel } from "@/shared/layout/horizontal-carousel";
import { CuratedCard } from "@/features/curated/components/curated-card";
import { cn } from "@/shared/utils/cn";
import type { CuratedItem } from "@/features/curated/types";

interface CuratedCarouselProps {
  items: CuratedItem[];
  className?: string;
}

/**
 * Horizontal scroll-snap carousel of CuratedCards, used by the
 * "Descubre lo nuevo" home section. Empty state is left to the caller
 * — this component just renders cards.
 */
export function CuratedCarousel({ items, className }: CuratedCarouselProps) {
  if (items.length === 0) return null;

  return (
    <HorizontalCarousel className={cn(className)}>
      {items.map((item) => (
        <CuratedCard key={item.id} item={item} />
      ))}
    </HorizontalCarousel>
  );
}

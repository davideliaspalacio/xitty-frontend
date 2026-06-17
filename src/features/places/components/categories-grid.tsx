"use client";

import Link from "next/link";
import {
  Utensils,
  Waves,
  BedDouble,
  Landmark,
  Music,
  ShoppingBag,
  TreePine,
  Coffee,
  Camera,
  MapPin,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useCategories } from "@/features/places/hooks/use-places";
import type { Category } from "@/lib/api/types";

/**
 * Soft, editorial palette per category slug. Tones from the Xitty brand —
 * coral, teal, plus warm cream + a couple of soft neutrals.
 * `bg` is a low-saturation tint; `fg` is the ink-on-tint color.
 */
type CategoryStyle = {
  bg: string;
  fg: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const SLUG_STYLES: Record<string, CategoryStyle> = {
  restaurantes: { bg: "#FFE9D6", fg: "#8A3B0D", Icon: Utensils },
  restaurant: { bg: "#FFE9D6", fg: "#8A3B0D", Icon: Utensils },
  playas: { bg: "#D6ECF2", fg: "#0B5A6E", Icon: Waves },
  playa: { bg: "#D6ECF2", fg: "#0B5A6E", Icon: Waves },
  hoteles: { bg: "#E6DEF2", fg: "#3A2A6B", Icon: BedDouble },
  hotel: { bg: "#E6DEF2", fg: "#3A2A6B", Icon: BedDouble },
  cultura: { bg: "#FFE3DF", fg: "#8A2A22", Icon: Landmark },
  cultural: { bg: "#FFE3DF", fg: "#8A2A22", Icon: Landmark },
  nightlife: { bg: "#E0D6F2", fg: "#3A1F6B", Icon: Music },
  vida_nocturna: { bg: "#E0D6F2", fg: "#3A1F6B", Icon: Music },
  compras: { bg: "#FFF1C7", fg: "#7A5A00", Icon: ShoppingBag },
  shopping: { bg: "#FFF1C7", fg: "#7A5A00", Icon: ShoppingBag },
  naturaleza: { bg: "#DCEFE2", fg: "#1F5A35", Icon: TreePine },
  parques: { bg: "#DCEFE2", fg: "#1F5A35", Icon: TreePine },
  cafes: { bg: "#FFF4E8", fg: "#6E4A1F", Icon: Coffee },
  cafe: { bg: "#FFF4E8", fg: "#6E4A1F", Icon: Coffee },
  tours: { bg: "#CFE9E4", fg: "#0E4A42", Icon: Camera },
  experiencias: { bg: "#CFE9E4", fg: "#0E4A42", Icon: Camera },
};

const FALLBACK_STYLES: CategoryStyle[] = [
  { bg: "#FFE9D6", fg: "#8A3B0D", Icon: Utensils },
  { bg: "#D6ECF2", fg: "#0B5A6E", Icon: Waves },
  { bg: "#E6DEF2", fg: "#3A2A6B", Icon: BedDouble },
  { bg: "#FFE3DF", fg: "#8A2A22", Icon: Landmark },
  { bg: "#E0D6F2", fg: "#3A1F6B", Icon: Music },
  { bg: "#FFF1C7", fg: "#7A5A00", Icon: ShoppingBag },
  { bg: "#DCEFE2", fg: "#1F5A35", Icon: TreePine },
  { bg: "#FFF4E8", fg: "#6E4A1F", Icon: Coffee },
  { bg: "#CFE9E4", fg: "#0E4A42", Icon: Camera },
  { bg: "#F1DCE6", fg: "#6B1F45", Icon: MapPin },
];

function styleFor(category: Category, index: number): CategoryStyle {
  const key = category.slug?.toLowerCase();
  if (key && SLUG_STYLES[key]) return SLUG_STYLES[key];
  return FALLBACK_STYLES[index % FALLBACK_STYLES.length];
}

interface CategoriesGridProps {
  className?: string;
  /** Max categories to render; defaults to all. */
  limit?: number;
}

export function CategoriesGrid({ className, limit }: CategoriesGridProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4",
          className,
        )}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            data-testid="category-skeleton"
            className="aspect-square rounded-2xl bg-[var(--bg-subtle)] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!categories?.length) return null;

  const visible = limit ? categories.slice(0, limit) : categories;

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4",
        className,
      )}
    >
      {visible.map((category, index) => {
        const style = styleFor(category, index);
        const Icon = style.Icon;
        return (
          <Link
            key={category.id}
            href={`/places?category=${category.slug}`}
            aria-label={`Ver lugares en ${category.name}`}
            className="group relative aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.03] hover:shadow-[var(--shadow-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            style={{ backgroundColor: style.bg, color: style.fg }}
          >
            <Icon className="h-9 w-9 sm:h-10 sm:w-10" />
            <span className="text-sm sm:text-[15px] font-semibold tracking-tight text-center line-clamp-2">
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

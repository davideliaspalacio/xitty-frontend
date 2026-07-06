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
 * Soft palette per category slug. Values point at design tokens so category
 * tiles follow light/dark theme changes without maintaining a second palette.
 */
type CategoryStyle = {
  bg: string;
  fg: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const SLUG_STYLES: Record<string, CategoryStyle> = {
  restaurantes: { bg: "var(--surface-warm)", fg: "var(--accent)", Icon: Utensils },
  restaurant: { bg: "var(--surface-warm)", fg: "var(--accent)", Icon: Utensils },
  playas: { bg: "var(--surface-sky)", fg: "var(--info)", Icon: Waves },
  playa: { bg: "var(--surface-sky)", fg: "var(--info)", Icon: Waves },
  hoteles: { bg: "var(--bg-subtle)", fg: "var(--text)", Icon: BedDouble },
  hotel: { bg: "var(--bg-subtle)", fg: "var(--text)", Icon: BedDouble },
  cultura: { bg: "var(--accent-soft)", fg: "var(--accent)", Icon: Landmark },
  cultural: { bg: "var(--accent-soft)", fg: "var(--accent)", Icon: Landmark },
  nightlife: { bg: "var(--sky-soft)", fg: "var(--info)", Icon: Music },
  vida_nocturna: { bg: "var(--sky-soft)", fg: "var(--info)", Icon: Music },
  compras: { bg: "var(--sunny-soft)", fg: "var(--warning)", Icon: ShoppingBag },
  shopping: { bg: "var(--sunny-soft)", fg: "var(--warning)", Icon: ShoppingBag },
  naturaleza: { bg: "var(--surface-mint)", fg: "var(--success)", Icon: TreePine },
  parques: { bg: "var(--surface-mint)", fg: "var(--success)", Icon: TreePine },
  cafes: { bg: "var(--surface-warm)", fg: "var(--warning)", Icon: Coffee },
  cafe: { bg: "var(--surface-warm)", fg: "var(--warning)", Icon: Coffee },
  tours: { bg: "var(--secondary-soft)", fg: "var(--secondary-fg)", Icon: Camera },
  experiencias: { bg: "var(--secondary-soft)", fg: "var(--secondary-fg)", Icon: Camera },
};

const FALLBACK_STYLES: CategoryStyle[] = [
  { bg: "var(--surface-warm)", fg: "var(--accent)", Icon: Utensils },
  { bg: "var(--surface-sky)", fg: "var(--info)", Icon: Waves },
  { bg: "var(--bg-subtle)", fg: "var(--text)", Icon: BedDouble },
  { bg: "var(--accent-soft)", fg: "var(--accent)", Icon: Landmark },
  { bg: "var(--sky-soft)", fg: "var(--info)", Icon: Music },
  { bg: "var(--sunny-soft)", fg: "var(--warning)", Icon: ShoppingBag },
  { bg: "var(--surface-mint)", fg: "var(--success)", Icon: TreePine },
  { bg: "var(--surface-warm)", fg: "var(--warning)", Icon: Coffee },
  { bg: "var(--secondary-soft)", fg: "var(--secondary-fg)", Icon: Camera },
  { bg: "var(--danger-soft)", fg: "var(--danger)", Icon: MapPin },
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
            className="aspect-square animate-pulse rounded-lg bg-[var(--bg-subtle)]"
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
            className="group relative flex aspect-square flex-col items-center justify-center gap-2 rounded-lg p-4 transition-all duration-200 hover:scale-[1.03] hover:shadow-[var(--shadow-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 motion-reduce:hover:scale-100"
            style={{ backgroundColor: style.bg, color: style.fg }}
          >
            <Icon className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden="true" />
            <span className="text-sm sm:text-[15px] font-semibold tracking-normal text-center line-clamp-2">
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

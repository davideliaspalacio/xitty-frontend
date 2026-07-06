"use client";

import { ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { PlaceSortBy } from "@/lib/api/types";

interface PlaceFiltersProps {
  priceRange: number | null;
  onPriceRangeChange: (v: number | null) => void;
  sortBy: PlaceSortBy;
  onSortByChange: (v: PlaceSortBy) => void;
  className?: string;
}

const sortLabels: Record<PlaceSortBy, string> = {
  newest: "Más recientes",
  rating: "Mejor calificados",
  popularity: "Más populares",
  price: "Precio",
  distance: "Cercanía",
};

export function PlaceFilters({
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
  className,
}: PlaceFiltersProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-y border-[var(--border)] py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="mr-1 text-xs font-semibold text-[var(--text-muted)]">
          Precio
        </span>
        {[1, 2, 3, 4].map((p) => {
          const active = priceRange === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPriceRangeChange(active ? null : p)}
              aria-pressed={active}
              className={cn(
                "h-11 rounded-pill border px-3 text-xs font-semibold transition-all sm:h-9",
                active
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--text-inverse)]"
                  : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text)]",
              )}
            >
              {"$".repeat(p)}
            </button>
          );
        })}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <ArrowUpDown
          className="h-4 w-4 text-[var(--text-muted)]"
          aria-hidden="true"
        />
        <span className="text-xs font-semibold text-[var(--text-muted)]">
          Ordenar
        </span>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as PlaceSortBy)}
          className="h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-base text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25 sm:h-9 sm:text-sm"
        >
          {(Object.keys(sortLabels) as PlaceSortBy[]).map((k) => (
            <option key={k} value={k}>
              {sortLabels[k]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

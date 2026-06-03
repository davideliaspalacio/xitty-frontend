"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import {
  useCategories,
  usePlaces,
  usePlaceSearch,
} from "@/features/places/hooks/use-places";
import { CategoryChips } from "@/features/places/components/category-chips";
import { PlaceFilters } from "@/features/places/components/place-filters";
import { PlaceGrid } from "@/features/places/components/place-grid";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import type { PlaceSortBy } from "@/lib/api/types";

export default function PlacesPage() {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const debouncedQ = useDebouncedValue(q, 300);

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<PlaceSortBy>("newest");

  const { data: categories, isLoading: catLoading } = useCategories();

  const isSearching = debouncedQ.trim().length >= 2;

  const listQuery = useMemo(
    () => ({
      category_id: categoryId ?? undefined,
      price_range:
        priceRange !== null ? (priceRange as 1 | 2 | 3 | 4) : undefined,
      sort_by: sortBy,
      page: 1,
      limit: 24,
    }),
    [categoryId, priceRange, sortBy],
  );

  const searchQuery = useMemo(
    () => ({
      q: debouncedQ.trim(),
      category_id: categoryId ?? undefined,
      page: 1,
      limit: 24,
    }),
    [debouncedQ, categoryId],
  );

  const listing = usePlaces(listQuery);
  const search = usePlaceSearch(searchQuery);

  const active = isSearching ? search : listing;
  const isLoading = active.isLoading || active.isFetching;
  const places = active.data?.data;
  const total = active.data?.total ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="eyebrow">Directorio</p>
        <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]">
          Explora lugares en Barranquilla
        </h1>
        <p className="text-[var(--text-muted)] text-[15px] max-w-2xl">
          Restaurantes, sitios turísticos y experiencias verificadas. Filtra
          por categoría, precio o popularidad.
        </p>
      </header>

      <div className="relative">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-soft)]" />
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, tipo o palabra clave…"
          className="h-12 pl-10 pr-10 text-[15px]"
        />
        {q ? (
          <button
            type="button"
            aria-label="Limpiar"
            onClick={() => setQ("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)] hover:text-[var(--text)]"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <CategoryChips
        categories={categories}
        loading={catLoading}
        selectedId={categoryId}
        onSelect={setCategoryId}
      />

      {!isSearching ? (
        <PlaceFilters
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />
      ) : (
        <div className="flex items-center justify-between border-y border-[var(--border)] py-3 text-sm text-[var(--text-muted)]">
          <span>
            Resultados para <strong className="text-[var(--text)]">"{debouncedQ}"</strong>
          </span>
          {total > 0 ? (
            <span className="text-xs">{total} encontrados</span>
          ) : null}
        </div>
      )}

      <PlaceGrid
        places={places}
        loading={isLoading}
        emptyMessage={
          isSearching
            ? "Sin resultados. Prueba otras palabras."
            : "No hay lugares con esos filtros."
        }
      />
    </div>
  );
}

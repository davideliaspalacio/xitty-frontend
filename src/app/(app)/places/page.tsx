"use client";

import { useMemo, useState } from "react";
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
import { ErrorState } from "@/shared/ui/error-state";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import type { PlaceSortBy } from "@/lib/api/types";
import { env } from "@/lib/env";

export default function PlacesPage() {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const city = params.get("city") ?? env.NEXT_PUBLIC_DEFAULT_CITY;
  const [draftSearch, setDraftSearch] = useState(() => ({
    source: initialQ,
    value: initialQ,
  }));
  const q = draftSearch.source === initialQ ? draftSearch.value : initialQ;
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
      city,
      page: 1,
      limit: 24,
    }),
    [categoryId, priceRange, sortBy, city],
  );

  const searchQuery = useMemo(
    () => ({
      q: debouncedQ.trim(),
      category_id: categoryId ?? undefined,
      city,
      page: 1,
      limit: 24,
    }),
    [debouncedQ, categoryId, city],
  );

  const listing = usePlaces(listQuery);
  const search = usePlaceSearch(searchQuery);

  const active = isSearching ? search : listing;
  const isLoading = active.isLoading || active.isFetching;
  const isError = active.isError;
  const places = active.data?.data;
  const total = active.data?.total ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="eyebrow">Directorio</p>
        <h1 className="text-[32px] font-semibold leading-[1.1] tracking-normal text-[var(--text)]">
          Explora lugares en {city}
        </h1>
        <p className="text-[var(--text-muted)] text-[15px] max-w-2xl">
          Restaurantes, sitios turísticos y experiencias verificadas. Filtra por
          categoría, precio o popularidad.
        </p>
      </header>

      <div className="relative">
        <label htmlFor="places-search" className="sr-only">
          Buscar lugares
        </label>
        <SearchIcon
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]"
          aria-hidden="true"
        />
        <Input
          id="places-search"
          type="search"
          value={q}
          onChange={(e) =>
            setDraftSearch({ source: initialQ, value: e.target.value })
          }
          placeholder="Buscar por nombre, tipo o palabra clave…"
          className="h-12 rounded-pill pl-12 pr-12 text-base"
        />
        {q ? (
          <button
            type="button"
            aria-label="Limpiar"
            onClick={() => setDraftSearch({ source: initialQ, value: "" })}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-pill text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
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
            Resultados para{" "}
            <strong className="text-[var(--text)]">
              &ldquo;{debouncedQ}&rdquo;
            </strong>
          </span>
          {total > 0 ? (
            <span className="text-xs">{total} encontrados</span>
          ) : null}
        </div>
      )}

      {isError ? (
        <ErrorState
          title="No pudimos cargar los lugares"
          description="Hubo un problema al traer el directorio. Revisa tu conexión e inténtalo de nuevo."
          onRetry={() => void active.refetch()}
        />
      ) : (
        <PlaceGrid
          places={places}
          loading={isLoading}
          emptyMessage={
            isSearching
              ? "Sin resultados. Prueba otras palabras."
              : "No hay lugares con esos filtros."
          }
        />
      )}
    </div>
  );
}

"use client";

import { PlaceCard } from "./place-card";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import type { PlaceCard as PlaceCardType } from "@/lib/api/types";

interface PlaceGridProps {
  places: PlaceCardType[] | undefined;
  loading?: boolean;
  emptyMessage?: string;
  variant?: "grid" | "list";
  className?: string;
}

export function PlaceGrid({
  places,
  loading,
  emptyMessage = "Sin resultados.",
  variant = "grid",
  className,
}: PlaceGridProps) {
  if (loading && !places) {
    return (
      <div
        className={cn(
          variant === "grid"
            ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col gap-3",
          className,
        )}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} variant={variant} />
        ))}
      </div>
    );
  }

  if (!places?.length) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-16 text-center">
        <p className="text-sm text-[var(--text-muted)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        variant === "grid"
          ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "flex flex-col gap-3",
        className,
      )}
    >
      {places.map((p) => (
        <PlaceCard key={p.id} place={p} variant={variant} />
      ))}
    </div>
  );
}

function SkeletonCard({ variant }: { variant: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <div className="flex gap-4 rounded-lg border border-[var(--border)] p-3">
        <Skeleton className="h-24 w-24 rounded-md" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

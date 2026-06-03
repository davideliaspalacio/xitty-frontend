"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { RatingStars } from "./rating-stars";
import { PriceTag } from "./price-tag";
import { FavoriteButton } from "@/features/favorites";
import type { PlaceCard as PlaceCardType } from "@/lib/api/types";

interface PlaceCardProps {
  place: PlaceCardType;
  variant?: "grid" | "list";
  className?: string;
  showFavorite?: boolean;
}

export function PlaceCard({
  place,
  variant = "grid",
  className,
  showFavorite = true,
}: PlaceCardProps) {
  const href = `/places/${place.id}`;

  if (variant === "list") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 transition-all hover:shadow-[var(--shadow-2)] hover:border-[var(--border-strong)]",
          className,
        )}
      >
        <Cover place={place} className="h-24 w-24 shrink-0 rounded-md" />
        <div className="flex flex-col flex-1 min-w-0">
          <Header place={place} />
          {place.description ? (
            <p className="text-sm text-[var(--text-muted)] line-clamp-2 mt-1">
              {place.description}
            </p>
          ) : null}
          <Meta place={place} className="mt-2" />
        </div>
        {showFavorite ? (
          <FavoriteButton placeId={place.id} size="sm" />
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-150 hover:shadow-[var(--shadow-2)] hover:border-[var(--border-strong)]",
        className,
      )}
    >
      <div className="relative">
        <Cover place={place} className="aspect-[4/3]" />
        {showFavorite ? (
          <div className="absolute top-2.5 right-2.5">
            <FavoriteButton placeId={place.id} size="md" />
          </div>
        ) : null}
        {place.categories ? (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center h-6 px-2.5 rounded-pill text-[11px] font-medium bg-white/95 backdrop-blur text-[var(--text)]">
            {place.categories.name}
          </span>
        ) : null}
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <Header place={place} />
        <Meta place={place} />
      </div>
    </Link>
  );
}

function Cover({
  place,
  className,
}: {
  place: PlaceCardType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--bg-subtle)]",
        className,
      )}
    >
      {place.cover_photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={place.cover_photo_url}
          alt={place.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[var(--text-soft)] text-xs">
          Sin imagen
        </div>
      )}
    </div>
  );
}

function Header({ place }: { place: PlaceCardType }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <h3 className="text-[15px] font-semibold tracking-tight text-[var(--text)] line-clamp-1">
        {place.name}
      </h3>
      <PriceTag range={place.price_range} className="shrink-0 mt-0.5" />
    </div>
  );
}

function Meta({
  place,
  className,
}: {
  place: PlaceCardType;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 text-[var(--text-muted)]", className)}>
      <RatingStars
        value={place.average_rating}
        count={place.total_reviews}
        size="sm"
      />
      {place.address ? (
        <span className="inline-flex items-center gap-1 text-xs line-clamp-1">
          <MapPin className="h-3 w-3" />
          {place.address}
        </span>
      ) : null}
    </div>
  );
}

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
      <article
        className={cn(
          "flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-1)] transition-all hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-2)]",
          className,
        )}
      >
        <Link href={href} className="group flex min-w-0 flex-1 gap-3">
          <Cover place={place} className="h-24 w-24 shrink-0 rounded-lg" />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header place={place} />
            {place.description ? (
              <p className="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">
                {place.description}
              </p>
            ) : null}
            <Meta place={place} className="mt-2" />
          </div>
        </Link>
        {showFavorite ? (
          <FavoriteButton placeId={place.id} size="sm" />
        ) : null}
      </article>
    );
  }

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-1)] transition-all duration-150 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-2)]",
        className,
      )}
    >
      <Link href={href} className="group block min-w-0">
        <div className="relative">
          <Cover place={place} className="aspect-[4/3]" />
          {place.categories ? (
            <span className="absolute bottom-2.5 left-2.5 inline-flex min-h-6 items-center rounded-pill bg-white/95 px-2.5 text-[11px] font-semibold text-[var(--text)] backdrop-blur">
              {place.categories.name}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5 p-4">
          <Header place={place} />
          <Meta place={place} />
        </div>
      </Link>
      {showFavorite ? (
        <div className="absolute right-2.5 top-2.5">
          <FavoriteButton placeId={place.id} size="md" />
        </div>
      ) : null}
    </article>
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
        <div className="flex h-full w-full items-center justify-center bg-[var(--surface-sky)] text-xs font-semibold text-[var(--text-muted)]">
          Sin imagen
        </div>
      )}
    </div>
  );
}

function Header({ place }: { place: PlaceCardType }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <h3 className="line-clamp-1 text-[15px] font-semibold tracking-normal text-[var(--text)]">
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
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {place.address}
        </span>
      ) : null}
    </div>
  );
}

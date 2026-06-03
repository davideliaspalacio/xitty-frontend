"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { RatingStars } from "@/features/places/components/rating-stars";
import { FavoriteButton } from "@/features/favorites";
import { cn } from "@/shared/utils/cn";
import type { RankingItem } from "@/lib/api/types";

export function RankingCard({ item }: { item: RankingItem }) {
  const { place, position, position_change, is_sponsored, sponsored_label } = item;
  const change = position_change ?? 0;
  const ChangeIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const changeColor =
    change > 0
      ? "text-[var(--success)]"
      : change < 0
        ? "text-[var(--danger)]"
        : "text-[var(--text-soft)]";

  return (
    <Link
      href={`/places/${place.id}`}
      className="group relative shrink-0 w-[280px] sm:w-[320px] flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all hover:shadow-[var(--shadow-2)] hover:border-[var(--border-strong)]"
    >
      <div className="relative aspect-[4/3] bg-[var(--bg-subtle)]">
        {place.cover_photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={place.cover_photo_url}
            alt={place.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : null}

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 h-7 rounded-pill bg-[var(--text)] text-[var(--text-inverse)] text-xs font-semibold">
          <span>#{position}</span>
          <ChangeIcon className={cn("h-3 w-3", change !== 0 ? changeColor : "text-white/60")} />
        </div>

        {is_sponsored ? (
          <span className="absolute top-2.5 right-12 inline-flex items-center h-6 px-2 rounded-pill text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-soft)] text-[var(--accent)]">
            {sponsored_label ?? "Patrocinado"}
          </span>
        ) : null}

        <div className="absolute top-2.5 right-2.5">
          <FavoriteButton placeId={place.id} size="sm" />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="text-[15px] font-semibold tracking-tight line-clamp-1">{place.name}</h3>
        <RatingStars
          value={place.average_rating}
          count={place.total_reviews}
          size="sm"
        />
      </div>
    </Link>
  );
}

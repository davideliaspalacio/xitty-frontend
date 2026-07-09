"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { RatingStars } from "@/features/places/components/rating-stars";
import { FavoriteButton } from "@/features/favorites";
import { cn } from "@/shared/utils/cn";
import type { RankingItem } from "@/lib/api/types";

export function RankingCard({ item }: { item: RankingItem }) {
  const { place, position, position_change, is_sponsored, sponsored_label } =
    item;
  const change = position_change ?? 0;
  const ChangeIcon =
    change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const changeLabel =
    position_change === null
      ? "Sin historial semanal"
      : change > 0
        ? `Subió ${change} posiciones`
        : change < 0
          ? `Bajó ${Math.abs(change)} posiciones`
          : "Sin cambio semanal";
  const changeText =
    position_change === null || change === 0
      ? "0"
      : change > 0
        ? `+${change}`
        : `${change}`;
  const changeColor =
    change > 0
      ? "text-[var(--success)]"
      : change < 0
        ? "text-[var(--danger)]"
        : "text-[var(--text-soft)]";

  return (
    <article className="relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-2)] sm:w-[320px]">
      <Link
        href={`/places/${place.id}`}
        aria-label={place.name}
        className="group flex flex-col"
      >
        <div className="relative aspect-[4/3] bg-[var(--bg-subtle)]">
          {place.cover_photo_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={place.cover_photo_url}
              alt={place.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : null}

          <div className="absolute left-2.5 top-2.5 flex h-7 items-center gap-1.5 rounded-pill bg-[var(--text)] px-2 text-xs font-semibold text-[var(--text-inverse)]">
            <span>#{position}</span>
            <span
              className={cn(
                "inline-flex min-w-7 items-center justify-center gap-0.5",
                change !== 0 ? changeColor : "text-white/60",
              )}
              aria-label={changeLabel}
              title={changeLabel}
            >
              <ChangeIcon className="h-3 w-3" aria-hidden="true" />
              <span>{changeText}</span>
            </span>
          </div>

          {is_sponsored ? (
            <span className="absolute right-12 top-2.5 inline-flex h-6 items-center rounded-pill bg-[var(--accent-soft)] px-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
              {sponsored_label ?? "Patrocinado"}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5 p-4">
          <h3 className="line-clamp-1 text-[15px] font-semibold tracking-normal">
            {place.name}
          </h3>
          <RatingStars
            value={place.average_rating}
            count={place.total_reviews}
            size="sm"
          />
        </div>
      </Link>

      <div className="absolute right-2.5 top-2.5 z-10">
        <FavoriteButton placeId={place.id} size="sm" />
      </div>
    </article>
  );
}

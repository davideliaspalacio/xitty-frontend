"use client";

import Link from "next/link";
import { Heart, Eye, Compass } from "lucide-react";
import { RatingStars } from "@/features/places/components/rating-stars";
import { FavoriteButton } from "@/features/favorites";
import type { LocalPickItem, PickTag } from "@/lib/api/types";

const tagMeta: Record<PickTag, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  favorito_local: { label: "Favorito local", icon: Heart },
  secreto: { label: "Secreto", icon: Eye },
  autentico: { label: "Auténtico", icon: Compass },
};

export function LocalPickCard({ item }: { item: LocalPickItem }) {
  if (!item.place) return null;
  const { place, pick_tag, short_pitch, curator_name, hero_image_url } = item;
  const photo = hero_image_url ?? place.cover_photo_url;
  const meta = tagMeta[pick_tag];
  const TagIcon = meta?.icon ?? Compass;

  return (
    <article className="relative flex w-[300px] shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-2)] sm:w-[340px]">
      <Link
        href={`/places/${place.id}`}
        aria-label={place.name}
        className="group flex flex-col"
      >
        <div className="relative aspect-[4/3] bg-[var(--bg-subtle)]">
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photo}
              alt={place.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : null}

          <span className="absolute left-2.5 top-2.5 inline-flex h-7 items-center gap-1.5 rounded-pill bg-white/95 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text)] backdrop-blur">
            <TagIcon className="h-3 w-3" aria-hidden="true" />
            {meta?.label ?? pick_tag}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <h3 className="line-clamp-1 text-[15px] font-semibold tracking-normal">
            {place.name}
          </h3>
          {short_pitch ? (
            <p className="line-clamp-2 text-sm italic leading-relaxed text-[var(--text-muted)]">
              “{short_pitch}”
            </p>
          ) : null}
          <div className="mt-1 flex items-center justify-between">
            <RatingStars
              value={place.average_rating}
              count={place.total_reviews}
              size="sm"
            />
            <span className="text-xs text-[var(--text-soft)]">
              — {curator_name}
            </span>
          </div>
        </div>
      </Link>

      <div className="absolute right-2.5 top-2.5 z-10">
        <FavoriteButton placeId={place.id} size="sm" />
      </div>
    </article>
  );
}

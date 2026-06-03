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
    <Link
      href={`/places/${place.id}`}
      className="group relative shrink-0 w-[300px] sm:w-[340px] flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all hover:shadow-[var(--shadow-2)] hover:border-[var(--border-strong)]"
    >
      <div className="relative aspect-[4/3] bg-[var(--bg-subtle)]">
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo}
            alt={place.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : null}

        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 h-7 px-3 rounded-pill text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-[var(--text)] backdrop-blur">
          <TagIcon className="h-3 w-3" />
          {meta?.label ?? pick_tag}
        </span>

        <div className="absolute top-2.5 right-2.5">
          <FavoriteButton placeId={place.id} size="sm" />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-[15px] font-semibold tracking-tight line-clamp-1">{place.name}</h3>
        {short_pitch ? (
          <p className="text-sm text-[var(--text-muted)] line-clamp-2 italic leading-relaxed">
            “{short_pitch}”
          </p>
        ) : null}
        <div className="flex items-center justify-between mt-1">
          <RatingStars
            value={place.average_rating}
            count={place.total_reviews}
            size="sm"
          />
          <span className="text-xs text-[var(--text-soft)]">— {curator_name}</span>
        </div>
      </div>
    </Link>
  );
}

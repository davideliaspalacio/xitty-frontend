"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { RatingStars } from "@/features/places/components/rating-stars";
import { FavoriteButton } from "@/features/favorites";
import type { FeaturedItem } from "@/lib/api/types";

export function FeaturedCard({ item }: { item: FeaturedItem }) {
  if (!item.place) return null;
  const { place, custom_title, custom_description, curator_name, hero_image_url } = item;
  const photo = hero_image_url ?? place.cover_photo_url;
  const title = custom_title ?? place.name;

  return (
    <Link
      href={`/places/${place.id}`}
      className="group relative shrink-0 w-[300px] sm:w-[380px] flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all hover:shadow-[var(--shadow-2)] hover:border-[var(--border-strong)]"
    >
      <div className="relative aspect-[16/10] bg-[var(--bg-subtle)]">
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="flex items-center gap-1.5 text-white/90 text-[11px] font-medium uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Destacado · {curator_name}
          </div>
        </div>

        <div className="absolute top-2.5 right-2.5">
          <FavoriteButton placeId={place.id} size="sm" />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-[17px] font-semibold tracking-tight leading-snug line-clamp-2">
          {title}
        </h3>
        {custom_description ? (
          <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {custom_description}
          </p>
        ) : null}
        <div className="flex items-center justify-between mt-1">
          <RatingStars
            value={place.average_rating}
            count={place.total_reviews}
            size="sm"
          />
          <span className="text-xs text-[var(--text-soft)]">{place.name}</span>
        </div>
      </div>
    </Link>
  );
}

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
    <article className="relative flex w-[300px] shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-2)] sm:w-[380px]">
      <Link
        href={`/places/${place.id}`}
        aria-label={title}
        className="group flex flex-col"
      >
        <div className="relative aspect-[16/10] bg-[var(--bg-subtle)]">
          {photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photo}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : null}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/90">
              <Sparkles className="h-3 w-3" aria-hidden="true" /> Destacado ·{" "}
              {curator_name}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-5">
          <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug tracking-normal">
            {title}
          </h3>
          {custom_description ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-muted)]">
              {custom_description}
            </p>
          ) : null}
          <div className="mt-1 flex items-center justify-between">
            <RatingStars
              value={place.average_rating}
              count={place.total_reviews}
              size="sm"
            />
            <span className="text-xs text-[var(--text-soft)]">
              {place.name}
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

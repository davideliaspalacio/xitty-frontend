"use client";

import { RatingStars } from "@/features/places/components/rating-stars";
import { formatRelativeDate, initials } from "@/shared/utils/format";
import type { ExperienceReview } from "@/lib/api/types";

export function ExperienceReviewItem({ review }: { review: ExperienceReview }) {
  const author = review.author?.full_name ?? "Viajero";
  const photos = review.photos
    .slice()
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <article className="flex flex-col gap-3 border-b border-[var(--border)] py-5 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center text-xs font-semibold"
            aria-hidden
          >
            {initials(author)}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium">{author}</p>
            <p className="text-xs text-[var(--text-soft)]">
              {formatRelativeDate(review.created_at)}
            </p>
          </div>
        </div>
        <RatingStars value={review.rating} size="sm" showValue={false} />
      </div>

      {review.comment ? (
        <p className="text-[15px] leading-relaxed text-[var(--text)] whitespace-pre-wrap">
          {review.comment}
        </p>
      ) : null}

      {photos.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-1">
          {photos.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-20 w-20 rounded-md overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border)] hover:opacity-90 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}

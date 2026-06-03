"use client";

import { RatingStars } from "@/features/places/components/rating-stars";
import { formatRelativeDate, initials } from "@/shared/utils/format";
import type { Review } from "@/lib/api/types";

export function ReviewItem({ review }: { review: Review }) {
  const author = review.profiles?.full_name ?? "Usuario";
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
    </article>
  );
}

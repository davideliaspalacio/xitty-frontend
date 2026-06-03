"use client";

import { Star } from "lucide-react";
import { RatingStars } from "@/features/places/components/rating-stars";
import { Skeleton } from "@/shared/ui/skeleton";
import type { RatingDistribution } from "@/lib/api/types";

export function RatingDistributionPanel({
  data,
  loading,
}: {
  data?: RatingDistribution;
  loading?: boolean;
}) {
  if (loading) {
    return <Skeleton className="h-40 w-full rounded-lg" />;
  }
  if (!data || data.total === 0) {
    return null;
  }

  const byRating = new Map(data.distribution.map((d) => [d.rating, d.count]));

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex flex-col items-center justify-center text-center sm:w-40 shrink-0">
        <p className="text-5xl font-semibold tracking-tight leading-none">
          {data.average.toFixed(1)}
        </p>
        <div className="mt-2">
          <RatingStars value={data.average} size="md" showValue={false} />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          {data.total} reseña{data.total === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = byRating.get(star) ?? 0;
          const pct = data.total ? (count / data.total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-0.5 w-7 shrink-0 text-[var(--text-muted)]">
                {star}
                <Star className="h-3 w-3 fill-[var(--text-soft)] text-[var(--text-soft)]" />
              </span>
              <div className="flex-1 h-2 rounded-pill bg-[var(--bg-subtle)] overflow-hidden">
                <div
                  className="h-full rounded-pill bg-[var(--accent)] transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-7 shrink-0 text-right tabular-nums text-[var(--text-muted)]">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

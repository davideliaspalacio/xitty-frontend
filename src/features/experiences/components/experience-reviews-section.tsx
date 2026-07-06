"use client";

import { useState } from "react";
import {
  useExperienceRatingDistribution,
  useExperienceReviews,
} from "@/features/experiences/hooks/use-experience-reviews";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Skeleton } from "@/shared/ui/skeleton";
import { RatingDistributionPanel } from "./rating-distribution";
import { ExperienceReviewItem } from "./experience-review-item";
import { ExperienceReviewForm } from "./experience-review-form";
import type { ExperienceReviewSort } from "@/lib/api/types";

const SORTS = [
  { key: "recent", label: "Recientes" },
  { key: "top", label: "Mejores" },
] as const;

export function ExperienceReviewsSection({
  experienceId,
}: {
  experienceId: string;
}) {
  const [sort, setSort] = useState<ExperienceReviewSort>("recent");
  const dist = useExperienceRatingDistribution(experienceId);
  const list = useExperienceReviews(experienceId, 1, 20, sort);
  const userId = useAuthStore((s) => s.user?.id);

  const reviews = list.data?.data ?? [];
  const myReview = userId
    ? (reviews.find((r) => r.user_id === userId) ?? null)
    : null;
  // The user's own review is editable in the form above, so keep it out of the list.
  const otherReviews = myReview
    ? reviews.filter((r) => r.id !== myReview.id)
    : reviews;

  const total = dist.data?.total ?? list.data?.total ?? 0;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold tracking-normal">
        Reseñas {total > 0 ? `(${total})` : ""}
      </h2>

      <RatingDistributionPanel data={dist.data} loading={dist.isLoading} />

      <ExperienceReviewForm experienceId={experienceId} myReview={myReview} />

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
        <p className="text-sm font-medium text-[var(--text-muted)]">
          {total > 0
            ? `${total} opinión${total === 1 ? "" : "es"} de viajeros`
            : "Sin reseñas todavía"}
        </p>
        {total > 1 ? (
          <div className="flex gap-1">
            {SORTS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSort(opt.key)}
                className={
                  "h-8 px-3 rounded-pill text-xs font-medium border transition-all " +
                  (sort === opt.key
                    ? "bg-[var(--text)] text-[var(--text-inverse)] border-[var(--text)]"
                    : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text)]")
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {list.isLoading ? (
        <div className="flex flex-col">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 py-5 border-b border-[var(--border)]"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-1/6" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : list.error ? (
        <p className="text-sm text-[var(--text-muted)] py-4">
          No se pudieron cargar las reseñas.
        </p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] py-4">
          Aún no hay reseñas. Sé el primero en compartir tu experiencia.
        </p>
      ) : otherReviews.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] py-4">
          Aún no hay otras reseñas además de la tuya.
        </p>
      ) : (
        <div className="flex flex-col">
          {otherReviews.map((r) => (
            <ExperienceReviewItem key={r.id} review={r} />
          ))}
        </div>
      )}
    </section>
  );
}

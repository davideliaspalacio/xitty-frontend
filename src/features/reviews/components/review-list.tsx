"use client";

import { useReviews } from "@/features/reviews/hooks/use-reviews";
import { Skeleton } from "@/shared/ui/skeleton";
import { ReviewItem } from "./review-item";

export function ReviewList({ placeId }: { placeId: string }) {
  const { data, isLoading, error } = useReviews(placeId, 1, 20);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 py-5 border-b border-[var(--border)]">
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
    );
  }

  if (error) {
    return (
      <p className="text-sm text-[var(--text-muted)] py-4">
        No se pudieron cargar las reseñas.
      </p>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)] py-4">
        Aún no hay reseñas. Sé el primero en compartir tu experiencia.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {data.data.map((r) => (
        <ReviewItem key={r.id} review={r} />
      ))}
    </div>
  );
}

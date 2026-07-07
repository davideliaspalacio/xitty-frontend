import { Sparkles } from "lucide-react";
import { RatingStars } from "@/features/places/components/rating-stars";
import type { SourceReview } from "@/lib/api/types";

interface SourceReviewsProps {
  reviews: SourceReview[] | null | undefined;
  className?: string;
}

/**
 * Bloque "Opiniones de Google" — reseñas importadas de la fuente cuando el lugar
 * vino del scraper. Display-only, con atribución. Es aparte de las reseñas de
 * usuarios de Xitty (ReviewList/ReviewForm).
 */
export function SourceReviews({ reviews, className }: SourceReviewsProps) {
  const items = (reviews ?? []).filter((r) => r?.text || r?.author);
  if (items.length === 0) return null;

  return (
    <section className={className}>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold">Opiniones de Google</h2>
        <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
          <Sparkles className="h-3 w-3" aria-hidden="true" /> vía Google
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {items.map((r, i) => (
          <li
            key={i}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{r.author ?? "Anónimo"}</span>
              {r.relative_time ? (
                <span className="text-xs text-[var(--text-muted)]">
                  {r.relative_time}
                </span>
              ) : null}
            </div>
            {r.rating != null ? <RatingStars value={r.rating} size="sm" /> : null}
            {r.text ? (
              <p className="text-sm text-[var(--text-muted)] leading-snug">
                {r.text}
              </p>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="mt-2 text-[11px] text-[var(--text-soft)]">
        Reseñas provistas por Google. Pueden no reflejar la opinión de Xitty.
      </p>
    </section>
  );
}

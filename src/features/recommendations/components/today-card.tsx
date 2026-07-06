"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { RecommendationItem } from "@/features/recommendations/types";

const DAY_LABELS = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
];

function dayLabel(date = new Date()): string {
  return DAY_LABELS[date.getDay()] ?? "HOY";
}

interface TodayCardProps {
  item: RecommendationItem;
  className?: string;
}

export function TodayCard({ item, className }: TodayCardProps) {
  const { place, reason } = item;
  const today = dayLabel();

  return (
    <Link
      href={`/places/${place.id}`}
      aria-label={place.name}
      className={cn(
        "group relative block overflow-hidden rounded-lg",
        "aspect-[4/3] sm:aspect-[16/9]",
        "min-h-[320px] sm:min-h-[440px]",
        "bg-[var(--bg-subtle)]",
        "transition-transform duration-300 hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {/* Cover photo — sin URL no renderizamos <img src=""> (forzaría al
          navegador a re-descargar el documento como imagen). El gradiente +
          aria-label del Link mantienen accesibilidad y estética. */}
      {place.cover_photo_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={place.cover_photo_url}
          alt={place.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, color-mix(in srgb, var(--accent) 30%, transparent) 0%, color-mix(in srgb, var(--secondary) 30%, transparent) 100%)",
        }}
      />

      {/* Bottom-up readability gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
      />

      {/* Top row: HOY chip + eyebrow */}
      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center h-8 px-3 rounded-pill",
            "bg-[var(--surface-warm)] text-[var(--ink)]",
            "border-[1.5px] border-[var(--ink)]",
            "text-[11px] font-bold uppercase tracking-wider",
            "shadow-[2px_2px_0_var(--ink)]",
          )}
        >
          HOY · {today}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-white/90 drop-shadow">
          Para ti
        </span>
      </div>

      {/* Bottom block: title + reason + CTA */}
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
        <div className="min-w-0 flex flex-col gap-1.5 max-w-[70%]">
          <h3 className="text-white text-2xl sm:text-3xl font-bold leading-tight tracking-normal line-clamp-2 drop-shadow">
            {place.name}
          </h3>
          {reason ? (
            <p className="text-white/90 text-xs sm:text-sm leading-snug line-clamp-2 drop-shadow">
              {reason}
            </p>
          ) : null}
        </div>

        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 h-10 px-4 rounded-pill",
            "bg-[var(--accent)] text-[var(--accent-fg)]",
            "text-sm font-semibold",
            "shadow-[var(--shadow-flat)]",
            "transition-transform duration-200 group-hover:translate-x-0.5",
          )}
        >
          Ver el lugar
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

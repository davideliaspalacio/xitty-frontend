"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { RatingStars } from "@/features/places/components/rating-stars";
import { fmtCop } from "@/shared/utils/format";
import { cn } from "@/shared/utils/cn";
import type { ExperienceCard as ExperienceCardType } from "@/lib/api/types";

function durationLabel(minutes: number) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes} min`;
}

const typeLabels: Record<string, string> = {
  tour: "Tour",
  workshop: "Taller",
  gastronomy: "Gastronomía",
  adventure: "Aventura",
  wellness: "Bienestar",
  cultural: "Cultural",
  nightlife: "Nightlife",
};

export function ExperienceCard({
  experience,
  className,
}: {
  experience: ExperienceCardType;
  /**
   * Extra classes for the card root. Defaults to `w-full` so the card fills
   * its grid cell. Pass a fixed width (e.g. `w-[280px] sm:w-[320px]`) when the
   * card lives inside a horizontal carousel.
   */
  className?: string;
}) {
  const duration = durationLabel(experience.duration_minutes);

  return (
    <Link
      href={`/experiences/${experience.id}`}
      aria-label={`${experience.title} — ${duration}`}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-1)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--ink)] hover:shadow-[var(--shadow-flat)] motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-[4/3] bg-[var(--bg-subtle)] overflow-hidden">
        {experience.cover_photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={experience.cover_photo_url}
            alt={experience.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, transparent) 0%, color-mix(in srgb, var(--secondary) 20%, transparent) 100%)",
          }}
        />

        {/* Sticker-style duration badge top-left */}
        <span
          className="absolute left-2.5 top-2.5 inline-flex h-7 items-center gap-1 rounded-pill border-[1.5px] border-[var(--ink)] bg-[var(--surface-warm)] px-2.5 text-[11px] font-semibold text-[var(--ink)]"
        >
          <Clock className="h-3 w-3" aria-hidden="true" />
          {duration}
        </span>

        {/* Experience-type pill (kept, moved to top-right so the sticker can breathe) */}
        <span className="absolute top-2.5 right-2.5 inline-flex min-h-6 items-center rounded-pill bg-white/95 px-2.5 text-[11px] font-semibold text-[var(--text)] backdrop-blur">
          {typeLabels[experience.experience_type] ?? experience.experience_type}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-[15px] font-semibold tracking-normal line-clamp-2 leading-snug">
          {experience.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <RatingStars
            value={experience.average_rating}
            count={experience.total_reviews}
            size="sm"
          />
        </div>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-base font-semibold text-[var(--text)]">
            {fmtCop.format(experience.price_cop)}
          </span>
          <span className="text-xs text-[var(--text-soft)]">/ persona</span>
        </div>
      </div>
    </Link>
  );
}

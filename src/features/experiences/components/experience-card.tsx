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
        "group relative flex w-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-flat)] hover:border-[var(--ink)]",
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

        {/* Hover gradient: coral -> teal at 20% */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,90,78,0.20) 0%, rgba(14,159,140,0.20) 100%)",
          }}
        />

        {/* Sticker-style duration badge top-left */}
        <span
          className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 h-7 px-2.5 rounded-pill text-[11px] font-semibold bg-[var(--cream)] text-[var(--ink)] border-[1.5px] border-[var(--ink)]"
        >
          <Clock className="h-3 w-3" aria-hidden="true" />
          {duration}
        </span>

        {/* Experience-type pill (kept, moved to top-right so the sticker can breathe) */}
        <span className="absolute top-2.5 right-2.5 inline-flex items-center h-6 px-2.5 rounded-pill text-[11px] font-medium bg-white/95 backdrop-blur text-[var(--text)]">
          {typeLabels[experience.experience_type] ?? experience.experience_type}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-[15px] font-semibold tracking-tight line-clamp-2 leading-snug">
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

"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { RatingStars } from "@/features/places/components/rating-stars";
import { fmtCop } from "@/shared/utils/format";
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

export function ExperienceCard({ experience }: { experience: ExperienceCardType }) {
  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="group relative shrink-0 w-[280px] sm:w-[320px] flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all hover:shadow-[var(--shadow-2)] hover:border-[var(--border-strong)]"
    >
      <div className="relative aspect-[4/3] bg-[var(--bg-subtle)]">
        {experience.cover_photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={experience.cover_photo_url}
            alt={experience.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : null}

        <span className="absolute top-2.5 left-2.5 inline-flex items-center h-6 px-2.5 rounded-pill text-[11px] font-medium bg-white/95 backdrop-blur text-[var(--text)]">
          {typeLabels[experience.experience_type] ?? experience.experience_type}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-[15px] font-semibold tracking-tight line-clamp-2 leading-snug">
          {experience.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {durationLabel(experience.duration_minutes)}
          </span>
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

"use client";

import Link from "next/link";
import { SectionHeader } from "@/shared/layout/section-header";
import { Skeleton } from "@/shared/ui/skeleton";
import { RatingStars } from "@/features/places/components/rating-stars";
import { useTodayRecommendations } from "@/features/recommendations/hooks/use-today";
import { TodayCard } from "@/features/recommendations/components/today-card";
import type { RecommendationItem } from "@/features/recommendations/types";

function TodaySubCard({ item }: { item: RecommendationItem }) {
  const { place, reason } = item;
  return (
    <Link
      href={`/places/${place.id}`}
      className="group relative shrink-0 w-[220px] sm:w-[260px] flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all hover:shadow-[var(--shadow-2)] hover:border-[var(--border-strong)]"
    >
      <div className="relative aspect-[4/3] bg-[var(--bg-subtle)]">
        {place.cover_photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={place.cover_photo_url}
            alt={place.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : null}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,90,78,0.20) 0%, rgba(14,159,140,0.20) 100%)",
          }}
        />
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <h4 className="text-[14px] font-semibold tracking-tight line-clamp-1">
          {place.name}
        </h4>
        {reason ? (
          <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-snug">
            {reason}
          </p>
        ) : null}
        <RatingStars
          value={place.average_rating}
          size="sm"
        />
      </div>
    </Link>
  );
}

function TodaySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="aspect-[4/3] sm:aspect-[16/9] min-h-[320px] sm:min-h-[440px] w-auto rounded-2xl" />
      <div className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[220px] sm:w-[260px]">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <div className="mt-3 flex flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TodaySection() {
  const { items, isLoading } = useTodayRecommendations();

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Qué vale la pena hacer hoy"
          subtitle="Según tu perfil y momento"
        />
        <TodaySkeleton />
      </section>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  const [hero, ...rest] = items;
  const subItems = rest.slice(0, 3);

  return (
    <section className="flex flex-col gap-5">
      <SectionHeader
        title="Qué vale la pena hacer hoy"
        subtitle="Según tu perfil y momento"
      />

      <TodayCard item={hero} />

      {subItems.length > 0 ? (
        <div className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-2">
          {subItems.map((item) => (
            <TodaySubCard key={item.place.id} item={item} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

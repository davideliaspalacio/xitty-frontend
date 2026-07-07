"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { featureFlags } from "@/lib/feature-flags";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { useHeroPromotions } from "@/features/promotions/hooks/use-hero-promotions";
import { useTrackImpression } from "@/features/promotions/hooks/use-track-impression";

const ROTATE_MS = 5_000;

export function AdsHero() {
  if (!featureFlags.promotions) return null;

  return <AdsHeroContent />;
}

function AdsHeroContent() {
  const { data, isLoading } = useHeroPromotions();
  const trackImpression = useTrackImpression();

  const items = useMemo(() => data ?? [], [data]);
  const [index, setIndex] = useState(0);
  const safeIndex = items.length > 0 ? index % items.length : 0;

  // Rotate slides every 5s while there's more than one item.
  useEffect(() => {
    if (items.length < 2) return;
    if (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [items.length]);

  // Track impressions: fire once per slide per session as it enters the viewport.
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackedRef = useRef<Set<string>>(new Set());
  const isVisibleRef = useRef(false);

  // Watch viewport visibility for the rotator as a whole.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== el) continue;
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          const current = items[safeIndex];
          if (current && !trackedRef.current.has(current.id)) {
            trackedRef.current.add(current.id);
            trackImpression(current.id);
          }
        }
      }
    });

    io.observe(el);
    return () => io.disconnect();
    // Re-bind when items/index change so we capture the latest slide id.
  }, [items, safeIndex, trackImpression]);

  // When the active slide changes while we're visible, track the new one.
  useEffect(() => {
    if (!isVisibleRef.current) return;
    const current = items[safeIndex];
    if (!current) return;
    if (trackedRef.current.has(current.id)) return;
    trackedRef.current.add(current.id);
    trackImpression(current.id);
  }, [safeIndex, items, trackImpression]);

  if (isLoading) {
    return (
      <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] overflow-hidden rounded-xl">
        <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
      </div>
    );
  }

  if (items.length === 0) return null;

  const active = items[safeIndex] ?? items[0];
  const placeId = active.places?.id ?? active.place_id;
  const placeName = active.places?.name ?? "";
  const photo = active.hero_image_url;

  return (
    <section
      ref={rootRef}
      data-testid="ads-hero-root"
      aria-label="Promociones destacadas"
      className="relative w-full aspect-[16/9] sm:aspect-[2/1] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]"
    >
      <div
        data-testid="ads-hero-slide-active"
        data-promo-id={active.id}
        className="absolute inset-0"
      >
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo}
            alt={active.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        {/* Subtle overlay so text stays legible regardless of image. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        {/* PROMO badge — top-left, coral pill. */}
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-fg)] shadow-[var(--shadow-1)]">
            Promo
          </span>
        </div>

        {/* Slide content. */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 text-white">
          <h2 className="text-xl sm:text-3xl font-bold leading-tight line-clamp-2 max-w-2xl">
            {active.title}
          </h2>
          {placeName ? (
            <p className="mt-1 text-xs sm:text-sm text-white/80 line-clamp-1">
              {placeName}
            </p>
          ) : null}
          <div className="mt-3">
            <Link
              href={`/places/${placeId}`}
              className="inline-flex items-center rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)] transition-colors"
            >
              Ver lugar
            </Link>
          </div>
        </div>
      </div>

      {/* Pagination dots — only when more than one slide. */}
      {items.length > 1 ? (
        <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center gap-1.5">
          {items.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Ir a promoción ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-6 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

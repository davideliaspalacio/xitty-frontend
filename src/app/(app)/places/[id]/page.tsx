"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { MapPin, Phone, Globe, Clock } from "lucide-react";
import { usePlaceById } from "@/features/places/hooks/use-places";
import { useTrackInteraction } from "@/features/metrics";
import { PlaceGallery } from "@/features/places/components/place-gallery";
import { RatingStars } from "@/features/places/components/rating-stars";
import { PriceTag } from "@/features/places/components/price-tag";
import { PlaceCtaActions } from "@/features/places/components/place-cta-actions";
import { FavoriteButton } from "@/features/favorites";
import { AudioTourPanel } from "@/features/audio-tours";
import { ReviewList } from "@/features/reviews/components/review-list";
import { ReviewForm } from "@/features/reviews/components/review-form";
import { featureFlags } from "@/lib/feature-flags";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui/card";

export default function PlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: place, isLoading, error } = usePlaceById(id);
  const track = useTrackInteraction(id);

  useEffect(() => {
    if (place) track.mutate({ interaction_type: "profile_view" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place?.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl">
        <Skeleton className="aspect-[3/2] w-full rounded-lg" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-16 text-center max-w-3xl">
        <p className="text-sm text-[var(--text-muted)]">
          No encontramos este lugar.{" "}
          <Link
            href="/places"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Volver al directorio
          </Link>
        </p>
      </div>
    );
  }

  const ctaPhone = place.cta_phone ?? place.phone;

  return (
    <div className="flex flex-col gap-10 max-w-5xl">
      <nav className="text-sm text-[var(--text-muted)]">
        <Link
          href="/places"
          className="hover:text-[var(--text)] underline-offset-4 hover:underline"
        >
          Directorio
        </Link>
        {place.categories ? (
          <>
            <span className="mx-2">/</span>
            <span>{place.categories.name}</span>
          </>
        ) : null}
        <span className="mx-2">/</span>
        <span className="text-[var(--text)]">{place.name}</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col gap-4">
        {place.is_sponsored ? (
          <span className="inline-flex items-center self-start h-6 px-2 rounded-pill text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent-soft)] text-[var(--accent)]">
            Patrocinado
          </span>
        ) : null}

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <h1 className="text-[36px] sm:text-[44px] font-semibold leading-[1.05] tracking-normal">
              {place.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
              <RatingStars
                value={place.average_rating}
                count={place.total_reviews}
                size="md"
              />
              <PriceTag range={place.price_range} />
              {place.categories ? (
                <span className="inline-flex items-center gap-1">
                  · {place.categories.name}
                </span>
              ) : null}
            </div>
          </div>
          {featureFlags.favorites ? (
            <FavoriteButton placeId={place.id} size="lg" />
          ) : null}
        </div>
      </header>

      <PlaceGallery
        photos={place.photos}
        fallbackUrl={place.cover_photo_url}
        alt={place.name}
      />

      <PlaceCtaActions place={place} />

      <AudioTourPanel placeId={place.id} />

      {/* Body grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="flex flex-col gap-8 min-w-0">
          {place.description ? (
            <section>
              <h2 className="text-xl font-semibold tracking-normal mb-3">
                Sobre el lugar
              </h2>
              <p className="text-[15px] leading-relaxed text-[var(--text)] whitespace-pre-wrap">
                {place.description}
              </p>
            </section>
          ) : null}

          {place.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {place.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center h-7 px-3 rounded-pill text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}

          <section>
            <h2 className="text-xl font-semibold tracking-normal mb-4">
              Reseñas ({place.total_reviews})
            </h2>
            <div className="flex flex-col gap-6">
              <ReviewForm placeId={place.id} />
              <ReviewList placeId={place.id} />
            </div>
          </section>
        </div>

        {/* Side info */}
        <aside className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {place.address ? (
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Dirección">
                  {place.address}
                </InfoRow>
              ) : null}
              {ctaPhone ? (
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Teléfono">
                  <a
                    href={`tel:${ctaPhone}`}
                    className="text-[var(--accent)] hover:underline"
                  >
                    {ctaPhone}
                  </a>
                </InfoRow>
              ) : null}
              {place.website ? (
                <InfoRow icon={<Globe className="h-4 w-4" />} label="Sitio web">
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline break-all"
                  >
                    {place.website.replace(/^https?:\/\//, "")}
                  </a>
                </InfoRow>
              ) : null}
              {place.schedule ? (
                <InfoRow icon={<Clock className="h-4 w-4" />} label="Horario">
                  <pre className="text-xs text-[var(--text-muted)] whitespace-pre-wrap font-sans">
                    {Object.entries(place.schedule)
                      .map(([day, hours]) => `${day}: ${String(hours)}`)
                      .join("\n")}
                  </pre>
                </InfoRow>
              ) : null}
            </CardContent>
          </Card>

          {featureFlags.microsites && place.slug ? (
            <Card>
              <CardContent className="py-5">
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  Micrositio
                </p>
                <Link
                  href={`/microsites/${place.slug}`}
                  className="text-sm text-[var(--accent)] font-medium hover:underline underline-offset-4"
                >
                  Ver perfil completo →
                </Link>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 mt-0.5 text-[var(--text-muted)]">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs text-[var(--text-soft)]">{label}</span>
        <div className="text-[var(--text)] break-words">{children}</div>
      </div>
    </div>
  );
}

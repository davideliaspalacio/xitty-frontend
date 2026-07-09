import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, MapPin, Phone, Globe } from "lucide-react";
import { env } from "@/lib/env";
import { Logo } from "@/shared/ui/logo";
import { RatingStars } from "@/features/places/components/rating-stars";
import { PriceTag } from "@/features/places/components/price-tag";
import { MicrositeCta } from "@/features/microsites/components/microsite-cta";
import { MicrositeTracker } from "@/features/microsites/components/microsite-tracker";
import { AudioTourPanel } from "@/features/audio-tours";
import { featureFlags } from "@/lib/feature-flags";
import { fmtNumber } from "@/shared/utils/format";
import type { Microsite } from "@/lib/api/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchMicrosite(slug: string): Promise<Microsite | null> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/microsites/${slug}`, {
      // cache 5 minutes — perfect for shared social media links
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Microsite;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!featureFlags.microsites) return { title: "No encontrado · Xitty" };

  const { slug } = await params;
  const microsite = await fetchMicrosite(slug);
  if (!microsite) return { title: "No encontrado · Xitty" };

  const title = `${microsite.name} · Xitty`;
  const description =
    microsite.description ??
    `Descubre ${microsite.name} en Barranquilla con Xitty.`;
  const image = microsite.cover_photo_url ?? undefined;
  const url = `${env.NEXT_PUBLIC_APP_URL}/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Xitty",
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function MicrositePage({ params }: PageProps) {
  if (!featureFlags.microsites) notFound();

  const { slug } = await params;
  const microsite = await fetchMicrosite(slug);
  if (!microsite) notFound();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="border-b border-[var(--border)] sticky top-0 bg-[var(--bg)]/90 backdrop-blur z-30">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Xitty">
            <Logo size="md" />
          </Link>
          <Link
            href={`/places/${microsite.id}`}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] underline-offset-4 hover:underline"
          >
            Ver en directorio →
          </Link>
        </div>
      </header>

      <MicrositeTracker placeId={microsite.id} />

      <main className="mx-auto max-w-5xl px-6 py-10 flex flex-col gap-10">
        {/* Hero */}
        <section className="flex flex-col gap-5">
          <p className="eyebrow">{microsite.categories?.name ?? "Lugar"}</p>
          <h1 className="text-[40px] sm:text-[56px] font-semibold leading-[1.02] tracking-normal">
            {microsite.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
            <RatingStars
              value={microsite.average_rating}
              count={microsite.total_reviews}
            />
            <PriceTag range={microsite.price_range} />
            {microsite.address ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {microsite.address}
              </span>
            ) : null}
          </div>
        </section>

        {/* Cover */}
        {microsite.cover_photo_url ? (
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[var(--bg-subtle)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={microsite.cover_photo_url}
              alt={microsite.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ) : null}

        {/* CTAs */}
        <MicrositeCta microsite={microsite} />

        <AudioTourPanel placeId={microsite.id} />

        {/* Active promotions */}
        {featureFlags.promotions && microsite.active_promotions.length > 0 ? (
          <section>
            <h2 className="text-2xl font-semibold tracking-normal mb-4">
              Promociones activas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {microsite.active_promotions.map((p) => (
                <article
                  key={p.id}
                  className="rounded-lg border border-[var(--accent-soft)] bg-[var(--accent-soft)]/30 p-5 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold tracking-normal">
                      {p.title}
                    </h3>
                    {p.discount_percentage != null ? (
                      <span className="shrink-0 inline-flex items-center h-7 px-2.5 rounded-pill text-xs font-semibold bg-[var(--accent)] text-[var(--accent-fg)]">
                        -{p.discount_percentage}%
                      </span>
                    ) : null}
                  </div>
                  {p.description ? (
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      {p.description}
                    </p>
                  ) : null}
                  <p className="text-xs text-[var(--text-soft)] mt-1">
                    Vence el{" "}
                    {new Date(p.ends_at).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* About */}
        {microsite.description ? (
          <section>
            <h2 className="text-2xl font-semibold tracking-normal mb-3">
              Sobre {microsite.name}
            </h2>
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
              {microsite.description}
            </p>
          </section>
        ) : null}

        {/* Info grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[var(--border)] pt-8">
          {microsite.phone ? (
            <InfoBlock icon={<Phone className="h-4 w-4" />} label="Teléfono">
              <a
                href={`tel:${microsite.phone}`}
                className="text-[var(--accent)] hover:underline"
              >
                {microsite.phone}
              </a>
            </InfoBlock>
          ) : null}
          {microsite.website ? (
            <InfoBlock icon={<Globe className="h-4 w-4" />} label="Sitio web">
              <a
                href={microsite.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline break-all"
              >
                {microsite.website.replace(/^https?:\/\//, "")}
              </a>
            </InfoBlock>
          ) : null}
          {microsite.address ? (
            <InfoBlock icon={<MapPin className="h-4 w-4" />} label="Dirección">
              {microsite.address}
            </InfoBlock>
          ) : null}
          {microsite.schedule ? (
            <InfoBlock icon={<Clock className="h-4 w-4" />} label="Horario">
              <span className="text-xs whitespace-pre-wrap">
                {Object.entries(microsite.schedule)
                  .map(([d, h]) => `${d}: ${String(h)}`)
                  .join("\n")}
              </span>
            </InfoBlock>
          ) : null}
        </section>

        <footer className="border-t border-[var(--border)] pt-6 text-xs text-[var(--text-soft)] flex justify-between">
          <span>
            {fmtNumber.format(microsite.total_reviews)} reseñas en Xitty
          </span>
          <span>Micrositio público — xitty.co/{slug}</span>
        </footer>
      </main>
    </div>
  );
}

function InfoBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-[var(--text-soft)] uppercase tracking-wider">
        {icon} {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

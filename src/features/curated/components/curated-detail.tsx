"use client";

import { ExternalLink, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { AiCuratedBadge } from "@/shared/ui/ai-curated-badge";
import { SourceAttribution } from "@/shared/ui/source-attribution";
import { CuratedImageFallback } from "@/shared/ui/curated-image-fallback";
import { fmtCop } from "@/shared/utils/format";
import { cn } from "@/shared/utils/cn";
import type { CuratedItem } from "@/features/curated/types";

interface CuratedDetailProps {
  item: CuratedItem;
  className?: string;
}

const dateTimeFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDateTime(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return dateTimeFormatter.format(new Date(iso));
  } catch {
    return null;
  }
}

const DISCLAIMER =
  "Información sujeta a cambios. Verifica con el negocio antes de visitar.";

export function CuratedDetail({ item, className }: CuratedDetailProps) {
  const startsAtLabel = formatDateTime(item.starts_at);
  const endsAtLabel = formatDateTime(item.ends_at);

  return (
    <article className={cn("flex flex-col gap-6", className)}>
      {/* Hero image (o placeholder de marca cuando el item no tiene foto) */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-[var(--bg-subtle)]">
        {item.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.image_url}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <CuratedImageFallback label={item.title} />
        )}
        <div className="absolute top-3 left-3">
          <AiCuratedBadge />
        </div>
      </div>

      <header className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-normal leading-tight">
          {item.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-muted)]">
          {item.location_name ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {item.location_name}
            </span>
          ) : null}
          {startsAtLabel ? (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={item.starts_at ?? undefined}>
                {startsAtLabel}
                {endsAtLabel ? ` — ${endsAtLabel}` : ""}
              </time>
            </span>
          ) : null}
          {item.price_cop != null ? (
            <span className="font-semibold text-[var(--text)]">
              {fmtCop.format(item.price_cop)}
            </span>
          ) : null}
        </div>
      </header>

      {item.description ? (
        <p className="text-base leading-relaxed text-[var(--text)] whitespace-pre-line">
          {item.description}
        </p>
      ) : null}

      {/* Source link — clickable, opens in new tab. Kept prominent so
          the user can verify the original posting. */}
      {item.source_url ? (
        <div className="flex flex-col gap-2">
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start h-10 px-4 rounded-pill border border-[var(--border-strong)] bg-[var(--surface)] text-sm font-medium hover:bg-[var(--bg-subtle)] transition-colors"
          >
            Ver fuente original
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <SourceAttribution
            sourceUrl={item.source_url}
            scrapedAt={item.scraped_at}
          />
        </div>
      ) : null}

      {/* Disclaimer */}
      <aside
        role="note"
        className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-3 text-xs text-[var(--text-muted)]"
      >
        <AlertTriangle
          className="h-4 w-4 shrink-0 mt-0.5 text-[var(--accent)]"
          aria-hidden="true"
        />
        <span>{DISCLAIMER}</span>
      </aside>
    </article>
  );
}

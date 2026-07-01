"use client";

import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { AiCuratedBadge } from "@/shared/ui/ai-curated-badge";
import { SourceAttribution } from "@/shared/ui/source-attribution";
import { CuratedImageFallback } from "@/shared/ui/curated-image-fallback";
import { cn } from "@/shared/utils/cn";
import type { CuratedItem } from "@/features/curated/types";

interface CuratedCardProps {
  item: CuratedItem;
  className?: string;
}

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatStartsAt(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return null;
  }
}

export function CuratedCard({ item, className }: CuratedCardProps) {
  const startsAtLabel = formatStartsAt(item.starts_at);

  return (
    <article
      className={cn(
        "group relative shrink-0 w-[280px] sm:w-[320px] flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-flat)] hover:border-[var(--ink)]",
        className,
      )}
    >
      <Link
        href={`/curated/${item.id}`}
        aria-label={item.title}
        className="flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[4/3] bg-[var(--bg-subtle)] overflow-hidden">
          {item.image_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.image_url}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <CuratedImageFallback label={item.title} />
          )}

          {/* AI-curated sticker, top-left */}
          <AiCuratedBadge className="absolute top-2.5 left-2.5" />
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-[15px] font-semibold tracking-tight line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {item.location_name ? (
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              <span className="line-clamp-1">{item.location_name}</span>
            </div>
          ) : null}

          {startsAtLabel ? (
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <time dateTime={item.starts_at ?? undefined}>
                {startsAtLabel}
              </time>
            </div>
          ) : null}
        </div>
      </Link>

      {/* Footer attribution — kept OUTSIDE the card link so the source
          link is reachable and announced separately by assistive tech.
          Solo se pinta si el item trae fuente (el card DTO del listado no la
          incluye, así evitamos un footer vacío / "Hace NaN años"). */}
      {item.source_url ? (
        <footer className="px-4 pb-3 pt-1 border-t border-[var(--border)] mt-auto">
          <SourceAttribution
            sourceUrl={item.source_url}
            scrapedAt={item.scraped_at}
          />
        </footer>
      ) : null}
    </article>
  );
}

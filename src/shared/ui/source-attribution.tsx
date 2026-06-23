import * as React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatRelativeDate } from "@/shared/utils/format";

export interface SourceAttributionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Full URL of the original source (e.g. an Instagram post). */
  sourceUrl: string;
  /** ISO timestamp when the source was scraped. */
  scrapedAt: string;
}

/**
 * Returns a clean hostname for display ("instagram.com" rather than
 * "www.instagram.com"). Falls back to the raw input when URL parsing
 * fails so we never render an empty string.
 */
function displayHost(sourceUrl: string): string {
  try {
    const url = new URL(sourceUrl);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return sourceUrl;
  }
}

/**
 * Tiny footer line for cards showing where curated content was
 * pulled from and how long ago. Designed to sit at the bottom of an
 * AI-curated card next to the AiCuratedBadge.
 */
export const SourceAttribution = React.forwardRef<
  HTMLDivElement,
  SourceAttributionProps
>(({ sourceUrl, scrapedAt, className, ...props }, ref) => {
  const host = displayHost(sourceUrl);
  const relative = formatRelativeDate(scrapedAt);

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]",
        className,
      )}
      {...props}
    >
      <span>Via </span>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 underline-offset-2 hover:underline hover:text-[var(--text)]"
      >
        {host}
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
      </a>
      <span aria-hidden="true">·</span>
      <time dateTime={scrapedAt}>{relative}</time>
    </div>
  );
});
SourceAttribution.displayName = "SourceAttribution";

/**
 * Curated discovery items — pieces of content surfaced by the AI-curated
 * pipeline. The data is scraped from third-party sources, scored for
 * quality, and republished in the public `Descubre lo nuevo` feed.
 *
 * The pipeline must remain pluggable: any concrete scraper that
 * implements `ScraperSource` can produce items. The frontend never
 * cares which source provided an item beyond the `source_url` it
 * displays for attribution.
 */
export interface ScraperSource {
  /** Stable identifier for the source (e.g. "instagram", "tripadvisor"). */
  readonly id: string;
  /** Friendly name shown in admin tooling. */
  readonly name: string;
  /** Hostname used when computing `source_url`. */
  readonly hostname: string;
}

/**
 * Card representation of a curated item — slim enough for carousels and
 * grids. Matches the backend `CuratedItemCardDto` plus the auditing
 * fields (`source_url`, `scraped_at`) the frontend expects to render in
 * the footer attribution and on the detail view.
 */
export interface CuratedItem {
  id: string;
  title: string;
  description: string | null;
  /** Free-form hint (e.g. "evento", "tour", "restaurante"). */
  category: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  price_cop: number | null;
  image_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  /** Score in [0, 1] produced by the quality pipeline. */
  quality_score: number;
  /** Original URL on the source site. */
  source_url: string | null;
  /** ISO timestamp when the source was scraped. */
  scraped_at: string;
}

export interface GetCuratedParams {
  limit?: number;
  category?: string;
}

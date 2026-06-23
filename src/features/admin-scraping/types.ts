/**
 * Tipos del modulo admin-scraping (frontend espejo de los DTOs del backend).
 *
 * Se mantienen acoplados al contrato de `/admin/scraping/*` pero NO se
 * importan desde el backend — esto es el frontend, los tipos viven aca.
 */

export type ScrapingSourceKind =
  | "google_places"
  | "eventbrite"
  | "tavily"
  | "firecrawl"
  | "manual";

/**
 * Interface pluggable para registrar nuevas fuentes en el panel sin tocar
 * cada componente. Cada source declara su `kind` (lo que viaja al backend)
 * y un `label` legible para el toggle / "Run now" UI.
 *
 * `requiresApiKey` se usa para pintar un warning visual cuando la fuente
 * normalmente necesita una API key pero el backend no la tiene configurada
 * — en ese caso el run vuelve mock data en vez de fallar.
 */
export interface ScraperSource {
  kind: ScrapingSourceKind;
  label: string;
  description: string;
  requiresApiKey: boolean;
}

export interface ScrapingSourceWithMeta {
  id: string;
  name: string;
  kind: ScrapingSourceKind;
  config: Record<string, unknown>;
  enabled: boolean;
  schedule_cron: string | null;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
  items_count: number;
}

export type ScrapingRunStatus =
  | "running"
  | "succeeded"
  | "failed"
  | "partial";

export interface ScrapingRun {
  id: string;
  source_id: string;
  status: ScrapingRunStatus;
  triggered_by: string | null;
  items_found: number;
  items_enriched: number;
  items_failed: number;
  error: string | null;
  started_at: string;
  finished_at: string | null;
}

export type EnrichedItemStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "published";

export interface ScrapedItemEnriched {
  id: string;
  raw_id: string;
  title: string;
  description: string | null;
  category_hint: string | null;
  location_name: string | null;
  lat: number | null;
  lng: number | null;
  starts_at: string | null;
  ends_at: string | null;
  price_cop: number | null;
  image_url: string | null;
  source_url: string | null;
  quality_score: number | null;
  status: EnrichedItemStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  published_place_id: string | null;
  published_experience_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateScrapingSourcePayload {
  name: string;
  kind: ScrapingSourceKind;
  config?: Record<string, unknown>;
  enabled?: boolean;
  schedule_cron?: string | null;
}

export interface UpdateScrapingSourcePayload {
  enabled?: boolean;
  schedule_cron?: string | null;
  config?: Record<string, unknown>;
}

export interface UpdateScrapedItemPayload {
  title?: string;
  description?: string;
  category_hint?: string;
  location_name?: string;
  lat?: number;
  lng?: number;
  starts_at?: string;
  ends_at?: string;
  price_cop?: number;
}

export interface ListItemsQuery {
  status?: EnrichedItemStatus;
  page?: number;
  limit?: number;
}

export interface ListRunsQuery {
  source_id?: string;
  limit?: number;
}

/**
 * Registry estatico de sources pluggables. Add a new entry here when the
 * backend gains a new ScraperSource kind — el resto de la UI lo recoge solo.
 */
export const SCRAPER_SOURCES: ScraperSource[] = [
  {
    kind: "google_places",
    label: "Google Places",
    description: "Lugares cercanos por nearby search.",
    requiresApiKey: true,
  },
  {
    kind: "eventbrite",
    label: "Eventbrite",
    description: "Eventos publicos en Barranquilla.",
    requiresApiKey: true,
  },
  {
    kind: "tavily",
    label: "Tavily Search",
    description: "Web search general (fallback).",
    requiresApiKey: true,
  },
  {
    kind: "firecrawl",
    label: "Firecrawl",
    description: "Crawler de paginas locales.",
    requiresApiKey: true,
  },
  {
    kind: "manual",
    label: "Manual",
    description: "Entrada manual / seed data.",
    requiresApiKey: false,
  },
];

export function getScraperSource(kind: ScrapingSourceKind): ScraperSource | undefined {
  return SCRAPER_SOURCES.find((s) => s.kind === kind);
}

import { api } from "@/lib/api/http";
import type {
  CreateScrapingSourcePayload,
  ListItemsQuery,
  ListPlaceCompletenessQuery,
  ListRunsQuery,
  PlaceCompletenessReport,
  ScrapedItemEnriched,
  ScrapingRun,
  ScrapingSourceWithMeta,
  UpdateScrapedItemPayload,
  UpdateScrapingSourcePayload,
} from "@/features/admin-scraping/types";

function qs(params: object): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

/**
 * Resumen del run que devuelve `POST /sources/:id/run`.
 *
 * El backend no siempre manda `status`: cuando falla suele venir con
 * `errored: true` + `error_message`, y cuando va bien manda los contadores
 * (`items_*`). Por eso todos los campos descriptivos son opcionales y la UI
 * deriva el texto del toast del shape real que llegue (ver `sources-panel`).
 */
export interface RunSummary {
  run_id?: string;
  source_id: string;
  status?: "succeeded" | "failed" | "partial";
  items_found?: number;
  items_enriched?: number;
  items_failed?: number;
  errored?: boolean;
  error_message?: string | null;
  error?: string | null;
}

/**
 * Cliente HTTP del modulo. Cada llamada va contra `/admin/scraping/*` y va
 * con el bearer del admin actual (`auth: true` es el default del cliente).
 */
export const adminScrapingApi = {
  // Sources
  listSources: () =>
    api.get<ScrapingSourceWithMeta[]>("/admin/scraping/sources"),

  createSource: (payload: CreateScrapingSourcePayload) =>
    api.post<ScrapingSourceWithMeta>("/admin/scraping/sources", payload),

  toggleSource: (id: string, payload: UpdateScrapingSourcePayload) =>
    api.patch<ScrapingSourceWithMeta>(`/admin/scraping/sources/${id}`, payload),

  runSource: (id: string) =>
    api.post<RunSummary>(`/admin/scraping/sources/${id}/run`),

  // Runs
  listRuns: (query: ListRunsQuery = {}) =>
    api.get<ScrapingRun[]>(`/admin/scraping/runs${qs(query)}`),

  // Items (moderation)
  listItems: (query: ListItemsQuery = {}) =>
    api.get<ScrapedItemEnriched[]>(`/admin/scraping/items${qs(query)}`),

  getItem: (id: string) =>
    api.get<ScrapedItemEnriched>(`/admin/scraping/items/${id}`),

  updateItem: (id: string, payload: UpdateScrapedItemPayload) =>
    api.patch<ScrapedItemEnriched>(`/admin/scraping/items/${id}`, payload),

  approveItem: (id: string) =>
    api.post<ScrapedItemEnriched>(`/admin/scraping/items/${id}/approve`),

  rejectItem: (id: string, reason?: string) =>
    api.post<ScrapedItemEnriched>(
      `/admin/scraping/items/${id}/reject`,
      reason ? { reason } : {},
    ),

  publishItem: (id: string) =>
    api.post<ScrapedItemEnriched>(`/admin/scraping/items/${id}/publish`),

  // Place data quality report
  listPlaceCompleteness: (query: ListPlaceCompletenessQuery = {}) =>
    api.get<PlaceCompletenessReport>(
      `/admin/scraping/place-completeness${qs(query)}`,
    ),
};

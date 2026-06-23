import { api } from "@/lib/api/http";
import type { CuratedItem, GetCuratedParams } from "@/features/curated/types";

function qs(params: Record<string, string | number | undefined | null>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export const curatedApi = {
  /**
   * Public feed of AI-curated items, newest + highest quality first.
   * Backend route: `GET /discover/curated`.
   */
  getCurated: (params: GetCuratedParams = {}) =>
    api.get<CuratedItem[]>(
      `/discover/curated${qs({
        limit: params.limit ?? undefined,
        category: params.category ?? undefined,
      })}`,
      { auth: false },
    ),

  /**
   * Detail view for a single curated item. Backend route:
   * `GET /discover/curated/:id`.
   */
  getCuratedById: (id: string) =>
    api.get<CuratedItem>(`/discover/curated/${id}`, { auth: false }),
};

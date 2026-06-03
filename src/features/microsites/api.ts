import { api } from "@/lib/api/http";
import type { Microsite } from "@/lib/api/types";

export const micrositesApi = {
  bySlug: (slug: string) =>
    api.get<Microsite>(`/microsites/${slug}`, { auth: false }),
};

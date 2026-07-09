import { describe, expect, it, vi } from "vitest";
import { adminScrapingApi } from "@/features/admin-scraping/api";
import { api } from "@/lib/api/http";

vi.mock("@/lib/api/http", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("adminScrapingApi", () => {
  it("lista reporte de completitud con filtros", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [],
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
      summary: {
        total_places: 0,
        complete_places: 0,
        incomplete_places: 0,
        average_completeness_score: 0,
        by_category: [],
        fields: [],
      },
    });

    await adminScrapingApi.listPlaceCompleteness({
      city: "Cartagena",
      missing_only: true,
      page: 1,
      limit: 50,
    });

    expect(api.get).toHaveBeenCalledWith(
      "/admin/scraping/place-completeness?city=Cartagena&missing_only=true&page=1&limit=50",
    );
  });
});

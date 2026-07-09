import { describe, expect, it, vi } from "vitest";
import { adminApi } from "@/features/admin/api";
import { api } from "@/lib/api/http";

vi.mock("@/lib/api/http", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("adminApi", () => {
  it("lista destacados programados", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    });

    await adminApi.listFeatured(1, 20);

    expect(api.get).toHaveBeenCalledWith("/featured?page=1&limit=20");
  });

  it("crea destacados con ventana semanal y credito", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ id: "featured-1" });

    await adminApi.createFeatured({
      place_id: "place-1",
      curator_name: "Xitty",
      week_starts_at: "2026-07-06T05:00:00.000Z",
      week_ends_at: "2026-07-13T04:59:00.000Z",
      custom_title: "Plan local",
      position: 1,
      is_active: true,
    });

    expect(api.post).toHaveBeenCalledWith("/admin/featured", {
      place_id: "place-1",
      curator_name: "Xitty",
      week_starts_at: "2026-07-06T05:00:00.000Z",
      week_ends_at: "2026-07-13T04:59:00.000Z",
      custom_title: "Plan local",
      position: 1,
      is_active: true,
    });
  });

  it("actualiza estado de destacados", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({ id: "featured-1" });

    await adminApi.updateFeatured("featured-1", { is_active: false });

    expect(api.patch).toHaveBeenCalledWith("/admin/featured/featured-1", {
      is_active: false,
    });
  });

  it("elimina destacados", async () => {
    vi.mocked(api.delete).mockResolvedValueOnce(undefined);

    await adminApi.deleteFeatured("featured-1");

    expect(api.delete).toHaveBeenCalledWith("/admin/featured/featured-1");
  });

  it("manda duration_days y priority al activar patrocinio", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      place_id: "place-1",
      is_sponsored: true,
      sponsored_at: "2026-07-09T00:00:00.000Z",
      sponsored_until: "2026-08-08T00:00:00.000Z",
      sponsorship_priority: 75,
    });

    await adminApi.activateSponsorship("place-1", 30, 75);

    expect(api.post).toHaveBeenCalledWith("/admin/places/place-1/sponsorship", {
      duration_days: 30,
      priority: 75,
    });
  });

  it("lee configuracion del ranking", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      id: "default",
      rating_weight: 0.45,
      views_weight: 0.25,
      conversions_weight: 0.3,
      rating_prior: 4.2,
      rating_prior_reviews: 10,
      views_cap: 500,
      conversions_cap: 100,
      window_days: 30,
      updated_at: "2026-07-09T00:00:00.000Z",
      weight_total: 1,
    });

    await adminApi.getRankingConfig();

    expect(api.get).toHaveBeenCalledWith("/admin/ranking/config");
  });

  it("actualiza configuracion del ranking", async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({
      id: "default",
      rating_weight: 0.5,
      views_weight: 0.2,
      conversions_weight: 0.3,
      rating_prior: 4.2,
      rating_prior_reviews: 10,
      views_cap: 500,
      conversions_cap: 100,
      window_days: 30,
      updated_at: "2026-07-09T00:00:00.000Z",
      weight_total: 1,
    });

    await adminApi.updateRankingConfig({
      rating_weight: 0.5,
      views_weight: 0.2,
    });

    expect(api.patch).toHaveBeenCalledWith("/admin/ranking/config", {
      rating_weight: 0.5,
      views_weight: 0.2,
    });
  });

  it("dispara refresh manual del ranking", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      refreshed_at: "2026-07-09T12:00:00.000Z",
    });

    await adminApi.refreshRanking();

    expect(api.post).toHaveBeenCalledWith("/admin/ranking/refresh");
  });
});

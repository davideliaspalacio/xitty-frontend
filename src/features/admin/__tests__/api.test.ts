import { describe, expect, it, vi } from "vitest";
import { adminApi } from "@/features/admin/api";
import { api } from "@/lib/api/http";

vi.mock("@/lib/api/http", () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("adminApi", () => {
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
});

import { describe, expect, it, vi } from "vitest";
import { discoverApi } from "@/features/discover/api";
import { api } from "@/lib/api/http";

vi.mock("@/lib/api/http", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("discoverApi", () => {
  it("manda city al ranking para usar rankings por ciudad", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });

    await discoverApi.ranking(8, "familia", "Cartagena");

    expect(api.get).toHaveBeenCalledWith(
      "/ranking?limit=8&traveler_type=familia&city=Cartagena",
      { auth: false },
    );
  });
});

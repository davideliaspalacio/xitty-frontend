import { describe, expect, it, vi } from "vitest";
import { placesApi } from "@/features/places/api";
import { api } from "@/lib/api/http";

vi.mock("@/lib/api/http", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("placesApi", () => {
  it("manda city y zone en el listado", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [],
      total: 0,
      page: 1,
      limit: 24,
      totalPages: 0,
    });

    await placesApi.list({
      city: "Cartagena",
      zone: "Centro Historico",
      limit: 24,
    });

    expect(api.get).toHaveBeenCalledWith(
      "/places?city=Cartagena&zone=Centro+Historico&limit=24",
      { auth: false },
    );
  });

  it("manda city en la busqueda", async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [],
      total: 0,
      page: 1,
      limit: 24,
      totalPages: 0,
    });

    await placesApi.search({
      q: "murallas",
      city: "Cartagena",
      limit: 24,
    });

    expect(api.get).toHaveBeenCalledWith(
      "/places/search?q=murallas&city=Cartagena&limit=24",
      { auth: false },
    );
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataQualityPanel } from "@/features/admin-scraping/components/data-quality-panel";
import type { PlaceCompletenessReport } from "@/features/admin-scraping/types";

vi.mock("@/lib/env", () => ({
  env: {
    NEXT_PUBLIC_DEFAULT_CITY: "Cartagena",
  },
}));

vi.mock("@/features/admin-scraping/hooks/use-place-completeness", () => ({
  usePlaceCompleteness: vi.fn(),
}));

import { usePlaceCompleteness } from "@/features/admin-scraping/hooks/use-place-completeness";

const mockedUsePlaceCompleteness = vi.mocked(usePlaceCompleteness);

const report: PlaceCompletenessReport = {
  data: [
    {
      id: "place-1",
      name: "Castillo de Salgar",
      city: "Cartagena",
      zone: "Centro",
      category_id: "cat-1",
      category_name: "Sitios Turisticos",
      category_slug: "sitios-turisticos",
      source_kind: "google_places",
      source_external_id: "g-1",
      source_url: "https://maps.google.com/?cid=1",
      photos_count: 0,
      cover_photos_count: 0,
      missing_fields: ["photos", "cover_photo", "website"],
      missing_count: 3,
      completeness_score: 0.7,
      created_at: "2026-07-09T00:00:00.000Z",
      updated_at: "2026-07-09T00:00:00.000Z",
    },
  ],
  total: 1,
  page: 1,
  limit: 50,
  totalPages: 1,
  summary: {
    total_places: 1,
    complete_places: 0,
    incomplete_places: 1,
    average_completeness_score: 0.7,
    by_category: [
      {
        category_id: "cat-1",
        category_name: "Sitios Turisticos",
        total_places: 1,
        complete_places: 0,
        incomplete_places: 1,
        average_completeness_score: 0.7,
      },
    ],
    fields: [
      {
        field: "photos",
        present_places: 0,
        missing_places: 1,
        completeness_percent: 0,
      },
      {
        field: "website",
        present_places: 0,
        missing_places: 1,
        completeness_percent: 0,
      },
    ],
  },
};

describe("DataQualityPanel", () => {
  beforeEach(() => {
    mockedUsePlaceCompleteness.mockReset();
    mockedUsePlaceCompleteness.mockReturnValue({
      data: report,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof usePlaceCompleteness>);
  });

  it("muestra resumen, desglose y lugares con faltantes", () => {
    render(<DataQualityPanel />);

    expect(screen.getByDisplayValue("Cartagena")).toBeInTheDocument();
    expect(screen.getByText("Lugares")).toBeInTheDocument();
    expect(screen.getByText("Con faltantes")).toBeInTheDocument();
    expect(screen.getAllByText("Castillo de Salgar").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Fotos")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Sitios Turisticos").length).toBeGreaterThan(0);
  });

  it("activa el filtro de solo faltantes", async () => {
    const user = userEvent.setup();
    render(<DataQualityPanel />);

    await user.click(screen.getByLabelText(/solo faltantes/i));

    expect(mockedUsePlaceCompleteness).toHaveBeenLastCalledWith(
      expect.objectContaining({
        city: "Cartagena",
        missing_only: true,
      }),
    );
  });
});

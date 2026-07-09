import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/features/auth/components/role-gate", () => ({
  RoleGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/features/places", () => ({
  usePlaces: () => ({
    data: {
      data: [
        {
          id: "place-1",
          name: "Castillo de Salgar",
        },
      ],
    },
    isLoading: false,
  }),
}));

vi.mock("@/features/admin", () => ({
  useAdminFeatured: () => ({
    data: {
      data: [
        {
          id: "featured-1",
          place_id: "place-1",
          curator_name: "Xitty",
          custom_title: "Ruta de historia",
          custom_description: "Una parada recomendada para esta semana.",
          hero_image_url: null,
          week_starts_at: "2026-07-06T05:00:00.000Z",
          week_ends_at: "2026-07-13T04:59:00.000Z",
          position: 1,
          is_active: true,
          created_by: "admin-1",
          created_at: "2026-07-06T05:00:00.000Z",
          updated_at: "2026-07-06T05:00:00.000Z",
          place: {
            id: "place-1",
            name: "Castillo de Salgar",
            slug: "castillo-de-salgar",
            description: null,
            address: null,
            category_id: null,
            average_rating: 4.8,
            total_reviews: 20,
            cover_photo_url: null,
          },
        },
      ],
    },
    isLoading: false,
  }),
  useCreateFeatured: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateFeatured: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useDeleteFeatured: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

import AdminFeaturedPage from "@/app/(app)/admin/featured/page";

describe("AdminFeaturedPage", () => {
  it("renders the weekly featured admin form and schedule list", () => {
    render(<AdminFeaturedPage />);

    expect(
      screen.getByRole("heading", { name: /destacados semanales/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/lugar/i)).toBeInTheDocument();
    expect(screen.getByText("Castillo de Salgar")).toBeInTheDocument();
    expect(screen.getByText("Ruta de historia")).toBeInTheDocument();
    expect(screen.getByText("Vigente")).toBeInTheDocument();
  });
});

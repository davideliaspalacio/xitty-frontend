import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
  updateMutate: vi.fn(),
  refreshMutate: vi.fn(),
  rankingConfig: {
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
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/features/auth/components/role-gate", () => ({
  RoleGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/features/admin", () => ({
  useRankingConfig: () => ({
    data: mocks.rankingConfig,
    isLoading: false,
    isError: false,
  }),
  useUpdateRankingConfig: () => ({
    mutateAsync: mocks.updateMutate,
    isPending: false,
  }),
  useRefreshRanking: () => ({
    mutateAsync: mocks.refreshMutate,
    isPending: false,
  }),
}));

import AdminRankingPage from "@/app/(app)/admin/ranking/page";

describe("AdminRankingPage", () => {
  beforeEach(() => {
    mocks.updateMutate.mockReset();
    mocks.refreshMutate.mockReset();
    mocks.updateMutate.mockResolvedValue({});
    mocks.refreshMutate.mockResolvedValue({
      refreshed_at: "2026-07-09T12:00:00.000Z",
    });
  });

  it("renderiza configuracion actual del ranking", () => {
    render(<AdminRankingPage />);

    expect(
      screen.getByRole("heading", { name: /configuración del ranking/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/peso de calificación/i)).toHaveValue(0.45);
    expect(screen.getByText(/total de pesos: 1.00/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /refrescar ranking/i }),
    ).toBeInTheDocument();
  });

  it("guarda los parametros editados", async () => {
    const user = userEvent.setup();
    render(<AdminRankingPage />);

    const ratingInput = screen.getByLabelText(/peso de calificación/i);
    await user.clear(ratingInput);
    await user.type(ratingInput, "0.5");
    await user.click(screen.getByRole("button", { name: /guardar cambios/i }));

    expect(mocks.updateMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        rating_weight: 0.5,
        views_weight: 0.25,
        conversions_weight: 0.3,
        rating_prior: 4.2,
        rating_prior_reviews: 10,
        views_cap: 500,
        conversions_cap: 100,
        window_days: 30,
      }),
    );
  });

  it("dispara refresh manual", async () => {
    const user = userEvent.setup();
    render(<AdminRankingPage />);

    await user.click(
      screen.getByRole("button", { name: /refrescar ranking/i }),
    );

    expect(mocks.refreshMutate).toHaveBeenCalledTimes(1);
  });
});

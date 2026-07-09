import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PromotionForm } from "@/features/promotions/components/promotion-form";
import type { CreatePromotionPayload } from "@/lib/api/types";

const mutateCreate = vi.fn();
const mutateUpdate = vi.fn();

vi.mock("@/features/promotions", () => ({
  useCreatePromotion: () => ({
    mutateAsync: mutateCreate,
    isPending: false,
  }),
  useUpdatePromotion: () => ({
    mutateAsync: mutateUpdate,
    isPending: false,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("PromotionForm", () => {
  beforeEach(() => {
    mutateCreate.mockReset();
    mutateUpdate.mockReset();
    mutateCreate.mockResolvedValue({});
    mutateUpdate.mockResolvedValue({});
  });

  it("envia fechas date-only para que el backend normalice America/Bogota", async () => {
    const user = userEvent.setup();
    render(<PromotionForm placeId="place-1" />);

    await user.clear(screen.getByLabelText(/t[ií]tulo/i));
    await user.type(screen.getByLabelText(/t[ií]tulo/i), "Promo de un dia");
    await user.clear(screen.getByLabelText(/inicio/i));
    await user.type(screen.getByLabelText(/inicio/i), "2026-07-09");
    await user.clear(screen.getByLabelText(/fin/i));
    await user.type(screen.getByLabelText(/fin/i), "2026-07-09");
    await user.click(
      screen.getByRole("button", { name: /crear promoci[oó]n/i }),
    );

    await waitFor(() => expect(mutateCreate).toHaveBeenCalledTimes(1));
    const payload = mutateCreate.mock.calls[0][0] as CreatePromotionPayload;
    expect(payload.starts_at).toBe("2026-07-09");
    expect(payload.ends_at).toBe("2026-07-09");
  });

  it("permite promociones de un solo dia", async () => {
    const user = userEvent.setup();
    render(<PromotionForm placeId="place-1" />);

    await user.clear(screen.getByLabelText(/t[ií]tulo/i));
    await user.type(screen.getByLabelText(/t[ií]tulo/i), "Hoy solamente");
    await user.clear(screen.getByLabelText(/inicio/i));
    await user.type(screen.getByLabelText(/inicio/i), "2026-08-01");
    await user.clear(screen.getByLabelText(/fin/i));
    await user.type(screen.getByLabelText(/fin/i), "2026-08-01");
    await user.click(
      screen.getByRole("button", { name: /crear promoci[oó]n/i }),
    );

    await waitFor(() => expect(mutateCreate).toHaveBeenCalledTimes(1));
    expect(
      screen.queryByText(/fecha de fin debe ser/i),
    ).not.toBeInTheDocument();
  });
});

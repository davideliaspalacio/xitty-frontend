import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Topbar } from "@/shared/layout/topbar";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/features/auth/store/auth-store", () => ({
  useAuthStore: (selector: (s: unknown) => unknown) =>
    selector({
      user: { id: "u1", email: "test@example.com", full_name: "Test User" },
    }),
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useLogout: () => vi.fn(),
}));

describe("Topbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search input", () => {
    render(<Topbar />);
    expect(
      screen.getByPlaceholderText(/buscar lugares/i),
    ).toBeInTheDocument();
  });

  it("renders the SOS emergency button next to the avatar", () => {
    render(<Topbar />);
    expect(
      screen.getByRole("button", { name: /llamar emergencia/i }),
    ).toBeInTheDocument();
  });
});

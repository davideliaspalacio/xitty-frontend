import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/features/favorites/hooks/use-favorites", () => ({
  useFavoriteIds: vi.fn(() => new Set<string>()),
  useToggleFavorite: vi.fn(() => ({ mutateAsync: vi.fn() })),
}));

vi.mock("@/features/auth/store/auth-store", () => ({
  useAuthStore: <T,>(selector: (s: { accessToken: string | null }) => T) =>
    selector({ accessToken: "token" }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("sonner", () => ({ toast: { info: vi.fn(), error: vi.fn() } }));

import { FavoriteButton } from "@/features/favorites/components/favorite-button";

describe("FavoriteButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders an accessible toggle button", () => {
    render(<FavoriteButton placeId="p-1" />);
    expect(
      screen.getByRole("button", { name: /guardar en favoritos/i }),
    ).toBeInTheDocument();
  });

  it.each(["sm", "md", "lg"] as const)(
    "exposes a touch target of at least 40px for size %s",
    (size) => {
      render(<FavoriteButton placeId="p-1" size={size} />);
      const btn = screen.getByRole("button");
      // The touch target is provided by an invisible ::before overlay
      // (before:min-h-[44px] before:min-w-[44px]) so the visible chrome can
      // stay icon-sized while the tappable area meets the 44px guideline.
      expect(btn.className).toContain("before:min-h-[44px]");
      expect(btn.className).toContain("before:min-w-[44px]");
    },
  );
});

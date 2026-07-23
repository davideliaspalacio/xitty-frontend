import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Topbar } from "@/shared/layout/topbar";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

const authMock = vi.hoisted(() => ({
  user: {
    id: "u1",
    email: "test@example.com",
    full_name: "Test User",
    role: "user",
  } as { id: string; email: string; full_name: string; role: string },
}));

vi.mock("@/features/auth/store/auth-store", () => ({
  useAuthStore: (selector: (s: unknown) => unknown) =>
    selector({ user: authMock.user }),
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useLogout: () => vi.fn(),
}));

describe("Topbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Por defecto, turista (ve el SOS).
    authMock.user = {
      id: "u1",
      email: "test@example.com",
      full_name: "Test User",
      role: "user",
    };
  });

  it("renders the search input", () => {
    render(<Topbar />);
    expect(
      screen.getByPlaceholderText(/buscar lugares/i),
    ).toBeInTheDocument();
  });

  it("renders the SOS emergency button for a turista", () => {
    render(<Topbar />);
    expect(
      screen.getByRole("button", { name: /llamar emergencia/i }),
    ).toBeInTheDocument();
  });

  it("hides the SOS button for a business owner (not a turista)", () => {
    authMock.user = { ...authMock.user, role: "business" };
    render(<Topbar />);
    expect(
      screen.queryByRole("button", { name: /llamar emergencia/i }),
    ).toBeNull();
  });

  it("renders the LanguageSelector next to the EmergencyButton", () => {
    render(<Topbar />);
    const lang = screen.getByRole("button", { name: /cambiar idioma/i });
    const sos = screen.getByRole("button", { name: /llamar emergencia/i });
    expect(lang).toBeInTheDocument();
    expect(sos).toBeInTheDocument();
    // Both should live in the same horizontal action group on the right.
    // Walk up to find a common ancestor that lays them out as siblings.
    const langParent = lang.parentElement;
    const sosParent = sos.parentElement;
    // Either they share a parent, or one wraps the other in a flex container.
    const sharedAncestor =
      langParent && sosParent && (
        langParent === sosParent ||
        langParent.parentElement === sosParent ||
        sosParent.parentElement === langParent ||
        langParent.parentElement === sosParent.parentElement
      );
    expect(sharedAncestor).toBe(true);
  });
});

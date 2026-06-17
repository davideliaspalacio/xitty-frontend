import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// AuthGate just renders its children — we are not testing auth here.
vi.mock("@/features/auth/components/auth-gate", () => ({
  AuthGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Sidebar/Topbar are heavy; stub them with simple markers so we can
// assert layout composition without rendering the whole world.
vi.mock("@/shared/layout/sidebar", () => ({
  Sidebar: () => <aside data-testid="sidebar" />,
}));

vi.mock("@/shared/layout/topbar", () => ({
  Topbar: () => <header data-testid="topbar" />,
}));

vi.mock("@/features/geo/components/location-banner", () => ({
  LocationBanner: () => <div data-testid="location-banner" />,
}));

vi.mock("@/features/geo/hooks/use-geo-heartbeat", () => ({
  useGeoHeartbeat: () => undefined,
}));

// The auth store selector — return a guest user.
vi.mock("@/features/auth/store/auth-store", () => ({
  useAuthStore: <T,>(selector: (s: { user: { role: string } | null }) => T) =>
    selector({ user: { role: "user" } }),
}));

// Spy on the ChatBubble component to make sure the layout mounts it.
vi.mock("@/features/chat", () => ({
  ChatBubble: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="chat-bubble" aria-label="Abrir asistente Xi" onClick={onClick}>
      Xi
    </button>
  ),
  ChatPanel: ({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) =>
    open ? (
      <div data-testid="chat-panel" role="dialog">
        <button onClick={onClose}>close</button>
      </div>
    ) : null,
}));

// ContextToast is headless — we just verify it is mounted.
vi.mock("@/features/suggestions", () => ({
  ContextToast: () => <div data-testid="context-toast" />,
}));

import AppLayout from "@/app/(app)/layout";

describe("AppLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the ChatBubble FAB", () => {
    render(
      <AppLayout>
        <div>child</div>
      </AppLayout>,
    );
    expect(screen.getByTestId("chat-bubble")).toBeInTheDocument();
  });

  it("mounts the ContextToast listener", () => {
    render(
      <AppLayout>
        <div>child</div>
      </AppLayout>,
    );
    expect(screen.getByTestId("context-toast")).toBeInTheDocument();
  });

  it("renders the topbar, sidebar and main content", () => {
    render(
      <AppLayout>
        <div data-testid="child" />
      </AppLayout>,
    );
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("topbar")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});

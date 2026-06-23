import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { SafetyBadge } from "@/features/suggestions/components/safety-badge";

describe("SafetyBadge", () => {
  it("renders with tone=good using teal styles", () => {
    const { container } = render(
      <SafetyBadge score={82} neighborhood="El Prado" tone="good" />,
    );
    const badge = container.firstElementChild as HTMLElement;
    expect(badge).toBeTruthy();
    expect(badge.getAttribute("data-tone")).toBe("good");
    expect(badge.className).toMatch(/teal/);
  });

  it("renders with tone=caution using red styles", () => {
    const { container } = render(
      <SafetyBadge score={42} neighborhood="Rebolo" tone="caution" />,
    );
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.getAttribute("data-tone")).toBe("caution");
    expect(badge.className).toMatch(/red/);
  });

  it("renders with tone=ok using yellow styles", () => {
    const { container } = render(
      <SafetyBadge score={60} neighborhood="Centro" tone="ok" />,
    );
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.getAttribute("data-tone")).toBe("ok");
    expect(badge.className).toMatch(/yellow/);
  });

  it("includes the neighborhood in the visible text", () => {
    render(<SafetyBadge score={82} neighborhood="El Prado" tone="good" />);
    expect(screen.getByText(/El Prado/)).toBeInTheDocument();
  });

  it("uses tone label in the visible text (Spanish)", () => {
    render(<SafetyBadge score={42} neighborhood="Rebolo" tone="caution" />);
    // Text follows the shape "Zona <tone-label> · <neighborhood>"
    expect(screen.getByText(/Zona/i)).toBeInTheDocument();
    expect(screen.getByText(/Rebolo/)).toBeInTheDocument();
  });
});

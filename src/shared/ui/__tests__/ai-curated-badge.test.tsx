import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AiCuratedBadge } from "@/shared/ui/ai-curated-badge";

describe("AiCuratedBadge", () => {
  it("renders the visible label", () => {
    render(<AiCuratedBadge />);
    expect(screen.getByText(/curado con ia/i)).toBeInTheDocument();
  });

  it("exposes an aria-label describing AI curation", () => {
    render(<AiCuratedBadge />);
    const badge = screen.getByLabelText(
      /contenido curado con inteligencia artificial/i,
    );
    expect(badge).toBeInTheDocument();
  });

  it("renders a sparkles icon decoratively (aria-hidden)", () => {
    const { container } = render(<AiCuratedBadge />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("defaults to the solid variant with warm surface background", () => {
    render(<AiCuratedBadge data-testid="badge" />);
    const badge = screen.getByTestId("badge");
    expect(badge.className).toMatch(/--surface-warm/);
  });

  it("supports an outline variant with transparent background", () => {
    render(<AiCuratedBadge variant="outline" data-testid="badge" />);
    const badge = screen.getByTestId("badge");
    expect(badge.className).toMatch(/bg-transparent/);
    expect(badge.className).toMatch(/--accent/);
  });

  it("merges custom className", () => {
    render(<AiCuratedBadge className="ml-2" data-testid="badge" />);
    expect(screen.getByTestId("badge").className).toMatch(/ml-2/);
  });
});

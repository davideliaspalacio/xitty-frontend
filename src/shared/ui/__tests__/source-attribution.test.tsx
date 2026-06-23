import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SourceAttribution } from "@/shared/ui/source-attribution";

describe("SourceAttribution", () => {
  beforeEach(() => {
    // Anchor "now" so relative time is deterministic.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the source hostname prefixed with 'Via'", () => {
    render(
      <SourceAttribution
        sourceUrl="https://www.instagram.com/p/abc123"
        scrapedAt="2026-06-19T12:00:00Z"
        data-testid="src"
      />,
    );
    expect(screen.getByTestId("src").textContent).toMatch(
      /via\s*instagram\.com/i,
    );
  });

  it("renders the relative time computed from scraped_at", () => {
    render(
      <SourceAttribution
        sourceUrl="https://instagram.com/p/abc"
        scrapedAt="2026-06-19T12:00:00Z"
      />,
    );
    expect(screen.getByText(/hace 3 días/i)).toBeInTheDocument();
  });

  it("renders an external link with the full source URL", () => {
    render(
      <SourceAttribution
        sourceUrl="https://instagram.com/p/abc"
        scrapedAt="2026-06-19T12:00:00Z"
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://instagram.com/p/abc");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders an external-link icon (aria-hidden)", () => {
    const { container } = render(
      <SourceAttribution
        sourceUrl="https://instagram.com/p/abc"
        scrapedAt="2026-06-19T12:00:00Z"
      />,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("falls back to the raw URL when it cannot be parsed", () => {
    render(
      <SourceAttribution
        sourceUrl="not-a-url"
        scrapedAt="2026-06-19T12:00:00Z"
        data-testid="src"
      />,
    );
    expect(screen.getByTestId("src").textContent).toMatch(
      /via\s*not-a-url/i,
    );
  });

  it("strips a leading www. from the hostname for cleaner display", () => {
    render(
      <SourceAttribution
        sourceUrl="https://www.tripadvisor.com/x"
        scrapedAt="2026-06-19T12:00:00Z"
        data-testid="src"
      />,
    );
    expect(screen.getByTestId("src").textContent).toMatch(
      /via\s*tripadvisor\.com/i,
    );
  });

  it("renders today copy when scraped just now", () => {
    render(
      <SourceAttribution
        sourceUrl="https://instagram.com/p/abc"
        scrapedAt="2026-06-22T11:30:00Z"
      />,
    );
    expect(screen.getByText(/hoy/i)).toBeInTheDocument();
  });
});

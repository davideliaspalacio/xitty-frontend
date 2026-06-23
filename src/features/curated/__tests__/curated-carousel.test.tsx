import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CuratedCarousel } from "@/features/curated/components/curated-carousel";
import type { CuratedItem } from "@/features/curated/types";

function makeItem(i: number, overrides: Partial<CuratedItem> = {}): CuratedItem {
  return {
    id: `cur-${i}`,
    title: `Curated ${i}`,
    description: null,
    category: null,
    location_name: null,
    latitude: null,
    longitude: null,
    price_cop: null,
    image_url: null,
    starts_at: null,
    ends_at: null,
    quality_score: 0.8,
    source_url: `https://example.com/${i}`,
    scraped_at: "2026-06-20T08:00:00Z",
    ...overrides,
  };
}

describe("CuratedCarousel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders one CuratedCard per item", () => {
    const items = [makeItem(1), makeItem(2), makeItem(3)];
    render(<CuratedCarousel items={items} />);
    expect(
      screen.getByRole("heading", { name: /curated 1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /curated 2/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /curated 3/i }),
    ).toBeInTheDocument();
  });

  it("renders nothing when items is empty", () => {
    const { container } = render(<CuratedCarousel items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("each card links to /curated/:id", () => {
    const items = [makeItem(1), makeItem(2)];
    render(<CuratedCarousel items={items} />);
    expect(
      screen.getByRole("link", { name: /curated 1/i }),
    ).toHaveAttribute("href", "/curated/cur-1");
    expect(
      screen.getByRole("link", { name: /curated 2/i }),
    ).toHaveAttribute("href", "/curated/cur-2");
  });
});

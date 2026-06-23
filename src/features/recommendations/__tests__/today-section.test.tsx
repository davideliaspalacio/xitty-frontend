import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { TodaySection } from "@/features/recommendations/components/today-section";
import type {
  RecommendationItem,
  TodayResponse,
} from "@/features/recommendations/types";

vi.mock("@/features/recommendations/hooks/use-today", () => ({
  useTodayRecommendations: vi.fn(),
}));

import { useTodayRecommendations } from "@/features/recommendations/hooks/use-today";

const mockedHook = vi.mocked(useTodayRecommendations);

function makeItem(i: number): RecommendationItem {
  return {
    place: {
      id: `p-${i}`,
      slug: `place-${i}`,
      name: `Place ${i}`,
      cover_url: `https://example.com/${i}.jpg`,
      price_range: 2,
      average_rating: 4.5,
    },
    score: 0.9 - i * 0.05,
    reason: `Reason ${i}`,
  };
}

function setHook(opts: {
  items?: RecommendationItem[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  const items = opts.items ?? [];
  const data: TodayResponse | undefined = opts.items
    ? { items, generated_at: new Date().toISOString() }
    : undefined;
  mockedHook.mockReturnValue({
    items,
    data,
    isLoading: opts.isLoading ?? false,
    isError: opts.isError ?? false,
  } as unknown as ReturnType<typeof useTodayRecommendations>);
}

describe("TodaySection", () => {
  beforeEach(() => {
    mockedHook.mockReset();
  });

  it("shows the skeleton while loading", () => {
    setHook({ isLoading: true, items: undefined });
    const { container } = render(<TodaySection />);
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("returns null when there are no items", () => {
    setHook({ items: [] });
    const { container } = render(<TodaySection />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the hero + sub-cards when there are 3+ items", () => {
    setHook({ items: [makeItem(0), makeItem(1), makeItem(2)] });
    render(<TodaySection />);

    // Section header
    expect(
      screen.getByText(/qu[eé] vale la pena hacer hoy/i),
    ).toBeInTheDocument();

    // Hero (first item) — title is rendered as Place 0
    expect(screen.getByText("Place 0")).toBeInTheDocument();

    // Sub-cards (items 1 and 2)
    expect(screen.getByText("Place 1")).toBeInTheDocument();
    expect(screen.getByText("Place 2")).toBeInTheDocument();
  });
});

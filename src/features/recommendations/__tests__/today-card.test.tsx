import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { TodayCard } from "@/features/recommendations/components/today-card";
import type { RecommendationItem } from "@/features/recommendations/types";

const baseItem: RecommendationItem = {
  place: {
    id: "place-123",
    slug: "malecon-del-rio",
    name: "Malecón del Río",
    cover_url: "https://example.com/cover.jpg",
    price_range: 2,
    average_rating: 4.6,
  },
  score: 0.92,
  reason: "Atardecer perfecto a esta hora",
};

describe("TodayCard", () => {
  it("renders the place title", () => {
    render(<TodayCard item={baseItem} />);
    expect(screen.getByText("Malecón del Río")).toBeInTheDocument();
  });

  it("renders the recommendation reason", () => {
    render(<TodayCard item={baseItem} />);
    expect(
      screen.getByText("Atardecer perfecto a esta hora"),
    ).toBeInTheDocument();
  });

  it("renders the HOY day chip", () => {
    render(<TodayCard item={baseItem} />);
    // Chip starts with "HOY · " then the day name (Spanish, e.g. "LUNES").
    expect(screen.getByText(/HOY\s*·/i)).toBeInTheDocument();
  });

  it("links to the place detail page", () => {
    render(<TodayCard item={baseItem} />);
    const link = screen.getByRole("link", { name: /malec[oó]n del r[ií]o/i });
    expect(link).toHaveAttribute("href", "/places/place-123");
  });

  it("uses the place name as the image alt text", () => {
    render(<TodayCard item={baseItem} />);
    const img = screen.getByRole("img", { name: /malec[oó]n del r[ií]o/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/cover.jpg");
  });

  it("renders a CTA pill 'Ver el lugar'", () => {
    render(<TodayCard item={baseItem} />);
    expect(screen.getByText(/ver el lugar/i)).toBeInTheDocument();
  });
});

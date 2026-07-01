import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CuratedCard } from "@/features/curated/components/curated-card";
import type { CuratedItem } from "@/features/curated/types";

const baseItem: CuratedItem = {
  id: "cur-1",
  title: "Concierto en el Malecón",
  description: "Show gratuito al atardecer junto al río Magdalena",
  category: "evento",
  location_name: "Gran Malecón",
  latitude: 10.99,
  longitude: -74.81,
  price_cop: null,
  image_url: "https://img.example/concert.jpg",
  starts_at: "2026-07-04T23:00:00Z",
  ends_at: null,
  quality_score: 0.82,
  source_url: "https://www.instagram.com/p/abc123",
  scraped_at: "2026-06-19T12:00:00Z",
};

describe("CuratedCard", () => {
  beforeEach(() => {
    // Anchor "now" so relative time is deterministic for the footer.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the AI-curated badge with the visible label", () => {
    render(<CuratedCard item={baseItem} />);
    expect(screen.getByText(/curado con ia/i)).toBeInTheDocument();
  });

  it("renders the title and location_name", () => {
    render(<CuratedCard item={baseItem} />);
    expect(
      screen.getByRole("heading", { name: /concierto en el malec[oó]n/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/gran malec[oó]n/i)).toBeInTheDocument();
  });

  it("renders a footer with the source hostname stripped of www.", () => {
    render(<CuratedCard item={baseItem} />);
    // SourceAttribution renders 'Via instagram.com'
    expect(screen.getByText(/via/i)).toBeInTheDocument();
    expect(screen.getByText(/instagram\.com/i)).toBeInTheDocument();
  });

  it("renders the relative scraped_at date in the footer", () => {
    render(<CuratedCard item={baseItem} />);
    // 2026-06-22 - 2026-06-19 = 3 days
    expect(screen.getByText(/hace 3 días/i)).toBeInTheDocument();
  });

  it("source link points to source_url with safe target/rel attributes", () => {
    render(<CuratedCard item={baseItem} />);
    const sourceLink = screen.getByRole("link", { name: /instagram\.com/i });
    expect(sourceLink).toHaveAttribute(
      "href",
      "https://www.instagram.com/p/abc123",
    );
    expect(sourceLink).toHaveAttribute("target", "_blank");
    expect(sourceLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("links the card to the curated detail page using the item id", () => {
    render(<CuratedCard item={baseItem} />);
    // The card itself is an internal Next link; find by accessible name (the title).
    const cardLink = screen.getByRole("link", {
      name: /concierto en el malec[oó]n/i,
    });
    expect(cardLink).toHaveAttribute("href", "/curated/cur-1");
  });

  it("renders the starts_at date when present", () => {
    render(<CuratedCard item={baseItem} />);
    // Expect a year somewhere in the formatted date.
    expect(screen.getAllByText(/2026/i).length).toBeGreaterThan(0);
  });

  it("renders without crashing when starts_at is null", () => {
    render(<CuratedCard item={{ ...baseItem, starts_at: null }} />);
    expect(
      screen.getByRole("heading", { name: /concierto en el malec[oó]n/i }),
    ).toBeInTheDocument();
  });

  it("falls back to the raw source string when source_url is not a valid URL", () => {
    render(
      <CuratedCard item={{ ...baseItem, source_url: "not-a-real-url" }} />,
    );
    expect(screen.getByText(/via/i)).toBeInTheDocument();
    expect(screen.getByText(/not-a-real-url/i)).toBeInTheDocument();
  });

  it("no muestra atribución ni 'NaN' cuando el item no trae fuente (card DTO)", () => {
    render(
      <CuratedCard
        item={{ ...baseItem, source_url: null, scraped_at: null }}
      />,
    );
    expect(screen.queryByText(/via/i)).toBeNull();
    expect(screen.queryByText(/nan/i)).toBeNull();
    // La tarjeta sigue mostrando su contenido principal.
    expect(
      screen.getByRole("heading", { name: /concierto en el malec[oó]n/i }),
    ).toBeInTheDocument();
  });

  it("renderiza un placeholder (sin <img>) cuando image_url es null", () => {
    const { container } = render(
      <CuratedCard item={{ ...baseItem, image_url: null }} />,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(
      screen.getByRole("heading", { name: /concierto en el malec[oó]n/i }),
    ).toBeInTheDocument();
  });
});

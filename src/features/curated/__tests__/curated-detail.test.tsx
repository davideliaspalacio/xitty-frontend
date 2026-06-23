import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CuratedDetail } from "@/features/curated/components/curated-detail";
import type { CuratedItem } from "@/features/curated/types";

const baseItem: CuratedItem = {
  id: "cur-1",
  title: "Festival de jazz en La Aduana",
  description:
    "Tres noches de jazz al aire libre.\nEntradas limitadas, llega temprano.",
  category: "evento",
  location_name: "Antigua Aduana",
  latitude: 10.99,
  longitude: -74.79,
  price_cop: 80000,
  image_url: "https://img.example/jazz.jpg",
  starts_at: "2026-07-15T23:00:00Z",
  ends_at: "2026-07-16T03:00:00Z",
  quality_score: 0.91,
  source_url: "https://www.tripadvisor.com/event/jazz",
  scraped_at: "2026-06-20T08:00:00Z",
};

describe("CuratedDetail", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the title as h1", () => {
    render(<CuratedDetail item={baseItem} />);
    expect(
      screen.getByRole("heading", { level: 1, name: /festival de jazz/i }),
    ).toBeInTheDocument();
  });

  it("renders the AI-curated badge", () => {
    render(<CuratedDetail item={baseItem} />);
    expect(screen.getByText(/curado con ia/i)).toBeInTheDocument();
  });

  it("renders the description and preserves newlines via whitespace-pre-line", () => {
    render(<CuratedDetail item={baseItem} />);
    const paragraph = screen.getByText(/tres noches de jazz/i);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.className).toMatch(/whitespace-pre-line/);
  });

  it("renders the location_name when present", () => {
    render(<CuratedDetail item={baseItem} />);
    expect(screen.getByText(/antigua aduana/i)).toBeInTheDocument();
  });

  it("renders the formatted price in COP", () => {
    render(<CuratedDetail item={baseItem} />);
    // fmtCop is Intl COP — assert digits appear regardless of locale spacing.
    expect(screen.getByText(/80\.?000/)).toBeInTheDocument();
  });

  it("renders a 'Ver fuente original' link to source_url that opens in a new tab", () => {
    render(<CuratedDetail item={baseItem} />);
    const link = screen.getByRole("link", { name: /ver fuente original/i });
    expect(link).toHaveAttribute(
      "href",
      "https://www.tripadvisor.com/event/jazz",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the disclaimer note", () => {
    render(<CuratedDetail item={baseItem} />);
    expect(
      screen.getByText(/informaci[oó]n sujeta a cambios/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/verifica con el negocio antes de visitar/i),
    ).toBeInTheDocument();
  });

  it("exposes the disclaimer as a note region", () => {
    render(<CuratedDetail item={baseItem} />);
    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it("omits the source block entirely when source_url is null", () => {
    render(<CuratedDetail item={{ ...baseItem, source_url: null }} />);
    expect(
      screen.queryByRole("link", { name: /ver fuente original/i }),
    ).toBeNull();
  });

  it("renders without crashing when image_url is null", () => {
    render(<CuratedDetail item={{ ...baseItem, image_url: null }} />);
    expect(
      screen.getByRole("heading", { level: 1, name: /festival de jazz/i }),
    ).toBeInTheDocument();
  });

  it("renders the SourceAttribution footer with hostname stripped of www.", () => {
    render(<CuratedDetail item={baseItem} />);
    expect(screen.getByText(/tripadvisor\.com/i)).toBeInTheDocument();
  });
});

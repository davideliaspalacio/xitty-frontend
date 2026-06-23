import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Replace the auth store so the page can render without a real session.
vi.mock("@/features/auth/store/auth-store", () => ({
  useAuthStore: <T,>(selector: (s: {
    user: { full_name: string } | null;
  }) => T) => selector({ user: { full_name: "Eli Test" } }),
}));

// Mock the new promotional section.
vi.mock("@/features/promotions", () => ({
  AdsHero: () => <div data-testid="ads-hero">AdsHero</div>,
}));

// Mock the "today" recommendations section. Its real header reads
// "Qué vale la pena hacer hoy", which we want present in the DOM
// because the ordering test asserts on that copy.
vi.mock("@/features/recommendations", () => ({
  TodaySection: () => (
    <section data-testid="today-section">
      <h2>Qué vale la pena hacer hoy</h2>
    </section>
  ),
}));

// Categories grid mock — renders the slug we'll assert on later.
vi.mock("@/features/places/components/categories-grid", () => ({
  CategoriesGrid: () => (
    <div data-testid="categories-grid">CategoriesGrid</div>
  ),
}));

// Traveler-type chips: simple stub with a data-testid we can locate.
vi.mock("@/features/preferences/components/traveler-type-chips", () => ({
  TravelerTypeChips: () => (
    <div data-testid="traveler-type-chips">TravelerTypeChips</div>
  ),
}));
vi.mock("@/features/preferences/hooks/use-traveler-filter", () => ({
  useTravelerFilter: () => ({ travelerType: null, setTravelerType: vi.fn() }),
}));

// Discover hooks — return empty state so the page renders the
// section frames + headers but no data cards.
vi.mock("@/features/discover", () => ({
  useRanking: () => ({ data: { data: [] }, isLoading: false }),
  useFeaturedCurrent: () => ({ data: [], isLoading: false }),
  useLocalPicksCurrent: () => ({ data: [], isLoading: false }),
}));

vi.mock("@/features/experiences", () => ({
  useExperiences: () => ({ data: { data: [] }, isLoading: false }),
}));

// Curated feed — empty by default so the section renders only the header.
vi.mock("@/features/curated", () => ({
  useCurated: () => ({ data: [], isLoading: false }),
  CuratedCarousel: ({ items }: { items: unknown[] }) => (
    <div data-testid="curated-carousel" data-count={items.length} />
  ),
}));

// next/link → plain anchor so we don't need the Next router context.
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import HomePage from "@/app/(app)/page";

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the greeting at the top", () => {
    render(<HomePage />);
    expect(screen.getByText(/buenos d[ií]as, eli/i)).toBeInTheDocument();
  });

  it("renders all the new sections", () => {
    render(<HomePage />);
    expect(screen.getByTestId("ads-hero")).toBeInTheDocument();
    expect(screen.getByTestId("today-section")).toBeInTheDocument();
    expect(screen.getByTestId("traveler-type-chips")).toBeInTheDocument();
    expect(screen.getByTestId("categories-grid")).toBeInTheDocument();
  });

  it("places sections in the expected order: today before recommended", () => {
    render(<HomePage />);

    const html = document.body.innerHTML;
    const todayIdx = html.indexOf("Qué vale la pena hacer hoy");
    const recommendedIdx = html.indexOf("Recomendados");
    expect(todayIdx).toBeGreaterThan(-1);
    expect(recommendedIdx).toBeGreaterThan(-1);
    expect(todayIdx).toBeLessThan(recommendedIdx);
  });

  it("orders ads-hero before today-section, and traveler-chips before ranking", () => {
    render(<HomePage />);
    const html = document.body.innerHTML;

    const adsIdx = html.indexOf('data-testid="ads-hero"');
    const todayIdx = html.indexOf('data-testid="today-section"');
    const chipsIdx = html.indexOf('data-testid="traveler-type-chips"');
    const rankingIdx = html.indexOf("Ranking en Barranquilla");
    const categoriesIdx = html.indexOf('data-testid="categories-grid"');
    const experienciasIdx = html.indexOf("Vive algo único");
    const localIdx = html.indexOf("Disfruta como un local");

    const curatedIdx = html.indexOf("Descubre lo nuevo en Barranquilla");

    expect(adsIdx).toBeLessThan(todayIdx);
    expect(todayIdx).toBeLessThan(chipsIdx);
    expect(chipsIdx).toBeLessThan(rankingIdx);
    expect(rankingIdx).toBeLessThan(html.indexOf("Recomendados"));
    expect(html.indexOf("Recomendados")).toBeLessThan(curatedIdx);
    expect(curatedIdx).toBeLessThan(categoriesIdx);
    expect(categoriesIdx).toBeLessThan(experienciasIdx);
    expect(experienciasIdx).toBeLessThan(localIdx);
  });

  it("uses the updated 'Explora por categoría' header for the categories grid", () => {
    render(<HomePage />);
    expect(screen.getByText(/explora por categor[ií]a/i)).toBeInTheDocument();
  });

  it("renders the curated section header copy", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", {
        name: /descubre lo nuevo en barranquilla/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/curado con ia, actualizado cada semana/i),
    ).toBeInTheDocument();
  });

  it("places the curated section between 'Recomendados' and 'Explora por categoría'", () => {
    render(<HomePage />);
    const html = document.body.innerHTML;

    const recommendedIdx = html.indexOf("Recomendados");
    const curatedIdx = html.indexOf("Descubre lo nuevo en Barranquilla");
    const categoriesIdx = html.indexOf("Explora por categor");

    expect(recommendedIdx).toBeGreaterThan(-1);
    expect(curatedIdx).toBeGreaterThan(-1);
    expect(categoriesIdx).toBeGreaterThan(-1);

    expect(recommendedIdx).toBeLessThan(curatedIdx);
    expect(curatedIdx).toBeLessThan(categoriesIdx);
  });
});

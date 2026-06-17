import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import type { HeroPromotion } from "@/lib/api/types";
import { AdsHero } from "@/features/promotions/components/ads-hero";

// Mock TanStack Query hook so we don't need a QueryClient.
vi.mock("@/features/promotions/hooks/use-hero-promotions", () => ({
  useHeroPromotions: vi.fn(),
}));

// Mock track impression hook — return a stable jest fn we can inspect.
const trackImpressionMock = vi.fn();
vi.mock("@/features/promotions/hooks/use-track-impression", () => ({
  useTrackImpression: () => trackImpressionMock,
}));

// next/link mock — just render an <a> so we can query it without Next router.
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

import { useHeroPromotions } from "@/features/promotions/hooks/use-hero-promotions";

const mockedUseHero = vi.mocked(useHeroPromotions);

function makePromo(overrides: Partial<HeroPromotion> = {}): HeroPromotion {
  return {
    id: "promo-1",
    place_id: "place-1",
    title: "Happy hour 2x1",
    description: "Cocteles dos por uno",
    discount_percentage: 50,
    starts_at: "2026-06-01T00:00:00Z",
    ends_at: "2026-12-31T23:59:59Z",
    is_active: true,
    is_hero: true,
    hero_priority: 10,
    hero_image_url: "https://example.com/hero-1.jpg",
    places: { id: "place-1", name: "Bar Caribe", slug: "bar-caribe" },
    ...overrides,
  };
}

function mockHero(items: HeroPromotion[] | undefined, isLoading = false) {
  mockedUseHero.mockReturnValue({
    data: items,
    isLoading,
    isError: false,
  } as unknown as ReturnType<typeof useHeroPromotions>);
}

// ── IntersectionObserver mock ───────────────────────────────────────
type IOCallback = (entries: { isIntersecting: boolean; target: Element }[]) => void;
const observers: { cb: IOCallback; targets: Set<Element> }[] = [];

class MockIntersectionObserver {
  cb: IOCallback;
  targets = new Set<Element>();
  constructor(cb: IOCallback) {
    this.cb = cb;
    observers.push({ cb, targets: this.targets });
  }
  observe(el: Element) {
    this.targets.add(el);
  }
  unobserve(el: Element) {
    this.targets.delete(el);
  }
  disconnect() {
    this.targets.clear();
  }
  takeRecords() {
    return [];
  }
}

function fireIntersect(el: Element, isIntersecting: boolean) {
  for (const obs of observers) {
    if (obs.targets.has(el)) {
      obs.cb([{ isIntersecting, target: el }]);
    }
  }
}

describe("AdsHero", () => {
  beforeEach(() => {
    mockedUseHero.mockReset();
    trackImpressionMock.mockReset();
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("renders a single slide when there is 1 promo", () => {
    mockHero([makePromo()]);
    render(<AdsHero />);
    expect(screen.getByText(/happy hour 2x1/i)).toBeInTheDocument();
    expect(screen.getByText(/bar caribe/i)).toBeInTheDocument();
    expect(screen.getByText(/promo/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver lugar/i })).toHaveAttribute(
      "href",
      "/places/place-1",
    );
  });

  it("rotates slides every 5s", () => {
    vi.useFakeTimers();
    mockHero([
      makePromo({ id: "p1", title: "Promo Uno" }),
      makePromo({ id: "p2", title: "Promo Dos" }),
    ]);

    render(<AdsHero />);

    const first = screen.getByTestId("ads-hero-slide-active");
    expect(first).toHaveAttribute("data-promo-id", "p1");

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    const second = screen.getByTestId("ads-hero-slide-active");
    expect(second).toHaveAttribute("data-promo-id", "p2");

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    const third = screen.getByTestId("ads-hero-slide-active");
    expect(third).toHaveAttribute("data-promo-id", "p1");
  });

  it("fires trackImpression once when a slide enters the viewport", () => {
    mockHero([makePromo({ id: "p1" }), makePromo({ id: "p2" })]);
    render(<AdsHero />);

    const root = screen.getByTestId("ads-hero-root");

    // First intersection -> should track once
    fireIntersect(root, true);
    expect(trackImpressionMock).toHaveBeenCalledTimes(1);
    expect(trackImpressionMock).toHaveBeenCalledWith("p1");

    // Same slide re-entering — should NOT double-track
    fireIntersect(root, false);
    fireIntersect(root, true);
    expect(trackImpressionMock).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when items is empty", () => {
    mockHero([]);
    const { container } = render(<AdsHero />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when data is undefined and not loading", () => {
    mockHero(undefined, false);
    const { container } = render(<AdsHero />);
    expect(container).toBeEmptyDOMElement();
  });
});

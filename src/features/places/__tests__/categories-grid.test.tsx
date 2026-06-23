import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoriesGrid } from "@/features/places/components/categories-grid";
import type { Category } from "@/lib/api/types";

// Mock the categories hook so we don't need a QueryClient / API.
vi.mock("@/features/places/hooks/use-places", () => ({
  useCategories: vi.fn(),
}));

import { useCategories } from "@/features/places/hooks/use-places";

const mockedUseCategories = vi.mocked(useCategories);

function makeCategory(i: number): Category {
  return {
    id: `cat-${i}`,
    name: `Categoría ${i}`,
    slug: `categoria-${i}`,
    icon: null,
    description: null,
  };
}

function mockCategories(categories: Category[] | undefined, loading = false) {
  mockedUseCategories.mockReturnValue({
    data: categories,
    isLoading: loading,
    isError: false,
  } as unknown as ReturnType<typeof useCategories>);
}

describe("CategoriesGrid", () => {
  beforeEach(() => {
    mockedUseCategories.mockReset();
  });

  it("renders 10 cards when 10 categories are returned", () => {
    const categories = Array.from({ length: 10 }, (_, i) => makeCategory(i + 1));
    mockCategories(categories);

    render(<CategoriesGrid />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(10);
  });

  it("each link points to /places?category=<slug>", () => {
    const categories = Array.from({ length: 10 }, (_, i) => makeCategory(i + 1));
    mockCategories(categories);

    render(<CategoriesGrid />);

    const links = screen.getAllByRole("link");
    links.forEach((link, idx) => {
      expect(link).toHaveAttribute(
        "href",
        `/places?category=${categories[idx].slug}`,
      );
    });
  });

  it("renders the category name in each card", () => {
    const categories = [makeCategory(1), makeCategory(2)];
    mockCategories(categories);

    render(<CategoriesGrid />);

    expect(screen.getByText("Categoría 1")).toBeInTheDocument();
    expect(screen.getByText("Categoría 2")).toBeInTheDocument();
  });

  it("shows skeleton placeholders while loading", () => {
    mockCategories(undefined, true);
    const { container } = render(<CategoriesGrid />);

    const skeletons = container.querySelectorAll('[data-testid="category-skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders nothing when there are no categories and not loading", () => {
    mockCategories([], false);
    const { container } = render(<CategoriesGrid />);
    expect(container.querySelectorAll("a")).toHaveLength(0);
  });
});

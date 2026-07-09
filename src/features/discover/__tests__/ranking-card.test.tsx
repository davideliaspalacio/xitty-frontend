import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RankingCard } from "@/features/discover/components/ranking-card";
import type { RankingItem } from "@/lib/api/types";

vi.mock("@/features/favorites", () => ({
  FavoriteButton: ({ placeId }: { placeId: string }) => (
    <button type="button">Favorito {placeId}</button>
  ),
}));

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

function makeItem(overrides: Partial<RankingItem> = {}): RankingItem {
  return {
    position: 3,
    previous_position: 5,
    position_change: 2,
    score: 0.82,
    views_30d: 120,
    conversions_30d: 15,
    is_sponsored: false,
    sponsored_label: null,
    place: {
      id: "place-1",
      name: "Castillo de Salgar",
      slug: "castillo-de-salgar",
      description: null,
      address: null,
      category_id: "cat-1",
      average_rating: 4.7,
      total_reviews: 80,
      cover_photo_url: "https://example.com/photo.jpg",
    },
    ...overrides,
  };
}

describe("RankingCard", () => {
  it("muestra cuanto subio en el ranking semanal", () => {
    render(<RankingCard item={makeItem({ position_change: 2 })} />);
    expect(screen.getByLabelText(/subi[oó] 2 posiciones/i)).toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("muestra cuanto bajo en el ranking semanal", () => {
    render(<RankingCard item={makeItem({ position_change: -1 })} />);
    expect(screen.getByLabelText(/baj[oó] 1 posiciones/i)).toBeInTheDocument();
    expect(screen.getByText("-1")).toBeInTheDocument();
  });

  it("mantiene visible el sello patrocinado", () => {
    render(
      <RankingCard
        item={makeItem({
          is_sponsored: true,
          sponsored_label: "Patrocinado",
        })}
      />,
    );
    expect(screen.getByText("Patrocinado")).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SourceReviews } from "@/features/places/components/source-reviews";
import type { SourceReview } from "@/lib/api/types";

const reviews: SourceReview[] = [
  {
    author: "Laura M.",
    rating: 5,
    text: "Atardecer espectacular y buenos cócteles.",
    relative_time: "hace 2 semanas",
    publish_time: null,
  },
  {
    author: "Diego R.",
    rating: 4,
    text: "Vista increíble, precios altos.",
    relative_time: "hace 1 mes",
    publish_time: null,
  },
];

describe("SourceReviews", () => {
  it("renderiza opiniones con autor, texto y atribución a Google", () => {
    render(<SourceReviews reviews={reviews} />);
    expect(screen.getByText("Opiniones de Google")).toBeInTheDocument();
    expect(screen.getByText(/vía google/i)).toBeInTheDocument();
    expect(screen.getByText("Laura M.")).toBeInTheDocument();
    expect(
      screen.getByText("Atardecer espectacular y buenos cócteles."),
    ).toBeInTheDocument();
    expect(screen.getByText("Diego R.")).toBeInTheDocument();
  });

  it("no renderiza nada si no hay reseñas", () => {
    const { container } = render(<SourceReviews reviews={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("ignora reseñas vacías (sin texto ni autor)", () => {
    const empty: SourceReview[] = [
      {
        author: null,
        rating: null,
        text: null,
        relative_time: null,
        publish_time: null,
      },
    ];
    const { container } = render(<SourceReviews reviews={empty} />);
    expect(container).toBeEmptyDOMElement();
  });
});

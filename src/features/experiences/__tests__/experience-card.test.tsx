import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceCard } from "@/features/experiences/components/experience-card";
import type { ExperienceCard as ExperienceCardType } from "@/lib/api/types";

const baseExperience: ExperienceCardType = {
  id: "exp-123",
  title: "Tour por el Malecón",
  slug: "tour-malecon",
  description: "Recorrido al atardecer",
  experience_type: "tour",
  tags: [],
  duration_minutes: 90,
  price_cop: 80000,
  average_rating: 4.6,
  total_reviews: 42,
  cover_photo_url: "https://img.example/cover.jpg",
};

describe("ExperienceCard", () => {
  it("renders title", () => {
    render(<ExperienceCard experience={baseExperience} />);
    expect(
      screen.getByRole("heading", { name: /tour por el malec[oó]n/i }),
    ).toBeInTheDocument();
  });

  it("renders the rating value", () => {
    render(<ExperienceCard experience={baseExperience} />);
    // RatingStars rounds to 1 decimal => "4.6"
    expect(screen.getByText("4.6")).toBeInTheDocument();
  });

  it("renders the duration badge (sticker style)", () => {
    render(<ExperienceCard experience={baseExperience} />);
    // 90 minutes -> "1h 30m"
    expect(screen.getByText(/1h\s*30m/i)).toBeInTheDocument();
  });

  it("formats sub-hour durations correctly", () => {
    render(
      <ExperienceCard
        experience={{ ...baseExperience, duration_minutes: 45 }}
      />,
    );
    expect(screen.getByText(/45\s*min/i)).toBeInTheDocument();
  });

  it("links to the experience detail page", () => {
    render(<ExperienceCard experience={baseExperience} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/experiences/exp-123");
  });

  it("renders an aria-label that mentions the title for accessibility", () => {
    render(<ExperienceCard experience={baseExperience} />);
    const link = screen.getByRole("link");
    const label =
      link.getAttribute("aria-label") ?? link.textContent ?? "";
    expect(label.toLowerCase()).toContain("tour por el malec");
  });
});

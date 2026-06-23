import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TravelerTypeChips } from "@/features/preferences/components/traveler-type-chips";
import type { TravelerType } from "@/lib/api/types";

// Mock the preferences hook so we don't need a QueryClient / API.
vi.mock("@/features/preferences/hooks/use-preferences", () => ({
  usePreferences: vi.fn(),
}));

import { usePreferences } from "@/features/preferences/hooks/use-preferences";

const mockedUsePreferences = vi.mocked(usePreferences);

function mockPreferences(travelerType: TravelerType | null) {
  mockedUsePreferences.mockReturnValue({
    data: travelerType
      ? {
          user_id: "u1",
          traveler_type: travelerType,
          budget_min: null,
          budget_max: null,
          available_time: null,
          energy_level: null,
          companions: 0,
          wizard_completed: true,
        }
      : undefined,
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof usePreferences>);
}

describe("TravelerTypeChips", () => {
  beforeEach(() => {
    mockedUsePreferences.mockReset();
    mockPreferences(null);
  });

  it("renders the 5 traveler chips", () => {
    render(<TravelerTypeChips selected={null} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /nómada/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pareja/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /familia/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /negocios/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /excursión/i })).toBeInTheDocument();
  });

  it("marks only one chip as selected at a time", () => {
    render(<TravelerTypeChips selected="pareja" onChange={() => {}} />);
    const pareja = screen.getByRole("button", { name: /pareja/i });
    const familia = screen.getByRole("button", { name: /familia/i });
    expect(pareja).toHaveAttribute("aria-pressed", "true");
    expect(familia).toHaveAttribute("aria-pressed", "false");

    // exactly one pressed
    const pressed = screen
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed).toHaveLength(1);
  });

  it("calls onChange with the value when a chip is tapped", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TravelerTypeChips selected={null} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /familia/i }));
    expect(onChange).toHaveBeenCalledWith("familia");

    await user.click(screen.getByRole("button", { name: /negocios/i }));
    expect(onChange).toHaveBeenLastCalledWith("negocios");
  });

  it("toggles off when tapping the currently-selected chip", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TravelerTypeChips selected="pareja" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /pareja/i }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("highlights the preferences value by default when selected prop is undefined", () => {
    mockPreferences("excursion");
    render(<TravelerTypeChips onChange={() => {}} />);
    const excursion = screen.getByRole("button", { name: /excursión/i });
    expect(excursion).toHaveAttribute("aria-pressed", "true");
  });

  it("explicit selected prop wins over preferences", () => {
    mockPreferences("excursion");
    render(<TravelerTypeChips selected="nomada" onChange={() => {}} />);
    expect(
      screen.getByRole("button", { name: /nómada/i }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /excursión/i }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("renders nothing-pressed when preferences and selected are both empty", () => {
    render(<TravelerTypeChips selected={null} onChange={() => {}} />);
    const pressed = screen
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed).toHaveLength(0);
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "@/shared/ui/error-state";

describe("ErrorState", () => {
  it("renders a default title and description", () => {
    render(<ErrorState />);
    expect(screen.getByText(/no pudimos cargar esto/i)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders a custom title", () => {
    render(<ErrorState title="No pudimos cargar tus favoritos" />);
    expect(
      screen.getByText(/no pudimos cargar tus favoritos/i),
    ).toBeInTheDocument();
  });

  it("shows a retry button only when onRetry is provided", () => {
    const { rerender } = render(<ErrorState />);
    expect(screen.queryByRole("button", { name: /reintentar/i })).toBeNull();

    rerender(<ErrorState onRetry={() => {}} />);
    expect(
      screen.getByRole("button", { name: /reintentar/i }),
    ).toBeInTheDocument();
  });

  it("invokes onRetry when the retry button is clicked", async () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    await userEvent.click(screen.getByRole("button", { name: /reintentar/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

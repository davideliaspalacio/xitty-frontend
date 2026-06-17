import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { EmergencyButton } from "@/shared/ui/emergency-button";

describe("EmergencyButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders SOS trigger with accessible label", () => {
    render(<EmergencyButton />);
    const trigger = screen.getByRole("button", { name: /llamar emergencia/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent(/sos/i);
  });

  it("opens the confirmation modal on click", () => {
    render(<EmergencyButton />);
    fireEvent.click(
      screen.getByRole("button", { name: /llamar emergencia/i }),
    );
    expect(
      screen.getByRole("heading", { name: /¿llamar a emergencias\?/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/línea 123/i),
    ).toBeInTheDocument();
  });

  it("renders the call link with tel:123 href", () => {
    render(<EmergencyButton />);
    fireEvent.click(
      screen.getByRole("button", { name: /llamar emergencia/i }),
    );
    const callLink = screen.getByRole("link", { name: /llamar 123/i });
    expect(callLink).toHaveAttribute("href", "tel:123");
  });

  it("blocks the call link for the first 3 seconds with aria-disabled", () => {
    render(<EmergencyButton />);
    fireEvent.click(
      screen.getByRole("button", { name: /llamar emergencia/i }),
    );

    const callLink = screen.getByRole("link", { name: /llamar 123/i });
    expect(callLink).toHaveAttribute("aria-disabled", "true");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(callLink).toHaveAttribute("aria-disabled", "false");
  });

  it("closes the modal when cancel is clicked", () => {
    render(<EmergencyButton />);
    fireEvent.click(
      screen.getByRole("button", { name: /llamar emergencia/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(
      screen.queryByRole("heading", { name: /¿llamar a emergencias\?/i }),
    ).not.toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmergencyButton } from "@/shared/ui/emergency-button";

describe("EmergencyButton", () => {
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
      screen.getByText(/te conectaremos con la l[ií]nea/i),
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

  it("call link is enabled immediately (no countdown — emergencias deben ser inmediatas)", () => {
    render(<EmergencyButton />);
    fireEvent.click(
      screen.getByRole("button", { name: /llamar emergencia/i }),
    );
    const callLink = screen.getByRole("link", { name: /llamar 123/i });
    expect(callLink).toHaveAttribute("href", "tel:123");
    expect(callLink).not.toHaveAttribute("aria-disabled", "true");
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

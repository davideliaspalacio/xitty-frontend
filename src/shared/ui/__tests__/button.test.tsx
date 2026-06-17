import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/shared/ui/button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("disables itself when loading is true", () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });
});

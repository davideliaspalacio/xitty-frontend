import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatBubble } from "@/features/chat/components/chat-bubble";

describe("ChatBubble", () => {
  it("renders a FAB with an accessible name", () => {
    render(<ChatBubble onClick={() => {}} />);
    const button = screen.getByRole("button", {
      name: /(abrir|asistente|xi|chat)/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label");
  });

  it("fires onClick when tapped", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<ChatBubble onClick={onClick} />);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is positioned fixed at the bottom-right", () => {
    render(<ChatBubble onClick={() => {}} />);
    const button = screen.getByRole("button");
    // Check tailwind utilities applied on the rendered element
    expect(button.className).toMatch(/fixed/);
    expect(button.className).toMatch(/bottom-/);
    expect(button.className).toMatch(/right-/);
  });

  it("shows an unread badge when hasUnread is true", () => {
    render(<ChatBubble onClick={() => {}} hasUnread />);
    expect(screen.getByLabelText(/nuevo|mensaje nuevo|nuevos/i)).toBeInTheDocument();
  });

  it("does not show the badge by default", () => {
    render(<ChatBubble onClick={() => {}} />);
    expect(
      screen.queryByLabelText(/nuevo|mensaje nuevo|nuevos/i),
    ).not.toBeInTheDocument();
  });
});

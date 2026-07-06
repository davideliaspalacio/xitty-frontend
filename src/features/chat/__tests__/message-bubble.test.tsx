import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageBubble } from "@/features/chat/components/message-bubble";
import type { Message } from "@/features/chat/types";

function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: "m1",
    role: "user",
    content: "Hola Xi",
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("MessageBubble", () => {
  it("renders the message content", () => {
    render(<MessageBubble message={makeMessage()} />);
    expect(screen.getByText("Hola Xi")).toBeInTheDocument();
  });

  it("applies user styling (coral background, right-aligned) for role=user", () => {
    const { container } = render(
      <MessageBubble message={makeMessage({ role: "user" })} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/justify-end|self-end|ml-auto/);

    // The bubble itself: data-testid for stable lookup
    const bubble = screen.getByTestId("message-bubble");
    expect(bubble.getAttribute("data-role")).toBe("user");
    expect(bubble.className).toMatch(/text-white|--accent-fg/);
  });

  it("applies assistant styling (warm bg + ink border, left-aligned) for role=assistant", () => {
    const { container } = render(
      <MessageBubble
        message={makeMessage({ role: "assistant", content: "Hola humano" })}
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toMatch(/justify-start|self-start|mr-auto/);

    const bubble = screen.getByTestId("message-bubble");
    expect(bubble.getAttribute("data-role")).toBe("assistant");
    expect(bubble.className).toMatch(/--surface-warm/);
  });

  it("renders inline markdown bold as <strong>", () => {
    render(
      <MessageBubble
        message={makeMessage({
          role: "assistant",
          content: "Visita **Malecón** hoy.",
        })}
      />,
    );
    expect(screen.getByText("Malecón").tagName.toLowerCase()).toBe("strong");
  });

  it("renders inline markdown italics as <em>", () => {
    render(
      <MessageBubble
        message={makeMessage({
          role: "assistant",
          content: "Algo *especial* te espera.",
        })}
      />,
    );
    expect(screen.getByText("especial").tagName.toLowerCase()).toBe("em");
  });
});

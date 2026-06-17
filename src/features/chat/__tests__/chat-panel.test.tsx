import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatPanel } from "@/features/chat/components/chat-panel";
import type {
  ConversationWithMessages,
  SendMessageResponse,
} from "@/features/chat/types";

// Mock the chat hooks so we don't need a QueryClient / network.
vi.mock("@/features/chat/hooks/use-conversation", () => ({
  useConversation: vi.fn(),
  conversationKey: (id: string | null | undefined) =>
    ["chat", "conversation", id ?? ""] as const,
}));

vi.mock("@/features/chat/hooks/use-send-message", () => ({
  useSendMessage: vi.fn(),
}));

vi.mock("@/features/chat/hooks/use-conversations", () => ({
  useCreateConversation: vi.fn(),
  CONVERSATIONS_KEY: ["chat", "conversations"] as const,
}));

import { useConversation } from "@/features/chat/hooks/use-conversation";
import { useSendMessage } from "@/features/chat/hooks/use-send-message";
import { useCreateConversation } from "@/features/chat/hooks/use-conversations";

const mockedUseConversation = vi.mocked(useConversation);
const mockedUseSendMessage = vi.mocked(useSendMessage);
const mockedUseCreateConversation = vi.mocked(useCreateConversation);

function setupHooks(opts: {
  conversation?: ConversationWithMessages | null;
  isPending?: boolean;
  mutate?: ReturnType<typeof vi.fn>;
} = {}) {
  mockedUseConversation.mockReturnValue({
    data: opts.conversation ?? undefined,
    isLoading: false,
    isError: false,
  } as unknown as ReturnType<typeof useConversation>);

  mockedUseSendMessage.mockReturnValue({
    mutate: opts.mutate ?? vi.fn(),
    mutateAsync: opts.mutate ?? vi.fn(async () => ({} as SendMessageResponse)),
    isPending: opts.isPending ?? false,
    reset: vi.fn(),
  } as unknown as ReturnType<typeof useSendMessage>);

  mockedUseCreateConversation.mockReturnValue({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
    reset: vi.fn(),
  } as unknown as ReturnType<typeof useCreateConversation>);
}

describe("ChatPanel", () => {
  beforeEach(() => {
    mockedUseConversation.mockReset();
    mockedUseSendMessage.mockReset();
    mockedUseCreateConversation.mockReset();
  });

  it("does not render anything when open=false", () => {
    setupHooks();
    const { container } = render(
      <ChatPanel open={false} onClose={() => {}} conversationId={null} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the header with avatar Xi and a close button when open", () => {
    setupHooks();
    render(<ChatPanel open onClose={() => {}} conversationId={null} />);
    expect(screen.getAllByText(/^Xi$/).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /cerrar/i })).toBeInTheDocument();
  });

  it("calls onClose when the close button is tapped", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    setupHooks();
    render(<ChatPanel open onClose={onClose} conversationId={null} />);

    await user.click(screen.getByRole("button", { name: /cerrar/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("renders quick-reply pills in the empty state", () => {
    setupHooks();
    render(<ChatPanel open onClose={() => {}} conversationId={null} />);
    expect(
      screen.getByRole("button", { name: /qu[eé] hago cerca/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /playa segura/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /restaurante familiar/i }),
    ).toBeInTheDocument();
  });

  it("send button triggers the sendMessage mutation with the typed content", async () => {
    const mutate = vi.fn();
    setupHooks({ mutate });
    const user = userEvent.setup();
    render(<ChatPanel open onClose={() => {}} conversationId={null} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "¿Hay algo abierto ahora?");

    const sendBtn = screen.getByRole("button", { name: /enviar/i });
    await user.click(sendBtn);

    expect(mutate).toHaveBeenCalledTimes(1);
    const args = mutate.mock.calls[0][0];
    expect(args).toMatchObject({
      content: "¿Hay algo abierto ahora?",
    });
  });

  it("tapping a quick reply sends that message", async () => {
    const mutate = vi.fn();
    setupHooks({ mutate });
    const user = userEvent.setup();
    render(<ChatPanel open onClose={() => {}} conversationId={null} />);

    await user.click(screen.getByRole("button", { name: /playa segura/i }));
    expect(mutate).toHaveBeenCalledTimes(1);
    const args = mutate.mock.calls[0][0];
    expect(args.content.toLowerCase()).toContain("playa");
  });

  it("renders existing messages from the conversation", () => {
    setupHooks({
      conversation: {
        id: "c1",
        title: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [
          {
            id: "m1",
            role: "user",
            content: "Hola",
            created_at: new Date().toISOString(),
          },
          {
            id: "m2",
            role: "assistant",
            content: "¡Hola! ¿En qué te ayudo?",
            created_at: new Date().toISOString(),
          },
        ],
      },
    });
    render(<ChatPanel open onClose={() => {}} conversationId="c1" />);

    expect(screen.getByText("Hola")).toBeInTheDocument();
    expect(screen.getByText(/¿En qué te ayudo\?/i)).toBeInTheDocument();
  });

  it("shows a typing indicator while the mutation is pending", () => {
    setupHooks({ isPending: true });
    render(<ChatPanel open onClose={() => {}} conversationId="c1" />);
    expect(screen.getByText(/escribiendo/i)).toBeInTheDocument();
  });
});

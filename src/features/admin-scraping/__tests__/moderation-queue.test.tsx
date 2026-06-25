import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModerationQueue } from "@/features/admin-scraping/components/moderation-queue";
import type { ScrapedItemEnriched } from "@/features/admin-scraping/types";

// Mock the hooks — el component no debe necesitar QueryClient ni network.
vi.mock("@/features/admin-scraping/hooks/use-items", () => ({
  useItems: vi.fn(),
  useApproveItem: vi.fn(),
  useRejectItem: vi.fn(),
  usePublishItem: vi.fn(),
  useUpdateItem: vi.fn(),
  // keys are not used by the component
  ITEMS_KEY: () => ["admin-scraping", "items"],
  ITEM_KEY: () => ["admin-scraping", "items", "detail"],
}));

// Sonner toasts no necesitan provider, pero los mockeamos para no spammear.
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  useItems,
  useApproveItem,
  useRejectItem,
  usePublishItem,
  useUpdateItem,
} from "@/features/admin-scraping/hooks/use-items";

const mockedUseItems = vi.mocked(useItems);
const mockedUseApprove = vi.mocked(useApproveItem);
const mockedUseReject = vi.mocked(useRejectItem);
const mockedUsePublish = vi.mocked(usePublishItem);
const mockedUseUpdate = vi.mocked(useUpdateItem);

function makeItem(i: number, overrides: Partial<ScrapedItemEnriched> = {}): ScrapedItemEnriched {
  return {
    id: `item-${i}`,
    raw_id: `raw-${i}`,
    title: `Item ${i}`,
    description: `Descripcion de item ${i}`,
    category_hint: i % 2 === 0 ? "tour" : "restaurante",
    location_name: `Lugar ${i}`,
    lat: 10.96,
    lng: -74.79,
    starts_at: null,
    ends_at: null,
    price_cop: null,
    image_url: null,
    source_url: `https://example.com/${i}`,
    quality_score: 0.8,
    status: "pending",
    reviewed_by: null,
    reviewed_at: null,
    rejection_reason: null,
    published_place_id: null,
    published_experience_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

interface SetupOpts {
  items?: ScrapedItemEnriched[];
  isLoading?: boolean;
  approveMutate?: ReturnType<typeof vi.fn>;
  rejectMutate?: ReturnType<typeof vi.fn>;
  publishMutate?: ReturnType<typeof vi.fn>;
  updateMutate?: ReturnType<typeof vi.fn>;
}

function setupHooks(opts: SetupOpts = {}) {
  mockedUseItems.mockReturnValue({
    data: opts.items,
    isLoading: opts.isLoading ?? false,
    isError: false,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof useItems>);

  const approveMutate =
    opts.approveMutate ?? vi.fn(async () => makeItem(1, { status: "approved" }));
  const rejectMutate =
    opts.rejectMutate ?? vi.fn(async () => makeItem(1, { status: "rejected" }));
  const publishMutate =
    opts.publishMutate ?? vi.fn(async () => makeItem(1, { status: "published" }));
  const updateMutate =
    opts.updateMutate ?? vi.fn(async () => makeItem(1));

  mockedUseApprove.mockReturnValue({
    mutate: approveMutate,
    mutateAsync: approveMutate,
    isPending: false,
    reset: vi.fn(),
  } as unknown as ReturnType<typeof useApproveItem>);

  mockedUseReject.mockReturnValue({
    mutate: rejectMutate,
    mutateAsync: rejectMutate,
    isPending: false,
    reset: vi.fn(),
  } as unknown as ReturnType<typeof useRejectItem>);

  mockedUsePublish.mockReturnValue({
    mutate: publishMutate,
    mutateAsync: publishMutate,
    isPending: false,
    reset: vi.fn(),
  } as unknown as ReturnType<typeof usePublishItem>);

  mockedUseUpdate.mockReturnValue({
    mutate: updateMutate,
    mutateAsync: updateMutate,
    isPending: false,
    reset: vi.fn(),
  } as unknown as ReturnType<typeof useUpdateItem>);

  return { approveMutate, rejectMutate, publishMutate, updateMutate };
}

describe("ModerationQueue", () => {
  beforeEach(() => {
    mockedUseItems.mockReset();
    mockedUseApprove.mockReset();
    mockedUseReject.mockReset();
    mockedUsePublish.mockReset();
    mockedUseUpdate.mockReset();
  });

  it("renderiza la lista de items pending", () => {
    const items = [makeItem(1), makeItem(2), makeItem(3)];
    setupHooks({ items });

    render(<ModerationQueue />);

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("muestra empty state cuando no hay items", () => {
    setupHooks({ items: [] });
    render(<ModerationQueue />);
    expect(screen.getByText(/no hay items/i)).toBeInTheDocument();
  });

  it("muestra skeletons mientras carga", () => {
    setupHooks({ items: undefined, isLoading: true });
    const { container } = render(<ModerationQueue />);
    expect(
      container.querySelectorAll('[data-testid="item-skeleton"]').length,
    ).toBeGreaterThan(0);
  });

  it("approve dispara la mutation con el id del item", async () => {
    const approveMutate = vi.fn(async () => makeItem(1, { status: "approved" }));
    setupHooks({ items: [makeItem(1)], approveMutate });
    const user = userEvent.setup();

    render(<ModerationQueue />);

    const card = screen.getByText("Item 1").closest("article")!;
    const approveBtn = within(card).getByRole("button", { name: /aprobar/i });
    await user.click(approveBtn);

    expect(approveMutate).toHaveBeenCalledTimes(1);
    expect(approveMutate).toHaveBeenCalledWith("item-1");
  });

  it("reject dispara la mutation con id y razon", async () => {
    const rejectMutate = vi.fn(async () => makeItem(1, { status: "rejected" }));
    setupHooks({ items: [makeItem(1)], rejectMutate });
    const user = userEvent.setup();

    // window.prompt() es la forma simple de pedir la razon en el flow inicial.
    const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("spam");

    render(<ModerationQueue />);
    const card = screen.getByText("Item 1").closest("article")!;
    await user.click(within(card).getByRole("button", { name: /rechazar/i }));

    expect(rejectMutate).toHaveBeenCalledWith({ id: "item-1", reason: "spam" });
    promptSpy.mockRestore();
  });

  it("reject NO se dispara si el usuario cancela el prompt (null)", async () => {
    const rejectMutate = vi.fn(async () => makeItem(1, { status: "rejected" }));
    setupHooks({ items: [makeItem(1)], rejectMutate });
    const user = userEvent.setup();

    // Cancelar el prompt del navegador devuelve null — no debe rechazar.
    const promptSpy = vi.spyOn(window, "prompt").mockReturnValue(null);

    render(<ModerationQueue />);
    const card = screen.getByText("Item 1").closest("article")!;
    await user.click(within(card).getByRole("button", { name: /rechazar/i }));

    expect(rejectMutate).not.toHaveBeenCalled();
    promptSpy.mockRestore();
  });

  it("reject con razon vacia se dispara sin reason", async () => {
    const rejectMutate = vi.fn(async () => makeItem(1, { status: "rejected" }));
    setupHooks({ items: [makeItem(1)], rejectMutate });
    const user = userEvent.setup();

    // Aceptar el prompt vacio ("") sigue siendo un rechazo, sin razon.
    const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("");

    render(<ModerationQueue />);
    const card = screen.getByText("Item 1").closest("article")!;
    await user.click(within(card).getByRole("button", { name: /rechazar/i }));

    expect(rejectMutate).toHaveBeenCalledWith({ id: "item-1", reason: undefined });
    promptSpy.mockRestore();
  });

  it("publish dispara la mutation", async () => {
    const publishMutate = vi.fn(async () => makeItem(1, { status: "published" }));
    setupHooks({ items: [makeItem(1)], publishMutate });
    const user = userEvent.setup();

    render(<ModerationQueue />);
    const card = screen.getByText("Item 1").closest("article")!;
    await user.click(within(card).getByRole("button", { name: /publicar/i }));

    expect(publishMutate).toHaveBeenCalledWith("item-1");
  });

  it("editar abre el modal con los valores actuales", async () => {
    setupHooks({ items: [makeItem(1)] });
    const user = userEvent.setup();

    render(<ModerationQueue />);
    const card = screen.getByText("Item 1").closest("article")!;
    await user.click(within(card).getByRole("button", { name: /editar/i }));

    // ItemEditor renderiza un input con name="title" precargado con "Item 1"
    const titleInput = screen.getByLabelText(/t[ií]tulo/i) as HTMLInputElement;
    expect(titleInput.value).toBe("Item 1");
  });

  it("guardar en el modal dispara updateItem con los cambios", async () => {
    const updateMutate = vi.fn(async () => makeItem(1, { title: "Nuevo titulo" }));
    setupHooks({ items: [makeItem(1)], updateMutate });
    const user = userEvent.setup();

    render(<ModerationQueue />);
    const card = screen.getByText("Item 1").closest("article")!;
    await user.click(within(card).getByRole("button", { name: /editar/i }));

    const titleInput = screen.getByLabelText(/t[ií]tulo/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Nuevo titulo");

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(updateMutate).toHaveBeenCalledTimes(1);
    const calls = updateMutate.mock.calls as unknown as Array<
      [{ id: string; payload: { title?: string } }]
    >;
    const callArg = calls[0][0];
    expect(callArg.id).toBe("item-1");
    expect(callArg.payload.title).toBe("Nuevo titulo");
  });
});

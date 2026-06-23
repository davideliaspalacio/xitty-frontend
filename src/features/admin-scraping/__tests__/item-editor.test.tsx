import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ItemEditor } from "@/features/admin-scraping/components/item-editor";
import type { ScrapedItemEnriched } from "@/features/admin-scraping/types";

vi.mock("@/features/admin-scraping/hooks/use-items", () => ({
  useUpdateItem: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { useUpdateItem } from "@/features/admin-scraping/hooks/use-items";

const mockedUseUpdate = vi.mocked(useUpdateItem);

function makeItem(overrides: Partial<ScrapedItemEnriched> = {}): ScrapedItemEnriched {
  return {
    id: "item-1",
    raw_id: "raw-1",
    title: "Titulo original",
    description: "Descripcion original",
    category_hint: "tour",
    location_name: "Lugar original",
    lat: 10.96,
    lng: -74.79,
    starts_at: null,
    ends_at: null,
    price_cop: null,
    image_url: null,
    source_url: "https://example.com/1",
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

function setup(mutate = vi.fn(async () => makeItem({ title: "Saved" }))) {
  mockedUseUpdate.mockReturnValue({
    mutate,
    mutateAsync: mutate,
    isPending: false,
    reset: vi.fn(),
  } as unknown as ReturnType<typeof useUpdateItem>);
  return mutate;
}

describe("ItemEditor", () => {
  beforeEach(() => {
    mockedUseUpdate.mockReset();
  });

  it("renders nothing when open=false", () => {
    setup();
    const { container } = render(
      <ItemEditor open={false} item={makeItem()} onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when item is null even if open=true", () => {
    setup();
    const { container } = render(
      <ItemEditor open={true} item={null} onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the modal with role=dialog when open with an item", () => {
    setup();
    render(<ItemEditor open={true} item={makeItem()} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("pre-fills the form fields from the item", () => {
    setup();
    render(<ItemEditor open={true} item={makeItem()} onClose={vi.fn()} />);
    expect(
      (screen.getByLabelText(/t[ií]tulo/i) as HTMLInputElement).value,
    ).toBe("Titulo original");
    expect(
      (screen.getByLabelText(/descripci[oó]n/i) as HTMLTextAreaElement).value,
    ).toBe("Descripcion original");
    expect(
      (screen.getByLabelText(/lugar/i) as HTMLInputElement).value,
    ).toBe("Lugar original");
    expect(
      (screen.getByLabelText(/categor[ií]a/i) as HTMLInputElement).value,
    ).toBe("tour");
  });

  it("only sends the changed fields in the PATCH payload", async () => {
    const mutate = setup();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<ItemEditor open={true} item={makeItem()} onClose={onClose} />);

    const titleInput = screen.getByLabelText(/t[ií]tulo/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Titulo nuevo");

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(mutate).toHaveBeenCalledTimes(1);
    const calls = mutate.mock.calls as unknown as Array<
      [{ id: string; payload: Record<string, unknown> }]
    >;
    const callArg = calls[0][0];
    expect(callArg.id).toBe("item-1");
    expect(callArg.payload).toEqual({ title: "Titulo nuevo" });
    expect(callArg.payload).not.toHaveProperty("description");
    expect(callArg.payload).not.toHaveProperty("location_name");
  });

  it("closes without calling the API when there are no changes", async () => {
    const mutate = setup();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<ItemEditor open={true} item={makeItem()} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(mutate).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Cancelar closes without calling the API", async () => {
    const mutate = setup();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<ItemEditor open={true} item={makeItem()} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(mutate).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("the close (X) button fires onClose", async () => {
    const mutate = setup();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<ItemEditor open={true} item={makeItem()} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: /cerrar/i }));

    expect(mutate).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sends parsed numeric price_cop in the payload", async () => {
    const mutate = setup();
    const user = userEvent.setup();

    render(<ItemEditor open={true} item={makeItem()} onClose={vi.fn()} />);
    const price = screen.getByLabelText(/precio/i);
    await user.clear(price);
    await user.type(price, "45000");

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(mutate).toHaveBeenCalledTimes(1);
    const calls = mutate.mock.calls as unknown as Array<
      [{ id: string; payload: { price_cop?: number } }]
    >;
    expect(calls[0][0].payload.price_cop).toBe(45000);
  });

  it("invokes onSaved callback with the updated item after save", async () => {
    const updated = makeItem({ title: "Guardado" });
    const mutate = vi.fn(async () => updated);
    setup(mutate);
    const onSaved = vi.fn();
    const user = userEvent.setup();

    render(
      <ItemEditor
        open={true}
        item={makeItem()}
        onClose={vi.fn()}
        onSaved={onSaved}
      />,
    );

    const titleInput = screen.getByLabelText(/t[ií]tulo/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Cambio");

    await user.click(screen.getByRole("button", { name: /guardar/i }));

    expect(onSaved).toHaveBeenCalledWith(updated);
  });
});

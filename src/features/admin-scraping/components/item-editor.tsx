"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { ApiError } from "@/lib/api/types";
import { useUpdateItem } from "@/features/admin-scraping/hooks/use-items";
import type {
  ScrapedItemEnriched,
  UpdateScrapedItemPayload,
} from "@/features/admin-scraping/types";

interface ItemEditorProps {
  open: boolean;
  item: ScrapedItemEnriched | null;
  onClose: () => void;
  onSaved?: (item: ScrapedItemEnriched) => void;
}

/**
 * Modal de edicion previa al approve/publish. Carga los campos de `item`
 * en un form local; al guardar dispara `updateItem` (PATCH /items/:id).
 *
 * Si el caller pasa `onSaved`, le devolvemos el item actualizado por si
 * quiere encadenar otra accion (ej. "edit y luego publish").
 *
 * Estrategia de reset: el caller monta `<ItemEditor key={item.id}>` o usa
 * el wrapper `ItemEditor` que ya lo hace internamente — asi React resetea
 * el estado al cambiar de item sin necesidad de useEffect+setState.
 */
export function ItemEditor(props: ItemEditorProps) {
  if (!props.open || !props.item) return null;
  return <ItemEditorBody key={props.item.id} {...props} />;
}

function ItemEditorBody({ item, onClose, onSaved }: ItemEditorProps) {
  const update = useUpdateItem();

  // El item esta garantizado por el wrapper, pero TS no lo sabe.
  const initial = item!;

  const [title, setTitle] = useState(initial.title ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [locationName, setLocationName] = useState(initial.location_name ?? "");
  const [categoryHint, setCategoryHint] = useState(initial.category_hint ?? "");
  const [priceCop, setPriceCop] = useState<number | "">(
    initial.price_cop ?? "",
  );
  const [startsAt, setStartsAt] = useState(initial.starts_at ?? "");
  const [endsAt, setEndsAt] = useState(initial.ends_at ?? "");

  async function handleSave() {
    const payload: UpdateScrapedItemPayload = {};
    if (title !== (initial.title ?? "")) payload.title = title;
    if (description !== (initial.description ?? "")) {
      payload.description = description;
    }
    if (locationName !== (initial.location_name ?? "")) {
      payload.location_name = locationName;
    }
    if (categoryHint !== (initial.category_hint ?? "")) {
      payload.category_hint = categoryHint;
    }
    if (priceCop !== (initial.price_cop ?? "") && priceCop !== "") {
      payload.price_cop = Number(priceCop);
    }
    if (startsAt && startsAt !== (initial.starts_at ?? "")) {
      payload.starts_at = startsAt;
    }
    if (endsAt && endsAt !== (initial.ends_at ?? "")) {
      payload.ends_at = endsAt;
    }

    if (Object.keys(payload).length === 0) {
      // Sin cambios — simplemente cerramos sin pegarle al backend (evita
      // un BadRequest del DTO que exige "al menos un campo").
      onClose();
      return;
    }

    try {
      const saved = await update.mutateAsync({ id: initial.id, payload });
      toast.success("Cambios guardados");
      onSaved?.(saved);
      onClose();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo guardar");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Editar item"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-[var(--surface)] shadow-[var(--shadow-3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between p-5 border-b border-[var(--border)]">
          <div>
            <p className="eyebrow">Moderacion</p>
            <h2 className="text-lg font-semibold tracking-normal">Editar item</h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          <Field label="Título" htmlFor="ed-title">
            <Input
              id="ed-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>

          <Field label="Descripción" htmlFor="ed-desc">
            <textarea
              id="ed-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="flex w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
            />
          </Field>

          <Field label="Categoría (hint)" htmlFor="ed-cat">
            <Input
              id="ed-cat"
              value={categoryHint}
              onChange={(e) => setCategoryHint(e.target.value)}
              placeholder="tour, restaurante, bar, evento..."
            />
          </Field>

          <Field label="Lugar / dirección" htmlFor="ed-loc">
            <Input
              id="ed-loc"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Inicio (ISO)" htmlFor="ed-start">
              <Input
                id="ed-start"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                placeholder="2026-07-01T15:00:00Z"
              />
            </Field>
            <Field label="Fin (ISO)" htmlFor="ed-end">
              <Input
                id="ed-end"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                placeholder="2026-07-01T18:00:00Z"
              />
            </Field>
          </div>

          <Field label="Precio (COP)" htmlFor="ed-price">
            <Input
              id="ed-price"
              type="number"
              min={0}
              value={priceCop}
              onChange={(e) =>
                setPriceCop(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </Field>
        </div>

        <footer className="flex justify-end gap-2 p-5 border-t border-[var(--border)]">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button loading={update.isPending} onClick={handleSave}>
            Guardar
          </Button>
        </footer>
      </div>
    </div>
  );
}

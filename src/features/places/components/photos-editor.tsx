"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ApiError } from "@/lib/api/types";
import type { CreatePhotoPayload, PlacePhoto } from "@/lib/api/types";

interface Props {
  photos: PlacePhoto[];
  onAdd: (payload: CreatePhotoPayload) => Promise<unknown>;
  adding?: boolean;
}

/**
 * Add-photo-by-URL editor, shared by places and experiences. The backend
 * only accepts photo URLs (no file upload) and has no delete-photo route,
 * so this is add-only.
 */
export function PhotosEditor({ photos, onAdd, adding }: Props) {
  const [url, setUrl] = useState("");
  const [isCover, setIsCover] = useState(false);

  const sorted = [...photos].sort((a, b) => {
    if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1;
    return a.display_order - b.display_order;
  });

  async function handleAdd() {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      toast.error("Pega una URL válida (https://…)");
      return;
    }
    try {
      await onAdd({
        url: trimmed,
        is_cover: isCover,
        display_order: photos.length,
      });
      setUrl("");
      setIsCover(false);
      toast.success("Foto agregada");
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "No se pudo agregar la foto",
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {sorted.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {sorted.map((p) => (
            <div
              key={p.id}
              className="relative aspect-square rounded-md overflow-hidden bg-[var(--bg-subtle)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.alt_text ?? ""}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {p.is_cover ? (
                <span className="absolute top-1 left-1 inline-flex items-center h-5 px-1.5 rounded-pill text-[10px] font-semibold bg-[var(--accent)] text-[var(--accent-fg)]">
                  Portada
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">Aún no hay fotos.</p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…/foto.jpg"
          className="flex-1"
        />
        <label className="inline-flex items-center gap-2 text-sm whitespace-nowrap">
          <input
            type="checkbox"
            checked={isCover}
            onChange={(e) => setIsCover(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border-strong)] text-[var(--accent)]"
          />
          Portada
        </label>
        <Button
          type="button"
          variant="secondary"
          onClick={handleAdd}
          loading={adding}
        >
          <ImagePlus className="h-4 w-4" /> Agregar
        </Button>
      </div>
      <p className="text-xs text-[var(--text-soft)]">
        Las fotos se agregan por enlace (URL). Por ahora no se pueden subir
        archivos ni eliminar fotos desde aquí.
      </p>
    </div>
  );
}

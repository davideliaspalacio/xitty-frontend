"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, ExternalLink, Pencil, Trash2, Upload } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { ApiError } from "@/lib/api/types";
import {
  useItems,
  usePublishItem,
  useRejectItem,
} from "@/features/admin-scraping/hooks/use-items";
import { ItemEditor } from "@/features/admin-scraping/components/item-editor";
import type {
  EnrichedItemStatus,
  ScrapedItemEnriched,
} from "@/features/admin-scraping/types";

interface ModerationQueueProps {
  status?: EnrichedItemStatus;
}

const STATUS_FILTERS: { id: EnrichedItemStatus; label: string }[] = [
  { id: "pending", label: "Pendientes" },
  { id: "approved", label: "Aprobados" },
  { id: "published", label: "Publicados" },
  { id: "rejected", label: "Rechazados" },
];

const STATUS_LABEL: Record<EnrichedItemStatus, string> = {
  pending: "pendiente",
  approved: "aprobado",
  published: "publicado",
  rejected: "rechazado",
};

const isPublishable = (item: ScrapedItemEnriched) =>
  item.status === "pending" || item.status === "approved";

/**
 * Cola de moderación con flujo de UN SOLO PASO.
 *
 * "Publicar" es la acción primaria: el admin corre el scraper y publica
 * directo (no hay "Aprobar" previo — ese doble flujo dejaba items atrapados en
 * `approved`). "Publicar todos" publica de una toda la vista. Editar/Rechazar
 * quedan como acciones secundarias.
 */
export function ModerationQueue({
  status: initialStatus = "pending",
}: ModerationQueueProps) {
  const [status, setStatus] = useState<EnrichedItemStatus>(initialStatus);
  const { data: items, isLoading } = useItems({ status });
  const reject = useRejectItem();
  const publish = usePublishItem();

  const [editingItem, setEditingItem] = useState<ScrapedItemEnriched | null>(
    null,
  );
  const [publishingAll, setPublishingAll] = useState(false);

  const publishable = (items ?? []).filter(isPublishable);

  async function handleReject(item: ScrapedItemEnriched) {
    if (typeof window === "undefined") return;
    // Capturar el raw primero: Cancelar devuelve null y debe abortar el
    // rechazo. Si lo colapsamos a undefined antes del guard, el rechazo se
    // dispara igual aunque el usuario haya cancelado.
    const raw = window.prompt("Razón del rechazo (opcional):");
    if (raw === null) return;
    const reason = raw || undefined;
    try {
      await reject.mutateAsync({ id: item.id, reason });
      toast.success("Item rechazado");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo rechazar");
    }
  }

  async function handlePublish(item: ScrapedItemEnriched) {
    try {
      await publish.mutateAsync(item.id);
      toast.success("Publicado — ya aparece en el catálogo y en Descubre");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo publicar");
    }
  }

  async function handlePublishAll() {
    if (publishable.length === 0 || publishingAll) return;
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        `¿Publicar ${publishable.length} item(s)? Aparecerán en el catálogo y en Descubre.`,
      )
    ) {
      return;
    }
    setPublishingAll(true);
    let ok = 0;
    let fail = 0;
    // Secuencial para no saturar el backend ni el rate limit.
    for (const item of publishable) {
      try {
        await publish.mutateAsync(item.id);
        ok += 1;
      } catch {
        fail += 1;
      }
    }
    setPublishingAll(false);
    if (fail === 0) toast.success(`${ok} item(s) publicados`);
    else toast.error(`${ok} publicados, ${fail} fallaron`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={status === f.id}
              onClick={() => setStatus(f.id)}
              className={cn(
                "min-h-11 rounded-pill border px-3 text-xs font-semibold transition-colors sm:min-h-9",
                status === f.id
                  ? "bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)]",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {publishable.length > 0 ? (
          <Button
            size="sm"
            onClick={handlePublishAll}
            loading={publishingAll}
          >
            <Upload className="h-4 w-4" aria-hidden="true" /> Publicar todos ({publishable.length})
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              data-testid="item-skeleton"
              className="h-32 rounded-lg"
            />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <Card className="p-8 text-center text-sm text-[var(--text-muted)]">
          No hay items en estado <strong>{STATUS_LABEL[status]}</strong>.
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const canPublish = isPublishable(item);
            const canEdit = isPublishable(item);
            const canReject = isPublishable(item);
            const publishedHref = item.published_place_id
              ? `/places/${item.published_place_id}`
              : item.published_experience_id
                ? `/experiences/${item.published_experience_id}`
                : null;

            return (
              <article
                key={item.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-1)] p-4 flex flex-col gap-3"
              >
                <header className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold tracking-normal truncate">
                        {item.title}
                      </h3>
                      {item.category_hint ? (
                        <span className="inline-flex items-center h-5 px-2 rounded-pill text-[10px] font-semibold uppercase bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                          {item.category_hint}
                        </span>
                      ) : null}
                      {item.quality_score !== null ? (
                        <span className="text-[10px] text-[var(--text-soft)]">
                          score {item.quality_score.toFixed(2)}
                        </span>
                      ) : null}
                    </div>
                    {item.description ? (
                      <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    ) : null}
                    <div className="text-xs text-[var(--text-soft)] mt-1 flex items-center gap-2 flex-wrap">
                      {item.location_name ? (
                        <span>{item.location_name}</span>
                      ) : null}
                      {item.source_url ? (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[var(--accent)]"
                        >
                          Fuente <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                  {item.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.image_url}
                      alt=""
                      className="h-16 w-16 rounded-md object-cover shrink-0"
                    />
                  ) : null}
                </header>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {canPublish ? (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(item)}
                      loading={publish.isPending}
                    >
                      <Upload className="h-4 w-4" aria-hidden="true" /> Publicar
                    </Button>
                  ) : null}
                  {canEdit ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" /> Editar
                    </Button>
                  ) : null}
                  {canReject ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(item)}
                      loading={reject.isPending}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Rechazar
                    </Button>
                  ) : null}

                  {item.status === "published" ? (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--success)]"
                    >
                      <Check className="h-4 w-4" aria-hidden="true" /> Publicado
                    </span>
                  ) : null}
                  {item.status === "published" && publishedHref ? (
                    <Link
                      href={publishedHref}
                      className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
                    >
                      Ver publicado <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  ) : null}
                  {item.status === "rejected" ? (
                    <span className="text-xs text-[var(--text-muted)]">
                      Rechazado
                      {item.rejection_reason
                        ? `: ${item.rejection_reason}`
                        : ""}
                    </span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ItemEditor
        open={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
      />
    </div>
  );
}

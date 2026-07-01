"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Check,
  ExternalLink,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { ApiError } from "@/lib/api/types";
import {
  useApproveItem,
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

/**
 * Sub-filtros por estado dentro de la cola. Sin esto, aprobar un item lo
 * mandaba a `approved` y desaparecia de la vista (que solo mostraba
 * `pending`), dejando el boton "Publicar" inalcanzable. El admin ahora
 * alterna estados y publica los aprobados.
 */
const STATUS_FILTERS: { id: EnrichedItemStatus; label: string }[] = [
  { id: "pending", label: "Pendientes" },
  { id: "approved", label: "Aprobados" },
  { id: "published", label: "Publicados" },
  { id: "rejected", label: "Rechazados" },
];

/**
 * Cola de moderacion: lista los enriched items por estado y deja
 * approve / reject / edit / publish item-by-item.
 *
 * El ciclo de vida es pending -> approved -> published (o rejected). Cada
 * accion se muestra solo cuando aplica al estado del item: aprobar solo en
 * pending; publicar en pending o approved (el backend acepta ambos); los
 * publicados muestran un enlace al place/experience creado.
 *
 * Mantiene un solo `editingItem` para el modal compartido.
 */
export function ModerationQueue({ status: initialStatus = "pending" }: ModerationQueueProps) {
  const [status, setStatus] = useState<EnrichedItemStatus>(initialStatus);
  const { data: items, isLoading } = useItems({ status });
  const approve = useApproveItem();
  const reject = useRejectItem();
  const publish = usePublishItem();

  const [editingItem, setEditingItem] = useState<ScrapedItemEnriched | null>(null);

  async function handleApprove(item: ScrapedItemEnriched) {
    try {
      await approve.mutateAsync(item.id);
      toast.success("Item aprobado");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo aprobar");
    }
  }

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
      toast.success("Item publicado");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo publicar");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Filtrar por estado"
        className="flex flex-wrap gap-1.5"
      >
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={status === f.id}
            onClick={() => setStatus(f.id)}
            className={cn(
              "h-8 px-3 rounded-pill text-xs font-medium border transition-colors",
              status === f.id
                ? "bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)]",
            )}
          >
            {f.label}
          </button>
        ))}
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
          No hay items en estado <strong>{status}</strong>.
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const canApprove = item.status === "pending";
            const canEdit =
              item.status === "pending" || item.status === "approved";
            const canPublish =
              item.status === "pending" || item.status === "approved";
            const canReject =
              item.status === "pending" || item.status === "approved";
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
                      <h3 className="text-base font-semibold tracking-tight truncate">
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
                          Fuente <ExternalLink className="h-3 w-3" />
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
                  {canApprove ? (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(item)}
                      loading={approve.isPending}
                    >
                      <Check className="h-4 w-4" /> Aprobar
                    </Button>
                  ) : null}
                  {canEdit ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil className="h-4 w-4" /> Editar
                    </Button>
                  ) : null}
                  {canPublish ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handlePublish(item)}
                      loading={publish.isPending}
                    >
                      <Upload className="h-4 w-4" /> Publicar
                    </Button>
                  ) : null}
                  {canReject ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleReject(item)}
                      loading={reject.isPending}
                    >
                      <Trash2 className="h-4 w-4" /> Rechazar
                    </Button>
                  ) : null}

                  {item.status === "published" ? (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium"
                      style={{ color: "#0E9F8C" }}
                    >
                      <Check className="h-4 w-4" /> Publicado
                    </span>
                  ) : null}
                  {item.status === "published" && publishedHref ? (
                    <Link
                      href={publishedHref}
                      className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
                    >
                      Ver publicado <ExternalLink className="h-3 w-3" />
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

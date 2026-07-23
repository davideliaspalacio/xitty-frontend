"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { useOwnedPlace } from "@/features/places/hooks/use-owned-place";
import { BusinessPlaceRequired } from "@/features/places/components/business-place-required";
import {
  usePromotionsForPlace,
  useDeletePromotion,
} from "@/features/promotions";
import { PromotionForm } from "@/features/promotions/components/promotion-form";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { ApiError } from "@/lib/api/types";
import type { Promotion } from "@/lib/api/types";

export default function PromotionsAdminPage() {
  const { data: place, isLoading } = useOwnedPlace();
  const promos = usePromotionsForPlace(place?.id);
  const remove = useDeletePromotion(place?.id ?? "");
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [creating, setCreating] = useState(false);

  if (isLoading) return <Skeleton className="h-64 rounded-lg" />;
  if (!place) return <BusinessPlaceRequired />;

  async function handleDelete(p: Promotion) {
    if (!confirm(`¿Borrar "${p.title}"? Esta acción no se puede deshacer.`))
      return;
    try {
      await remove.mutateAsync(p.id);
      toast.success("Promoción eliminada");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo eliminar");
    }
  }

  const list = promos.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          {list.length} promociones · {list.filter((p) => p.is_active).length}{" "}
          activas
        </p>
        {!creating && !editing ? (
          <Button onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" /> Nueva promoción
          </Button>
        ) : null}
      </div>

      {creating ? (
        <Card>
          <CardContent className="py-6">
            <PromotionForm
              placeId={place.id}
              onSuccess={() => setCreating(false)}
              onCancel={() => setCreating(false)}
            />
          </CardContent>
        </Card>
      ) : null}

      {editing ? (
        <Card>
          <CardContent className="py-6">
            <PromotionForm
              placeId={place.id}
              existing={editing}
              onSuccess={() => setEditing(null)}
              onCancel={() => setEditing(null)}
            />
          </CardContent>
        </Card>
      ) : null}

      {promos.isLoading ? (
        <Skeleton className="h-32 rounded-lg" />
      ) : promos.isError ? (
        <ErrorState
          title="No pudimos cargar tus promociones"
          onRetry={() => void promos.refetch()}
        />
      ) : list.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="Aún no has creado promociones"
          description="Crea una para atraer clientes a tu negocio."
          action={
            <Button onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> Nueva promoción
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((p) => (
            <Card
              key={p.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold tracking-normal">
                    {p.title}
                  </h3>
                  {p.is_active ? (
                    <span className="inline-flex items-center h-5 px-2 rounded-pill text-[10px] font-semibold uppercase bg-[var(--success)]/10 text-[var(--success)]">
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center h-5 px-2 rounded-pill text-[10px] font-semibold uppercase bg-[var(--bg-subtle)] text-[var(--text-soft)]">
                      Inactiva
                    </span>
                  )}
                  {p.discount_percentage != null ? (
                    <span className="inline-flex items-center h-5 px-2 rounded-pill text-[10px] font-semibold bg-[var(--accent)] text-[var(--accent-fg)]">
                      -{p.discount_percentage}%
                    </span>
                  ) : null}
                </div>
                {p.description ? (
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-2">
                    {p.description}
                  </p>
                ) : null}
                <p className="text-xs text-[var(--text-soft)]">
                  {new Date(p.starts_at).toLocaleDateString("es-CO")} →{" "}
                  {new Date(p.ends_at).toLocaleDateString("es-CO")}
                </p>
              </div>
              <div className="flex w-full gap-1 sm:w-auto sm:shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Editar"
                  onClick={() => setEditing(p)}
                  className="flex-1 sm:flex-none"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Borrar"
                  onClick={() => handleDelete(p)}
                  disabled={remove.isPending}
                  className="flex-1 sm:flex-none"
                >
                  <Trash2
                    className="h-4 w-4 text-[var(--danger)]"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

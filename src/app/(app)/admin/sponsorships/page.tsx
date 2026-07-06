"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, X } from "lucide-react";
import { usePlaces } from "@/features/places";
import { usePlaceById } from "@/features/places/hooks/use-places";
import {
  useActivateSponsorship,
  useDeactivateSponsorship,
} from "@/features/admin";
import { RoleGate } from "@/features/auth/components/role-gate";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Input } from "@/shared/ui/input";
import { Field } from "@/shared/ui/field";
import { ApiError } from "@/lib/api/types";

function DurationDialog({
  open,
  placeId,
  placeName,
  onClose,
}: {
  open: boolean;
  placeId: string;
  placeName: string;
  onClose: () => void;
}) {
  const [days, setDays] = useState<number | "">(30);
  const activate = useActivateSponsorship();

  if (!open) return null;

  async function handleConfirm() {
    if (typeof days !== "number" || days < 1) {
      toast.error("Mínimo 1 día");
      return;
    }
    try {
      await activate.mutateAsync({ placeId, days });
      toast.success("Patrocinio activado");
      onClose();
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "No se pudo activar",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-xl bg-[var(--surface)] shadow-[var(--shadow-3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between p-5 border-b border-[var(--border)]">
          <div>
            <p className="eyebrow">Patrocinar</p>
            <h2 className="text-lg font-semibold tracking-normal">{placeName}</h2>
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
        <div className="p-5 flex flex-col gap-4">
          <Field
            label="Duración (días)"
            htmlFor="days"
            hint="El lugar aparecerá destacado en el ranking durante este período."
          >
            <Input
              id="days"
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={(e) =>
                setDays(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button loading={activate.isPending} onClick={handleConfirm}>
              Activar patrocinio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceRow({ placeId }: { placeId: string }) {
  const { data: place, isLoading } = usePlaceById(placeId);
  const deactivate = useDeactivateSponsorship();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading || !place) {
    return <Skeleton className="h-20 rounded-lg" />;
  }

  async function handleDeactivate() {
    if (!place || !confirm(`¿Desactivar patrocinio de "${place.name}"?`)) return;
    try {
      await deactivate.mutateAsync(place.id);
      toast.success("Patrocinio desactivado");
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "No se pudo desactivar",
      );
    }
  }

  return (
    <>
      <Card className="flex items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-[var(--bg-subtle)]">
            {place.cover_photo_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={place.cover_photo_url}
                alt={place.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{place.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">
              {place.categories?.name ?? "—"}
              {place.is_sponsored ? (
                <span className="ml-2 inline-flex items-center h-5 px-2 rounded-pill text-[10px] font-semibold uppercase bg-[var(--accent-soft)] text-[var(--accent)]">
                  Patrocinado
                </span>
              ) : null}
              {place.sponsored_until ? (
                <span className="ml-2 text-[var(--text-soft)]">
                  hasta {new Date(place.sponsored_until).toLocaleDateString("es-CO")}
                </span>
              ) : null}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {place.is_sponsored ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDeactivate}
              loading={deactivate.isPending}
            >
              Desactivar
            </Button>
          ) : (
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Sparkles className="h-4 w-4" /> Patrocinar
            </Button>
          )}
        </div>
      </Card>
      <DurationDialog
        open={dialogOpen}
        placeId={place.id}
        placeName={place.name}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}

export default function AdminSponsorshipsPage() {
  const { data, isLoading } = usePlaces({ limit: 50 });

  return (
    <RoleGate allow={["admin"]}>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="eyebrow">Admin</p>
          <h1 className="text-[32px] font-semibold leading-[1.1] tracking-normal">
            Patrocinios
          </h1>
          <p className="text-[var(--text-muted)] text-[15px] max-w-2xl">
            Activa o desactiva sponsorships. Los lugares patrocinados aparecen
            destacados en el ranking durante el período configurado.
          </p>
        </header>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {data?.data.map((p) => (
              <PlaceRow key={p.id} placeId={p.id} />
            ))}
          </div>
        )}
      </div>
    </RoleGate>
  );
}

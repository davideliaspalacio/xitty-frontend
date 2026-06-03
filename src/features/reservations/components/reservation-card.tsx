"use client";

import Link from "next/link";
import { Calendar, Users, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { useCancelReservation } from "@/features/reservations";
import { fmtCop } from "@/shared/utils/format";
import { cn } from "@/shared/utils/cn";
import { ApiError } from "@/lib/api/types";
import type { Reservation } from "@/lib/api/types";

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
};

const statusColor: Record<string, string> = {
  pending: "bg-[var(--warning)]/20 text-[var(--warning)]",
  confirmed: "bg-[var(--success)]/20 text-[var(--success)]",
  cancelled: "bg-[var(--bg-subtle)] text-[var(--text-soft)]",
  completed: "bg-[var(--info)]/20 text-[var(--info)]",
};

export function ReservationCard({ reservation }: { reservation: Reservation }) {
  const cancel = useCancelReservation();
  const exp = reservation.experience;
  const slot = reservation.slot;

  async function handleCancel() {
    if (!confirm("¿Cancelar esta reserva? La acción no se puede deshacer.")) return;
    try {
      await cancel.mutateAsync(reservation.id);
      toast.success("Reserva cancelada");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo cancelar");
    }
  }

  const date = slot ? new Date(slot.starts_at) : null;
  const canCancel =
    reservation.status === "confirmed" &&
    date != null &&
    date.getTime() - Date.now() > 0;

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden">
      <div
        className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-auto bg-[var(--bg-subtle)] shrink-0"
      >
        {exp?.cover_photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={exp.cover_photo_url}
            alt={exp.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex-1 p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-tight">
              {exp?.title ?? "Experiencia"}
            </h3>
          </div>
          <span
            className={cn(
              "inline-flex items-center h-6 px-2 rounded-pill text-[10px] font-semibold uppercase",
              statusColor[reservation.status] ?? "",
            )}
          >
            {statusLabels[reservation.status] ?? reservation.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-[var(--text-muted)]">
          {date ? (
            <div className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {date.toLocaleDateString("es-CO", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
              ·{" "}
              {date.toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
          ) : null}
          <div className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {reservation.participants} participante{reservation.participants > 1 ? "s" : ""}
          </div>
          {exp?.id ? (
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <Link
                href={`/experiences/${exp.id}`}
                className="hover:text-[var(--text)] underline-offset-4 hover:underline"
              >
                Ver experiencia
              </Link>
            </div>
          ) : null}
          <div className="inline-flex items-center gap-1.5">
            <span className="font-semibold text-[var(--text)]">
              {fmtCop.format(reservation.total_price_cop)}
            </span>
          </div>
        </div>

        {canCancel ? (
          <div className="flex justify-end mt-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              loading={cancel.isPending}
            >
              Cancelar reserva
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

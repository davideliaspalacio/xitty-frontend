"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Users, CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { useCreateReservation } from "@/features/experiences";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { fmtCop } from "@/shared/utils/format";
import { ApiError } from "@/lib/api/types";
import type { ExperienceDetail, ExperienceSlot } from "@/lib/api/types";

interface Props {
  experience: ExperienceDetail;
  slot: ExperienceSlot;
  open: boolean;
  onClose: () => void;
}

export function BookingDialog({ experience, slot, open, onClose }: Props) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const create = useCreateReservation(experience.id);
  const [participants, setParticipants] = useState(experience.min_participants);

  // Reset when re-opened
  useEffect(() => {
    if (open) setParticipants(experience.min_participants);
  }, [open, experience.min_participants]);

  if (!open) return null;

  const max = Math.min(experience.max_participants, slot.seats_available);
  const min = experience.min_participants;
  const total = experience.price_cop * participants;
  const date = new Date(slot.starts_at);

  async function handleConfirm() {
    if (!accessToken) {
      toast.info("Inicia sesión para reservar");
      router.push("/login?next=" + encodeURIComponent(window.location.pathname));
      return;
    }
    try {
      await create.mutateAsync({
        slot_id: slot.id,
        participants,
      });
      toast.success("Reserva confirmada");
      onClose();
      router.push("/reservations");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo reservar");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full sm:max-w-md bg-[var(--surface)] rounded-t-2xl sm:rounded-2xl shadow-[var(--shadow-3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between p-5 border-b border-[var(--border)]">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="eyebrow">Confirmar reserva</p>
            <h2 className="text-lg font-semibold tracking-tight line-clamp-1">
              {experience.title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="shrink-0 p-1 -mr-1 -mt-1 text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-5 flex flex-col gap-5">
          {/* Slot */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-4 flex items-start gap-3">
            <CalendarCheck className="h-5 w-5 text-[var(--accent)] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[var(--text-muted)]">Fecha y hora</p>
              <p className="text-sm font-semibold">
                {date.toLocaleDateString("es-CO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                {date.toLocaleTimeString("es-CO", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                · Duración{" "}
                {Math.floor(experience.duration_minutes / 60)}h{" "}
                {experience.duration_minutes % 60}m
              </p>
            </div>
          </div>

          {/* Participants */}
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[var(--text-muted)]" />
              Participantes
            </p>
            <div className="inline-flex items-center gap-3 rounded-pill border border-[var(--border-strong)] px-2 h-12">
              <button
                type="button"
                disabled={participants <= min}
                onClick={() => setParticipants((p) => Math.max(min, p - 1))}
                className="h-8 w-8 rounded-full border border-[var(--border-strong)] text-lg leading-none disabled:opacity-30"
              >
                −
              </button>
              <span className="min-w-[40px] text-center text-base font-semibold">
                {participants}
              </span>
              <button
                type="button"
                disabled={participants >= max}
                onClick={() => setParticipants((p) => Math.min(max, p + 1))}
                className="h-8 w-8 rounded-full border border-[var(--border-strong)] text-lg leading-none disabled:opacity-30"
              >
                +
              </button>
            </div>
            <p className="text-xs text-[var(--text-soft)] mt-1.5">
              Min {min} · Max {max} disponibles
            </p>
          </div>

          {/* Total */}
          <div className="flex items-end justify-between border-t border-[var(--border)] pt-4">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Total</p>
              <p className="text-2xl font-semibold">{fmtCop.format(total)}</p>
              <p className="text-xs text-[var(--text-soft)] mt-0.5">
                {fmtCop.format(experience.price_cop)} × {participants}
              </p>
            </div>
            <Button
              size="lg"
              loading={create.isPending}
              onClick={handleConfirm}
            >
              Confirmar reserva
            </Button>
          </div>

          <p className="text-xs text-[var(--text-soft)] text-center">
            Cancelación gratuita hasta {experience.cancellation_hours}h antes.
          </p>
        </div>
      </div>
    </div>
  );
}

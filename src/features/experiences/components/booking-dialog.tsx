"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
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
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    function handleEscape(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        setParticipants(experience.min_participants);
        onCloseRef.current();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      previousFocusRef.current?.focus();
    };
  }, [open, experience.min_participants]);

  if (!open) return null;

  const max = Math.min(experience.max_participants, slot.seats_available);
  const min = experience.min_participants;
  const safeParticipants = Math.min(max, Math.max(min, participants));
  const total = experience.price_cop * safeParticipants;
  const date = new Date(slot.starts_at);

  function handleClose() {
    setParticipants(experience.min_participants);
    onClose();
  }

  async function handleConfirm() {
    if (!accessToken) {
      toast.info("Inicia sesión para reservar");
      router.push("/login?next=" + encodeURIComponent(window.location.pathname));
      return;
    }
    try {
      await create.mutateAsync({
        slot_id: slot.id,
        participants: safeParticipants,
      });
      toast.success("Reserva confirmada");
      handleClose();
      router.push("/reservations");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "No se pudo reservar");
    }
  }

  function handleDialogKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const focusable = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
        className="w-full overflow-hidden rounded-t-xl bg-[var(--surface)] shadow-[var(--shadow-3)] sm:max-w-md sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
      >
        <header className="flex items-start justify-between p-5 border-b border-[var(--border)]">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="eyebrow">Confirmar reserva</p>
            <h2
              id="booking-dialog-title"
              className="line-clamp-1 text-lg font-semibold tracking-normal"
            >
              {experience.title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            ref={closeRef}
            onClick={handleClose}
            className="-mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-pill text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="p-5 flex flex-col gap-5">
          {/* Slot */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-4 flex items-start gap-3">
            <CalendarCheck
              className="mt-0.5 h-5 w-5 text-[var(--accent)]"
              aria-hidden="true"
            />
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
              <Users
                className="h-4 w-4 text-[var(--text-muted)]"
                aria-hidden="true"
              />
              Participantes
            </p>
            <div className="inline-flex items-center gap-3 rounded-pill border border-[var(--border-strong)] px-2 h-12">
              <button
                type="button"
                aria-label="Quitar un participante"
                disabled={safeParticipants <= min}
                onClick={() => setParticipants((p) => Math.max(min, p - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] text-lg leading-none disabled:opacity-30"
              >
                −
              </button>
              <span className="min-w-[40px] text-center text-base font-semibold">
                {safeParticipants}
              </span>
              <button
                type="button"
                aria-label="Agregar un participante"
                disabled={safeParticipants >= max}
                onClick={() => setParticipants((p) => Math.min(max, p + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] text-lg leading-none disabled:opacity-30"
              >
                +
              </button>
            </div>
            <p className="mt-1.5 text-xs text-[var(--text-muted)]">
              Min {min} · Max {max} disponibles
            </p>
          </div>

          {/* Total */}
          <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Total</p>
              <p className="text-2xl font-semibold">{fmtCop.format(total)}</p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {fmtCop.format(experience.price_cop)} × {safeParticipants}
              </p>
            </div>
            <Button
              size="lg"
              loading={create.isPending}
              onClick={handleConfirm}
              className="w-full sm:w-auto"
            >
              Confirmar reserva
            </Button>
          </div>

          <p className="pb-[env(safe-area-inset-bottom)] text-center text-xs text-[var(--text-muted)]">
            Cancelación gratuita hasta {experience.cancellation_hours}h antes.
          </p>
        </div>
      </div>
    </div>
  );
}

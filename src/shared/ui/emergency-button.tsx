"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ShieldAlert, Phone, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface EmergencyButtonProps {
  className?: string;
}

export function EmergencyButton({ className }: EmergencyButtonProps) {
  const [open, setOpen] = React.useState(false);

  const handleClose = React.useCallback(() => setOpen(false), []);

  // Cerrar con Escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  // Bloquear scroll del body mientras el modal está abierto
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Llamar emergencia"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full border-[1.5px] border-[#DC2626] bg-[var(--surface,#FFF8F1)] px-3 text-xs font-semibold uppercase tracking-wide text-[#DC2626] transition-colors hover:bg-[#FEE2E2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2",
          className,
        )}
      >
        <ShieldAlert className="h-4 w-4" aria-hidden="true" />
        <span>SOS</span>
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
          }}
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="emergency-title"
            aria-describedby="emergency-desc"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl bg-[var(--surface,#ffffff)] p-6 text-center shadow-2xl"
          >
            {/* Cerrar (X) */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar"
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted,#6b7280)] transition-colors hover:bg-black/5"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Ícono en círculo rojo suave */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE2E2]">
              <ShieldAlert className="h-8 w-8 text-[#DC2626]" aria-hidden="true" />
            </div>

            <h2
              id="emergency-title"
              className="text-xl font-bold tracking-tight text-[var(--text,#111827)]"
            >
              ¿Llamar a emergencias?
            </h2>
            <p
              id="emergency-desc"
              className="mt-2 text-sm leading-relaxed text-[var(--text-muted,#6b7280)]"
            >
              Te conectaremos con la línea{" "}
              <span className="font-semibold text-[var(--text,#111827)]">123</span>{" "}
              (Policía Nacional de Colombia).
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href="tel:123"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#DC2626] text-base font-semibold text-white shadow-[0_6px_18px_-6px_rgba(220,38,38,0.6)] transition-transform hover:bg-[#C11D1D] active:scale-[0.98]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Llamar 123
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-[var(--border,#e5e7eb)] bg-transparent text-sm font-semibold text-[var(--text,#374151)] transition-colors hover:bg-black/5"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>,
            document.body,
          )
        : null}
    </>
  );
}

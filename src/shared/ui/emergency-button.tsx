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
          "inline-flex h-11 items-center gap-1.5 rounded-pill border-[1.5px] border-[var(--danger)] bg-[var(--danger-soft)] px-3 text-xs font-semibold uppercase tracking-wide text-[var(--danger)] transition-colors hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)] focus-visible:ring-offset-2 sm:h-9",
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
            backgroundColor:
              "color-mix(in srgb, var(--ink) 55%, transparent)",
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
            className="relative w-full max-w-sm rounded-xl bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-3)]"
          >
            {/* Cerrar (X) */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar"
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-pill text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Ícono en círculo rojo suave */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-pill bg-[var(--danger-soft)]">
              <ShieldAlert className="h-8 w-8 text-[var(--danger)]" aria-hidden="true" />
            </div>

            <h2
              id="emergency-title"
              className="text-xl font-bold tracking-normal text-[var(--text)]"
            >
              ¿Llamar a emergencias?
            </h2>
            <p
              id="emergency-desc"
              className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]"
            >
              Te conectaremos con la línea{" "}
              <span className="font-semibold text-[var(--text)]">123</span>{" "}
              (Policía Nacional de Colombia).
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href="tel:123"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-[var(--danger)] text-base font-semibold text-white shadow-[0_3px_0_var(--ink)] transition-transform hover:brightness-95 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Llamar 123
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-11 w-full items-center justify-center rounded-pill border border-[var(--border)] bg-transparent text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)]"
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

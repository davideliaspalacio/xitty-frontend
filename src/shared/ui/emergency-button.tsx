"use client";

import * as React from "react";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const COUNTDOWN_SECONDS = 3;

export interface EmergencyButtonProps {
  className?: string;
}

export function EmergencyButton({ className }: EmergencyButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(COUNTDOWN_SECONDS);

  React.useEffect(() => {
    if (!open) {
      setSecondsLeft(COUNTDOWN_SECONDS);
      return;
    }

    setSecondsLeft(COUNTDOWN_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  const locked = secondsLeft > 0;

  const handleClose = React.useCallback(() => setOpen(false), []);

  const handleAnchorClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (locked) {
        event.preventDefault();
      }
    },
    [locked],
  );

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

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

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="emergency-title"
          aria-describedby="emergency-desc"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#DC2626] px-6 text-white"
        >
          <div className="flex flex-col items-center text-center max-w-md w-full">
            <ShieldAlert className="h-16 w-16 mb-6" aria-hidden="true" />
            <h2
              id="emergency-title"
              className="text-3xl font-bold mb-3"
            >
              ¿Llamar a emergencias?
            </h2>
            <p
              id="emergency-desc"
              className="text-base text-white/90 mb-10"
            >
              Te conectaremos con la línea 123 (Policía Nacional Colombia)
            </p>

            <a
              href="tel:123"
              aria-disabled={locked ? "true" : "false"}
              onClick={handleAnchorClick}
              tabIndex={locked ? -1 : 0}
              className={cn(
                "flex h-16 w-full items-center justify-center rounded-2xl bg-white text-xl font-bold text-[#DC2626] shadow-lg transition-opacity",
                locked
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-white/95 active:scale-[0.98]",
              )}
            >
              {locked ? `Llamar 123 (${secondsLeft})` : "Llamar 123"}
            </a>

            <button
              type="button"
              onClick={handleClose}
              className="mt-4 h-12 w-full rounded-2xl border-[1.5px] border-white/80 bg-transparent text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

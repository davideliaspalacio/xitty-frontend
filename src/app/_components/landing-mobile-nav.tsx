"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface LandingMobileNavItem {
  href: string;
  label: string;
}

/**
 * Menú hamburguesa para la landing en mobile (auditoría #13). En desktop los
 * enlaces de sección viven en el <nav> con `hidden md:flex`; aquí replicamos
 * esos mismos enlaces detrás de un botón, visible solo por debajo de `md`.
 */
export function LandingMobileNav({ items }: { items: LandingMobileNavItem[] }) {
  const [open, setOpen] = useState(false);

  // Bloquea el scroll del body mientras el menú está abierto.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/30"
          />
          {/* Drawer */}
          <nav
            aria-label="Menú principal"
            className="fixed inset-x-3 top-20 z-50 flex flex-col gap-1 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-2 shadow-[var(--shadow-flat)]"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-4 py-3 text-base font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-warm)]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </>
      ) : null}
    </div>
  );
}

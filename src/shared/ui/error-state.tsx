import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/ui/button";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  /** Si se pasa, se muestra un botón "Reintentar" que lo invoca. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Acción extra opcional (p. ej. un enlace) además del botón de reintento. */
  action?: React.ReactNode;
}

/**
 * Estado de error consistente para vistas que cargan datos (auditoría #6).
 * A diferencia de un texto plano, ofrece un botón "Reintentar" cableado al
 * `refetch` de la query, para que el usuario pueda recuperarse sin recargar.
 */
export function ErrorState({
  icon: Icon = AlertTriangle,
  title = "No pudimos cargar esto",
  description = "Hubo un problema de conexión. Revisa tu internet e inténtalo de nuevo.",
  onRetry,
  retryLabel = "Reintentar",
  action,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--danger-soft)] px-5 py-10 text-center sm:px-8 sm:py-12",
        className,
      )}
      {...props}
    >
      <span
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-pill border border-[var(--ink)] bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-flat)]"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="text-lg font-semibold tracking-normal text-[var(--text)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>
      ) : null}
      {onRetry || action ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {onRetry ? (
            <Button variant="secondary" onClick={onRetry}>
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              {retryLabel}
            </Button>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}

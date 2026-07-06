import { cn } from "@/shared/utils/cn";

interface CuratedImageFallbackProps {
  /** Se usa la inicial del título como marca de agua del placeholder. */
  label?: string | null;
  className?: string;
}

/**
 * Placeholder de marca "Atardecer Malecón" para cards/heros de contenido
 * curado que no tienen `image_url` (el scraper no siempre trae foto). Cubre
 * al padre con `absolute inset-0`, así que el contenedor debe ser `relative`.
 * Reemplaza el recuadro gris vacío por un gradiente cálido + inicial.
 */
export function CuratedImageFallback({ label, className }: CuratedImageFallbackProps) {
  const initial = (label ?? "").trim().charAt(0).toUpperCase() || "★";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 flex items-center justify-center select-none",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--accent-soft) 0%, var(--surface-warm) 50%, var(--surface-mint) 100%)",
      }}
    >
      <span
        className="font-bold leading-none text-6xl sm:text-7xl"
        style={{ color: "color-mix(in srgb, var(--ink) 10%, transparent)" }}
      >
        {initial}
      </span>
    </div>
  );
}

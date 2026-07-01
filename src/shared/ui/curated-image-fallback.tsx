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
          "linear-gradient(135deg, #FFE7E3 0%, #FFF4E8 50%, #DCF3EF 100%)",
      }}
    >
      <span
        className="font-bold leading-none text-6xl sm:text-7xl"
        style={{ color: "rgba(26,26,26,0.10)" }}
      >
        {initial}
      </span>
    </div>
  );
}

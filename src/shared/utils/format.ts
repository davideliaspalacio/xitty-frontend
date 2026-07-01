export const fmtCop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const fmtNumber = new Intl.NumberFormat("es-CO");

export function priceRangeLabel(range: number | null): string {
  if (range == null) return "";
  return "$".repeat(Math.max(1, Math.min(4, Math.round(range))));
}

/**
 * "Hace X" legible a partir de un ISO. Devuelve "" cuando la fecha falta o es
 * inválida — así nunca renderizamos "Hace NaN años" (bug del feed curado, cuyo
 * card DTO no incluye `scraped_at`). El caller decide si ocultar el string vacío.
 */
export function formatRelativeDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return "";
  const diffDays = Math.floor((Date.now() - ms) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} sem`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
  return `Hace ${Math.floor(diffDays / 365)} años`;
}

export function initials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

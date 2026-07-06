"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCuratedById } from "@/features/curated/hooks/use-curated";
import { CuratedDetail } from "@/features/curated/components/curated-detail";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * Detalle de un item del feed "Descubre / Curado con IA".
 *
 * Antes esta ruta NO existía: las cards enlazaban a `/curated/:id` y Next
 * devolvía 404. Ahora monta el `CuratedDetail` con los datos de
 * `GET /discover/curated/:id` (que sí incluye source_url + scraped_at).
 */
export default function CuratedDetailPage() {
  const params = useParams<{ id: string }>();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : null;

  const { data, isLoading, isError } = useCuratedById(id);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <Link
        href="/home"
        className="inline-flex items-center gap-1 self-start text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Descubre
      </Link>

      {isLoading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="aspect-[16/9] w-full rounded-lg" />
          <Skeleton className="h-9 w-2/3 rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      ) : isError || !data ? (
        <Card className="p-10 flex flex-col items-center gap-3 text-center">
          <p className="text-lg font-semibold">No encontramos este contenido</p>
          <p className="text-sm text-[var(--text-muted)] max-w-sm">
            Puede que ya no esté disponible o que el enlace haya cambiado.
          </p>
          <Link href="/home" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Volver al inicio
          </Link>
        </Card>
      ) : (
        <CuratedDetail item={data} />
      )}
    </div>
  );
}

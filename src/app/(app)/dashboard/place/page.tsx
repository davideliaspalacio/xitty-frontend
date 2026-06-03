"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useOwnedPlace } from "@/features/places/hooks/use-owned-place";
import { useAddPlacePhoto } from "@/features/places/hooks/use-manage-place";
import { PlaceForm } from "@/features/places/components/place-form";
import { PhotosEditor } from "@/features/places/components/photos-editor";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export default function DashboardPlacePage() {
  const { data: place, isLoading } = useOwnedPlace();
  const addPhoto = useAddPlacePhoto(place?.id ?? "");

  if (isLoading) return <Skeleton className="h-64 rounded-lg" />;

  if (!place) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[var(--text-muted)]">
          Aún no tienes un lugar registrado. Crea uno para empezar a recibir
          visitas, publicar promociones y experiencias.
        </p>
        <Card>
          <CardContent className="py-6">
            <PlaceForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-muted)]">
          Edita la información que ven los turistas en tu perfil.
        </p>
        {place.slug ? (
          <Link
            href={`/microsites/${place.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Ver perfil público <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>

      <Card>
        <CardContent className="py-6">
          <h3 className="text-sm font-semibold tracking-tight mb-4">
            Datos del lugar
          </h3>
          <PlaceForm existing={place} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6">
          <h3 className="text-sm font-semibold tracking-tight mb-4">Fotos</h3>
          <PhotosEditor
            photos={place.photos ?? []}
            onAdd={(p) => addPhoto.mutateAsync(p)}
            adding={addPhoto.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

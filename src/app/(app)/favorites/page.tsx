"use client";

import Link from "next/link";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { PlaceGrid } from "@/features/places/components/place-grid";
import { Button } from "@/shared/ui/button";
import type { FavoriteItem, PlaceCard } from "@/lib/api/types";

function toPlaceCard(item: FavoriteItem): PlaceCard {
  return {
    id: item.place.id,
    name: item.place.name,
    description: null,
    address: null,
    latitude: null,
    longitude: null,
    price_range: item.place.price_range,
    average_rating: item.place.average_rating,
    total_reviews: item.place.total_reviews,
    tags: [],
    categories: item.place.categories,
    cover_photo_url: item.place.cover_photo_url,
  };
}

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites(1, 50);

  const places = data?.data.map(toPlaceCard);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="eyebrow">Tus favoritos</p>
        <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]">
          Guardado para más tarde
        </h1>
        <p className="text-[var(--text-muted)] text-[15px]">
          Sincronizado entre tus dispositivos. Toca el corazón en cualquier
          tarjeta para guardar o quitar.
        </p>
      </header>

      {!isLoading && (!places || places.length === 0) ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-6 py-16 text-center">
          <h2 className="text-lg font-semibold mb-2">
            Aún no has guardado nada
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6 max-w-md mx-auto">
            Explora Barranquilla y guarda los lugares que quieras visitar.
            Aparecerán aquí.
          </p>
          <Link href="/places">
            <Button>Explorar lugares</Button>
          </Link>
        </div>
      ) : (
        <PlaceGrid places={places} loading={isLoading} />
      )}
    </div>
  );
}

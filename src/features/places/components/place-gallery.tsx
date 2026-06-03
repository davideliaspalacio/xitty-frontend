"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import type { PlacePhoto } from "@/lib/api/types";

interface PlaceGalleryProps {
  photos: PlacePhoto[];
  fallbackUrl?: string | null;
  alt: string;
  className?: string;
}

export function PlaceGallery({
  photos,
  fallbackUrl,
  alt,
  className,
}: PlaceGalleryProps) {
  const sorted = [...photos].sort(
    (a, b) =>
      Number(b.is_cover) - Number(a.is_cover) ||
      a.display_order - b.display_order,
  );
  const displayPhotos = sorted.length > 0 ? sorted : fallbackUrl
    ? [{
        id: "fallback",
        url: fallbackUrl,
        alt_text: alt,
        is_cover: true,
        display_order: 0,
      } as PlacePhoto]
    : [];

  const [active, setActive] = useState(0);

  if (displayPhotos.length === 0) {
    return (
      <div
        className={cn(
          "aspect-[3/2] rounded-lg bg-[var(--bg-subtle)] flex items-center justify-center text-sm text-[var(--text-soft)]",
          className,
        )}
      >
        Sin imágenes
      </div>
    );
  }

  const current = displayPhotos[active];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-[var(--bg-subtle)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={current.alt_text ?? alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {displayPhotos.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayPhotos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`Foto ${i + 1}`}
              className={cn(
                "shrink-0 h-16 w-20 rounded-md overflow-hidden border-2 transition-all",
                i === active
                  ? "border-[var(--accent)]"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import {
  Phone,
  MessageCircle,
  Navigation,
  CalendarCheck,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";
import { useTrackInteraction } from "@/features/metrics";
import type { PlaceDetail } from "@/lib/api/types";

interface PlaceCtaActionsProps {
  place: PlaceDetail;
}

export function PlaceCtaActions({ place }: PlaceCtaActionsProps) {
  const track = useTrackInteraction(place.id);
  const ctaPhone = place.cta_phone ?? place.phone;
  const ctaWa = place.cta_whatsapp;

  const mapsUrl =
    place.latitude != null && place.longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`
      : place.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`
        : null;

  async function handleShare() {
    const shareUrl = `${window.location.origin}/places/${place.id}`;
    const shareData = {
      title: place.name,
      text: place.description ?? `Mira ${place.name} en Xitty`,
      url: shareUrl,
    };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user dismissed */
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiado al portapapeles");
    } catch {
      toast.error("No se pudo compartir.");
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {place.reservation_url ? (
        <a
          href={place.reservation_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track.mutate({ interaction_type: "reservation_click" })}
          className={cn(
            buttonVariants({ variant: "primary", size: "md" }),
            "col-span-2 md:col-span-1",
          )}
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" /> Reservar
        </a>
      ) : null}

      {ctaPhone ? (
        <a
          href={`tel:${ctaPhone}`}
          onClick={() => track.mutate({ interaction_type: "call_click" })}
          className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
        >
          <Phone className="h-4 w-4" aria-hidden="true" /> Llamar
        </a>
      ) : null}

      {ctaWa ? (
        <a
          href={`https://wa.me/${ctaWa.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track.mutate({ interaction_type: "whatsapp_click" })}
          className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
        </a>
      ) : null}

      {mapsUrl ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track.mutate({ interaction_type: "directions_click" })}
          className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
        >
          <Navigation className="h-4 w-4" aria-hidden="true" /> Cómo llegar
        </a>
      ) : null}

      <button
        type="button"
        onClick={handleShare}
        className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
      >
        <Share2 className="h-4 w-4" aria-hidden="true" /> Compartir
      </button>
    </div>
  );
}

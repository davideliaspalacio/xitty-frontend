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
import type { Microsite } from "@/lib/api/types";

export function MicrositeCta({ microsite }: { microsite: Microsite }) {
  const track = useTrackInteraction(microsite.id);
  const ctaPhone = microsite.cta_phone ?? microsite.phone;
  const ctaWa = microsite.cta_whatsapp;
  const mapsUrl =
    microsite.latitude != null && microsite.longitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${microsite.latitude},${microsite.longitude}`
      : microsite.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(microsite.address)}`
        : null;

  async function handleShare() {
    const url = `${window.location.origin}/${microsite.slug}`;
    const data = { title: microsite.name, text: microsite.description ?? "", url };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* dismissed */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado");
    } catch {
      toast.error("No se pudo compartir");
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {ctaPhone ? (
        <a
          href={`tel:${ctaPhone}`}
          onClick={() => track.mutate({ interaction_type: "call_click" })}
          className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
        >
          <Phone className="h-4 w-4" /> Llamar
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
          <MessageCircle className="h-4 w-4" /> WhatsApp
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
          <Navigation className="h-4 w-4" /> Cómo llegar
        </a>
      ) : null}

      {microsite.reservation_url ? (
        <a
          href={microsite.reservation_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track.mutate({ interaction_type: "reservation_click" })}
          className={cn(buttonVariants({ variant: "primary", size: "md" }))}
        >
          <CalendarCheck className="h-4 w-4" /> Reservar
        </a>
      ) : null}

      <button
        type="button"
        onClick={handleShare}
        className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
      >
        <Share2 className="h-4 w-4" /> Compartir
      </button>
    </div>
  );
}

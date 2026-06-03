"use client";

import { useEffect } from "react";
import { useTrackInteraction } from "@/features/metrics";

/**
 * Fires a single `profile_view` interaction when a microsite mounts client-side.
 * Rendered inside the server page.
 */
export function MicrositeTracker({ placeId }: { placeId: string }) {
  const track = useTrackInteraction(placeId);
  useEffect(() => {
    track.mutate({ interaction_type: "profile_view" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);
  return null;
}

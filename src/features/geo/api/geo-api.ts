import { api } from "@/lib/api/http";
import type { GeoSnapshot } from "@/features/geo/store/geo-store";

export interface GeoSnapshotPayload {
  lat: number;
  lng: number;
  accuracy: number;
  captured_at: string; // ISO timestamp
}

function toPayload(snapshot: GeoSnapshot): GeoSnapshotPayload {
  return {
    lat: snapshot.lat,
    lng: snapshot.lng,
    accuracy: snapshot.accuracy,
    captured_at: new Date(snapshot.timestamp).toISOString(),
  };
}

export const geoApi = {
  saveSnapshots: (snapshots: GeoSnapshot[]) =>
    api.post<{ saved: number }>("/location/snapshots", {
      snapshots: snapshots.map(toPayload),
    }),

  deleteAllSnapshots: () =>
    api.delete<{ deleted: number }>("/location/snapshots/mine"),
};

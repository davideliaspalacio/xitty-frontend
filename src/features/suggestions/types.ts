export type SafetyTone = "good" | "ok" | "caution";

export type PriceBand = "asequible" | "medio" | "premium";

export interface SafetyZone {
  neighborhood: string;
  score: number;
  tags: string[];
  tone: SafetyTone;
}

export interface SuggestionContextResponse {
  safety_zone: SafetyZone | null;
  nearby_beach_m: number | null;
  price_band: PriceBand | null;
}

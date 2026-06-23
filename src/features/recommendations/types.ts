export interface RecommendationPlace {
  id: string;
  slug: string | null;
  name: string;
  /** Backend devuelve `cover_photo_url` (alineado con el shape de places). */
  cover_photo_url: string | null;
  price_range: number | null;
  average_rating: number;
}

export interface RecommendationItem {
  place: RecommendationPlace;
  score: number;
  reason: string;
}

export interface TodayResponse {
  items: RecommendationItem[];
  generated_at: string;
}

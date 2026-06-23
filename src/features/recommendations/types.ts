export interface RecommendationPlace {
  id: string;
  slug: string | null;
  name: string;
  cover_url: string | null;
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

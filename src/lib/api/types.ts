/**
 * Tipos auth (escritos a mano contra el contrato del backend mientras
 * /api/docs-json está protegido sin SWAGGER_PASSWORD).
 *
 * Una vez se agregue SWAGGER_PASSWORD al backend, este archivo se
 * reemplaza por la generación automática vía `npm run gen:api`.
 */

export type Role = "user" | "business" | "admin";

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  role: Role;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}

export interface RegisterResponse {
  message: string;
  user_id: string;
}

export interface VerifyEmailPayload {
  email: string;
  token: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  new_password: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  phone?: string;
}

export interface ProfileSummary extends User {
  stats: {
    places_visited: number;
    routes_completed: number;
    favorites_count: number;
    reviews_count: number;
  };
}

/* ───────── Preferences (módulo backend `preferences`) ───────── */

export type TravelerType =
  | "nomada"
  | "pareja"
  | "familia"
  | "negocios"
  | "excursion";

export type AvailableTime = "1-3 dias" | "4-7 dias" | "+1 semana";

export type EnergyLevel = "baja" | "media" | "alta";

export interface Preferences {
  user_id: string;
  traveler_type: TravelerType | null;
  budget_min: number | null;
  budget_max: number | null;
  available_time: AvailableTime | null;
  energy_level: EnergyLevel | null;
  companions: number;
  wizard_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePreferencesPayload {
  traveler_type: TravelerType;
  budget_min: number;
  budget_max: number;
  available_time: AvailableTime;
  energy_level: EnergyLevel;
  companions: number;
}

export type UpdatePreferencesPayload = Partial<CreatePreferencesPayload>;

/* ───────── Places / Categories / Reviews / Favorites (M3) ───────── */

export type PriceRange = 1 | 2 | 3 | 4;

export type PlaceSortBy =
  | "rating"
  | "price"
  | "popularity"
  | "newest"
  | "distance";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
}

export interface PlaceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface PlacePhoto {
  id: string;
  url: string;
  alt_text: string | null;
  is_cover: boolean;
  display_order: number;
}

export interface PlaceCard {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  price_range: number | null;
  average_rating: number;
  total_reviews: number;
  tags: string[];
  categories: PlaceCategory | null;
  cover_photo_url: string | null;
}

export interface PlaceDetail extends PlaceCard {
  phone: string | null;
  website: string | null;
  schedule: Record<string, unknown> | null;
  category_id: string | null;
  owner_id: string | null;
  is_active: boolean;
  slug: string | null;
  cta_phone: string | null;
  cta_whatsapp: string | null;
  reservation_url: string | null;
  is_sponsored: boolean;
  sponsored_until: string | null;
  photos: PlacePhoto[];
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type PlaceListResponse = Paginated<PlaceCard>;

export interface PlaceListQuery {
  page?: number;
  limit?: number;
  category_id?: string;
  price_range?: PriceRange;
  sort_by?: PlaceSortBy;
  latitude?: number;
  longitude?: number;
}

export interface PlaceSearchQuery {
  q: string;
  page?: number;
  limit?: number;
  category_id?: string;
}

/* ───────── Place management (owner/admin CRUD) ───────── */

export interface CreatePlacePayload {
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  price_range?: PriceRange;
  schedule?: Record<string, unknown>;
  category_id?: string;
  tags?: string[];
  slug?: string;
  cta_phone?: string;
  cta_whatsapp?: string;
  reservation_url?: string;
}

/** `is_active` is admin-only on the backend; owners just edit the fields. */
export type UpdatePlacePayload = Partial<CreatePlacePayload> & {
  is_active?: boolean;
};

/** Add-a-photo payload shared by places and experiences (CreatePlacePhotoDto). */
export interface CreatePhotoPayload {
  url: string;
  alt_text?: string;
  is_cover?: boolean;
  display_order?: number;
}

export interface Review {
  id: string;
  place_id: string;
  user_id: string;
  profiles: { full_name: string | null } | null;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export type ReviewListResponse = Paginated<Review>;

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export type UpdateReviewPayload = Partial<CreateReviewPayload>;

export interface FavoriteToggleResponse {
  place_id: string;
  is_favorite: boolean;
}

export interface FavoritePlace {
  id: string;
  name: string;
  average_rating: number;
  total_reviews: number;
  price_range: number | null;
  cover_photo_url: string | null;
  categories: { id: string; name: string; slug: string; icon: string | null } | null;
}

export interface FavoriteItem {
  place: FavoritePlace;
  favorited_at: string;
}

export type FavoriteListResponse = Paginated<FavoriteItem>;

/* ───────── Discover: ranking + featured + local-picks + experiences ───────── */

export interface DiscoverPlace {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  address: string | null;
  category_id: string | null;
  average_rating: number;
  total_reviews: number;
  cover_photo_url: string | null;
}

export interface RankingItem {
  position: number;
  previous_position: number | null;
  position_change: number | null;
  score: number;
  views_30d: number;
  conversions_30d: number;
  is_sponsored: boolean;
  sponsored_label: string | null;
  place: DiscoverPlace;
}

export interface RankingListResponse {
  data: RankingItem[];
  category_id: string | null;
  limit: number;
}

export interface FeaturedItem {
  id: string;
  place_id: string;
  curator_name: string;
  custom_title: string | null;
  custom_description: string | null;
  hero_image_url: string | null;
  week_starts_at: string;
  week_ends_at: string;
  position: number;
  is_active: boolean;
  place: DiscoverPlace | null;
}

export type PickTag = "favorito_local" | "secreto" | "autentico";

export interface LocalPickItem {
  id: string;
  place_id: string;
  curator_name: string;
  pick_tag: PickTag;
  short_pitch: string | null;
  hero_image_url: string | null;
  week_starts_at: string;
  week_ends_at: string;
  position: number;
  is_active: boolean;
  place: DiscoverPlace | null;
}

export type ExperienceType =
  | "tour"
  | "workshop"
  | "gastronomy"
  | "adventure"
  | "wellness"
  | "cultural"
  | "nightlife";

export interface ExperienceCard {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  experience_type: ExperienceType;
  tags: string[];
  duration_minutes: number;
  price_cop: number;
  average_rating: number;
  total_reviews: number;
  cover_photo_url: string | null;
}

export type ExperienceListResponse = Paginated<ExperienceCard>;

export interface ExperienceDetail extends ExperienceCard {
  operator_place_id: string;
  min_participants: number;
  max_participants: number;
  meeting_point_address: string | null;
  meeting_point_latitude: number | null;
  meeting_point_longitude: number | null;
  cancellation_hours: number;
  is_active: boolean;
  photos: PlacePhoto[];
  created_at: string;
  updated_at: string;
}

export interface ExperienceSlot {
  id: string;
  experience_id: string;
  starts_at: string;
  capacity: number;
  seats_taken: number;
  seats_available: number;
}

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface ReservationListExperience {
  id: string;
  title: string;
  slug: string | null;
  duration_minutes: number;
  cover_photo_url: string | null;
}

export interface ReservationListSlot {
  id: string;
  starts_at: string;
}

export interface Reservation {
  id: string;
  slot_id: string;
  experience_id: string;
  user_id: string;
  participants: number;
  total_price_cop: number;
  status: ReservationStatus;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  slot: ReservationListSlot | null;
  experience: ReservationListExperience | null;
}

export type ReservationListResponse = Paginated<Reservation>;

export interface CreateReservationPayload {
  slot_id: string;
  participants: number;
}

export interface ExperienceListQuery {
  page?: number;
  limit?: number;
  experience_type?: ExperienceType;
  sort_by?: "rating" | "price_asc" | "price_desc" | "newest";
  tag?: string;
  traveler_type?: TravelerType;
}

/* ───────── Experience management (owner/admin CRUD) ───────── */

export interface CreateExperiencePayload {
  operator_place_id: string;
  title: string;
  slug?: string;
  description?: string;
  experience_type: ExperienceType;
  tags?: string[];
  duration_minutes: number;
  price_cop: number;
  min_participants?: number;
  max_participants?: number;
  meeting_point_address?: string;
  meeting_point_latitude?: number;
  meeting_point_longitude?: number;
  cancellation_hours?: number;
  is_active?: boolean;
}

/** `operator_place_id` can't be changed after creation. */
export type UpdateExperiencePayload = Partial<
  Omit<CreateExperiencePayload, "operator_place_id">
>;

export interface CreateSlotPayload {
  starts_at: string;
  capacity: number;
  is_active?: boolean;
}

/* ───────── Experience reviews + rating distribution (US-043) ───────── */

export type ExperienceReviewSort = "recent" | "top";

export interface ExperienceReviewPhoto {
  id: string;
  url: string;
  display_order: number;
}

export interface ExperienceReviewAuthor {
  id: string;
  full_name: string | null;
}

export interface ExperienceReview {
  id: string;
  experience_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  reservation_id: string | null;
  created_at: string;
  updated_at: string;
  photos: ExperienceReviewPhoto[];
  author: ExperienceReviewAuthor | null;
}

export type ExperienceReviewListResponse = Paginated<ExperienceReview>;

export interface RatingDistributionItem {
  rating: number;
  count: number;
}

export interface RatingDistribution {
  distribution: RatingDistributionItem[];
  total: number;
  average: number;
}

export interface CreateExperienceReviewPayload {
  rating: number;
  comment?: string;
  reservation_id?: string;
  photo_urls?: string[];
}

export interface UpdateExperienceReviewPayload {
  rating?: number;
  comment?: string;
}

/* ───────── Microsites / Promotions / Metrics / Notifications (M5) ───────── */

export interface ActivePromotion {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  starts_at: string;
  ends_at: string;
}

export type Microsite = PlaceDetail & {
  active_promotions: ActivePromotion[];
};

export interface Promotion {
  id: string;
  place_id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePromotionPayload {
  title: string;
  description?: string;
  discount_percentage?: number;
  starts_at: string;
  ends_at: string;
  is_active?: boolean;
}

export type UpdatePromotionPayload = Partial<CreatePromotionPayload>;

export interface ActivePromotionListItem {
  id: string;
  place_id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  starts_at: string;
  ends_at: string;
  places: { id: string; name: string; slug: string | null } | null;
}

/**
 * Hero promotion shape returned by `GET /promotions/hero` —
 * powers the home-page AdsHero rotator. Backed by the
 * `active_hero_promotions` view on the backend.
 */
export interface HeroPromotion {
  id: string;
  place_id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  is_hero: boolean;
  hero_priority: number;
  hero_image_url: string | null;
  places: { id: string; name: string; slug: string | null } | null;
}

export type InteractionType =
  | "profile_view"
  | "call_click"
  | "whatsapp_click"
  | "reservation_click"
  | "directions_click"
  | "promo_view";

export interface TrackInteractionPayload {
  interaction_type: InteractionType;
  promo_id?: string;
}

export interface MetricsSummary {
  total_views: number;
  total_calls: number;
  total_whatsapp: number;
  total_reservations: number;
  total_directions: number;
  total_promo_views: number;
  total_interactions: number;
  prev_total_interactions: number;
  change_percent: number;
  period: { from: string; to: string };
}

export type TimeseriesGranularity = "day" | "week";

export interface MetricsBucket {
  bucket: string;
  views: number;
  calls: number;
  whatsapp: number;
  reservations: number;
  directions: number;
  promo_views: number;
  total: number;
}

export interface NotificationSettings {
  user_id: string;
  notify_call_click: boolean;
  notify_whatsapp_click: boolean;
  notify_reservation_click: boolean;
  daily_summary: boolean;
  created_at?: string;
  updated_at?: string;
}

export type UpdateNotificationSettingsPayload = Partial<
  Omit<NotificationSettings, "user_id" | "created_at" | "updated_at">
>;

export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;
  constructor(status: number, body: ApiErrorBody) {
    const msg = Array.isArray(body.message)
      ? body.message.join(", ")
      : body.message || "Error en la API";
    super(msg);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

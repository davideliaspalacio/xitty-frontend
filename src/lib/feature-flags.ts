const TRUE_VALUES = new Set(["1", "true", "on", "yes", "enabled"]);
const FALSE_VALUES = new Set(["0", "false", "off", "no", "disabled"]);

export const featureFlagDefaults = {
  aiChat: true,
  audioTours: true,
  categories: true,
  contextSuggestions: true,
  curatedFeed: true,
  emergencyButton: true,
  experiences: true,
  favorites: true,
  geoTracking: true,
  localPicks: true,
  microsites: true,
  onboardingTour: true,
  promotions: true,
  ranking: true,
  recommendations: true,
  reservations: true,
  rewardsRally: true,
  travelerModes: true,
} as const;

export type FeatureFlagKey = keyof typeof featureFlagDefaults;

export const landingSectionFlagDefaults = {
  landingPlanner: true,
  landingItinerary: true,
  landingFeatures: true,
  landingAudioTours: true,
  landingTravelerModes: true,
  landingTrust: true,
  landingBusiness: true,
  landingFaq: true,
  landingFinalCta: true,
} as const;

export type LandingSectionFlagKey = keyof typeof landingSectionFlagDefaults;

const featureFlagEnv = {
  aiChat: process.env.NEXT_PUBLIC_FEATURE_AI_CHAT,
  audioTours: process.env.NEXT_PUBLIC_FEATURE_AUDIO_TOURS,
  categories: process.env.NEXT_PUBLIC_FEATURE_CATEGORIES,
  contextSuggestions: process.env.NEXT_PUBLIC_FEATURE_CONTEXT_SUGGESTIONS,
  curatedFeed: process.env.NEXT_PUBLIC_FEATURE_CURATED_FEED,
  emergencyButton: process.env.NEXT_PUBLIC_FEATURE_EMERGENCY_BUTTON,
  experiences: process.env.NEXT_PUBLIC_FEATURE_EXPERIENCES,
  favorites: process.env.NEXT_PUBLIC_FEATURE_FAVORITES,
  geoTracking: process.env.NEXT_PUBLIC_FEATURE_GEO_TRACKING,
  localPicks: process.env.NEXT_PUBLIC_FEATURE_LOCAL_PICKS,
  microsites: process.env.NEXT_PUBLIC_FEATURE_MICROSITES,
  onboardingTour: process.env.NEXT_PUBLIC_FEATURE_ONBOARDING_TOUR,
  promotions: process.env.NEXT_PUBLIC_FEATURE_PROMOTIONS,
  ranking: process.env.NEXT_PUBLIC_FEATURE_RANKING,
  recommendations: process.env.NEXT_PUBLIC_FEATURE_RECOMMENDATIONS,
  reservations: process.env.NEXT_PUBLIC_FEATURE_RESERVATIONS,
  rewardsRally: process.env.NEXT_PUBLIC_FEATURE_REWARDS_RALLY,
  travelerModes: process.env.NEXT_PUBLIC_FEATURE_TRAVELER_MODES,
} satisfies Record<FeatureFlagKey, string | undefined>;

const landingSectionFlagEnv = {
  landingPlanner: process.env.NEXT_PUBLIC_LANDING_PLANNER,
  landingItinerary: process.env.NEXT_PUBLIC_LANDING_ITINERARY,
  landingFeatures: process.env.NEXT_PUBLIC_LANDING_FEATURES,
  landingAudioTours: process.env.NEXT_PUBLIC_LANDING_AUDIO_TOURS,
  landingTravelerModes: process.env.NEXT_PUBLIC_LANDING_TRAVELER_MODES,
  landingTrust: process.env.NEXT_PUBLIC_LANDING_TRUST,
  landingBusiness: process.env.NEXT_PUBLIC_LANDING_BUSINESS,
  landingFaq: process.env.NEXT_PUBLIC_LANDING_FAQ,
  landingFinalCta: process.env.NEXT_PUBLIC_LANDING_FINAL_CTA,
} satisfies Record<LandingSectionFlagKey, string | undefined>;

function parseBoolean(value: string | undefined): boolean | null {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();
  if (TRUE_VALUES.has(normalized)) return true;
  if (FALSE_VALUES.has(normalized)) return false;

  return null;
}

function parseDisabledList(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

type ResolvedFlags<T extends Record<string, boolean>> = {
  readonly [K in keyof T]: boolean;
};

function resolveFlags<T extends Record<string, boolean>>(
  defaults: T,
  envValues: Record<keyof T, string | undefined>,
  disabledList: Set<string>,
): ResolvedFlags<T> {
  return Object.fromEntries(
    Object.keys(defaults).map((key) => {
      const typedKey = key as keyof T;
      const explicitValue = parseBoolean(envValues[typedKey]);

      return [
        key,
        explicitValue ?? (!disabledList.has(key) && defaults[typedKey]),
      ];
    }),
  ) as ResolvedFlags<T>;
}

export const featureFlags = Object.freeze(
  resolveFlags(
    featureFlagDefaults,
    featureFlagEnv,
    parseDisabledList(process.env.NEXT_PUBLIC_DISABLED_FEATURES),
  ),
);

export const landingSectionFlags = Object.freeze(
  resolveFlags(
    landingSectionFlagDefaults,
    landingSectionFlagEnv,
    parseDisabledList(process.env.NEXT_PUBLIC_DISABLED_LANDING_SECTIONS),
  ),
);

export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return featureFlags[flag];
}

export function isLandingSectionEnabled(
  flag: LandingSectionFlagKey,
): boolean {
  return landingSectionFlags[flag];
}

import type { Catalog } from "@/features/i18n/catalog/es";

/**
 * English catalog. Covers ~30 high-traffic strings from home + nav.
 * Anything missing falls back to the Spanish catalog.
 */
export const en: Catalog = {
  // Navigation
  "nav.discover": "Discover",
  "nav.places": "Places",
  "nav.favorites": "Favorites",
  "nav.reservations": "Reservations",
  "nav.profile": "My account",
  "nav.business": "My business",
  "nav.promotions": "Promotions",
  "nav.metrics": "Metrics",
  "nav.admin": "Admin panel",
  "nav.featured": "Featured",
  "nav.local_picks": "Local picks",
  "nav.users": "Users",
  "nav.experiences": "Experiences",
  "nav.main_aria": "Main navigation",
  "nav.go_home": "Go to home",

  // Topbar
  "topbar.search_placeholder": "Search places, experiences…",
  "topbar.notifications": "Notifications",
  "topbar.guest": "Guest",
  "topbar.logout": "Log out",

  // Home
  "home.eyebrow": "Today in Barranquilla",
  "home.greeting": "Hi {name}. Where do we start?",
  "home.greeting.morning": "Good morning, {name}. Where do we start?",
  "home.greeting.afternoon": "Good afternoon, {name}. Where do we start?",
  "home.greeting.evening": "Good evening, {name}. Where do we start?",
  "home.intro":
    "A curated pick of places, weekly highlights and unique experiences across the Colombian Caribbean.",
  "home.cta.explore_places": "Explore places",
  "home.cta.see_experiences": "See experiences",

  // Sections
  "section.today.title": "Worth doing today",
  "section.ranking.title": "Ranking in Barranquilla",
  "section.featured.title": "Recommended",
  "section.categories.title": "Browse by category",
  "section.experiences.title": "Live something unique",
  "section.local.title": "Enjoy it like a local",

  // Language selector
  "i18n.change_language": "Change language",
  "i18n.language.es": "Spanish",
  "i18n.language.en": "English",
  "i18n.language.fr": "French",
  "i18n.language.pt": "Portuguese",

  // Generic greeting
  "greeting.morning": "Hello {name}",
};

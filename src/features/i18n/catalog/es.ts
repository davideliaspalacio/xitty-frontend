/**
 * Spanish catalog — DEFAULT.
 *
 * Holds all the user-facing strings the app uses. Other languages should
 * mirror the keys here; missing keys in another language fall back to es.
 */
export const es = {
  // Navigation / sidebar
  "nav.discover": "Descubrir",
  "nav.places": "Lugares",
  "nav.favorites": "Favoritos",
  "nav.reservations": "Reservas",
  "nav.profile": "Mi cuenta",
  "nav.business": "Mi negocio",
  "nav.promotions": "Promociones",
  "nav.metrics": "Métricas",
  "nav.admin": "Panel admin",
  "nav.featured": "Destacados",
  "nav.local_picks": "Local picks",
  "nav.users": "Usuarios",
  "nav.experiences": "Experiencias",
  "nav.main_aria": "Navegación principal",
  "nav.go_home": "Ir al inicio",

  // Topbar
  "topbar.search_placeholder": "Buscar lugares, experiencias…",
  "topbar.notifications": "Notificaciones",
  "topbar.guest": "Invitado",
  "topbar.logout": "Cerrar sesión",

  // Home / greeting
  "home.eyebrow": "Hoy en Barranquilla",
  "home.greeting": "Buenos días, {name}. ¿Por dónde empezamos?",
  "home.greeting.morning": "Buenos días, {name}. ¿Por dónde empezamos?",
  "home.greeting.afternoon": "Buenas tardes, {name}. ¿Por dónde empezamos?",
  "home.greeting.evening": "Buenas noches, {name}. ¿Por dónde empezamos?",
  "home.intro":
    "Selección curada de lugares, destacados de la semana y experiencias únicas en el Caribe colombiano.",
  "home.cta.explore_places": "Explorar lugares",
  "home.cta.see_experiences": "Ver experiencias",

  // Sections
  "section.today.title": "Qué vale la pena hacer hoy",
  "section.ranking.eyebrow": "Top de la ciudad",
  "section.ranking.title": "Ranking en Barranquilla",
  "section.ranking.subtitle": "Lo más visitado y mejor calificado esta semana.",
  "section.ranking.empty": "El ranking se actualiza diariamente. Aún no hay datos.",
  "section.featured.eyebrow": "Esta semana",
  "section.featured.title": "Recomendados",
  "section.featured.subtitle": "Curados por Xitty.",
  "section.featured.empty": "Pronto publicaremos los destacados de la semana.",
  "section.categories.title": "Explora por categoría",
  "section.categories.subtitle":
    "Encuentra lo que buscas, organizado por tipo de lugar.",
  "section.experiences.eyebrow": "Experiencias",
  "section.experiences.title": "Vive algo único",
  "section.experiences.subtitle":
    "Tours, talleres, gastronomía y bienestar.",
  "section.experiences.empty":
    "Estamos curando las primeras experiencias para ti.",
  "section.local.eyebrow": "Como local",
  "section.local.title": "Disfruta como un local",
  "section.local.subtitle":
    "Lugares secretos, auténticos y favoritos de la comunidad.",
  "section.local.empty":
    "Los locales aún no han compartido sus secretos esta semana.",

  // Language selector
  "i18n.change_language": "Cambiar idioma",
  "i18n.language.es": "Español",
  "i18n.language.en": "Inglés",
  "i18n.language.fr": "Francés",
  "i18n.language.pt": "Portugués",

  // Generic greeting key (used by tests/examples)
  "greeting.morning": "Hola {name}",
} as const;

export type CatalogKey = keyof typeof es;
export type Catalog = Readonly<Partial<Record<CatalogKey, string>>>;

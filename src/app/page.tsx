import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Camera,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Compass,
  CreditCard,
  Gift,
  Heart,
  Languages,
  ListChecks,
  LocateFixed,
  Map,
  MapPinned,
  MapPin,
  MessageCircle,
  PlayCircle,
  Route,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Ticket,
  UsersRound,
  Volume2,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/shared/ui/logo";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/cn";
import {
  LandingMobileNav,
  type LandingMobileNavItem,
} from "@/app/_components/landing-mobile-nav";
import {
  featureFlags,
  landingSectionFlags,
  type FeatureFlagKey,
} from "@/lib/feature-flags";

export const metadata: Metadata = {
  title: "Xitty — Planea Barranquilla en una sola guía",
  description:
    "Planifica qué hacer en Barranquilla con rutas, mapa, favoritos, audiotours, promociones y recomendaciones locales en una sola app.",
};

const landingButton =
  "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-pill px-6 text-base font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] motion-reduce:transition-none motion-reduce:active:scale-100";

const landingButtonVariants = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_3px_0_var(--ink)] hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] active:translate-y-0.5 active:shadow-none motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--ink)] hover:bg-[var(--surface-hover)]",
  soft: "bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--surface-warm)]",
};

type LandingCardItem = {
  icon: LucideIcon;
  title: string;
  text: string;
  feature?: FeatureFlagKey;
};

type LandingPlanItem = LandingCardItem & {
  time: string;
};

const plannerHighlights: LandingCardItem[] = [
  {
    icon: CalendarCheck,
    title: "Itinerario",
    text: "Mañana, tarde y noche ordenadas por tiempo real.",
  },
  {
    icon: Map,
    title: "Mapa",
    text: "Lugares, distancias y rutas en una sola vista.",
  },
  {
    icon: Heart,
    title: "Favoritos",
    text: "Guarda planes y vuelve cuando estés cerca.",
  },
  {
    icon: Ticket,
    title: "Promos",
    text: "Ofertas útiles en el momento correcto.",
    feature: "promotions",
  },
];

const replacementFeatures: LandingCardItem[] = [
  {
    icon: ListChecks,
    title: "Plan del día",
    text: "Convierte tiempo, presupuesto, energía y compañía en una ruta clara para hoy.",
    feature: "recommendations",
  },
  {
    icon: MapPinned,
    title: "Mapa de decisiones",
    text: "Ubicación, zonas, distancias y lugares guardados sin saltar entre pestañas.",
  },
  {
    icon: Volume2,
    title: "Audiotours",
    text: "Sitios de interés con narración por paradas, historia e idiomas.",
    feature: "audioTours",
  },
  {
    icon: Gift,
    title: "Rewards Rally",
    text: "Recorridos con retos, aprendizaje y premios desbloqueables.",
    feature: "rewardsRally",
  },
  {
    icon: MessageCircle,
    title: "Asistente Xi",
    text: "Pregunta por precios, playas, seguridad, reservas o planes cerca.",
    feature: "aiChat",
  },
  {
    icon: ShieldCheck,
    title: "Señales de confianza",
    text: "Reseñas, fotos, estado, seguridad y contexto para no improvisar mal.",
    feature: "contextSuggestions",
  },
];

const dayPlan: LandingPlanItem[] = [
  {
    time: "9:30 AM",
    title: "Café con sombra",
    text: "Cerca del hotel, buenas reseñas y ambiente tranquilo.",
    icon: Search,
  },
  {
    time: "11:00 AM",
    title: "Audiotour histórico",
    text: "Tres paradas narradas antes de que suba el calor.",
    icon: Volume2,
    feature: "audioTours",
  },
  {
    time: "1:20 PM",
    title: "Almuerzo local",
    text: "Promoción activa y ruta corta desde la parada anterior.",
    icon: Ticket,
    feature: "promotions",
  },
  {
    time: "4:45 PM",
    title: "Spot para fotos",
    text: "Atardecer recomendado según ubicación y clima del momento.",
    icon: Camera,
  },
];

const compareRows = [
  [
    "Antes",
    "12 pestañas abiertas",
    "Sin saber qué queda cerca",
    "Promos que aparecen tarde",
  ],
  [
    "Con Xitty",
    "Un plan vivo",
    "Mapa + tiempos + favoritos",
    "Acciones listas para reservar",
  ],
];

const modes = [
  {
    label: "Pareja",
    text: "Planes caminables, reservas y atardeceres.",
    icon: UsersRound,
  },
  {
    label: "Familia",
    text: "Rutas cortas, lugares seguros y pausas claras.",
    icon: ShieldCheck,
  },
  {
    label: "Negocios",
    text: "Comidas cerca, horarios y traslados rápidos.",
    icon: Clock3,
  },
  {
    label: "Nómada",
    text: "Cafés, Wi-Fi, cultura y barrios con ambiente.",
    icon: Smartphone,
  },
];

const trustSignals = [
  { icon: BadgeCheck, text: "Curaduría Xitty y recomendaciones locales" },
  { icon: Languages, text: "Base multi-idioma para visitantes" },
  {
    icon: LocateFixed,
    text: "Contexto por ubicación cuando el usuario lo permite",
  },
  { icon: Bell, text: "Alertas útiles para reservas, promos y recorridos" },
];

const faqs = [
  {
    question: "¿Xitty es solo una lista de lugares?",
    answer:
      "No. La dirección nueva es planner: lugares, experiencias, mapa, favoritos, promociones, audiotours y recomendaciones trabajando juntos para darte una próxima acción.",
  },
  {
    question: "¿Puedo usarlo si no conozco Barranquilla?",
    answer:
      "Ese es el punto. Xitty reduce la incertidumbre para que no tengas que adivinar zonas, distancias, precios o qué vale la pena hacer primero.",
  },
  {
    question: "¿Qué pasa si viajo con familia, pareja o por trabajo?",
    answer:
      "Las modalidades de viajero ayudan a priorizar planes distintos según energía, compañía, presupuesto y tiempo disponible.",
  },
];

function isLandingItemVisible(item: { feature?: FeatureFlagKey }) {
  return !item.feature || featureFlags[item.feature];
}

export default function LandingPage() {
  const activePlannerHighlights =
    plannerHighlights.filter(isLandingItemVisible);
  const activeReplacementFeatures =
    replacementFeatures.filter(isLandingItemVisible);
  const activeDayPlan = dayPlan.filter(isLandingItemVisible);
  const showAudioTours =
    landingSectionFlags.landingAudioTours && featureFlags.audioTours;
  // Mismos enlaces de sección que el nav desktop, para el menú móvil (#13).
  const mobileNavItems: LandingMobileNavItem[] = [
    landingSectionFlags.landingPlanner && {
      href: "#planner",
      label: "Planner",
    },
    landingSectionFlags.landingFeatures && {
      href: "#features",
      label: "Features",
    },
    showAudioTours && { href: "#audiotours", label: "Audiotours" },
    landingSectionFlags.landingTrust && {
      href: "#confianza",
      label: "Confianza",
    },
  ].filter((item): item is LandingMobileNavItem => Boolean(item));
  const showTravelerModes =
    landingSectionFlags.landingTravelerModes && featureFlags.travelerModes;
  const showBusiness =
    landingSectionFlags.landingBusiness && featureFlags.promotions;
  const heroCapabilities = [
    "rutas",
    "lugares",
    "mapa",
    featureFlags.favorites ? "favoritos" : null,
    featureFlags.promotions ? "promociones" : null,
    featureFlags.audioTours ? "audiotours" : null,
    featureFlags.recommendations ? "recomendaciones" : null,
  ]
    .filter((item): item is string => Boolean(item))
    .join(", ");
  const audioTourHighlights: Array<[LucideIcon, string, string]> = [
    [
      Volume2,
      "Narración por parada",
      "Historia y contexto en español, luego multi-idioma.",
    ],
    [
      MapPin,
      "Paradas geolocalizadas",
      "Cada punto puede tener radio, transcript y progreso.",
    ],
    ...(featureFlags.rewardsRally
      ? ([
          [
            Gift,
            "Base para recompensas",
            "Completar recorridos puede desbloquear premios.",
          ],
        ] as Array<[LucideIcon, string, string]>)
      : []),
  ];
  const finalCtaCopy = featureFlags.promotions
    ? "Empieza guardando lugares, revisando promociones o dejando que Xitty te sugiera qué vale la pena hacer hoy."
    : "Empieza guardando lugares o dejando que Xitty te sugiera qué vale la pena hacer hoy.";

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="relative isolate min-h-[92svh] overflow-hidden border-b border-[var(--border)] bg-[var(--surface-mint)]">
        <Image
          src="/landing/xitty-cartoon-barranquilla-hero.png"
          alt="Ilustración cartoon de Barranquilla con viajeros, mapa de ruta, palmeras y ciudad caribeña."
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-30 h-full w-full object-cover object-[64%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(248,252,248,0.98)_0%,rgba(248,252,248,0.92)_39%,rgba(248,252,248,0.62)_67%,rgba(248,252,248,0.22)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-[linear-gradient(0deg,var(--bg)_0%,rgba(248,252,248,0)_100%)]"
        />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Xitty">
            <Logo size="md" />
          </Link>
          <nav aria-label="Principal" className="flex items-center gap-2">
            <div className="hidden items-center gap-5 md:flex">
              {landingSectionFlags.landingPlanner ? (
                <NavLink href="#planner">Planner</NavLink>
              ) : null}
              {landingSectionFlags.landingFeatures ? (
                <NavLink href="#features">Features</NavLink>
              ) : null}
              {showAudioTours ? (
                <NavLink href="#audiotours">Audiotours</NavLink>
              ) : null}
              {landingSectionFlags.landingTrust ? (
                <NavLink href="#confianza">Confianza</NavLink>
              ) : null}
            </div>
            <Link
              href="/login"
              className={cn(
                landingButton,
                landingButtonVariants.secondary,
                "h-11 px-3 text-xs sm:h-9",
              )}
            >
              Entrar
            </Link>
            <LandingMobileNav items={mobileNavItems} />
          </nav>
        </header>

        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[minmax(0,600px)_minmax(380px,1fr)] lg:px-8 lg:pb-16 lg:pt-20">
          <div className="flex flex-col items-start self-center">
            <Badge variant="secondary" className="mb-5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Planner local para visitantes nuevos
            </Badge>
            <h1 className="max-w-[12ch] text-[44px] font-semibold leading-[0.98] tracking-normal text-[var(--text)] sm:text-[64px] lg:text-[78px]">
              Planea Barranquilla en una sola guía.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
              Xitty junta {heroCapabilities} para que no tengas que improvisar
              como turista perdido.
            </p>
            <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/register"
                className={cn(
                  landingButton,
                  landingButtonVariants.primary,
                  "w-full sm:w-auto",
                )}
              >
                Empezar a planear
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              {featureFlags.promotions ? (
                <Link
                  href="/promotions"
                  className={cn(
                    landingButton,
                    landingButtonVariants.soft,
                    "w-full sm:w-auto",
                  )}
                >
                  Ver promos activas
                </Link>
              ) : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <LandingPill icon={CalendarCheck}>Itinerario</LandingPill>
              <LandingPill icon={Map}>Mapa</LandingPill>
              {featureFlags.audioTours ? (
                <LandingPill icon={Volume2}>Audiotours</LandingPill>
              ) : null}
              {featureFlags.rewardsRally ? (
                <LandingPill icon={Gift}>Rewards</LandingPill>
              ) : null}
            </div>
          </div>

          <HeroPlannerMockup items={activeDayPlan} />
        </div>
      </section>

      {landingSectionFlags.landingPlanner ? (
        <section
          id="planner"
          className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                Como un trip planner, pero local
              </Badge>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Todo lo que necesitas para decidir qué hacer hoy.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)]">
              La idea no es mostrar más información: es convertir tiempo,
              ubicación, presupuesto y compañía en un plan que puedas seguir.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {activePlannerHighlights.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-normal">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {landingSectionFlags.landingItinerary ? (
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:px-8 lg:py-16">
            <div className="flex flex-col justify-center">
              <Badge variant="secondary" className="mb-4">
                <Route className="h-3.5 w-3.5" aria-hidden="true" />
                Plan armado
              </Badge>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                De “no sé qué hacer” a una ruta con horarios.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-muted)]">
                Una landing tipo planner tiene que enseñar el producto rápido:
                itinerario, mapa, paradas, tiempos y decisiones claras.
              </p>
              <div className="mt-7 grid gap-3">
                {compareRows.map(([label, one, two, three]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
                  >
                    <p className="text-sm font-semibold text-[var(--accent)]">
                      {label}
                    </p>
                    <div className="mt-3 grid gap-2 text-sm text-[var(--text-muted)] sm:grid-cols-3">
                      <span>{one}</span>
                      <span>{two}</span>
                      <span>{three}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ItineraryBoard items={activeDayPlan} />
          </div>
        </section>
      ) : null}

      {landingSectionFlags.landingFeatures ? (
        <section
          id="features"
          className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
                Reemplaza herramientas sueltas
              </Badge>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Lo que normalmente resuelves con mapa, notas, chats y reseñas.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[var(--text-muted)]">
              Xitty lo ordena alrededor de la decisión: qué vale la pena, cómo
              llegar, cuánto cuesta y qué puedes guardar.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activeReplacementFeatures.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-lg bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-normal">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {showAudioTours ? (
        <section
          id="audiotours"
          className="bg-[var(--ink)] text-[var(--text-inverse)]"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
            <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-white/8">
              <Image
                src="/landing/xitty-cartoon-river-route.png"
                alt="Visitantes siguiendo una ruta ilustrada con paradas por Barranquilla."
                fill
                loading="eager"
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <Badge className="mb-4 border-white/20 bg-white/10 text-white">
                <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Diferencial Xitty
              </Badge>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                No solo llegas al sitio: entiendes por qué importa.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/78">
                Los audiotours convierten lugares de interés en recorridos
                narrados por paradas.
                {featureFlags.rewardsRally
                  ? " Después, Rewards Rally puede usar esas paradas para retos, aprendizaje y premios."
                  : null}
              </p>
              <div className="mt-7 grid gap-3">
                {audioTourHighlights.map(([Icon, title, text]) => (
                  <article
                    key={String(title)}
                    className="rounded-lg bg-white/9 p-4"
                  >
                    <div className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-white text-[var(--ink)]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-semibold tracking-normal">
                          {title as string}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-white/72">
                          {text as string}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showTravelerModes ? (
        <section className="border-b border-[var(--border)] bg-[var(--surface-mint)]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">
            <div>
              <Badge variant="secondary" className="mb-4 bg-[var(--surface)]">
                <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
                Modalidades de viajero
              </Badge>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                El mismo mapa, distinto plan según con quién viajes.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {modes.map(({ label, text, icon: Icon }) => (
                <article
                  key={label}
                  className="rounded-lg bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-normal">
                    {label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {landingSectionFlags.landingTrust ? (
        <section
          id="confianza"
          className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge variant="secondary" className="mb-4">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Confianza práctica
              </Badge>
              <h2 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Para no sentirse turista bobo.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--text-muted)]">
                La promesa no es información infinita. Es ahorrar tiempo, evitar
                errores y salir con un plan que tenga sentido.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {trustSignals.map(({ icon: Icon, text }) => (
                <article
                  key={text}
                  className="flex gap-3 rounded-lg bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="self-center text-sm font-semibold leading-6 text-[var(--text)]">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showBusiness ? (
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
            <LandingImageCard
              src="/landing/xitty-cartoon-local-promotions.png"
              alt="Negocio local de Barranquilla mostrando promociones y reservas en un celular."
              label="Promociones dentro del plan"
              text="No como anuncio suelto: como oportunidad relevante para la ruta del día."
              icon={CreditCard}
            />
            <div className="flex flex-col justify-center">
              <Badge variant="secondary" className="mb-4">
                <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
                Para negocios y visitantes
              </Badge>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Las promos, reservas y micrositios aparecen donde se toma la
                decisión.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-muted)]">
                El negocio no queda enterrado en un catálogo. Entra en el
                momento exacto del plan: cerca, útil y con acción clara.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {landingSectionFlags.landingFaq ? (
        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-16">
          <div>
            <Badge variant="secondary" className="mb-4">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Preguntas normales
            </Badge>
            <h2 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
              Claro desde la primera visita.
            </h2>
          </div>
          <div className="grid gap-3">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                className="group rounded-lg bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg)]">
                  {question}
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-[var(--accent)] transition-transform duration-150 group-open:rotate-90 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {landingSectionFlags.landingFinalCta ? (
        <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="relative isolate overflow-hidden rounded-lg bg-[var(--surface-mint)] p-6 shadow-[var(--shadow-flat)] sm:p-8 lg:p-10">
            <Image
              src="/landing/xitty-cartoon-barranquilla-hero.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 1180px, 100vw"
              className="absolute inset-0 -z-20 h-full w-full object-cover object-[72%_center] opacity-32"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--surface-mint)_0%,rgba(236,250,236,0.94)_46%,rgba(236,250,236,0.62)_100%)]"
            />
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                Entra con una pregunta. Sal con un plan.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
                {finalCtaCopy}
              </p>
              <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/register"
                  className={cn(
                    landingButton,
                    landingButtonVariants.primary,
                    "w-full sm:w-auto",
                  )}
                >
                  Empezar ahora
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    landingButton,
                    landingButtonVariants.secondary,
                    "w-full sm:w-auto",
                  )}
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-semibold text-[var(--text-muted)] underline-offset-4 hover:text-[var(--text)] hover:underline"
    >
      {children}
    </Link>
  );
}

function LandingPill({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-pill border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--text)] shadow-[var(--shadow-1)]">
      <Icon className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
      {children}
    </span>
  );
}

function HeroPlannerMockup({ items }: { items: LandingPlanItem[] }) {
  return (
    <div
      className="relative hidden min-h-[560px] self-end lg:block"
      aria-label="Vista previa de planner Xitty"
    >
      <div className="absolute right-0 top-2 w-[430px] rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-4 shadow-[var(--shadow-flat)]">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)]">
              Mi viaje
            </p>
            <h2 className="text-xl font-semibold tracking-normal">
              Barranquilla, 3 días
            </h2>
          </div>
          <span className="rounded-pill bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--accent-fg)]">
            Listo
          </span>
        </div>
        <div className="mt-4 grid gap-3">
          {items.slice(0, 3).map(({ time, title, text, icon: Icon }) => (
            <div
              key={title}
              className="flex gap-3 rounded-lg bg-[var(--bg-subtle)] p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold text-[var(--text-soft)]">
                  {time}
                </p>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs leading-5 text-[var(--text-muted)]">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-0 w-[360px] rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-4 shadow-[var(--shadow-flat)]">
        <div className="relative h-56 overflow-hidden rounded-lg bg-[var(--surface-mint)]">
          <Image
            src="/landing/xitty-cartoon-river-route.png"
            alt="Mapa ilustrado de ruta Xitty"
            fill
            sizes="360px"
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 rounded-pill bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--text)] shadow-[var(--shadow-1)]">
            Mapa vivo
          </div>
          <div className="absolute bottom-4 right-4 rounded-lg bg-[var(--surface)] p-3 shadow-[var(--shadow-1)]">
            <p className="text-xs font-semibold text-[var(--text-muted)]">
              Siguiente parada
            </p>
            <p className="text-sm font-semibold">
              {featureFlags.audioTours
                ? "Audiotour histórico"
                : "Ruta recomendada"}
            </p>
          </div>
        </div>
      </div>
      {featureFlags.aiChat ? (
        <div className="absolute bottom-20 right-12 w-52 rounded-lg bg-[var(--ink)] p-4 text-[var(--text-inverse)] shadow-[var(--shadow-flat)]">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles
              className="h-4 w-4 text-[var(--secondary)]"
              aria-hidden="true"
            />
            Xi sugiere
          </div>
          <p className="mt-2 text-xs leading-5 text-white/74">
            {featureFlags.promotions
              ? "Cambia el almuerzo: hay una promo a 8 minutos."
              : "Ordena la tarde: este plan queda cerca y evita traslados largos."}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ItineraryBoard({ items }: { items: LandingPlanItem[] }) {
  return (
    <div className="rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] p-4 shadow-[var(--shadow-flat)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)]">
            Plan recomendado
          </p>
          <h3 className="text-2xl font-semibold tracking-normal">
            Hoy: cultura + comida + atardecer
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-pill bg-[var(--secondary-soft)] px-3 py-1 text-xs font-semibold text-[var(--secondary-fg)]">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />3 horas
        </span>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map(({ time, title, text, icon: Icon }) => (
          <article
            key={title}
            className="flex gap-4 rounded-lg bg-[var(--bg-subtle)] p-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-[var(--text-soft)]">
                {time}
              </p>
              <h4 className="mt-1 text-base font-semibold tracking-normal">
                {title}
              </h4>
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                {text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function LandingImageCard({
  src,
  alt,
  label,
  text,
  icon: Icon,
}: {
  src: string;
  alt: string;
  label: string;
  text: string;
  icon: LucideIcon;
}) {
  return (
    <figure className="overflow-hidden rounded-lg bg-[var(--surface)] shadow-[var(--shadow-flat)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          loading="eager"
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">{label}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              {text}
            </p>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

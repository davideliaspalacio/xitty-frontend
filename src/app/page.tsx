import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BookmarkCheck,
  CalendarCheck,
  Camera,
  Clock3,
  Compass,
  Coffee,
  Gift,
  Heart,
  Languages,
  LocateFixed,
  MapPinned,
  MapPin,
  MessageCircle,
  Navigation,
  Route,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Ticket,
  UsersRound,
  Utensils,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/shared/ui/logo";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/cn";

export const metadata: Metadata = {
  title: "Xitty — Descubre Barranquilla como local",
  description:
    "Una guía cálida y confiable para descubrir lugares, experiencias, promociones y planes en Barranquilla.",
};

const trustSignals = [
  {
    icon: ShieldCheck,
    title: "Lugares con señales claras",
    text: "Reseñas, estado, fotos y contexto para decidir sin adivinar.",
  },
  {
    icon: Sparkles,
    title: "Curaduría local",
    text: "Destacados, secretos y planes que se sienten de la ciudad.",
  },
  {
    icon: CalendarCheck,
    title: "Reserva cuando el plan lo pide",
    text: "Experiencias, horarios y favoritos listos para organizar tu viaje.",
  },
];

const discoveryModes = [
  {
    icon: Coffee,
    title: "Mañana suave",
    text: "Cafés, museos y caminatas con sombra para empezar sin correr.",
    points: ["Cerca de tu hotel", "Buen ambiente", "Fotos recientes"],
    image: "/landing/xitty-cartoon-cafe-planning.png",
    imageAlt:
      "Viajeros y locales planeando su ruta en una terraza de café en Barranquilla.",
    panelClass: "bg-[var(--surface-warm)]",
    iconClass: "bg-[var(--sunny-soft)] text-[var(--warning)]",
  },
  {
    icon: Utensils,
    title: "Almuerzo con sabor local",
    text: "Sitios recomendados por zona, reseñas claras y promos activas.",
    points: ["Reservas", "Promociones", "Favoritos"],
    image: "/landing/xitty-cartoon-local-promotions.png",
    imageAlt:
      "Pareja revisando promociones en el celular frente a un negocio local de Barranquilla.",
    panelClass: "bg-[var(--surface)]",
    iconClass: "bg-[var(--accent-soft)] text-[var(--accent)]",
  },
  {
    icon: Camera,
    title: "Tarde para explorar",
    text: "Rutas cortas por el río, cultura, tiendas y planes familiares.",
    points: ["Malecón", "Experiencias", "Ruta sugerida"],
    image: "/landing/xitty-cartoon-river-route.png",
    imageAlt:
      "Visitantes siguiendo una ruta ilustrada por el Malecón del Río en Barranquilla.",
    panelClass: "bg-[var(--surface-sky)]",
    iconClass: "bg-[var(--sky-soft)] text-[var(--info)]",
  },
  {
    icon: Ticket,
    title: "Noche lista",
    text: "Eventos, reservas y lugares guardados para decidir rápido.",
    points: ["Hoy abierto", "Música", "Cómo llegar"],
    image: "/landing/xitty-cartoon-night-plan.png",
    imageAlt:
      "Grupo llegando a una cena con música en una terraza iluminada de Barranquilla.",
    panelClass: "bg-[var(--surface-mint)]",
    iconClass: "bg-[var(--secondary-soft)] text-[var(--secondary-fg)]",
  },
];

const guidedSteps = [
  {
    icon: Search,
    title: "Dices qué se te antoja",
    text: "Comida, cultura, plan familiar, algo cerca o una experiencia para reservar.",
  },
  {
    icon: LocateFixed,
    title: "Xitty ordena opciones útiles",
    text: "Prioriza ubicación, señales de confianza, favoritos, promos y disponibilidad.",
  },
  {
    icon: Route,
    title: "Sales con una ruta clara",
    text: "Guardas lo que te gusta, comparas sin estrés y vuelves cuando quieras.",
  },
];

const productHighlights = [
  {
    icon: BookmarkCheck,
    title: "Favoritos con intención",
    text: "Guarda cafés, restaurantes, experiencias y lugares que quieres recordar.",
  },
  {
    icon: Gift,
    title: "Promos sin perseguirlas",
    text: "Encuentra ofertas locales en el momento en que sí te sirven.",
  },
  {
    icon: MessageCircle,
    title: "Chat para decidir",
    text: "Haz preguntas cuando estés entre dos planes o necesites contexto rápido.",
  },
  {
    icon: Languages,
    title: "Listo para visitantes",
    text: "Una experiencia clara para quien llega con poco tiempo y muchas dudas.",
  },
  {
    icon: Bell,
    title: "Avisos útiles",
    text: "Recibe señales sobre reservas, recomendaciones y contenido relevante.",
  },
  {
    icon: BadgeCheck,
    title: "Confianza primero",
    text: "Contenido moderado, reseñas, estados y detalles que reducen la incertidumbre.",
  },
];

const moments = [
  "Llegas al Malecón y quieres comer cerca",
  "Buscas un plan familiar antes del atardecer",
  "Quieres guardar lo bueno y volver después",
];

const routeStops = [
  {
    time: "9:20 AM",
    title: "Desayuno con terraza",
    text: "A 8 minutos, buenas fotos y reseñas recientes.",
    icon: Coffee,
  },
  {
    time: "11:10 AM",
    title: "Paseo por el río",
    text: "Ruta corta, ideal si quieres moverte sin perderte.",
    icon: MapPinned,
  },
  {
    time: "1:30 PM",
    title: "Almuerzo recomendado",
    text: "Promoción activa y opción para guardar en favoritos.",
    icon: Utensils,
  },
];

const localRoles = [
  {
    icon: UsersRound,
    title: "Para quien llega por primera vez",
    text: "Menos pestañas abiertas, menos preguntas sueltas y más decisiones en calma.",
  },
  {
    icon: Store,
    title: "Para negocios locales",
    text: "Perfiles, promos y señales de rendimiento que ayudan a atraer visitantes reales.",
  },
  {
    icon: Sparkles,
    title: "Para la ciudad",
    text: "Un catálogo más vivo de planes, cultura, sabores y rincones con personalidad.",
  },
];

const faqs = [
  {
    question: "¿Necesito cuenta para ver planes?",
    answer:
      "Puedes entrar por la landing y explorar promociones públicas. Para guardar favoritos, recibir recomendaciones y reservar experiencias, lo mejor es crear tu guía.",
  },
  {
    question: "¿Xitty es solo para turistas?",
    answer:
      "No. Está pensado para visitantes nuevos, locales curiosos y negocios que quieren mostrar mejor lo que ofrecen en Barranquilla.",
  },
  {
    question: "¿Qué pasa si no sé qué hacer hoy?",
    answer:
      "Ese es el caso ideal: Xitty te ayuda a filtrar por ubicación, tiempo, preferencias, promociones y experiencias disponibles.",
  },
  {
    question: "¿La experiencia funciona bien en celular?",
    answer:
      "Sí. El rediseño prioriza pantallas móviles, acciones táctiles, navegación clara y contenido fácil de leer mientras estás en movimiento.",
  },
];

const landingButton =
  "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-pill px-6 text-base font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] motion-reduce:transition-none motion-reduce:active:scale-100";

const landingButtonVariants = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_3px_0_var(--ink)] hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] active:translate-y-0.5 active:shadow-none motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--ink)] hover:bg-[var(--surface-hover)]",
  soft:
    "bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--surface-warm)]",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="relative isolate min-h-[88svh] overflow-hidden border-b border-[var(--border)] bg-[var(--surface-sky)]">
        <Image
          src="/landing/xitty-cartoon-barranquilla-hero.png"
          alt="Ilustración cartoon del Malecón de Barranquilla con viajeros, ruta de descubrimiento, palmeras y ciudad caribeña."
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(251,253,255,0.96)_0%,rgba(251,253,255,0.88)_34%,rgba(251,253,255,0.35)_62%,rgba(251,253,255,0.08)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[rgba(251,253,255,0.42)] sm:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-[linear-gradient(0deg,var(--bg)_0%,rgba(251,253,255,0)_100%)]"
        />

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Xitty">
            <Logo size="md" />
          </Link>
          <nav aria-label="Principal" className="flex items-center gap-2">
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="#planes"
                className="text-sm font-semibold text-[var(--text-muted)] underline-offset-4 hover:text-[var(--text)] hover:underline"
              >
                Planes
              </Link>
              <Link
                href="#guia"
                className="text-sm font-semibold text-[var(--text-muted)] underline-offset-4 hover:text-[var(--text)] hover:underline"
              >
                Cómo funciona
              </Link>
              <Link
                href="#confianza"
                className="text-sm font-semibold text-[var(--text-muted)] underline-offset-4 hover:text-[var(--text)] hover:underline"
              >
                Confianza
              </Link>
            </div>
            <Link
              href="/promotions"
              className="hidden text-sm font-semibold text-[var(--text-muted)] underline-offset-4 hover:text-[var(--text)] hover:underline sm:inline-flex"
            >
              Promociones
            </Link>
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
          </nav>
        </header>

        <div className="mx-auto grid w-full max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,620px)_1fr] lg:px-8 lg:pb-16 lg:pt-24">
          <div className="flex flex-col items-start">
            <Badge variant="secondary" className="mb-5">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Barranquilla en modo fácil
            </Badge>
            <h1 className="max-w-[12ch] text-[46px] font-semibold leading-[0.98] tracking-normal text-[var(--text)] sm:text-[64px] lg:text-[76px]">
              Descubre la ciudad como si alguien de aquí te guiara.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
              Xitty convierte lugares, experiencias, favoritos y recomendaciones
              en una ruta clara para moverte por Barranquilla con confianza.
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
                Crear mi guía
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  landingButton,
                  landingButtonVariants.soft,
                  "w-full sm:w-auto",
                )}
              >
                Ya tengo cuenta
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <LandingPill icon={Compass}>Planes cerca</LandingPill>
              <LandingPill icon={Heart}>Favoritos guardados</LandingPill>
              <LandingPill icon={Star}>Recomendaciones para hoy</LandingPill>
            </div>
          </div>
        </div>
      </section>

      <section
        id="confianza"
        className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16"
      >
        <div>
          <p className="text-sm font-semibold text-[var(--accent)]">
            Para visitantes nuevos
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">
            No necesitas conocer la ciudad para tomar buenas decisiones.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {trustSignals.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold tracking-normal">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="planes" className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                Elige por momento
              </Badge>
              <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
                La ciudad cambia según la hora, el antojo y con quién vienes.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[var(--text-muted)]">
              En lugar de mostrarte una lista infinita, Xitty ayuda a convertir
              “quiero hacer algo” en planes concretos para hoy.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {discoveryModes.map((mode) => (
              <article
                key={mode.title}
                className={cn(
                  "flex min-h-[380px] flex-col justify-between overflow-hidden rounded-xl shadow-[var(--shadow-1)]",
                  mode.panelClass,
                )}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={mode.image}
                    alt={mode.imageAlt}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-pill",
                        mode.iconClass,
                      )}
                    >
                      <mode.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-xl font-semibold tracking-normal">
                      {mode.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                      {mode.text}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {mode.points.map((point) => (
                      <span
                        key={point}
                        className="rounded-pill bg-[rgba(255,255,255,0.78)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="guia" className="bg-[var(--surface-mint)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
              Abres Xitty, dices qué quieres hacer, y la ciudad deja de sentirse
              gigante.
            </h2>
            <div className="mt-7 grid gap-3">
              {moments.map((moment, index) => (
                <div
                  key={moment}
                  className="flex items-center gap-3 rounded-lg bg-[var(--surface)] p-3 shadow-[var(--shadow-1)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-[var(--sunny-soft)] text-sm font-bold text-[var(--warning)]">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {moment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <PhonePreview />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8 lg:py-16">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <Badge variant="secondary" className="mb-4">
            <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
            Una guía que se arma contigo
          </Badge>
          <h2 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Menos búsqueda dispersa, más señales para decidir.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--text-muted)]">
            La experiencia mezcla descubrimiento, favoritos, promociones,
            reservas y recomendaciones para que cada pantalla tenga una acción
            clara.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {productHighlights.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-xl bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]"
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

      <section className="bg-[var(--ink)] text-[var(--text-inverse)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <Badge className="mb-4 border-white/20 bg-white/10 text-white">
              <Store className="h-3.5 w-3.5" aria-hidden="true" />
              Ciudad + negocios locales
            </Badge>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
              Las promociones, reservas y perfiles viven donde la gente decide.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/78">
              Xitty también ayuda a los negocios a aparecer con mejor contexto:
              oferta clara, fotos, estado, ubicación, reseñas y acciones útiles
              para convertir interés en visita.
            </p>
            <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/promotions"
                className={cn(
                  landingButton,
                  "w-full bg-[var(--sunny)] text-[var(--ink)] shadow-[0_3px_0_#ffffff] hover:-translate-y-0.5 hover:bg-[#ffe08f] active:translate-y-0.5 active:shadow-none sm:w-auto motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
                )}
              >
                Ver promociones
                <Ticket className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/register"
                className={cn(
                  landingButton,
                  "w-full border border-white/28 bg-white/10 text-white hover:bg-white/16 sm:w-auto",
                )}
              >
                Crear cuenta
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-white/9">
              <Image
                src="/landing/xitty-cartoon-local-promotions.png"
                alt="Negocio local de Barranquilla mostrando promociones y reservas a visitantes desde Xitty."
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
            {localRoles.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-xl bg-white/9 p-5">
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-white text-[var(--ink)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-normal">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/74">
                      {text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
        <LandingImageCard
          src="/landing/xitty-cartoon-river-route.png"
          alt="Visitantes siguiendo una ruta por el Malecón del Río con pines de comida, cultura y atardecer."
          label="Ruta amable para caminar"
          text="Tres paradas, tiempos cortos y lugares guardados si quieres ajustar el plan."
          icon={Route}
        />
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="mb-4">
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            Del antojo al camino
          </Badge>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Xitty no te deja con una lista: te deja con una próxima acción.
          </h2>
          <div className="mt-7 grid gap-3">
            {routeStops.map(({ icon: Icon, time, title, text }) => (
              <article
                key={title}
                className="flex gap-4 rounded-xl bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-[var(--secondary-soft)] text-[var(--secondary-fg)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-muted)]">
                    {time}
                  </p>
                  <h3 className="mt-1 text-base font-semibold tracking-normal">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface-warm)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
          <div>
            <Badge variant="secondary" className="mb-4 bg-[var(--surface)]">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              Primeros cinco minutos
            </Badge>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
              Lo suficiente para empezar rápido, sin pedirte que configures todo.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-muted)]">
              La primera pantalla debe sentirse como una bienvenida práctica:
              abrir, entender y salir con una decisión.
            </p>
          </div>
          <div className="grid gap-4">
            <LandingImageCard
              src="/landing/xitty-cartoon-first-visit.png"
              alt="Visitante nuevo usando Xitty mientras recibe orientación para explorar Barranquilla."
              label="Tu guía empieza con contexto"
              text="Favoritos, recomendaciones y lugares cerca aparecen con una lectura clara desde el primer uso."
              icon={Smartphone}
            />
            <div className="grid gap-3">
            {guidedSteps.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="flex gap-4 rounded-xl bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-[var(--sunny-soft)] text-[var(--warning)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold tracking-normal">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                    {text}
                  </p>
                </div>
              </article>
            ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-16">
        <div>
          <Badge variant="secondary" className="mb-4">
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            Dudas normales
          </Badge>
          <h2 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Para entrar sin sentirse perdido.
          </h2>
        </div>
        <div className="grid gap-3">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-xl bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]"
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

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div className="relative isolate overflow-hidden rounded-xl bg-[var(--surface-sky)] p-6 shadow-[var(--shadow-flat)] sm:p-8 lg:p-10">
          <Image
            src="/landing/xitty-cartoon-barranquilla-hero.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 1180px, 100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[72%_center] opacity-35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--surface-sky)_0%,rgba(236,248,255,0.92)_44%,rgba(236,248,255,0.56)_100%)]"
          />
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
              Entra, guarda tus lugares y deja que Barranquilla te encuentre a ti.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
              La landing es solo la puerta: adentro tienes favoritos,
              recomendaciones, reservas, promociones y una guía que se adapta a
              tu forma de viajar.
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
                href="/promotions"
                className={cn(
                  landingButton,
                  landingButtonVariants.secondary,
                  "w-full sm:w-auto",
                )}
              >
                Ver promociones activas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
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

function PhonePreview() {
  return (
    <aside className="relative overflow-hidden rounded-xl bg-[var(--surface)] p-4 shadow-[var(--shadow-flat)]">
      <div className="rounded-xl bg-[var(--ink)] p-3 text-[var(--text-inverse)]">
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-pill bg-white/28" />
        <div className="rounded-lg bg-[var(--bg)] p-4 text-[var(--text)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)]">
                Hoy en Barranquilla
              </p>
              <p className="text-lg font-semibold tracking-normal">
                Ruta para 3 horas
              </p>
            </div>
            <span className="rounded-pill bg-[var(--secondary-soft)] px-3 py-1 text-xs font-semibold text-[var(--secondary-fg)]">
              Lista
            </span>
          </div>
          <div className="mt-5 grid gap-3">
            {["Café con sombra", "Paseo por el río", "Cena con música"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg bg-[var(--surface)] p-3 shadow-[var(--shadow-1)]"
                >
                  <span className="text-sm font-semibold">{item}</span>
                  <MapPin
                    className="h-4 w-4 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                </div>
              ),
            )}
          </div>
          <div className="mt-4 rounded-lg bg-[var(--surface-warm)] p-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-[var(--warning)]" />
              Te conviene guardar este plan
            </div>
            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              Está cerca de dos lugares que marcaste como favoritos.
            </p>
          </div>
        </div>
      </div>
    </aside>
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
    <figure className="overflow-hidden rounded-xl bg-[var(--surface)] shadow-[var(--shadow-flat)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
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

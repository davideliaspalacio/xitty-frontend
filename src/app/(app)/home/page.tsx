"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, MapPin, Search, Sparkles } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth-store";
import {
  useFeaturedCurrent,
  useLocalPicksCurrent,
  useRanking,
} from "@/features/discover";
import { useExperiences } from "@/features/experiences";
import { HorizontalCarousel } from "@/shared/layout/horizontal-carousel";
import { SectionHeader } from "@/shared/layout/section-header";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { EmptyState } from "@/shared/ui/empty-state";
import { RankingCard } from "@/features/discover/components/ranking-card";
import { FeaturedCard } from "@/features/discover/components/featured-card";
import { LocalPickCard } from "@/features/discover/components/local-pick-card";
import { ExperienceCard as ExperienceCardComponent } from "@/features/experiences/components/experience-card";
import { TravelerTypeChips } from "@/features/preferences/components/traveler-type-chips";
import { useTravelerFilter } from "@/features/preferences/hooks/use-traveler-filter";
import { AdsHero } from "@/features/promotions";
import { TodaySection } from "@/features/recommendations";
import { CategoriesGrid } from "@/features/places/components/categories-grid";
import { CuratedCarousel, useCurated } from "@/features/curated";
import { useT } from "@/features/i18n";
import { env } from "@/lib/env";
import { featureFlags } from "@/lib/feature-flags";

function CarouselSkeletons() {
  return (
    <div className="flex gap-4 px-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-[min(82vw,320px)] shrink-0">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <div className="mt-3 flex flex-col gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyMini({ message }: { message: string }) {
  return (
    <EmptyState
      icon={Sparkles}
      title="Estamos preparando esta sección"
      description={message}
      className="py-8"
    />
  );
}

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const name = user?.full_name?.split(" ")[0] ?? "Hola";
  const [heroQuery, setHeroQuery] = useState("");
  const t = useT();
  const city = env.NEXT_PUBLIC_DEFAULT_CITY;

  const { travelerType, setTravelerType } = useTravelerFilter();
  const ranking = useRanking(8, travelerType, featureFlags.ranking, city);
  const featured = useFeaturedCurrent(
    travelerType,
    featureFlags.recommendations,
  );
  const localPicks = useLocalPicksCurrent(
    travelerType,
    featureFlags.localPicks,
  );
  const experiences = useExperiences(
    { limit: 8, sort_by: "rating" },
    { enabled: featureFlags.experiences },
  );
  const curated = useCurated(
    { limit: 12 },
    { enabled: featureFlags.curatedFeed },
  );

  return (
    <div className="flex flex-col space-y-10 sm:space-y-12">
      {/* Greeting / hero */}
      <header
        id="tour-hero"
        className="grid gap-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)] sm:p-6 lg:grid-cols-[1fr_320px]"
      >
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">Hoy en {city}</p>
            <Badge variant="secondary">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Caribe colombiano
            </Badge>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-[34px] font-semibold leading-[1.05] tracking-normal text-[var(--text)] sm:text-[44px]">
              {t("home.greeting", { name })}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)]">
              Selección curada de lugares, destacados de la semana y
              experiencias únicas para moverte por la ciudad con confianza.
            </p>
          </div>

          <form
            action="/places"
            method="get"
            className="flex flex-col gap-2 sm:max-w-2xl sm:flex-row"
          >
            <div className="relative min-w-0 flex-1">
              <label htmlFor="home-search" className="sr-only">
                Buscar en {city}
              </label>
              <input type="hidden" name="city" value={city} />
              <Search
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]"
                aria-hidden="true"
              />
              <input
                id="home-search"
                name="q"
                type="search"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Busca restaurantes, planes o barrios"
                className="h-12 w-full rounded-pill border border-[var(--border-strong)] bg-[var(--bg)] pl-12 pr-4 text-base text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/25"
              />
            </div>
            <Button type="submit" size="lg">
              <Search className="h-4 w-4" aria-hidden="true" />
              Buscar
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Link href="/places" className={buttonVariants({ variant: "soft" })}>
              Explorar lugares
            </Link>
            <Link
              href="/experiences"
              className={buttonVariants({ variant: "secondary" })}
            >
              Ver experiencias
            </Link>
          </div>
        </div>

        <aside className="grid gap-3 rounded-lg bg-[var(--surface-mint)] p-4">
          <Badge variant="secondary">Guía rápida</Badge>
          <div className="grid gap-3">
            <HeroCue
              icon={Compass}
              title="Plan del día"
              description="Ideas según tu estilo, energía y tiempo disponible."
            />
            <HeroCue
              icon={Sparkles}
              title="Curaduría local"
              description="Destacados, secretos y experiencias verificadas."
            />
          </div>
        </aside>
      </header>

      {/* 1. Ads — promotional slot, no section header */}
      {featureFlags.promotions ? <AdsHero /> : null}

      {/* 2. Today — "Qué vale la pena hacer hoy" */}
      {featureFlags.recommendations ? (
        <div id="tour-today">
          <TodaySection />
        </div>
      ) : null}

      {/* 3. Traveler-type filter */}
      {featureFlags.travelerModes ? (
        <div id="tour-chips">
          <TravelerTypeChips
            selected={travelerType}
            onChange={setTravelerType}
          />
        </div>
      ) : null}

      {/* 4. Ranking */}
      {featureFlags.ranking ? (
        <section id="tour-ranking">
          <SectionHeader
            eyebrow="Top de la ciudad"
            title={`Ranking en ${city}`}
            subtitle="Lo más visitado y mejor calificado esta semana."
            href="/places"
          />
          {ranking.isLoading ? (
            <CarouselSkeletons />
          ) : ranking.data?.data.length ? (
            <HorizontalCarousel>
              {ranking.data.data.map((item) => (
                <RankingCard key={item.place.id} item={item} />
              ))}
            </HorizontalCarousel>
          ) : (
            <EmptyMini message="El ranking se actualiza diariamente. Aún no hay datos." />
          )}
        </section>
      ) : null}

      {/* 5. Featured — Recomendados */}
      {featureFlags.recommendations ? (
        <section>
          <SectionHeader
            eyebrow="Esta semana"
            title="Recomendados"
            subtitle="Curados por Xitty."
          />
          {featured.isLoading ? (
            <CarouselSkeletons />
          ) : featured.data?.length ? (
            <HorizontalCarousel>
              {featured.data.map((item) => (
                <FeaturedCard key={item.id} item={item} />
              ))}
            </HorizontalCarousel>
          ) : (
            <EmptyMini message="Pronto publicaremos los destacados de la semana." />
          )}
        </section>
      ) : null}

      {/* 6. Curated — AI-curated weekly feed */}
      {featureFlags.curatedFeed ? (
        <section>
          <SectionHeader
            eyebrow="Curado con IA"
            title={`Descubre lo nuevo en ${city}`}
            subtitle="Curado con IA, actualizado cada semana."
          />
          {curated.isLoading ? (
            <CarouselSkeletons />
          ) : curated.data?.length ? (
            <CuratedCarousel items={curated.data} />
          ) : (
            <EmptyMini message="Pronto verás aquí lo nuevo de la semana, curado por nuestra IA." />
          )}
        </section>
      ) : null}

      {/* 7. Categories grid */}
      {featureFlags.categories ? (
        <section id="tour-categories">
          <SectionHeader
            title="Explora por categoría"
            subtitle="Encuentra lo que buscas, organizado por tipo de lugar."
          />
          <CategoriesGrid />
        </section>
      ) : null}

      {/* 8. Experiences */}
      {featureFlags.experiences ? (
        <section id="tour-experiences">
          <SectionHeader
            eyebrow="Experiencias"
            title="Vive algo único"
            subtitle="Tours, talleres, gastronomía y bienestar."
            href="/experiences"
          />
          {experiences.isLoading ? (
            <CarouselSkeletons />
          ) : experiences.data?.data.length ? (
            <HorizontalCarousel>
              {experiences.data.data.map((exp) => (
                <ExperienceCardComponent
                  key={exp.id}
                  experience={exp}
                  className="shrink-0 w-[280px] sm:w-[320px]"
                />
              ))}
            </HorizontalCarousel>
          ) : (
            <EmptyMini message="Estamos curando las primeras experiencias para ti." />
          )}
        </section>
      ) : null}

      {/* 9. Local picks — Disfruta como local */}
      {featureFlags.localPicks ? (
        <section>
          <SectionHeader
            eyebrow="Como local"
            title="Disfruta como un local"
            subtitle="Lugares secretos, auténticos y favoritos de la comunidad."
          />
          {localPicks.isLoading ? (
            <CarouselSkeletons />
          ) : localPicks.data?.length ? (
            <HorizontalCarousel>
              {localPicks.data.map((item) => (
                <LocalPickCard key={item.id} item={item} />
              ))}
            </HorizontalCarousel>
          ) : (
            <EmptyMini message="Los locales aún no han compartido sus secretos esta semana." />
          )}
        </section>
      ) : null}
    </div>
  );
}

function HeroCue({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Compass;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg bg-[var(--surface)] p-3 shadow-[var(--shadow-1)]">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-[var(--accent-soft)] text-[var(--accent)]"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
        <p className="text-xs leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}
